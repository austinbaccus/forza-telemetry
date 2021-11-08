import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import { Polyline } from 'react-shapes'

const sideColumnStyle = {
    float: 'left',
    width: '25%',
    height: '100%',
    color: 'white',
}
const centerColumnStyle = {
    float: 'left',
    width: '75%',
    height: '100%',
}
const dataTopRowStyle = {
    height: '25%',
    textAlign: 'left',
    margin: '18px 0px 0px 30px',
    fontFamily: 'Roboto',
}
const dataRowStyle = {
    height: '25%',
    textAlign: 'left',
    margin: '-2px 0px 0px 30px',
    fontFamily: 'Roboto',
}
const dataValueStyle = {
    color: '#C54242',
    fontSize: '24px',
}
const dataKeyStyle = {
    color: 'grey',
    fontSize: '12px',
}

function calculateMapDimensions(minX, maxX, minZ, maxZ) {
    let w = maxX - minX
    let h = maxZ - minZ

    // make sure the dimensions have a 1.344:1 ratio
    if (w / h > 1.344) {
        // needs to be taller
        h = w / 1.344
    } else {
        // needs to be wider
        w = h * 1.344
    }

    // make sure to add a bit of buffer on the sides so that it looks nice
    w = w * 1.1
    h = h * 1.1

    return [w, h]
}

function calculateMapOffset(minX, minZ) {
    return [minX * 1.1, minZ * 1.1]
}

function checkNewBounds(newCoords, minX, maxX, minZ, maxZ) {
    const bounds = [0, 0, 0, 0]
    bounds[0] = newCoords[0] < minX ? newCoords[0] : minX
    bounds[1] = newCoords[0] > maxX ? newCoords[0] : maxX
    bounds[2] = newCoords[1] < minZ ? newCoords[1] : minZ
    bounds[3] = newCoords[1] > maxZ ? newCoords[1] : maxZ
    return bounds
}

function Map(props) {
    const [minX, setMinX] = useState(0)
    const [maxX, setMaxX] = useState(0)
    const [minZ, setMinZ] = useState(0)
    const [maxZ, setMaxZ] = useState(0)
    const [mapDimensions, setMapDimensions] = useState([13.44, 10.0])
    const [mapOffset, setMapOffset] = useState([-1, -1])
    const [smush, setSmush] = useState(0)

    useEffect(() => {
        if (props.Coords[0]) {
            if (props.Coords.length < 2) {
                setMinX(props.Coords[props.Coords.length - 1][0] - 1)
                setMaxX(props.Coords[props.Coords.length - 1][0] + 1)
                setMinZ(props.Coords[props.Coords.length - 1][1] - 1)
                setMaxZ(props.Coords[props.Coords.length - 1][1] + 1)
            }
            const newBounds = checkNewBounds(
                props.Coords[props.Coords.length - 1],
                minX,
                maxX,
                minZ,
                maxZ
            )
            setMinX(newBounds[0])
            setMaxX(newBounds[1])
            setMinZ(newBounds[2])
            setMaxZ(newBounds[3])
            setMapDimensions(calculateMapDimensions(minX, maxX, minZ, maxZ))
            setMapOffset(calculateMapOffset(minX, minZ))

            const widthToHeightRatio = (maxX - minX) / (maxZ - minZ)
            setSmush(
                widthToHeightRatio > 1
                    ? Math.min(168, widthToHeightRatio * 20)
                    : 0
            )
        }
        // Reset the map boundaries and variables if a new race has just started
        // If the race time is 0  we can assume the user has just started a new race
        if (props.RaceTime === 0) {
            setMinX(0)
            setMaxX(0)
            setMinZ(0)
            setMaxZ(0)
            setMapDimensions([13.44, 10.0])
            setMapOffset([-1, -1])
            setSmush(0)
        }
    }, [props])

    // this doesn't work (it's supposed to place the prev lap path on the map every time a new lap is started)
    useEffect(() => {
        // prevLapOutline = d3.line()(props.PrevLapCoords)
    }, [props.PrevLapCoords])

    /* const boxOutline = d3.line()([
      [minX, minZ],
      [minX, maxZ],
      [maxX, maxZ],
      [maxX, minZ],
      [minX, minZ],
    ]);
    */
    // const prevLapOutline = d3.line()(props.PrevLapCoords);
    const lapOutline = d3.line()(props.Coords)

    return (
        <div style={{ height: '100%' }}>
            <div style={sideColumnStyle}>
                <div style={dataTopRowStyle}>
                    <div style={dataValueStyle}>{props.Position}</div>
                    <div style={dataKeyStyle}>POSITION</div>
                </div>
                <div style={dataRowStyle}>
                    <div style={dataValueStyle}>{props.Distance}</div>
                    <div style={dataKeyStyle}>DISTANCE (m)</div>
                </div>
                <div style={dataRowStyle}>
                    <div style={dataValueStyle}>{props.Remaining}</div>
                    <div style={dataKeyStyle}>DRIVING LINE</div>
                </div>
                <div style={dataRowStyle}>
                    <div style={dataValueStyle}>
                        {props.X + ',' + props.Y + ',' + props.Z}
                    </div>
                    <div style={dataKeyStyle}>COORDS</div>
                </div>
            </div>
            <div style={centerColumnStyle}>
                {/* This line is only here to "smush" the map down so that it's in the center of the box thingy */}
                <Polyline
                    points={`0,0 0,${smush}`}
                    fill={{ color: '#34495e' }}
                    stroke={{ color: 'transparent' }}
                    strokeWidth={5}
                />

                <svg
                    viewBox={`${mapOffset[0]} ${mapOffset[1]} ${mapDimensions[0]} ${mapDimensions[1]}`}
                    style={{ backgroundColor: 'transparent' }}
                >
                    {/* <path d={prevLapOutline} stroke="grey" fill='transparent' strokeWidth='6'/> */}
                    <path
                        d={lapOutline}
                        stroke="white"
                        fill="transparent"
                        strokeWidth="10"
                    />
                    {/* <path d={boxOutline} stroke="grey" fill='transparent' strokeWidth='6'/> */}
                </svg>
            </div>
        </div>
    )
}

export default Map
