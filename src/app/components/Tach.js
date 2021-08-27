import React from "react";
import Arc from "./Arc";

const centerStyle = {
  margin: 'auto',
  width: '100%',
  height: '100%',
  paddingTop: '17px',
};
const blockStyle = {
  display: 'flex', 
  flexFlow: 'row nowrap',
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

function Tach(props) {
  return (
    <div style={centerStyle}>
      <div style={blockStyle}>
        <div style={backgroundStyle}>
          <Arc 
            outerRadius={props.outerRadius-5} 
            innerRadius={props.innerRadius-5} 
            startAngle={0} 
            endAngle={2 * Math.PI * (320/360)} 
            color='#4D4D4D'
            strokeWidth='1'
          />
        </div>
        <div style={foregroundStyle}>
          <Arc 
            outerRadius={props.outerRadius} 
            innerRadius={props.innerRadius} 
            startAngle={props.startAngle} 
            endAngle={props.endAngle} 
            color='#C54242'
            strokeWidth='5'
          />
        </div>
      </div>
    </div>
  );
};

export default Tach;