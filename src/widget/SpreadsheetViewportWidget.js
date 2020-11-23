import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";

/**
 * This component holds the cells viewport as well as the column and row controls.
 */
export default class SpreadsheetViewportWidget extends React.Component {

    static classes = makeStyles((theme) => ({
        table: {
            minWidth: "100%"
        },
    }));

    constructor(props) {
        super(props);
        this.dimensions = props.dimensions;
    }

    render() {
        const dimensions = this.dimensions;

        return (
            <TableContainer className="{classes}" component={Paper} style={{ width: dimensions.width, height: dimensions.height}}>
                <Table className={SpreadsheetViewportWidget.classes.table} size="small">
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
}

SpreadsheetViewportWidget.propTypes = {
    dimensions: PropTypes.object.isRequired,
}