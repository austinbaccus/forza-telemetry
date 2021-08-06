import React from "react";

const card = {
    //width: '100%',
    backgroundColor: 'grey',
    padding: '10px',
    margin: '10px',
    borderRadius: '8px'
};

const Card = ({children}) => {
    return (
        <div style={card}>
            {children}
        </div>
    );
};

export default Card;