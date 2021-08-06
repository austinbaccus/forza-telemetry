import React from "react";
import { Circle, Polyline } from 'react-shapes';

const blockStyle = {
    display: 'flex', 
    flexFlow: 'row nowrap',
    //height: '94vh'
};
const centerStyle = {
    margin: 'auto',
    width: '50%'
}
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

function CenterCircle() {

}

function CenterLine() {

}

function GetAccelerometerPosition(x, z) {
    return `150,150 ${150-(x*10)},${150+(z*10)}`
}

function Accelerometer(props) {
    return (
        <div style={centerStyle}>
            <div style={blockStyle}>
                <div style={backgroundStyle}>
                    <Circle r={150} fill={{color:'transparent'}} stroke={{color:'red'}} strokeWidth={1} />
                </div>
                <div style={foregroundStyle}>
                    <Polyline points={GetAccelerometerPosition(props.X, props.Z)} fill={{color:'#34495e'}} stroke={{color:'red'}} strokeWidth={3} />
                </div>
                
            </div>
        </div>
    );
}

export default Accelerometer;