<h3 align=center>Forza Telemetry</h3>

<div align=center>

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/austinbaccus/forza-telemetry.svg)](https://github.com/eastonco/YikYak/Issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/austinbaccus/forza-telemetry.svg)](https://github.com/eastonco/YikYak/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align=center>Record and Display Telemetry from Forza Motorsport 7, Horizon 4, and Horizon 5.
    <br/>
</p>

<img src="https://user-images.githubusercontent.com/10345834/135935950-c2771543-0c8d-45d6-a127-8220ab46b2ec.gif" width=650 align=center>

## 📝 Table of Contents

-   [Quick Start](#quick_start)
-   [Features](#features)
-   [Built Using](#built_using)
-   [FAQ](#faq)

## 🏁 Quick Start <a name="quick_start"></a>

### Configuration

#### Installing .NET 6.0

1. Visit [Microsoft's .NET 6.0 download page](https://dotnet.microsoft.com/download/dotnet/6.0)
2. Download the x64 version of the installer for Windows

#### Configuring Forza's UDP settings

##### Motorsport 7

1. Launch the game and head to the HUD options menu
2. Set `Data Out` to `ON`
3. Set `Data Out IP Address` to `127.0.0.1` (localhost)
4. Set `Data Out IP Port` to `5300`
5. Set `Data Out Packet Format` to `CAR DASH`

##### Horizon 4

1. Launch the game and proceed through the menus until you can drive your car
2. Pause the game and navigate to the Settings menu
3. Navigate to HUD and Gameplay
4. Set `Data Out` to `ON`
5. Set `Data Out IP Address` to `127.0.0.1` (localhost)
6. Set `Data Out IP Port` to `5300`

#### Enable UDP Loopback for Forza

1. Install [Window 8 AppContainer Loopback Utility](https://telerik-fiddler.s3.amazonaws.com/fiddler/addons/enableloopbackutility.exe)
2. Start the utility (if it shows a message about orphan sid, you can safely ignore it)
3. Make sure that Forza Horizon 4 / Motorsport 7 are checked
4. Save changes

More information on how to enable this and why it's necessary can be found [here](https://github.com/SHWotever/SimHub/wiki/SimHub-Basics----Games-config-and-troubleshooting#forza-horizon-4--motorsport-7)

### Running the App

1. Clone this repository: `git clone https://github.com/austinbaccus/forza-telemetry.git`
2. Open a terminal and navigate to the folder containing the `src` folder
3. Install dependencies with `npm install`
4. Run: `npm run build:react | npm run build | npm run start`

OR

1. Download the latest release version
2. Unzip the folder
3. Run the executable

## 🚀 Features <a name="features"></a>

### Record Telemetry

-   This app allows users to save all telemetry to a CSV file for later analysis
-   All incoming telemetry data is saved (along with the timestamp)
    <img src="https://user-images.githubusercontent.com/10345834/135935841-fd35ff94-461f-4e40-8305-688cf3795049.gif" width=350 align=center>
    This gif was created by using the Recording feature and <a href="https://github.com/austinbaccus/forza-map-visualization">Forza Map Visualization</a> to make a 3D trace of the player's XYZ coordinates during a race

### Map Trail

-   Your car's path will be drawn in real-time as you drive around in either Motorsport or Horizon
    <img src="https://user-images.githubusercontent.com/10345834/131269308-40c7ace2-069c-4a6e-8952-6631cc5274d5.gif" width=350 align=center>

### Fuel Management

-   Displays the number of laps you can go until you run out of fuel
-   Displays the amount of fuel consumed per lap
-   Displays your car's MPG

### Lap Dashboard

-   Displays time and split time for every lap, not just your best and previous lap

### Runs on your Local Machine

-   Forza Telemetry uses a UDP loopback so that you can run this program on the same computer that you're using to play Forza

## ⚒️ Built Using <a name="built_using"></a>

-   [React](https://reactjs.org/)
-   [Webpack](https://webpack.js.org/)
-   [Electron](https://electronjs.org/)
-   [Babbel](https://babeljs.io/)
-   [Material-UI](https://material-ui.com/)
-   [Bootstrap](https://getbootstrap.com/)

## ❓ FAQ <a name="faq"></a>

### Why does the MPG value look off?

Because Forza calculates fuel consumption in a very strange way. Also, Forza cars have an unknown amount of fuel, so calculating the Miles Per Gallon figure is a bit tricky. The app assumes that each car has roughly 13 gallons of fuel to arrive at a number for MPG (13 gallons of fuel is a typical amount for a road car).

### Why is the app running slowly?

Most likely the map has too much data to render.

### Why do some things look out of place?

This app looks best when it's in a 1920x1080 window (and looks even better in fullscreen mode). When the window deviates from this size, some visual elements might be placed incorrectly.

### Can I use this app with an Xbox?

Not yet. That is a feature I'd like to implement eventually.
