import React, { useState } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { createTheme } from '@material-ui/core/styles'
import { ipcRenderer } from 'electron'
import CSS from 'csstype'
import Button from 'react-bootstrap/Button'
import {
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalBody,
    MDBModalFooter,
} from 'mdb-react-ui-kit'

import Accelerometer from './Accelerometer'
import Laps from './Laps'
import Tires from './Tires'
import Steering from './Steering'
import Map from './Map'
import Tach from './Tach'
const electron = require('electron')
const window = electron.remote.getCurrentWindow()
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
})

const sideColumnStyle: CSS.Properties = {
    float: 'left',
    width: '25%',
    height: '95vh',
}
const centerColumnStyle: CSS.Properties = {
    float: 'left',
    width: '50%',
    height: '95vh',
}
const accelerometerContainerStyle: CSS.Properties = {
    backgroundColor: '#171717',
    height: '33.33%',
    margin: '15px',
    borderRadius: '5px',
}
const lapContainerStyle: CSS.Properties = {
    backgroundColor: '#171717',
    height: '66.66%',
    margin: '15px',
    borderRadius: '5px',
}
const basicTelemetryContainerStyle: CSS.Properties = {
    backgroundColor: '#171717',
    height: '32.75%',
    margin: '15px',
    borderRadius: '5px',
}
const mainHudContainerStyle: CSS.Properties = {
    height: '100%',
    fontFamily: 'Roboto',
    fontWeight: 'normal',
}
const mainHudTopStyle: CSS.Properties = {
    height: '10%',
    marginTop: '15px',
    borderRadius: '5px',
}
const mainHudBottomStyle: CSS.Properties = {
    height: '10%',
    borderRadius: '5px',
    marginTop: '60px',
}
const dataValueStyle = {
    color: '#C54242',
    fontSize: '24px',
}
const dataKeyStyle = {
    color: 'grey',
    fontSize: '12px',
}

type Packet = {
    TimestampMS: number

    EngineMaxRpm: number
    EngineIdleRpm: number
    CurrentEngineRpm: number

    AccelerationX: number
    AccelerationY: number
    AccelerationZ: number

    VelocityX: number
    VelocityY: number
    VelocityZ: number

    AngularVelocityX: number
    AngularVelocityY: number
    AngularVelocityZ: number

    Yaw: number
    Pitch: number
    Roll: number

    NormalizedSuspensionTravelFrontLeft: number
    NormalizedSuspensionTravelFrontRight: number
    NormalizedSuspensionTravelRearLeft: number
    NormalizedSuspensionTravelRearRight: number

    TireSlipRatioFrontLeft: number
    TireSlipRatioFrontRight: number
    TireSlipRatioRearLeft: number
    TireSlipRatioRearRight: number

    WheelRotationSpeedFrontLeft: number
    WheelRotationSpeedFrontRight: number
    WheelRotationSpeedRearLeft: number
    WheelRotationSpeedRearRight: number

    WheelOnRumbleStripFrontLeft: number
    WheelOnRumbleStripFrontRight: number
    WheelOnRumbleStripRearLeft: number
    WheelOnRumbleStripRearRight: number

    WheelInPuddleDepthFrontLeft: number
    WheelInPuddleDepthFrontRight: number
    WheelInPuddleDepthRearLeft: number
    WheelInPuddleDepthRearRight: number

    SurfaceRumbleFrontLeft: number
    SurfaceRumbleFrontRight: number
    SurfaceRumbleRearLeft: number
    SurfaceRumbleRearRight: number

    TireSlipAngleFrontLeft: number
    TireSlipAngleFrontRight: number
    TireSlipAngleRearLeft: number
    TireSlipAngleRearRight: number

    TireCombinedSlipFrontLeft: number
    TireCombinedSlipFrontRight: number
    TireCombinedSlipRearLeft: number
    TireCombinedSlipRearRight: number

    SuspensionTravelMetersFrontLeft: number
    SuspensionTravelMetersFrontRight: number
    SuspensionTravelMetersRearLeft: number
    SuspensionTravelMetersRearRight: number

    CarOrdinal: number
    CarClass: number
    CarPerformanceIndex: number
    DrivetrainType: number
    NumCylinders: number

    IsRaceOn: number
    PositionX: number
    PositionY: number
    PositionZ: number
    Speed: number
    Power: number
    Torque: number
    TireTempFl: number
    TireTempFr: number
    TireTempRl: number
    TireTempRr: number
    Boost: number
    Fuel: number
    Distance: number
    BestLapTime: number
    LastLapTime: number
    CurrentLapTime: number
    CurrentRaceTime: number
    Lap: number
    RacePosition: number
    Accelerator: number
    Brake: number
    Clutch: number
    Handbrake: number
    Gear: number
    Steer: number
    NormalDrivingLine: number
    NormalAiBrakeDifference: number
}

let dataCount = 0

function secondsToTimeString(seconds: number) {
    const s = Math.floor(seconds % 60)
    const m = Math.floor(((seconds * 1000) / (1000 * 60)) % 60)
    let strFormat = 'MM:SS'

    strFormat = strFormat.replace(/MM/, m + '')
    strFormat = strFormat.replace(/SS/, s + '')

    return strFormat
}

function toggleFullscreen() {
    if (!window.isFullScreen()) {
        window.setFullScreen(true)
    } else {
        window.setFullScreen(false)
    }
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
    const [previousCoords, setPreviousCoords] = useState([0, 0, 0])
    const [previousFuel, setPreviousFuel] = useState(1)
    const [settingsModal, setSettingsModal] = useState(false)
    const toggleSettingsModalShow = () => setSettingsModal(!settingsModal)
    // const setPrevFuel = (fuel: number) => setPreviousFuel(fuel);

    React.useEffect(() => {
        ipcRenderer.on('new-data-for-dashboard', (event: any, message: any) => {
            setData(message)

            dataCount = dataCount + 1
            // update map
            // only update the map every 10 ticks to avoid running into performance issues
            if (dataCount % 10 == 0) {
                const c = lapCoords
                c.push([message.PositionX, -message.PositionZ])
                setLapCoords(c)
                // If the map path is more than 6500 segments long, then start deleting the oldest segment every time you add a new segment.
                // This prevents the app from running into performance issues because of the map path becoming too long.
                // 6500 is a guesstimated value. It was chosen after testing the number of segments required for
                // one of FM7's slowest cars, the Toyota Arctic Truck, to draw a complete path around the Nurburgring Nordschleife + GP circuit.
                // The number required is roughly 6500 segments.
                if (c.length > 6500) {
                    c.shift()
                }
            }
            // update MPG
            if (dataCount % 50 == 0) {
                // distance travelled = starting coords
                const y1 = message.PositionY
                const x1 = message.PositionX
                const z1 = message.PositionZ
                const x2 = previousCoords[0]
                const y2 = previousCoords[1]
                const z2 = previousCoords[2]
                // do not use the game's calculation of distance travelled. if you do, the player
                // can simply go backwardss during a race and the games' distance travelled number will actually decrease
                // this would, of course, throw off the MPG calculation
                let distance = Math.sqrt(
                    Math.pow(x2 - x1, 2) +
                        Math.pow(y2 - y1, 2) +
                        Math.pow(z2 - z1, 2)
                )

                previousCoords[0] = message.PositionX
                previousCoords[1] = message.PositionY
                previousCoords[2] = message.PositionZ

                // convert to miles
                distance = distance * 0.00062137 * 1609.344

                // gallons consumed
                let fuelUsed = previousFuel - message.Fuel

                // convert to gallons
                fuelUsed = fuelUsed * 13 // 13 gallons is the typical sized fuel tank for a car. Forza doesn't tell you how many gallons their cars have.

                setMpg((distance / fuelUsed).toFixed(0))
            }
        })
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
        const c = lapCoords
        setPrevLapCoords(c)

        // delete current lapCoords
        lapCoords.length = 0

        // log previous lap data
        if (lapNumber != NaN && lapNumber != -1) {
            lapData.unshift([
                lapNumber,
                data.LastLapTime.toFixed(3),
                (data.LastLapTime - data.BestLapTime).toFixed(3),
            ])
        }

        // update split times
        for (let i = 0; i < lapData.length; i++) {
            if (Number(lapData[i][1]) == data.BestLapTime) {
                // this is the best time, so show no split time
                lapData[i][2] = ''
            } else if (
                Math.abs(Number(lapData[i][1]) - data.BestLapTime).toFixed(3) ==
                '0.000'
            ) {
                lapData[i][2] = ''
            } else {
                lapData[i][2] = (
                    Number(lapData[i][1]) - data.BestLapTime
                ).toFixed(3)
            }
        }

        // update fuel numbers
        setFuelPerLap((100 * ((1 - data.Fuel) / lapNumber)).toFixed(2) + '%')
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
                        <table
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                fontWeight: 'normal',
                            }}
                        >
                            <tr>
                                <td style={{}}>
                                    <div style={dataValueStyle}>
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => {
                                                ipcRenderer.send(
                                                    'switch-recording-mode',
                                                    ''
                                                )
                                                setRecordingState(
                                                    recordingState === 'Record'
                                                        ? 'Stop Recording'
                                                        : 'Record'
                                                )
                                            }}
                                        >
                                            {recordingState}
                                        </Button>
                                    </div>
                                </td>
                                <td style={{}}>
                                    <div style={dataValueStyle}>
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => {
                                                setLapCoords([])
                                                setPrevLapCoords([])
                                                setLapNumber(-1)
                                                setLapData([])
                                                setFuelPerLap('N/A')
                                                setMpg('0')
                                                setPreviousCoords([0, 0, 0])
                                                setPreviousFuel(1)
                                                lapCoords.length = 0
                                            }}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </td>
                                <td style={{}}>
                                    <div style={dataValueStyle}>
                                        <Button
                                            variant="outline-danger"
                                            onClick={toggleFullscreen}
                                        >
                                            Fullscreen
                                        </Button>
                                    </div>
                                </td>
                                <td style={{}}>
                                    <div style={dataValueStyle}>
                                        <Button
                                            variant="outline-danger"
                                            onClick={toggleSettingsModalShow}
                                        >
                                            Settings
                                        </Button>
                                        <MDBModal
                                            show={settingsModal}
                                            getOpenState={(e: any) =>
                                                setSettingsModal(e)
                                            }
                                            tabIndex="-1"
                                        >
                                            <MDBModalDialog>
                                                <MDBModalContent>
                                                    <MDBModalBody>
                                                        <Button variant="outline-danger">
                                                            Light Mode
                                                        </Button>
                                                    </MDBModalBody>

                                                    <MDBModalFooter>
                                                        <Button
                                                            variant="danger"
                                                            onClick={
                                                                toggleSettingsModalShow
                                                            }
                                                        >
                                                            Close
                                                        </Button>
                                                    </MDBModalFooter>
                                                </MDBModalContent>
                                            </MDBModalDialog>
                                        </MDBModal>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div style={{ height: '80%' }}>
                        <Tach
                            outerRadius={90}
                            innerRadius={90}
                            startAngle={0}
                            endAngle={
                                data
                                    ? (data.CurrentEngineRpm /
                                          data.EngineMaxRpm) *
                                      2 *
                                      Math.PI *
                                      (340 / 360)
                                    : 2 * Math.PI * (320 / 360)
                            }
                            rpm={
                                data
                                    ? Math.round(data.CurrentEngineRpm)
                                          .toString()
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    : 0
                            }
                            gear={
                                data ? (data.Gear == 0 ? 'R' : data.Gear) : 'N'
                            }
                            speed={
                                data
                                    ? Math.abs(Math.round(data.Speed * 2.237))
                                          .toString()
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    : 0
                            }
                        />
                    </div>

                    <div style={mainHudBottomStyle}>
                        <table
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                fontWeight: 'normal',
                            }}
                        >
                            <tr>
                                <td style={{ width: '20%' }}>
                                    <div style={dataValueStyle}>
                                        {data ? fuelPerLap : 'N/A'}
                                    </div>
                                </td>
                                <td style={{ width: '20%' }}>
                                    <div style={dataValueStyle}>
                                        {data
                                            ? (data.Fuel * 100).toFixed(3)
                                            : 100.0}
                                        %
                                    </div>
                                </td>
                                <td style={{ width: '20%' }}>
                                    <div style={dataValueStyle}>
                                        {data
                                            ? secondsToTimeString(
                                                  data.CurrentLapTime
                                              )
                                            : '0:00'}
                                    </div>
                                </td>
                                <td style={{ width: '20%' }}>
                                    <div style={dataValueStyle}>N/A</div>
                                </td>
                                <td style={{ width: '20%' }}>
                                    <div style={dataValueStyle}>
                                        {data ? mpg : 1}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div style={dataKeyStyle}>FUEL/LAP</div>
                                </td>
                                <td>
                                    <div style={dataKeyStyle}>FUEL</div>
                                </td>
                                <td>
                                    <div style={dataKeyStyle}>CURRENT LAP</div>
                                </td>
                                <td>
                                    <div style={dataKeyStyle}>PIT IN</div>
                                </td>
                                <td>
                                    <div style={dataKeyStyle}>MPG</div>
                                </td>
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
                    <Steering
                        power={data ? data.Power : 0}
                        torque={data ? data.Torque : 0}
                        throttle={data ? data.Accelerator : 0}
                        steering={data ? data.Steer : 0}
                        boost={data ? data.Boost : 0}
                        outerRadius={90}
                        innerRadius={90}
                        startAngle={0}
                        endAngle={
                            data
                                ? (data.CurrentEngineRpm / data.EngineMaxRpm) *
                                  2 *
                                  Math.PI *
                                  (340 / 360)
                                : 2 * Math.PI * (320 / 360)
                        }
                    />
                </div>
                <div style={basicTelemetryContainerStyle}>
                    <Map
                        Coords={lapCoords}
                        PrevLapCoords={prevLapCoords}
                        LapNumber={lapNumber}
                        Position={data ? data.RacePosition : 0}
                        Distance={data ? data.Distance.toFixed(0) : 0}
                        Remaining={data ? data.NormalDrivingLine : 0}
                        X={data ? data.PositionX.toFixed(0) : 0}
                        Y={data ? data.PositionY.toFixed(0) : 0}
                        Z={data ? data.PositionZ.toFixed(0) : 0}
                        RaceTime={data ? data.CurrentRaceTime : 0}
                    />
                </div>
            </div>
        </ThemeProvider>
    )
}
