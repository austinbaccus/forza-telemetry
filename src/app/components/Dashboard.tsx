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
import Tachometer from "./Tachometer";
import Tach from "./Tach";

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
    height: '100%',
    fontFamily: 'Roboto',
    fontWeight: 'normal'
};
const mainHudTopStyle: CSS.Properties = {
    height: '10%',
    marginTop: '15px',
    borderRadius: '5px'
}
const mainHudBottomStyle: CSS.Properties = {
    height: '10%',
    borderRadius: '5px'
}
const dataRowStyle = { 
    height: '25%',
    textAlign: 'left',
    margin: '-2px 0px 0px 30px',
    fontFamily: 'Roboto'
}
const dataValueStyle = {
    color: '#C54242',
    fontSize: '24px'
}
const dataKeyStyle = {
    color: 'grey',
    fontSize: '12px',
}

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

var dataCount = 0

export const Dashboard = () => {
    const [data, setData] = useState<Packet>();
    const [recordingState, setRecordingState] = useState('Record');
    const [lapCoords, setLapCoords] = useState([]);
    const [prevLapCoords, setPrevLapCoords] = useState([])
    const [lapNumber, setLapNumber] = useState(-1);
    const [lapData, setLapData] = useState([])

    React.useEffect( () => {
        ipcRenderer.on('new-data-for-dashboard', (event:any, message:any) => { 
            setData(message)

            dataCount = dataCount + 1
            if (dataCount % 5 == 0) {
                let c = lapCoords
                c.push([message.PositionX, -message.PositionZ])
                setLapCoords(c)
            }
        });          
    }, []);

    // new lap
    if (data && data.Lap !== lapNumber) {
        setLapNumber(data.Lap)

        // prevLapCoords need to be updated, new lap just started
        let c = lapCoords
        setPrevLapCoords(c)

        // delete current lapCoords
        lapCoords.length = 0

        // log previous lap data
        if (lapNumber != NaN && lapNumber != -1) {
            lapData.unshift([lapNumber, data.LastLapTime.toFixed(3), (data.LastLapTime - data.BestLapTime).toFixed(3)])
        }

        // update split times
        for (var i = 0; i < lapData.length; i++) {
            if (Number(lapData[i][1]) == data.BestLapTime) { // this is the best time, so show no split time
                lapData[i][2] = ''
            } else {
                lapData[i][2] = (Number(lapData[i][1]) - data.BestLapTime).toFixed(3)
            }
        }
    }

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
                    <Laps 
                        LapNumber={lapNumber + 1} 
                        LapTime={data ? data.CurrentLapTime.toFixed(3) : '0.00'} 
                        PreviousLaps={lapData}
                    />
                </div>
            </div>

            {/* center column */}
            <div style={centerColumnStyle}>
                <div style={mainHudContainerStyle}>
                    <div style={mainHudTopStyle}>
                        <table style={{width: '100%', textAlign: 'center', fontWeight: 'normal'}}>
                            <tr>
                                <td style={{width: '100%'}}>
                                    <div style={dataValueStyle}>
                                        <Button onClick={() => {  
                                            ipcRenderer.send('switch-recording-mode', ''); 
                                            setRecordingState(recordingState === 'Record' ? 'Stop Recording' : 'Record');
                                        }}>
                                            {recordingState}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        
                    </div>

                    <div style={{height: '80%'}}>
                        <Tach outerRadius={90} innerRadius={90} startAngle={0} endAngle={data ? (data.CurrentEngineRpm / data.EngineMaxRpm) * 2 * Math.PI : 2 * Math.PI}/>
                    </div>

                    <div style={mainHudBottomStyle}>
                        <table style={{width: '100%', textAlign: 'center', fontWeight: 'normal'}}>
                            <tr>
                                <td style={{width: '20%'}}><div style={dataValueStyle}>N/A</div></td>
                                <td style={{width: '20%'}}><div style={dataValueStyle}>{data ? data.Fuel : 0}</div></td>
                                <td style={{width: '20%'}}><div style={dataValueStyle}>{data ? data.CurrentLapTime : '0:00.000'}</div></td>
                                <td style={{width: '20%'}}><div style={dataValueStyle}>N/A</div></td>
                                <td style={{width: '20%'}}><div style={dataValueStyle}>{data ? data.Lap : 1}</div></td>
                            </tr>
                            <tr>
                                <td><div style={dataKeyStyle}>FUEL/LAP</div></td>
                                <td><div style={dataKeyStyle}>FUEL</div></td>
                                <td><div style={dataKeyStyle}>CURRENT LAP</div></td>
                                <td><div style={dataKeyStyle}>PIT IN</div></td>
                                <td><div style={dataKeyStyle}>LAP</div></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

            {/* right column */}
            <div style={sideColumnStyle}>
                <div style={basicTelemetryContainerStyle}>
                    <Tires
                        Pitch={data ? data.Pitch : 0}
                        Yaw={data ? data.Yaw : 0}
                        Roll={data ? data.Roll : 0}
                        Brake={data ? data.Brake : 0}
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
                <div style={basicTelemetryContainerStyle}>
                    <Steering Power={data ? data.Power : 0} Torque={data ? data.Torque : 0} Throttle={data ? data.Accelerator : 0} Steering={data ? data.Steer : 0} Boost={data ? data.Boost : 0}/>
                </div>
                <div style={basicTelemetryContainerStyle}>
                    <Map Coords={lapCoords} PrevLapCoords={prevLapCoords} LapNumber={lapNumber}/>
                </div>
            </div>
        </ThemeProvider>
    );
};