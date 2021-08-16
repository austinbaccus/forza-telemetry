import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'

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
    return [minX*1.0,minZ*1.1]
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
    const [minX, setMinX] = useState(-10)
    const [maxX, setMaxX] = useState(10)
    const [minZ, setMinZ] = useState(-10)
    const [maxZ, setMaxZ] = useState(10)
    const [mapDimensions, setMapDimensions] = useState([13.44,10.00]) // width, height
    const [mapOffset, setMapOffset] = useState([-5,-5]) // horizontal, vertical
    
    useEffect(() => {
        // if (props.Coords[props.Coords]) {
        if (props.Coords[0]) {
            let newBounds = checkNewBounds(props.Coords[props.Coords.length-1], minX, maxX, minZ, maxZ)
            setMinX(newBounds[0])
            setMaxX(newBounds[1])
            setMinZ(newBounds[2])
            setMaxZ(newBounds[3])
            setMapDimensions(CalculateMapDimensions(minX, maxX, minZ, maxZ))
            setMapOffset(CalculateMapOffset(minX, minZ))
        }
    }, [props])

    let boxOutline = d3.line()([[minX,minZ], [minX,maxZ], [maxX,maxZ], [maxX,minZ], [minX,minZ]])
    let lapOutline = d3.line()(props.Coords)
    console.log(props.Coords.length)

    return (
        <div>
            <svg viewBox={`${mapOffset[0]} ${mapOffset[1]} ${mapDimensions[0]} ${mapDimensions[1]}`} style={{backgroundColor: 'transparent'}}>
                <path d={boxOutline} stroke="grey" fill='transparent' strokeWidth='8'/>
                <path d={lapOutline} stroke="white" fill='transparent' strokeWidth='10'/>
            </svg>
        </div>
    );
}

export default Map;