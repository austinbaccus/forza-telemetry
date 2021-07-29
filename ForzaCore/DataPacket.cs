namespace ForzaCore
{
    public class DataPacket
    {
        // Sled
        public bool IsRaceOn { get; set; }
        public uint TimestampMS { get; set; } // Can overflow to 0 eventually
        public float EngineMaxRpm { get; set; }
        public float EngineIdleRpm { get; set; }
        public float CurrentEngineRpm { get; set; }
        public float AccelerationX { get; set; } // In the car's local space; X = right, Y = up, Z = forward
        public float AccelerationY { get; set; }
        public float AccelerationZ { get; set; }
        public float VelocityX { get; set; } // In the car's local space; X = right, Y = up, Z = forward
        public float VelocityY { get; set; }
        public float VelocityZ { get; set; }
        public float AngularVelocityX { get; set; } // In the car's local space; X = pitch, Y = yaw, Z = roll
        public float AngularVelocityY { get; set; }
        public float AngularVelocityZ { get; set; }
        public float Yaw { get; set; }
        public float Pitch { get; set; }
        public float Roll { get; set; }
        public float NormalizedSuspensionTravelFrontLeft { get; set; } // Suspension travel normalized: 0.0f = max stretch; 1.0 = max compression
        public float NormalizedSuspensionTravelFrontRight { get; set; }
        public float NormalizedSuspensionTravelRearLeft { get; set; }
        public float NormalizedSuspensionTravelRearRight { get; set; }
        public float TireSlipRatioFrontLeft { get; set; } // Tire normalized slip ratio, = 0 means 100% grip and |ratio| > 1.0 means loss of grip.
        public float TireSlipRatioFrontRight { get; set; }
        public float TireSlipRatioRearLeft { get; set; }
        public float TireSlipRatioRearRight { get; set; }
        public float WheelRotationSpeedFrontLeft { get; set; } // Wheel rotation speed radians/sec.
        public float WheelRotationSpeedFrontRight { get; set; }
        public float WheelRotationSpeedRearLeft { get; set; }
        public float WheelRotationSpeedRearRight { get; set; }
        public float WheelOnRumbleStripFrontLeft { get; set; } // = 1 when wheel is on rumble strip, = 0 when off.
        public float WheelOnRumbleStripFrontRight { get; set; }
        public float WheelOnRumbleStripRearLeft { get; set; }
        public float WheelOnRumbleStripRearRight { get; set; }
        public float WheelInPuddleDepthFrontLeft { get; set; } // = from 0 to 1, where 1 is the deepest puddle
        public float WheelInPuddleDepthFrontRight { get; set; }
        public float WheelInPuddleDepthRearLeft { get; set; }
        public float WheelInPuddleDepthRearRight { get; set; }
        public float SurfaceRumbleFrontLeft { get; set; } // Non-dimensional surface rumble values passed to controller force feedback
        public float SurfaceRumbleFrontRight { get; set; }
        public float SurfaceRumbleRearLeft { get; set; }
        public float SurfaceRumbleRearRight { get; set; }
        public float TireSlipAngleFrontLeft { get; set; } // Tire normalized slip angle, = 0 means 100% grip and |angle| > 1.0 means loss of grip.
        public float TireSlipAngleFrontRight { get; set; }
        public float TireSlipAngleRearLeft { get; set; }
        public float TireSlipAngleRearRight { get; set; }
        public float TireCombinedSlipFrontLeft { get; set; } // Tire normalized combined slip, = 0 means 100% grip and |slip| > 1.0 means loss of grip.
        public float TireCombinedSlipFrontRight { get; set; }
        public float TireCombinedSlipRearLeft { get; set; }
        public float TireCombinedSlipRearRight { get; set; }
        public float SuspensionTravelMetersFrontLeft { get; set; } // Actual suspension travel in meters
        public float SuspensionTravelMetersFrontRight { get; set; }
        public float SuspensionTravelMetersRearLeft { get; set; }
        public float SuspensionTravelMetersRearRight { get; set; }
        public uint CarOrdinal { get; set; } // Unique ID of the car make/model
        public uint CarClass { get; set; } // Between 0 (D -- worst cars) and 7 (X class -- best cars) inclusive
        public uint CarPerformanceIndex { get; set; } // Between 100 (slowest car) and 999 (fastest car) inclusive
        public uint DrivetrainType { get; set; } // Corresponds to EDrivetrainType; 0 = FWD, 1 = RWD, 2 = AWD
        public uint NumCylinders { get; set; } // Number of cylinders in the engine

        // Dash
        public float PositionX { get; set; }
        public float PositionY { get; set; }
        public float PositionZ { get; set; }
        public float Speed { get; set; }
        public float Power { get; set; }
        public float Torque { get; set; }
        public float TireTempFl { get; set; }
        public float TireTempFr { get; set; }
        public float TireTempRl { get; set; }
        public float TireTempRr { get; set; }
        public float Boost { get; set; }
        public float Fuel { get; set; }
        public float Distance { get; set; }
        public float BestLapTime { get; set; }
        public float LastLapTime { get; set; }
        public float CurrentLapTime { get; set; }
        public float CurrentRaceTime { get; set; }
        public uint Lap { get; set; }
        public uint RacePosition { get; set; }
        public uint Accelerator { get; set; }
        public uint Brake { get; set; }
        public uint Clutch { get; set; }
        public uint Handbrake { get; set; }
        public uint Gear { get; set; }
        public int Steer { get; set; }
        public uint NormalDrivingLine { get; set; }
        public uint NormalAiBrakeDifference { get; set; }
    }
}
