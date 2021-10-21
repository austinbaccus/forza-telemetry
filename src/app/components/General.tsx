import React, { FC, ReactElement } from 'react'

type GeneralProps = {
    PositionX: number
    PositionY: number
    PositionZ: number
    Steer: number
    Gear: number
    Fuel: number
    Distance: number
    EngineMaxRpm: number
    EngineIdleRpm: number
    CurrentEngineRpm: number
}

const General: FC<GeneralProps> = ({
    PositionX,
    PositionY,
    PositionZ,
    Steer,
    Gear,
    Fuel,
    Distance,
    EngineMaxRpm,
    EngineIdleRpm,
    CurrentEngineRpm,
}): ReactElement => {
    return (
        <div>
            <p>X: {PositionX}</p>
            <p>Y: {PositionY}</p>
            <p>Z: {PositionZ}</p>
            <p>Steer: {Steer}</p>
            <p>Gear: {Gear}</p>
            <p>Fuel: {Fuel}</p>
            <p>Distance: {Distance}</p>
            <p>EngineMaxRpm: {EngineMaxRpm}</p>
            <p>EngineIdleRpm: {EngineIdleRpm}</p>
            <p>CurrentEngineRpm: {CurrentEngineRpm}</p>
        </div>
    )
}

export default General
