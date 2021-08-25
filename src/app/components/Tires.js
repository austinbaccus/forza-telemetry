import React from 'react'

const sideColumnStyle = {
    float: 'left',
    width: '25%',
    height: '100%',
    color: 'white'
};
const centerColumnStyle = {
    float: 'left',
    width: '75%',
    height: '100%'
};
const dataTopRowStyle = { 
    height: '25%',
    textAlign: 'left',
    margin: '18px 0px 0px 35px',
    fontFamily: 'Roboto'
}
const dataRowStyle = { 
    height: '25%',
    textAlign: 'left',
    margin: '-2px 0px 0px 30px',
    fontFamily: 'Roboto'
}
const dataValueStyle = {
    color: '#C54242',
    fontSize: '24px'
}
const dataKeyStyle = {
    color: 'grey',
    fontSize: '12px'
}
const tireTableStyle = {
    tableLayout: 'fixed',
    height: '100%',
    width: '80%',
}
const tireTableDataStyle = {
    width: '50%'
}

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

function LeftTire(props) {
    let t = props.Temp;
    let tempScaleValue = tempToScale(t);
    let rgb = toRgba(tempScaleValue);
    let hex = toHex(rgb);
    return (
        <div>
            <svg width="100" height="100">
                <rect x='40' y ='15' width="45" height="73" rx="10" style={{fill:hex, stroke:'#1c87c9', strokeWidth:'2'}}/>
            </svg>
        </div>
        
    );
}
function RightTire(props) {
    let t = props.Temp;
    let tempScaleValue = tempToScale(t);
    let rgb = toRgba(tempScaleValue);
    let hex = toHex(rgb);
    return (
        <div>
            <svg width="100" height="100">
                <rect x='40' y='15' width="45" height="73" rx="10" style={{fill:hex, stroke:'#1c87c9', strokeWidth:'2'}}/>
            </svg>
        </div>
    );
}

function Tires(props) {
    return (
        <div style={{height: '100%'}}>
            <div style={sideColumnStyle}>
                <div style={dataTopRowStyle}>
                    <div style={dataValueStyle}>{Number(180 * props.Pitch / Math.PI).toFixed(1)}°</div>
                    <div style={dataKeyStyle}>PITCH</div>
                </div>
                <div style={dataRowStyle}>
                    <div style={dataValueStyle}>{Number(180 * props.Yaw / Math.PI).toFixed(1)}°</div>
                    <div style={dataKeyStyle}>YAW</div>
                </div>
                <div style={dataRowStyle}>
                    <div style={dataValueStyle}>{Number(180 * props.Roll / Math.PI).toFixed(1)}°</div>
                    <div style={dataKeyStyle}>ROLL</div>
                </div>
                <div style={dataRowStyle}>
                    <div style={dataValueStyle}>{Number(100 * (props.Brake / 255)).toFixed(0)}%</div>
                    <div style={dataKeyStyle}>BRAKE</div>
                </div>
            </div>
            <div style={centerColumnStyle}>
                <table style={tireTableStyle}>
                    <tbody>
                        <tr>
                            <td style={tireTableDataStyle}><LeftTire Temp={props.FlTemp}/></td>
                            <td style={tireTableDataStyle}><RightTire Temp={props.FrTemp}/></td>
                        </tr>
                        <tr>
                            <td style={tireTableDataStyle}><LeftTire Temp={props.RlTemp}/></td>
                            <td style={tireTableDataStyle}><RightTire Temp={props.RrTemp}/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Tires;