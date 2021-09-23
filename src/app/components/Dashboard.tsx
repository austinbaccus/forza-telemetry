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

function secondsToTimeString(seconds:number) {
    var ms = Math.floor((seconds*1000) % 1000).toFixed(3)
    var s = Math.floor(seconds%60)
    var m = Math.floor((seconds*1000/(1000*60))%60)
    var strFormat = "MM:SS:XXX"

    strFormat = strFormat.replace(/MM/, m+"")
    strFormat = strFormat.replace(/SS/, s+"")
    strFormat = strFormat.replace(/XXX/, ms.slice(0,3)) //toString().slice(0,3));
    
    return strFormat;
}

export const Dashboard = () => {
    const [data, setData] = useState<Packet>()
    const [recordingState, setRecordingState] = useState('Record')
    const [lapCoords, setLapCoords] = useState([])
    const [prevLapCoords, setPrevLapCoords] = useState([])
    const [lapNumber, setLapNumber] = useState(-1)
    const [lapData, setLapData] = useState([])
    const [fuelPerLap, setFuelPerLap] = useState('N/A')
    const [mpg, setMpg] = useState('0')
    const [previousCoords, setPreviousCoords] = useState([0,0,0])
    const [previousFuel, setPreviousFuel] = useState(1)

    const setPrevFuel = (fuel:number) => { setPreviousFuel(fuel) }

    React.useEffect(() => {
        ipcRenderer.on('new-data-for-dashboard', (event:any, message:any) => { 
            setData(message)

            dataCount = dataCount + 1
            // update map
            if (dataCount % 5 == 0) {
                let c = lapCoords
                c.push([message.PositionX, -message.PositionZ])
                setLapCoords(c)
            }
            // update MPG
            if (dataCount % 50 == 0) {
                // distance travelled = starting coords 
                let x1 = message.PositionX
                let y1 = message.PositionY
                let z1 = message.PositionZ
                let x2 = previousCoords[0]
                let y2 = previousCoords[1]
                let z2 = previousCoords[2]
                let distance = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2) + Math.pow(z2-z1, 2))
                
                previousCoords[0] = message.PositionX
                previousCoords[1] = message.PositionY
                previousCoords[2] = message.PositionZ

                // convert to miles
                distance = distance * 0.00062137 * 1609.344

                // gallons consumed
                let fuelUsed = previousFuel - message.Fuel

                // convert to gallons
                fuelUsed = fuelUsed * 13 // 13 gallons is the typical sized fuel tank for a car

                setMpg((distance/fuelUsed).toFixed(0))
            }
        });          
    }, [])

    React.useEffect(() => {
        if (data) {
            setPreviousFuel(data.Fuel)
        }
    }, [mpg])

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
            } else if (Math.abs(Number(lapData[i][1]) - data.BestLapTime).toFixed(3) == '0.000') {
                lapData[i][2] = ''
            } else {
                lapData[i][2] = (Number(lapData[i][1]) - data.BestLapTime).toFixed(3)
            }
        }

        // update fuel numbers
        setFuelPerLap((100 * ((1 - data.Fuel) / lapNumber)).toFixed(2)+'%')
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
                                <td style={{}}>
                                    <div style={dataValueStyle}>
                                        <Button onClick={() => {  
                                            ipcRenderer.send('switch-recording-mode', ''); 
                                            setRecordingState(recordingState === 'Record' ? 'Stop Recording' : 'Record');
                                        }}>
                                            {recordingState}
                                        </Button>
                                    </div>
                                </td>
                                <td style={{}}>
                                    <div style={dataValueStyle}>
                                        <Button onClick={() => { console.log('clicked!') }}>
                                            Reset
                                        </Button>
                                    </div>
                                </td>
                                <td style={{}}>
                                    <div style={dataValueStyle}>
                                        <Button onClick={() => { console.log('clicked!') }}>
                                            Fullscreen
                                        </Button>
                                    </div>
                                </td>
                                <td style={{}}>
                                    <div style={dataValueStyle}>
                                        <Button onClick={() => { console.log('clicked!') }}>
                                            Settings
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div style={{height: '80%'}}>
                        <Tach 
                            outerRadius={90} 
                            innerRadius={90} 
                            startAngle={0} 
                            endAngle={data ? (data.CurrentEngineRpm / data.EngineMaxRpm) * 2 * Math.PI * (340/360) : 2 * Math.PI * (320/360)} 
                            rpm={data ? Math.round(data.CurrentEngineRpm).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                            gear={data ? data.Gear == 0 ? 'R': data.Gear : 'N'}
                            speed={data ? Math.abs(Math.round(data.Speed * 2.237)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                        />
                    </div>

                    <div style={mainHudBottomStyle}>
                        <table style={{width: '100%', textAlign: 'center', fontWeight: 'normal'}}>
                            <tr>
                                <td style={{width: '20%'}}><div style={dataValueStyle}>{data ? fuelPerLap : 'N/A'}</div></td>
                                <td style={{width: '20%'}}><div style={dataValueStyle}>{data ? (data.Fuel*100).toFixed(3) : 100.000}%</div></td>
                                <td style={{width: '20%'}}><div style={dataValueStyle}>{data ? secondsToTimeString(data.CurrentLapTime) : '0:00.000'}</div></td>
                                <td style={{width: '20%'}}><div style={dataValueStyle}>N/A</div></td>
                                <td style={{width: '20%'}}><div style={dataValueStyle}>{data ? mpg : 1}</div></td>
                            </tr>
                            <tr>
                                <td><div style={dataKeyStyle}>FUEL/LAP</div></td>
                                <td><div style={dataKeyStyle}>FUEL</div></td>
                                <td><div style={dataKeyStyle}>CURRENT LAP</div></td>
                                <td><div style={dataKeyStyle}>PIT IN</div></td>
                                <td><div style={dataKeyStyle}>MPG</div></td>
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