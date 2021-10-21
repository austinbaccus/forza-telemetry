import React, { FC, ReactElement } from 'react'
import CSS from 'csstype'

type DataTextProp = {
    header: string
    value: any
    alignment: string
}

const headerStyle: CSS.Properties = {
    borderRadius: '5em',
    backgroundColor: '#010101',
    color: '#ffffff',
    textAlign: 'center',
}

const DataText: FC<DataTextProp> = ({
    header,
    value,
    alignment,
}): ReactElement => {
    return (
        <div>
            {/* Header */}
            <div style={headerStyle}>{header}</div>
            {/* Value */}
            <div
                style={{
                    color: '#ffffff',
                    textAlign: alignment === 'left' ? 'left' : 'right',
                }}
            >
                {value}
            </div>
        </div>
    )
}

export default DataText
