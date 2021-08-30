# Forza Telemetry
Record and Display Telemetry from Forza Motorsport 7, Horizon 4, and Horizon 5.

<img src="https://user-images.githubusercontent.com/10345834/131267675-9a4c4617-954c-4bd3-bd65-c854cd8e2f9d.png" width=650 align=center>

## Quick Start
1. Clone this repository: `git clone https://github.com/austinbaccus/forza-telemetry.git`

2. Open a terminal and navigate to the folder containing the `src` folder

3. Run: `npm run build:react | npm run build | npm run start`
## Features
### Record Telemetry
- This app allows users to save all telemetry to a CSV file for later analysis
### Map Trail
- Your car's path will be drawn in real-time as you drive around in either Motorsport or Horizon
<img src="https://user-images.githubusercontent.com/10345834/131269308-40c7ace2-069c-4a6e-8952-6631cc5274d5.gif" width=350 align=center>

### Fuel Management
- Displays the number of laps you can go until you run out of fuel
- Displays the amount of fuel consumed per lap
- Displays your car's MPG
### Lap Dashboard
- Displays time and split time for every lap, not just your best and previous lap
### Runs on your Local Machine
- Forza Telemetry uses a UDP loopback so that you can run this program on the same computer that you're using to play Forza

## FAQ
### Why does the MPG value look off?
Because Forza calculates fuel consumption in a very strange way. Also, Forza cars have an unknown amount of fuel, so calculating the Miles Per Gallon figure is a bit tricky. The app assumes that each car has roughly 13 gallons of fuel to arrive at a number for MPG (13 gallons of fuel is a typical amount for a road car).
### Why is the app running slowly?
Most likely the map has too much data to render. Adjust the map performance options in the Settings menu to compensate.
### Why do some things look out of place? 
This app looks best when it's in a 1920x1080 window (and looks even better in fullscreen mode). When the window deviates from this size, some visual elements might be placed incorrectly.
