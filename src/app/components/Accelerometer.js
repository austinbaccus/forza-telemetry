import React from "react";
import { Circle, Polyline } from 'react-shapes';

const centerStyle = {
    margin: 'auto',
    width: '300px',
    height: '300px',
    paddingTop: '17px',
};
const blockStyle = {
    display: 'flex', 
    flexFlow: 'row nowrap',
    //height: '94vh'
};
const backgroundStyle = {
    boxSizing: 'borderBox', 
    width: '100%', 
    flex: 'none' 
};
const foregroundStyle = {
    boxSizing: 'borderBox', 
    width: '100%', 
    flex: 'none', 
    marginLeft: '-100%' 
};

function GetAccelerometerPosition(x, z, radius) {
    let xSign = x >= 0 ? 1 : -1
    let zSign = z >= 0 ? 1 : -1
    let xVal = Math.min(Math.abs(x*10), radius) * xSign
    let zVal = Math.min(Math.abs(z*10), radius) * zSign
    return `${radius},${radius} ${radius-xVal},${radius+zVal}`
}
function GetRedLinePosition(x, z, radius) {
    let xSign = x >= 0 ? 1 : -1
    let zSign = z >= 0 ? 1 : -1

    let xEnd = radius - (Math.min(Math.abs(x*10), radius) * xSign)
    let zEnd = radius + (Math.min(Math.abs(z*10), radius) * zSign)

    let xLen = xEnd - radius
    let zLen = zEnd - radius

    let xStart = (radius - (Math.min(Math.abs(x*10), radius) * xSign)) - (xLen * 0.15)
    let zStart = (radius + (Math.min(Math.abs(z*10), radius) * zSign)) - (zLen * 0.15)

    return `${xStart},${zStart} ${xEnd},${zEnd}`
}

function Accelerometer(props) {
    const radius = 150;

    return (
        <div style={centerStyle}>
            <div style={blockStyle}>
                <div style={backgroundStyle}>
                    <Circle r={radius} fill={{color:'transparent'}} stroke={{color:'#4D4D4D'}} strokeWidth={1} />
                </div>
                <div style={foregroundStyle}>
                    <Polyline points={GetAccelerometerPosition(props.X, props.Z, radius)} fill={{color:'#34495e'}} stroke={{color:'#4D4D4D'}} strokeWidth={3} />
                </div>
                <div style={foregroundStyle}>
                    <Polyline points={GetRedLinePosition(props.X, props.Z, radius)} fill={{color:'transparent'}} stroke={{color:'#C54242'}} strokeWidth={3} />
                </div>
            </div>
        </div>
    );
}

export default Accelerometer;