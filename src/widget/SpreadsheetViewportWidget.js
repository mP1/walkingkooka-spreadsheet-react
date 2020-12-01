import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";
import SpreadsheetCellReference from "../spreadsheet/reference/SpreadsheetCellReference";
import SpreadsheetCell from "../spreadsheet/SpreadsheetCell";
import SpreadsheetFormula from "../spreadsheet/SpreadsheetFormula";
import TextStyle from "../text/TextStyle";
import Text from "../text/Text";

const columnHeader = {
    margin: "0",
    borderColor: "#000",
    borderStyle: "solid",
    borderWidth: "1px",
    padding: "0",
    fontWeight: "bold",

    textAlign: "center",
    verticalAlign: "middle",

    backgroundColor: "#bbb", // TODO take colours from theme
    color: "#444",
};

/**
 * This component holds the cells viewport as well as the column and row controls.
 */
export default class SpreadsheetViewportWidget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cells: props.cells,
            columnWidths: props.columnWidths,
            rowHeights: props.rowHeights,
            defaultStyle: props.defaultStyle,
            dimensions: props.dimensions,
            home: props.home,
        }
    }

    /**
     * Renders a TABLE CONTAINER which contains the header and cells to fill the table body.
     */
    render() {
        const {dimensions, defaultStyle, home} = this.state;

        return (dimensions && defaultStyle && home && this.renderTable()) ||
            this.emptyTable();
    }

    renderTable() {
        const dimensions = this.state.dimensions;

        return <TableContainer component={Paper}
                               style={{
                                   width: dimensions.width,
                                   height: dimensions.height,
                                   minWidth: "100%",
                                   overflow: "hidden",
                                   borderRadius: 0, // cancel paper rounding.
                               }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {
                                    this.headers()
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.body()
                            }
                        </TableBody>
                    </Table>
                </TableContainer>;
    }

    /**
     * Returns an array of TableCell, one for each column header.
     */
    headers() {
        const {columnWidths, dimensions, defaultStyle, home} = this.state;
        const viewportWidth = dimensions.width;
        const defaultColumnWidth = defaultStyle.width().value();

        let headers = [];
        let x = 0;
        let column = home.column();

        while (x < viewportWidth) {
            headers.push(
                <TableCell key={column} style={columnHeader}>{column.toString()}</TableCell>
            );

            x = x + (columnWidths.get(column) || defaultColumnWidth);
            column = column.add(1);
        }

        return headers;
    }

    /**
     * Render the required TABLE ROW each filled with available or empty TABLE CELL cells.
     */
    body() {
        const {cells, columnWidths, rowHeights, defaultStyle, dimensions, home} = this.state;

        const defaultColumnWidth = defaultStyle.width().value();
        const defaultRowHeight = defaultStyle.height().value();

        const viewportWidth = dimensions.width;
        const viewportHeight = dimensions.height;

        const tableRows = [];

        let y = 0;
        let row = home.row();

        while (y < viewportHeight) {

            const tableCells = [];
            let x = 0;
            let column = home.column();

            // reference, formula, style, format, formatted
            while (x < viewportWidth) {
                const cellReference = new SpreadsheetCellReference(column, row);
                const cell = cells.get(cellReference) || this.emptyCell(cellReference);

                tableCells.push(cell.render(defaultStyle));

                x = x + (columnWidths.get(row) || defaultColumnWidth);
                column = column.add(1);
            }

            tableRows.push(
                <TableRow key={row}>
                    {
                        tableCells
                    }
                </TableRow>
            );

            y = y + (rowHeights.get(row) || defaultRowHeight);
            row = row.add(1);
        }

        return tableRows;
    }

    /**
     * Provides the empty cell that appears when the reference has no actual cell.
     */
    emptyCell(reference) {
        return new SpreadsheetCell(reference,
            new SpreadsheetFormula(""),
            TextStyle.EMPTY,
            undefined,
            new Text(""));
    }

    /**
     * Renders an empty table, this happens when ALL requirements are not yet available.
     */
    emptyTable() {
        return <TableContainer/>;
    }
}

SpreadsheetViewportWidget.propTypes = {
    dimensions: PropTypes.object.isRequired,
}