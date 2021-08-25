import React from "react";
import * as shape from "d3-shape";

const d3 = { shape };

const Arc = ({
  outerRadius,
  innerRadius,
  startAngle,
  endAngle
}) => {
  const arcGenerator = d3.shape
    .arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius)
    .startAngle(startAngle)
    .endAngle(endAngle);

  return (
    <div style={{width:'100%', height:'80vh'}}>
        <svg viewBox={'-200 -200 400 400'} style={{maxHeight:'100%'}}>
            <path d={arcGenerator()} stroke="#C54242" strokeWidth="3" fill="none"/>
        </svg>
    </div>
  );
};

export default Arc;