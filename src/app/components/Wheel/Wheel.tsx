import React, { useState, FC, ReactElement } from "react";
import WheelNumbers from "./WheelNumbers";
import WheelVisual from "./WheelVisual";
import CSS from 'csstype';

const left: CSS.Properties = {
    float: 'left',
    height: '100%',
    backgroundColor: 'darkkhaki'
};
const right: CSS.Properties = {
    height: '100%',
    backgroundColor: 'burlywood'
};
const container: CSS.Properties = {
    width: '100%',
    height: '300px',
    backgroundColor: 'grey'
}

type WheelProps = {
    Side: number, // 0 = left, 1 = right
    Temp: number,
    Slip: number,
    SlipRatio: number,
    SlipAngle: number
}

const Wheel: FC<WheelProps> = ({
    Side,
    Temp,
    Slip,
    SlipRatio,
    SlipAngle }): 
    ReactElement => {
    return (
        <div style={container}>
            <div style={left}>
                { Side === 1 ? <WheelNumbers Side={Side} Temp={Temp} Slip={Slip} SlipRatio={SlipRatio} SlipAngle={SlipAngle} /> : <WheelVisual Temp={Temp}/> }
            </div>
            <div style={right}>
                { Side === 1 ? <WheelVisual Temp={Temp}/> : <WheelNumbers Side={Side} Temp={Temp} Slip={Slip} SlipRatio={SlipRatio} SlipAngle={SlipAngle} /> }
            </div>
        </div>
    );
};

export default Wheel;