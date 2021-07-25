using static ForzaCore.PacketParse;

namespace ForzaCore
{
    public static class FM7Data
    {
        // testing to see if we can get sled data as well
        public static float IsRaceOn(this byte[] bytes) { return GetUInt32(bytes, 0); }

        public static float PositionX(this byte[] bytes) { return GetSingle(bytes, 232); }
        public static float PositionY(this byte[] bytes) { return GetSingle(bytes, 236); }
        public static float PositionZ(this byte[] bytes) { return GetSingle(bytes, 240); }
        public static float Speed(this byte[] bytes) { return GetSingle(bytes, 244); }
        public static float Power(this byte[] bytes) { return GetSingle(bytes, 248); }
        public static float Torque(this byte[] bytes) { return GetSingle(bytes, 252); }
        public static float TireTempFl(this byte[] bytes) { return GetSingle(bytes, 256); }
        public static float TireTempFr(this byte[] bytes) { return GetSingle(bytes, 260); }
        public static float TireTempRl(this byte[] bytes) { return GetSingle(bytes, 264); }
        public static float TireTempRr(this byte[] bytes) { return GetSingle(bytes, 268); }
        public static float Boost(this byte[] bytes) { return GetSingle(bytes, 272); }
        public static float Fuel(this byte[] bytes) { return GetSingle(bytes, 276); }
        public static float Distance(this byte[] bytes) { return GetSingle(bytes, 280); }
        public static float BestLapTime(this byte[] bytes) { return GetSingle(bytes, 284); }
        public static float LastLapTime(this byte[] bytes) { return GetSingle(bytes, 288); }
        public static float CurrentLapTime(this byte[] bytes) { return GetSingle(bytes, 292); }
        public static float CurrentRaceTime(this byte[] bytes) { return GetSingle(bytes, 296); }
        public static uint Lap(this byte[] bytes) { return GetUInt16(bytes, 300); }
        public static uint RacePosition(this byte[] bytes) { return GetUInt8(bytes, 302); }
        public static uint Accelerator(this byte[] bytes) { return GetUInt8(bytes, 303); }
        public static uint Brake(this byte[] bytes) { return GetUInt8(bytes, 304); }
        public static uint Clutch(this byte[] bytes) { return GetUInt8(bytes, 305); }
        public static uint Handbrake(this byte[] bytes) { return GetUInt8(bytes, 306); }
        public static uint Gear(this byte[] bytes) { return GetUInt8(bytes, 307); }
        public static int Steer(this byte[] bytes) { return GetInt8(bytes, 308); }
        public static uint NormalDrivingLine(this byte[] bytes) { return GetUInt8(bytes, 309); }
        public static uint NormalAiBrakeDifference(this byte[] bytes) { return GetUInt8(bytes, 310); }
    }
}
