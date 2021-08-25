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
    margin: '18px 0px 0px 30px',
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

function Steering(props) {
    return (
        <div style={{height: '100%'}}>
            <div style={sideColumnStyle}>
                <div style={dataTopRowStyle}>
                    <div style={dataValueStyle}>{props.Power}</div>
                    <div style={dataKeyStyle}>POWER</div>
                </div>
                <div style={dataRowStyle}>
                    <div style={dataValueStyle}>{props.Torque}</div>
                    <div style={dataKeyStyle}>TORQUE</div>
                </div>
                <div style={dataRowStyle}>
                    <div style={dataValueStyle}>{props.Throttle}%</div>
                    <div style={dataKeyStyle}>THROTTLE</div>
                </div>
                <div style={dataRowStyle}>
                    <div style={dataValueStyle}>{props.Boost}</div>
                    <div style={dataKeyStyle}>BOOST</div>
                </div>
            </div>
            <div style={centerColumnStyle}>
                <svg height='100%' width='100%'>
                    <path d=" M 163 293 A 100 100 0 1 1 237 293" stroke="yellow" strokeWidth="5" fill="none"/>
                    <path d=" M 176 124 A 100 100 256 0 1 237 128"  stroke="green" strokeWidth="5" fill="none"/>
                </svg>
            </div>
        </div>
    );
}

export default Steering;