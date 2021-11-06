using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using ElectronCgi.DotNet;
using Newtonsoft.Json.Linq;

namespace ForzaCore
{
    class Program
    {
        private const int recordRateMS = 50;
        private static bool recordingData = false;
        private static bool isRaceOn = false;
        private static DataPacket data = new DataPacket();
        private const int FORZA_DATA_OUT_PORT = 5300;
        private const int FORZA_HOST_PORT = 5200;
        private static Connection connection = new ConnectionBuilder().WithLogging().Build();
        private static string currentFilename = "./data/" + DateTime.Now.ToFileTime() + ".csv";

        static void Main(string[] args)
        {
            #region udp stuff
            var ipEndPoint = new IPEndPoint(IPAddress.Loopback, FORZA_DATA_OUT_PORT);
            var senderClient = new UdpClient(FORZA_HOST_PORT);
            var receiverTask = Task.Run(async () =>
            {
                var client = new UdpClient(FORZA_DATA_OUT_PORT);
                while (true)
                {
                    await client.ReceiveAsync().ContinueWith(receive =>
                    {
                        var resultBuffer = receive.Result.Buffer;
                        if (!AdjustToBufferType(resultBuffer.Length))
                        {
                            connection.Send("new-data", $"buffer not the correct length. length is {resultBuffer.Length}");
                            return;
                        }
                        isRaceOn = resultBuffer.IsRaceOn();
                        // send data to node here
                        if (resultBuffer.IsRaceOn())
                        {
                            data = ParseData(resultBuffer);
                            SendData(data);
                        }
                    });
                    
                    // Dispose the client at the end of each request. Seems to clear out any buffered packets, 
                    // preventing the program from "falling behind" the actual game. Might cause lower data resolution, 
                    // but probably not significantly enough to matter. 
                    client.Dispose();
                    client = new UdpClient(FORZA_DATA_OUT_PORT);
                }
            });
            var recorderTask = Task.Run(async () =>
            {
                while (true)
                {
                    if (recordingData && isRaceOn)
                    {
                        RecordData(data);
                        await Task.Delay(recordRateMS);
                    }
                }
            });
            #endregion

            #region messaging between dotnet and node
            connection.On<string, string>("message-from-node", msg =>
            {
                connection.Send("new-data", $"{msg}");
                return $"{msg}";
            });
            connection.On<string, string>("switch-recording-mode", msg =>
            {
                if (recordingData)
                {
                    StopRecordingSession();
                }
                else
                {
                    StartNewRecordingSession();
                }
                return "";
            });
            connection.Listen();
            #endregion
        }

        static void SendData(DataPacket data)
        {
            string dataString = JsonSerializer.Serialize(data);
            connection.Send("new-data", dataString);
        }

        static void RecordData(DataPacket data)
        {
            string dataToWrite = DataPacketToCsvString(data);
            const int BufferSize = 65536;  // 64 Kilobytes
            StreamWriter sw = new StreamWriter(currentFilename, true, Encoding.UTF8, BufferSize);
            sw.WriteLine(dataToWrite);
            sw.Close();
        }

        static DataPacket ParseData(byte[] packet)
        {
            DataPacket data = new DataPacket();

            // sled
            data.IsRaceOn = packet.IsRaceOn();
            data.TimestampMS = packet.TimestampMs(); 
            data.EngineMaxRpm = packet.EngineMaxRpm(); 
            data.EngineIdleRpm = packet.EngineIdleRpm(); 
            data.CurrentEngineRpm = packet.CurrentEngineRpm(); 
            data.AccelerationX = packet.AccelerationX(); 
            data.AccelerationY = packet.AccelerationY(); 
            data.AccelerationZ = packet.AccelerationZ(); 
            data.VelocityX = packet.VelocityX(); 
            data.VelocityY = packet.VelocityY(); 
            data.VelocityZ = packet.VelocityZ(); 
            data.AngularVelocityX = packet.AngularVelocityX(); 
            data.AngularVelocityY = packet.AngularVelocityY(); 
            data.AngularVelocityZ = packet.AngularVelocityZ(); 
            data.Yaw = packet.Yaw(); 
            data.Pitch = packet.Pitch(); 
            data.Roll = packet.Roll(); 
            data.NormalizedSuspensionTravelFrontLeft = packet.NormSuspensionTravelFl(); 
            data.NormalizedSuspensionTravelFrontRight = packet.NormSuspensionTravelFr(); 
            data.NormalizedSuspensionTravelRearLeft = packet.NormSuspensionTravelRl(); 
            data.NormalizedSuspensionTravelRearRight = packet.NormSuspensionTravelRr(); 
            data.TireSlipRatioFrontLeft = packet.TireSlipRatioFl(); 
            data.TireSlipRatioFrontRight = packet.TireSlipRatioFr(); 
            data.TireSlipRatioRearLeft = packet.TireSlipRatioRl(); 
            data.TireSlipRatioRearRight = packet.TireSlipRatioRr(); 
            data.WheelRotationSpeedFrontLeft = packet.WheelRotationSpeedFl(); 
            data.WheelRotationSpeedFrontRight = packet.WheelRotationSpeedFr(); 
            data.WheelRotationSpeedRearLeft = packet.WheelRotationSpeedRl(); 
            data.WheelRotationSpeedRearRight = packet.WheelRotationSpeedRr(); 
            data.WheelOnRumbleStripFrontLeft = packet.WheelOnRumbleStripFl(); 
            data.WheelOnRumbleStripFrontRight = packet.WheelOnRumbleStripFr(); 
            data.WheelOnRumbleStripRearLeft = packet.WheelOnRumbleStripRl(); 
            data.WheelOnRumbleStripRearRight = packet.WheelOnRumbleStripRr(); 
            data.WheelInPuddleDepthFrontLeft = packet.WheelInPuddleFl(); 
            data.WheelInPuddleDepthFrontRight = packet.WheelInPuddleFr(); 
            data.WheelInPuddleDepthRearLeft = packet.WheelInPuddleRl(); 
            data.WheelInPuddleDepthRearRight = packet.WheelInPuddleRr(); 
            data.SurfaceRumbleFrontLeft = packet.SurfaceRumbleFl(); 
            data.SurfaceRumbleFrontRight = packet.SurfaceRumbleFr(); 
            data.SurfaceRumbleRearLeft = packet.SurfaceRumbleRl(); 
            data.SurfaceRumbleRearRight = packet.SurfaceRumbleRr(); 
            data.TireSlipAngleFrontLeft = packet.TireSlipAngleFl(); 
            data.TireSlipAngleFrontRight = packet.TireSlipAngleFr(); 
            data.TireSlipAngleRearLeft = packet.TireSlipAngleRl(); 
            data.TireSlipAngleRearRight = packet.TireSlipAngleRr(); 
            data.TireCombinedSlipFrontLeft = packet.TireCombinedSlipFl(); 
            data.TireCombinedSlipFrontRight = packet.TireCombinedSlipFr(); 
            data.TireCombinedSlipRearLeft = packet.TireCombinedSlipRl(); 
            data.TireCombinedSlipRearRight = packet.TireCombinedSlipRr(); 
            data.SuspensionTravelMetersFrontLeft = packet.SuspensionTravelMetersFl(); 
            data.SuspensionTravelMetersFrontRight = packet.SuspensionTravelMetersFr(); 
            data.SuspensionTravelMetersRearLeft = packet.SuspensionTravelMetersRl(); 
            data.SuspensionTravelMetersRearRight = packet.SuspensionTravelMetersRr();
            data.CarOrdinal = packet.CarOrdinal(); 
            data.CarClass = packet.CarClass();
            data.CarPerformanceIndex = packet.CarPerformanceIndex();
            data.DrivetrainType = packet.DriveTrain();
            data.NumCylinders = packet.NumCylinders();

            // dash
            data.PositionX = packet.PositionX();
            data.PositionY = packet.PositionY();
            data.PositionZ = packet.PositionZ();
            data.Speed = packet.Speed();
            data.Power = packet.Power();
            data.Torque = packet.Torque();
            data.TireTempFl = packet.TireTempFl();
            data.TireTempFr = packet.TireTempFr();
            data.TireTempRl = packet.TireTempRl();
            data.TireTempRr = packet.TireTempRr();
            data.Boost = packet.Boost();
            data.Fuel = packet.Fuel();
            data.Distance = packet.Distance();
            data.BestLapTime = packet.BestLapTime();
            data.LastLapTime = packet.LastLapTime();
            data.CurrentLapTime = packet.CurrentLapTime();
            data.CurrentRaceTime = packet.CurrentRaceTime();
            data.Lap = packet.Lap();
            data.RacePosition = packet.RacePosition();
            data.Accelerator = packet.Accelerator();
            data.Brake = packet.Brake();
            data.Clutch = packet.Clutch();
            data.Handbrake = packet.Handbrake();
            data.Gear = packet.Gear();
            data.Steer = packet.Steer();
            data.NormalDrivingLine = packet.NormalDrivingLine();
            data.NormalAiBrakeDifference = packet.NormalAiBrakeDifference();
            
            return data;
        }

        static bool AdjustToBufferType(int bufferLength)
        {
            switch (bufferLength)
            {
                case 232: // FM7 sled
                    return false;
                case 311: // FM7 dash
                    FMData.BufferOffset = 0;
                    return true;
                case 324: // FH4
                    FMData.BufferOffset = 12;
                    return true;
                default:
                    return false;
            }
        }

        static void StartNewRecordingSession()
        {
            currentFilename = "./data/" + DateTime.Now.ToFileTime() + ".csv";
            recordingData = true;

            IEnumerable<string> props = data.GetType()
                 .GetProperties()
                 .Where(p => p.CanRead)
                 .Select(p => p.Name);
            StringBuilder sb = new StringBuilder();
            sb.AppendJoin(',', props);

            StreamWriter sw = new StreamWriter(currentFilename, true, Encoding.UTF8);
            sw.WriteLine(sb.ToString());
            sw.Close();
        }

        static void StopRecordingSession()
        {
            recordingData = false;
        }

        static string DataPacketToCsvString(DataPacket packet)
        {
            IEnumerable<object> values = data.GetType()
                 .GetProperties()
                 .Where(p => p.CanRead)
                 .Select(p => p.GetValue(packet, null));

            StringBuilder sb = new StringBuilder();
            sb.AppendJoin(',', values);
            return sb.ToString();
        }
    }
}
