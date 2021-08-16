import React, { useState } from "react";
import { ThemeProvider } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import { ipcRenderer } from "electron";
import { Button } from 'react-bootstrap';
import CSS from 'csstype';

import Accelerometer from './Accelerometer';
import Laps from "./Laps";
import Tires from "./Tires";
import Steering from "./Steering";
import Map from "./Map";

const darkTheme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#FA6868',
        },
        secondary: {
            main: '#0BEA99',
        },
    },
});

const sideColumnStyle: CSS.Properties = {
    float: 'left',
    width: '25%',
    height: '95vh',
};
const centerColumnStyle: CSS.Properties = {
    float: 'left',
    width: '50%',
    height: '95vh',
};
const accelerometerContainerStyle: CSS.Properties = {
    backgroundColor: '#171717',
    height: '33.33%',
    margin: '15px',
    borderRadius: '5px'
};
const lapContainerStyle: CSS.Properties = {
    backgroundColor: '#171717',
    height: '66.66%',
    margin: '15px',
    borderRadius: '5px'
};
const basicTelemetryContainerStyle: CSS.Properties = {
    backgroundColor: '#171717',
    height: '32.75%',
    margin: '15px',
    borderRadius: '5px'
};
const mainHudContainerStyle: CSS.Properties = {
};

type Packet = {
    TimestampMS: number,

    EngineMaxRpm: number,
    EngineIdleRpm: number,
    CurrentEngineRpm: number,

    AccelerationX: number,
    AccelerationY: number, 
    AccelerationZ: number,
    
    VelocityX: number,
    VelocityY: number,
    VelocityZ: number,

    AngularVelocityX: number,
    AngularVelocityY: number,
    AngularVelocityZ: number,

    Yaw: number,
    Pitch: number,
    Roll: number,

    NormalizedSuspensionTravelFrontLeft: number,
    NormalizedSuspensionTravelFrontRight: number,
    NormalizedSuspensionTravelRearLeft: number,
    NormalizedSuspensionTravelRearRight: number,

    TireSlipRatioFrontLeft: number,
    TireSlipRatioFrontRight: number,
    TireSlipRatioRearLeft: number,
    TireSlipRatioRearRight: number,

    WheelRotationSpeedFrontLeft: number,
    WheelRotationSpeedFrontRight: number,
    WheelRotationSpeedRearLeft: number,
    WheelRotationSpeedRearRight: number,

    WheelOnRumbleStripFrontLeft: number,
    WheelOnRumbleStripFrontRight: number,
    WheelOnRumbleStripRearLeft: number,
    WheelOnRumbleStripRearRight: number,

    WheelInPuddleDepthFrontLeft: number,
    WheelInPuddleDepthFrontRight: number,
    WheelInPuddleDepthRearLeft: number,
    WheelInPuddleDepthRearRight: number,

    SurfaceRumbleFrontLeft: number,
    SurfaceRumbleFrontRight: number,
    SurfaceRumbleRearLeft: number,
    SurfaceRumbleRearRight: number,

    TireSlipAngleFrontLeft: number,
    TireSlipAngleFrontRight: number,
    TireSlipAngleRearLeft: number,
    TireSlipAngleRearRight: number,

    TireCombinedSlipFrontLeft: number,
    TireCombinedSlipFrontRight: number,
    TireCombinedSlipRearLeft: number,
    TireCombinedSlipRearRight: number,

    SuspensionTravelMetersFrontLeft: number,
    SuspensionTravelMetersFrontRight: number,
    SuspensionTravelMetersRearLeft: number,
    SuspensionTravelMetersRearRight: number,

    CarOrdinal: number,
    CarClass: number,
    CarPerformanceIndex: number,
    DrivetrainType: number,
    NumCylinders: number,

    IsRaceOn: number,
    PositionX: number,
    PositionY: number,
    PositionZ: number,
    Speed: number,
    Power: number,
    Torque: number,
    TireTempFl: number,
    TireTempFr: number,
    TireTempRl: number,
    TireTempRr: number,
    Boost: number,
    Fuel: number,
    Distance: number,
    BestLapTime: number,
    LastLapTime: number,
    CurrentLapTime: number,
    CurrentRaceTime: number,
    Lap: number,
    RacePosition: number,
    Accelerator: number,
    Brake: number,
    Clutch: number,
    Handbrake: number,
    Gear: number,
    Steer: number,
    NormalDrivingLine: number,
    NormalAiBrakeDifference: number
}

export const Dashboard2 = () => {
    const [data, setData] = useState<Packet>();
    const [recordingState, setRecordingState] = useState('Record');
    const [lapCoords, setLapCoords] = useState([]);
    const [lapNumber, setLapNumber] = useState(-1);

    React.useEffect( () => {
        ipcRenderer.on('new-data-for-dashboard', (event:any, message:any) => { 
            setData(message);
            setLapNumber(message.Lap)
            setLapCoords([message.PositionX, message.PositionZ])
        });               
    }, []);

    return (
        <ThemeProvider theme={darkTheme}>
            {/* left column */}
            <div style={sideColumnStyle}>
                <div style={accelerometerContainerStyle}>
                    <Accelerometer
                        X={data ? data.AccelerationX : 0}
                        Y={data ? data.AccelerationY : 0}
                        Z={data ? data.AccelerationZ : 0}
                    />
                </div>
                <div style={lapContainerStyle}>
                    <Laps/>
                </div>
            </div>

            {/* center column */}
            <div style={centerColumnStyle}>
                <div style={mainHudContainerStyle}>
                    <Button onClick={() => { 
                        ipcRenderer.send('switch-recording-mode', '');
                        setRecordingState(recordingState === 'Record' ? 'Stop Recording' : 'Record');
                    }}>
                        {recordingState}
                    </Button>
                    <p style={{color: 'white'}}>TimestampMS: {data ? data.TimestampMS : 0}</p>
                    <p style={{color: 'white'}}>Coords: {lapCoords}</p>
                    <p style={{color: 'white'}}>X: {data ? data.PositionX : 0}</p>
                    <p style={{color: 'white'}}>Y: {data ? data.PositionY : 0}</p>
                    <p style={{color: 'white'}}>Z: {data ? data.PositionZ : 0}</p>
                </div>
            </div>

            {/* right column */}
            <div style={sideColumnStyle}>
                <div style={basicTelemetryContainerStyle}>
                    <Tires
                        Pitch={data ? data.Pitch : 0}
                        Yaw={data ? data.Yaw : 0}
                        Roll={data ? data.Roll : 0}
                        FlTemp={data ? data.TireTempFl : 0}
                        FrTemp={data ? data.TireTempFr : 0}
                        RlTemp={data ? data.TireTempRl : 0}
                        RrTemp={data ? data.TireTempRr : 0}
                        FlSlip={data ? data.TireCombinedSlipFrontLeft : 0}
                        FrSlip={data ? data.TireCombinedSlipFrontRight : 0}
                        RlSlip={data ? data.TireCombinedSlipRearLeft : 0}
                        RrSlip={data ? data.TireCombinedSlipRearRight : 0}
                        FlSlipRatio={data ? data.TireSlipRatioFrontLeft : 0}
                        FrSlipRatio={data ? data.TireSlipRatioFrontRight : 0}
                        RlSlipRatio={data ? data.TireSlipRatioRearLeft : 0}
                        RrSlipRatio={data ? data.TireSlipRatioRearRight : 0}
                        FlSlipAngle={data ? data.TireSlipAngleFrontLeft : 0}
                        FrSlipAngle={data ? data.TireSlipAngleFrontRight : 0}
                        RlSlipAngle={data ? data.TireSlipAngleRearLeft : 0}
                        RrSlipAngle={data ? data.TireSlipAngleRearRight : 0}
                    />
                </div>
                <div style={basicTelemetryContainerStyle}><Steering/></div>
                <div style={basicTelemetryContainerStyle}>
                    <Map Coords={lapCoords} LapNumber={lapNumber}/>
                </div>
            </div>
        </ThemeProvider>
    );
};