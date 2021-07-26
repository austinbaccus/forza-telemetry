import React, {useState} from "react";
import {ipcRenderer} from "electron";

export const Dashboard = () => {
    const [data, setData] = useState(-1);

    React.useEffect( () => {
        ipcRenderer.on('new-data-for-dashboard', (event:any, message:any) => { 
            console.log('dashboard received data!');
            console.log(message) ;
            setData(-3);  
        });
        setData(-2);                
    }, []);
    return <div>{data}</div>;
};