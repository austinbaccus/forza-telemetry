import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'

const sideColumnStyle = {
    float: 'left',
    width: '25%',
    height: '100%',
    color: 'white'
};
const centerColumnStyle = {
    float: 'left',
    width: '75%',
    height: '100%',
};
const dataTopRowStyle = { 
    height: '25%',
    textAlign: 'left',
    margin: '18px 0px 0px 30px',
    fontFamily: 'Roboto'
};
const dataRowStyle = { 
    height: '25%',
    textAlign: 'left',
    margin: '-2px 0px 0px 30px',
    fontFamily: 'Roboto'
};
const dataValueStyle = {
    color: '#C54242',
    fontSize: '24px'
};
const dataKeyStyle = {
    color: 'grey',
    fontSize: '12px'
};

function CalculateMapDimensions(minX, maxX, minZ, maxZ) {
    let w = maxX - minX
    let h = maxZ - minZ

    // make sure the dimensions have a 1.344:1 ratio
    if (w/h > 1.344) {
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

    // return [1344,1000]
}

function CalculateMapOffset(minX, minZ) {
    return [minX*1.1,minZ*1.1]
}

function checkNewBounds(newCoords, minX, maxX, minZ, maxZ) {
    let bounds = [0,0,0,0]
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
    const [mapDimensions, setMapDimensions] = useState([13.44,10.00])
    const [mapOffset, setMapOffset] = useState([-1,-1])
    
    useEffect(() => {
        if (props.Coords[0]) {
            if (props.Coords.length < 2) { 
                setMinX(props.Coords[props.Coords.length-1][0] - 1)
                setMaxX(props.Coords[props.Coords.length-1][0] + 1)
                setMinZ(props.Coords[props.Coords.length-1][1] - 1)
                setMaxZ(props.Coords[props.Coords.length-1][1] + 1)
            }
            let newBounds = checkNewBounds(props.Coords[props.Coords.length-1], minX, maxX, minZ, maxZ)
            setMinX(newBounds[0])
            setMaxX(newBounds[1])
            setMinZ(newBounds[2])
            setMaxZ(newBounds[3])
            setMapDimensions(CalculateMapDimensions(minX, maxX, minZ, maxZ))
            setMapOffset(CalculateMapOffset(minX, minZ))
        }
    }, [props])

    // this doesn't work (it's supposed to place the prev lap path on the map every time a new lap is started)
    useEffect(() => {
       prevLapOutline = d3.line()(props.PrevLapCoords)
    }, [props.PrevLapCoords])

    let boxOutline = d3.line()([[minX,minZ], [minX,maxZ], [maxX,maxZ], [maxX,minZ], [minX,minZ]])
    let prevLapOutline = d3.line()(props.PrevLapCoords)
    let lapOutline = d3.line()(props.Coords)

    return (
        <div style={{height: '100%'}}>
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
                    <div style={dataValueStyle}>{props.X+','+props.Y+','+props.Z}</div>
                    <div style={dataKeyStyle}>COORDS</div>
                </div>
            </div>
            <div style={centerColumnStyle}>
                <svg viewBox={`${mapOffset[0]} ${mapOffset[1]} ${mapDimensions[0]} ${mapDimensions[1]}`} style={{backgroundColor: 'transparent'}}>
                    <path d={prevLapOutline} stroke="grey" fill='transparent' strokeWidth='6'/>
                    <path d={lapOutline} stroke="white" fill='transparent' strokeWidth='10'/>
                    <path d={boxOutline} stroke="grey" fill='transparent' strokeWidth='6'/>
                </svg>
            </div>
        </div>
    );
}

export default Map;