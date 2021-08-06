const url = require("url");
const path = require("path");
const { ConnectionBuilder } = require("electron-cgi");

import { app, BrowserWindow, ipcMain } from "electron";

let window: BrowserWindow | null;

const createWindow = () => {
  window = new BrowserWindow({
    width: 1000, 
    height: 800,
    backgroundColor: '#000000',
    autoHideMenuBar: true,
    webPreferences:{
      nodeIntegration: true, // these two preferences are critical
      contextIsolation: false // to getting data from main to dashboard
    }
  });

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  window.on("closed", () => {
    window = null;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (window === null) {
    createWindow();
  }
});

// C# communication stuff ForzaDataDotNet
const connection = new ConnectionBuilder()
  .connectTo('dotnet', 'run', '--project', 'ForzaCore')
  .build();

connection.onDisconnect = () => {
  console.log("lost");
};

// receive
connection.on('new-data', (data: any) => {
  // parse data into object
  var dataObj = JSON.parse(data);
  // send the data from forza to the front-end
  window.webContents.send("new-data-for-dashboard", dataObj);
  // log this event
  console.log(`${dataObj.Steer}`);
});

connection.on('switch-recording-mode', (data: any) => {
  // parse data into object
  var dataObj = JSON.parse(data);
  // send the data from forza to the front-end
  window.webContents.send("new-data-for-dashboard", dataObj);
  // log this event
  console.log(`${dataObj.Steer}`);
});

// send
ipcMain.on('switch-recording-mode', (event, arg) => {
  connection.send("switch-recording-mode", "", (response: any) => { });
});