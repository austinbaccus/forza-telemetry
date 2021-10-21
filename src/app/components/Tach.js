import React from 'react'
import Arc from './Arc'

const centerStyle = {
    margin: 'auto',
    width: '100%',
    height: '100%',
    marginTop: '-40px',
}
const blockStyle = {
    display: 'flex',
    flexFlow: 'row nowrap',
}
const backgroundStyle = {
    boxSizing: 'borderBox',
    width: '100%',
    flex: 'none',
}
const foregroundStyle = {
    boxSizing: 'borderBox',
    width: '100%',
    flex: 'none',
    marginLeft: '-100%',
}
const foregroundNumbersStyle = {
    boxSizing: 'borderBox',
    width: '100%',
    flex: 'none',
    marginLeft: '-100%',
    fontFamily: 'Roboto',
    color: '#C54242',
}
const numbersContainer = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
}
const child = {
    textAlign: 'center',
}
const rpm = {
    fontSize: '40px',
    marginTop: '270px',
}
const gear = {
    fontSize: '72px',
    marginTop: '120px',
}
const speed = {
    fontSize: '30px',
    marginTop: '15px',
}

function Tach(props) {
    return (
        <div style={centerStyle}>
            <div style={blockStyle}>
                <div style={backgroundStyle}>
                    <Arc
                        outerRadius={props.outerRadius - 5}
                        innerRadius={props.innerRadius - 5}
                        startAngle={0}
                        endAngle={2 * Math.PI * (320 / 360)}
                        color="#4D4D4D"
                        strokeWidth="1"
                    />
                </div>
                <div style={foregroundStyle}>
                    <Arc
                        outerRadius={props.outerRadius}
                        innerRadius={props.innerRadius}
                        startAngle={props.startAngle}
                        endAngle={props.endAngle}
                        color="#C54242"
                        strokeWidth="5"
                    />
                </div>
                <div style={foregroundNumbersStyle}>
                    <div style={numbersContainer}>
                        <div style={child}>
                            <div style={rpm}>{props.rpm}</div>
                            <div style={gear}>{props.gear}</div>
                            <div style={speed}>{props.speed}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tach
