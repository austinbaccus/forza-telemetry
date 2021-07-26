const url = require("url");
const path = require("path");
const { ConnectionBuilder } = require("electron-cgi");

import { app, BrowserWindow } from "electron";

let window: BrowserWindow | null;

const createWindow = () => {
  window = new BrowserWindow({
    width: 800, 
    height: 600,
    autoHideMenuBar: true,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: false
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

// send
connection.send("message-from-node", "hi dotnet, it's node!", (response: any) => {
  console.log("node: message sent to dotnet");
  console.log(`node: response: ${response}`);
});

// receive
connection.on('new-data', (data: any) => {
  // send the data from forza to the front-end
  window.webContents.send("new-data-for-dashboard", data);
  // log this event
  console.log(`node: new data from dotnet: ${data}`);
});