import React from "react";
import Arc from "./Arc";

function Tach(props) {
  return (
    <div>
        <Arc outerRadius={props.outerRadius} innerRadius={props.innerRadius} startAngle={props.startAngle} endAngle={props.endAngle}/>
    </div>
  );
};

export default Tach;