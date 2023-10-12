using System;

namespace ForzaCore
{
    public static class PacketParse
    {
        private const int SLED_PACKET_LENGTH = 232; // FM7
        private const int DASH_PACKET_LENGTH = 311; // FM7
        private const int FH4_PACKET_LENGTH = 324; // FH4
        private const int FM8_PACKET_LENGTH = 331; // FM8

        public static bool IsSledFormat(byte[] packet)
        {
            return packet.Length == SLED_PACKET_LENGTH;
        }

        public static bool IsDashFormat(byte[] packet)
        {
            return packet.Length == DASH_PACKET_LENGTH;
        }

        public static bool IsFH4Format(byte[] packet)
        {
            return packet.Length == FH4_PACKET_LENGTH;
        }

        public static bool IsFM8Format(byte[] packet)
        {
            return packet.Length == FM8_PACKET_LENGTH;
        }


        internal static float GetSingle(byte[] bytes, int index)
        {
            ByteCheck(bytes, index, 4);
            return BitConverter.ToSingle(bytes, index);
        }

        internal static uint GetUInt16(byte[] bytes, int index)
        {
            ByteCheck(bytes, index, 2);
            return BitConverter.ToUInt16(bytes, index);
        }

        internal static uint GetUInt32(byte[] bytes, int index)
        {
            ByteCheck(bytes, index, 4);
            return BitConverter.ToUInt32(bytes, index);
        }

        internal static uint GetUInt8(byte[] bytes, int index)
        {
            ByteCheck(bytes, index, 1);
            return bytes[index];
        }

        internal static int GetInt8(byte[] bytes, int index)
        {
            ByteCheck(bytes, index, 1);
            return Convert.ToInt16((sbyte)bytes[index]);
        }

        private static void ByteCheck(byte[] bytes, int index, int byteCount)
        {
            if (index + byteCount <= bytes.Length)
            {
                return;
            }

            throw new ArgumentException("Not enough bytes in this array");
        }
    }
}
