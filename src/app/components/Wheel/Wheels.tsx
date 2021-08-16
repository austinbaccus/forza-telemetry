import React, { FC, ReactElement } from "react";
import WheelNumbers from "./WheelNumbers";
import WheelVisual from "./WheelVisual";
import CSS from 'csstype';

const layout: CSS.Properties = {
    width: '100%',
};

type WheelsProps = {
    FlTemp: number,
    FrTemp: number,
    RlTemp: number,
    RrTemp: number,
    FlSlip: number,
    FrSlip: number,
    RlSlip: number,
    RrSlip: number,
    FlSlipRatio: number,
    FrSlipRatio: number,
    RlSlipRatio: number,
    RrSlipRatio: number,
    FlSlipAngle: number,
    FrSlipAngle: number,
    RlSlipAngle: number,
    RrSlipAngle: number
}

const Wheels: FC<WheelsProps> = ({
    FlTemp,
    FrTemp,
    RlTemp,
    RrTemp,
    FlSlip,
    FrSlip,
    RlSlip,
    RrSlip,
    FlSlipRatio,
    FrSlipRatio,
    RlSlipRatio,
    RrSlipRatio,
    FlSlipAngle,
    FrSlipAngle,
    RlSlipAngle,
    RrSlipAngle }): 
    ReactElement => {
    return (
        <div>
            <table style={layout}>
                <tr>
                    {/* front left */}
                    <td style={{width: '60px'}}><WheelVisual Temp={FlTemp}/></td>
                    <td><WheelNumbers Side={0} Temp={FlTemp} Slip={FlSlip} SlipRatio={FlSlipRatio} SlipAngle={FlSlipAngle}/></td>

                    {/* front right */}
                    <td><WheelNumbers Side={1} Temp={FrTemp} Slip={FrSlip} SlipRatio={FrSlipRatio} SlipAngle={FrSlipAngle}/></td>
                    <td style={{width: '60px'}}><WheelVisual Temp={FrTemp}/></td>
                </tr>
                <tr>
                    {/* rear left */}
                    <td style={{width: '60px'}}><WheelVisual Temp={RlTemp}/></td>
                    <td><WheelNumbers Side={0} Temp={RlTemp} Slip={RlSlip} SlipRatio={RlSlipRatio} SlipAngle={RlSlipAngle}/></td>

                    {/* rear right */} 
                    <td><WheelNumbers Side={1} Temp={RrTemp} Slip={RrSlip} SlipRatio={RrSlipRatio} SlipAngle={RrSlipAngle}/></td>
                    <td style={{width: '60px'}}><WheelVisual Temp={RrTemp}/></td>
                </tr>
            </table>
        </div>
    );
};

export default Wheels;