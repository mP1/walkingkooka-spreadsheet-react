import Equality from "../Equality.js";
import ImmutableMap from "../util/ImmutableMap.js";
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";
import React from 'react';
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetCell from "./SpreadsheetCell.js";
import SpreadsheetColumnReference from "./reference/SpreadsheetColumnReference.js";
import SpreadsheetFormula from "./SpreadsheetFormula.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Text from "../text/Text.js";
import TextStyle from "../text/TextStyle.js";
import './SpreadsheetViewportWidget.css';

const headerCell = {
    minWidth: "4ex",

    margin: "0",
    borderColor: "#000",
    borderStyle: "solid",
    borderWidth: "1px",
    padding: "0",
    fontWeight: "bold",

    textAlign: "center",
    verticalAlign: "middle",

    backgroundColor: "#ccc", // TODO take colours from theme
    color: "#333",
};

const headerCellSelected = Object.assign({},
    headerCell,
    {
        backgroundColor: "#444", // TODO take colours from theme
        color: "#bbb",
    },
);

/**
 * This component holds the cells viewport as well as the column and row controls.
 */
export default class SpreadsheetViewportWidget extends SpreadsheetHistoryAwareStateWidget {

    initialStateFromProps(props) {
        return {
            cells: props.cells,
            columnWidths: props.columnWidths,
            rowHeights: props.rowHeights,
            defaultStyle: props.defaultStyle,
            dimensions: props.dimensions,
            home: props.home,
        };
    }

    stateFromHistoryTokens(tokens) {
        return {
            editCell: tokens[SpreadsheetHistoryHash.CELL],
        };
    }

    init() {
        // nop
    }

    /**
     * Possibly update the history hash using the current state.editCell
     */
    historyTokensFromState(prevState) {
        const editCellOld = prevState.editCell;
        const editCellNew = this.state.editCell;
        console.log("historyTokensFromState editCell: " + editCellOld + " to " + editCellNew);

        if(!Equality.safeEquals(editCellOld, editCellNew)){
            const history = this.history;
            const current = history.location.pathname;

            const replacement = {};
            replacement[SpreadsheetHistoryHash.CELL] = editCellNew;

            const tokens = SpreadsheetHistoryHash.parse(current);
            const updatedPathname = SpreadsheetHistoryHash.merge(
                tokens,
                replacement
            );
            console.log("historyTokensFromState current: " + current + " to " + updatedPathname);
            if(current !== updatedPathname){
                history.push(updatedPathname);
            }

            if(!tokens[SpreadsheetHistoryHash.CELL_FORMULA]) {
                console.log("Missing formula token giving focus to cell...", tokens);
                const cellElement = document.getElementById("cell-" + editCellNew);
                if(cellElement) {
                    cellElement.focus();
                }
            }
        }
    }

    /**
     * Renders a TABLE CONTAINER which contains the header and cells to fill the table body.
     */
    render() {
        console.log("SpreadsheetViewportWidget.render", this.state);

        const {dimensions, home} = this.state;

        return (dimensions && home && this.renderTable()) ||
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
        const {columnWidths, dimensions, defaultStyle, home, editCell} = this.state;
        const viewportWidth = dimensions.width;
        const defaultColumnWidth = defaultStyle.width().value();
        const editCellColumn = editCell && editCell.column();

        let headers = [];
        headers.push(<TableCell key={"all"} id={"select-all-cells"} style={headerCell}></TableCell>); // TODO add select all support

        let x = 0;
        let column = home.column();

        while(x < viewportWidth) {
            headers.push(
                this.headerCell(column, column.equals(editCellColumn))
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
        const {cells, columnWidths, rowHeights, defaultStyle, dimensions, home, editCell} = this.state;

        const defaultColumnWidth = defaultStyle.width().value();
        const defaultRowHeight = defaultStyle.height().value();

        const viewportWidth = dimensions.width;
        const viewportHeight = dimensions.height;

        const editCellRow = editCell && editCell.row();

        const tableRows = [];

        let y = 0;
        let row = home.row();

        while(y < viewportHeight) {

            const tableCells = [];
            let x = 0;
            let column = home.column();

            tableCells.push(this.headerCell(row, row.equals(editCellRow)));

            // reference, formula, style, format, formatted
            while(x < viewportWidth) {
                const cellReference = new SpreadsheetCellReference(column, row);
                const cell = cells.get(cellReference) || this.emptyCell(cellReference);

                if(cells.get(cellReference)){
                    console.log("SpreadsheetViewportWidget cell " + cellReference, cellReference, cell);
                }

                const editing = cellReference.equals(editCell);

                tableCells.push(
                    cell.render(
                        defaultStyle,
                        editing,
                        () => this.onCellClick(cellReference),
                        editing ? (event) => this.onCellKeyDown(event, cellReference) : undefined,
                    )
                );

                x = x + (columnWidths.get(row) || defaultColumnWidth);
                column = column.add(1);
            }

            tableRows.push(
                <TableRow key={row} id={"row-" + row}>
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
     * Creates a TABLE CELL which will be the column or row header.
     */
    headerCell(reference, highlighted) {
        const column = reference instanceof SpreadsheetColumnReference;

        return <TableCell key={reference}
                          id={(column ? "column-" : "row-") + "" + reference}
                          className={(column ? "column" : "row") + (highlighted ? " selected" : "")}
                          style={highlighted ? headerCellSelected : headerCell}>{reference.toString()}</TableCell>
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

    onCellClick(cellReference) {
        console.log("onCellClick: " + cellReference);

        this.saveEditCell(cellReference);
    }

    onCellKeyDown(event, cellReference) {
        event.preventDefault();

        const key = event.key;
        console.log("onCellKeyDown: " + cellReference + " key: " + key);

        switch(key) {
            case "ArrowLeft":
                this.saveEditCell(cellReference.addColumnSaturated(-1));
                break;
            case "ArrowDown":
                this.saveEditCell(cellReference.addRowSaturated(+1));
                break;
            case "ArrowRight":
                this.saveEditCell(cellReference.addColumnSaturated(+1));
                break;
            case "ArrowUp":
                this.saveEditCell(cellReference.addRowSaturated(-1));
                break;
            case "Enter":
                this.giveFormulaTextBoxFocus();
                break;
            case "Escape":
                this.blurFormulaTextBox();
                break;
            default:
                // ignore other keys
                break;
        }
    }

    /**
     * Saves the new edit cell, this should trigger any changes to the viewport including loading new cells
     * scrolling etc.
     */
    saveEditCell(cellReference) {
        this.setState({
            editCell: cellReference,
        });
    }

    giveFormulaTextBoxFocus() {
        const replacements = {}
        replacements[SpreadsheetHistoryHash.CELL_FORMULA] = true;

        this.updateFormulaTextBoxFocus(replacements);
    }

    blurFormulaTextBox() {
        const replacements = {}
        replacements[SpreadsheetHistoryHash.CELL] = null;
        replacements[SpreadsheetHistoryHash.CELL_FORMULA] = false;

        this.updateFormulaTextBoxFocus(replacements);
    }

    updateFormulaTextBoxFocus(replacements) {
        SpreadsheetHistoryHash.parseMergeAndPush(this.history, replacements);
    }
}

SpreadsheetViewportWidget.propTypes = {
    history: PropTypes.object.isRequired,
    cells: PropTypes.instanceOf(ImmutableMap).isRequired,
    columnWidths: PropTypes.instanceOf(ImmutableMap).isRequired,
    rowHeights: PropTypes.instanceOf(ImmutableMap).isRequired,
    defaultStyle: PropTypes.instanceOf(TextStyle),
    dimensions: PropTypes.object,
    homeCell: PropTypes.instanceOf(SpreadsheetCellReference),
}
