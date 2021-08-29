import React, { FC, ReactElement, useEffect } from 'react';
import { makeStyles, createTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    width: '95%',
    backgroundColor: '#171717',
    margin: '2.5%'
  },
});

type LapProps = {
  LapNumber: number, 
  LapTime: string, 
  PreviousLaps: number[][]
}

const Laps: React.FC<LapProps> = ({LapNumber, LapTime, PreviousLaps}) => {
  const classes = useStyles();

  var visibleLaps = new Array<Array<number>>();
  for (var i = 0; i < PreviousLaps.length; i++) { // 17
    visibleLaps.push(PreviousLaps[i])
  }
  while (visibleLaps.length > 17) {
    visibleLaps.shift()
  }

  return (
    <TableContainer style={{backgroundColor: '#171717'}} component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow key={'header'}>
            <TableCell style={{color: '#C54242'}}>LAP</TableCell>
            <TableCell align="left" style={{color: '#C54242'}}>TIME</TableCell>
            <TableCell align="right" style={{color: '#C54242'}}>SPLIT</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={LapNumber}>
            <TableCell component="th" scope="row">{LapNumber}</TableCell>
            <TableCell align="left">{LapTime}</TableCell>
            <TableCell align="right"> </TableCell>
          </TableRow>
          {visibleLaps.map((row) => (
            <TableRow key={row[0]}>
              <TableCell component="th" scope="row">{row[0]+1}</TableCell>
              <TableCell align="left">{row[1]}</TableCell>
              <TableCell align="right">{row[2]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Laps;