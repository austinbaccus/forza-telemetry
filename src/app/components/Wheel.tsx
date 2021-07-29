import React, { useState, FC, ReactElement } from "react";

type WheelProps = {
    traction: number, 
    offset: number, 
    speed: number, 
    camber: number, 
    tempInner: number,
    tempCenter: number,
    tempOuter: number,
  }

const Wheel: FC<WheelProps> = ({
    traction, 
    offset, 
    speed,
    camber,
    tempInner,
    tempCenter,
    tempOuter}): 
    ReactElement => {
    return (
        <div>
            <p>{traction}</p>
            <p>{offset}</p>
            <p>{speed}</p>
            <p>{camber}</p>
            <p>{tempInner}</p>
            <p>{tempCenter}</p>
            <p>{tempOuter}</p>
        </div>
    );
};

export default Wheel;