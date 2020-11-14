import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: "100",
    },
});

export default function SpreadsheetContent() {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>A</TableCell>
                        <TableCell>B</TableCell>
                        <TableCell>C</TableCell>
                        <TableCell>D</TableCell>
                        <TableCell>E</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell component="th" scope="row">Row</TableCell>
                        <TableCell align="right">Cell A</TableCell>
                        <TableCell align="right">Cell B</TableCell>
                        <TableCell align="right">Cell C</TableCell>
                        <TableCell align="right">Cell D</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">Row</TableCell>
                        <TableCell align="right">Cell A</TableCell>
                        <TableCell align="right">Cell B</TableCell>
                        <TableCell align="right">Cell C</TableCell>
                        <TableCell align="right">Cell D</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
