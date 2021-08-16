import React from 'react';
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

function createData(lap: number, time: number, split: number) {
  return { lap, time, split };
}

const rows = [
  createData(18, 71.8, 16.0),
  createData(17, 59.9, 3.7),
  createData(16, 72.1, 16.0),
  createData(15, 65.5, 6.0),
  createData(14, 63.2, 9.0),
  createData(13, 71.8, 16.0),
  createData(12, 59.9, 3.7),
  createData(11, 72.1, 16.0),
  createData(10, 65.5, 6.0),
  createData(9, 63.2, 9.0),
  createData(8, 71.8, 16.0),
  createData(7, 59.9, 3.7),
  createData(6, 72.1, 16.0),
  createData(5, 65.5, 6.0),
  createData(4, 63.2, 9.0),
  createData(3, 71.8, 16.0),
  createData(2, 59.9, 3.7),
  createData(1, 72.1, 16.0),
];

export default function Laps() {
  const classes = useStyles();
  return (
    <TableContainer style={{backgroundColor: '#171717'}} component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell style={{color: '#C54242'}}>LAP</TableCell>
            <TableCell align="left" style={{color: '#C54242'}}>TIME</TableCell>
            <TableCell align="right" style={{color: '#C54242'}}>SPLIT</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.lap}>
              <TableCell component="th" scope="row">{row.lap}</TableCell>
              <TableCell align="left">{row.time}</TableCell>
              <TableCell align="right">{row.split}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}