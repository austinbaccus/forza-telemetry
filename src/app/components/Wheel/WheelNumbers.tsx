import React, { FC, ReactElement } from "react";
import CSS from 'csstype';
import DataText from "../DataText";

type WheelNumbersProps = {
    Side: number, // 0 = left, 1 = right
    Temp: number,
    Slip: number,
    SlipRatio: number,
    SlipAngle: number
}

const container: CSS.Properties = {
    width: '100%'
}

const WheelNumbers: FC<WheelNumbersProps> = ({
    Side,
    Temp,
    Slip,
    SlipRatio,
    SlipAngle }): 
    ReactElement => {
    return (
        <div style={container}>
            <DataText header='Temp' value={Temp} alignment={Side === 0 ? 'left' : 'right'}/>
            <DataText header='Slip' value={Slip} alignment={Side === 0 ? 'left' : 'right'}/>
            <DataText header='Slip Ratio' value={SlipRatio} alignment={Side === 0 ? 'left' : 'right'}/>
            <DataText header='Slip Angle' value={SlipAngle} alignment={Side === 0 ? 'left' : 'right'}/>
        </div>
    );
};

export default WheelNumbers;