using System;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using ElectronCgi.DotNet;

namespace ForzaCore
{
    class Program
    {
        private const int FORZA_DATA_OUT_PORT = 5300;
        private const int FORZA_HOST_PORT = 5200;
        private static Connection connection = new ConnectionBuilder().WithLogging().Build();

        static void Main(string[] args)
        {
            #region udp stuff
            byte[] toDisplay = null;
            var ipEndPoint = new IPEndPoint(IPAddress.Loopback, FORZA_DATA_OUT_PORT);
            var senderClient = new System.Net.Sockets.UdpClient(FORZA_HOST_PORT);
            var senderTask = Task.Run(async () =>
            {
                while (true)
                {
                    await senderClient.SendAsync(new byte[1], 1, ipEndPoint);
                    await Task.Delay(5000);
                }
            });
            var receiverTask = Task.Run(async () =>
            {
                var client = new System.Net.Sockets.UdpClient(FORZA_DATA_OUT_PORT);
                while (true)
                {
                    await client.ReceiveAsync().ContinueWith(receive =>
                    {
                        var resultBuffer = receive.Result.Buffer;
                        if (resultBuffer.Length != 311)
                        {
                            connection.Send("new-data", $"buffer not the correct length. length is {resultBuffer.Length}");
                            return;
                        }

                        var stuff = new byte[resultBuffer.Length];
                        resultBuffer.CopyTo(stuff, 0);
                        toDisplay = stuff;

                        // send data to node here
                        SendData(toDisplay);
                    });
                }
            });
            #endregion

            #region messaging between dotnet and node
            connection.On<string, string>("message-from-node", msg =>
            {
                connection.Send("new-data", $"dotnet: received {msg}");
                return $"dotnet: received {msg}";
            });
            connection.Listen();
            #endregion
        }

        static void SendData(byte[] packet)
        {
            string data = packet.Steer() + " " + packet.IsRaceOn();
            connection.Send("new-data", data);
        }
    }
}
