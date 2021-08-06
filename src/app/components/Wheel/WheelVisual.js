import React from "react";
import { Rectangle } from 'react-shapes';

function tempToScale(temp) {
    let minTemp = 30
    let maxTemp = 300
    return Math.floor(765 * Math.min(1, Math.max(0, (temp - minTemp) / maxTemp)))
}

function toRgba(tempScaleValue) {
    // tempScaleValue ranges from 0 to 765, 0 being the coldest

    // first 255 - third value goes from 255 to 0
    let thirdValue = 255 - Math.min(255,tempScaleValue)

    // second 255
    let firstValue = tempScaleValue > 255 ?  Math.min(255,tempScaleValue - 255) : 0

    // third 255
    let secondValue = tempScaleValue > 510 ? 255 - (tempScaleValue - 510) : 255

    return `rgba(${firstValue},${secondValue},${thirdValue},1)`
}

function toHex(rgbaValue) {
    // rgbaValue format: "rgba(0, 0, 0, 0.74)"
    var rgb = rgbaValue.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        hex = rgb ?
        (rgb[1] | 1 << 8).toString(16).slice(1) +
        (rgb[2] | 1 << 8).toString(16).slice(1) +
        (rgb[3] | 1 << 8).toString(16).slice(1) : rgbaValue;
  
    return `#${hex}`;
  }

function WheelVisual (props) {
    let t = props.Temp;
    let tempScaleValue = tempToScale(t);
    let rgb = toRgba(tempScaleValue);
    let hex = toHex(rgb);
    return (
        <div>
            <Rectangle 
                width={50} 
                height={100} 
                fill={{color:hex}} 
                stroke={{color:'#FFFFFF'}} 
                strokeWidth={3} />
        </div>
    );
};

export default WheelVisual;