import Equality from "../Equality.js";
import ImmutableMap from "../util/ImmutableMap.js";
import Paper from '@material-ui/core/Paper';
import Preconditions from "../Preconditions.js";
import PropTypes from "prop-types";
import React from 'react';
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetCell from "./SpreadsheetCell.js";
import SpreadsheetColumnReference from "./reference/SpreadsheetColumnReference.js";
import SpreadsheetExpressionReferenceSimilarities from "./SpreadsheetExpressionReferenceSimilarities.js";
import SpreadsheetFormula from "./SpreadsheetFormula.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetLabelName from "./reference/SpreadsheetLabelName.js";
import SpreadsheetMessenger from "./message/SpreadsheetMessenger.js";
import SpreadsheetMessengerCrud from "./message/SpreadsheetMessengerCrud.js";
import SpreadsheetMetadata from "./meta/SpreadsheetMetadata.js";
import SpreadsheetViewport from "./SpreadsheetViewport.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Text from "../text/Text.js";
import TextStyle from "../text/TextStyle.js";

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
 * <ul>
 * <li>ImmutableMap cells: A cache of the cells within the visible viewport</li>
 * <li>ImmutableMap columnWidths: A cache of the column widths within the visible viewport</li>
 * <li>ImmutableMap rowHeights: A cache of the row heights within the visible viewport</li>
 * <li>object dimensions: Holds the width and height of the viewport in pixels</li>
 * <li>SpreadsheetMetadata metadata: holds the viewport home cell & default style</li>
 * <li>SpreadsheetRange viewportRange: holds a range of all the cells within the viewport</li>
 * <li>Immutable cellToLabels: cell to Label lookup</li>
 * </ul>
 */
export default class SpreadsheetViewportWidget extends SpreadsheetHistoryAwareStateWidget {

    init() {
        this.viewportTable = React.createRef();
    }

    componentDidMount() {
        super.componentDidMount();

        const props = this.props;
        this.onSpreadsheetDeltaRemover = props.spreadsheetDeltaCrud.addListener(this.onSpreadsheetDelta.bind(this));
        this.onSpreadsheetLabelCrudRemover = props.spreadsheetLabelCrud.addListener(this.onSpreadsheetLabel.bind(this));
        this.onSpreadsheetMetadataRemover = props.spreadsheetMetadataCrud.addListener(this.onSpreadsheetMetadata.bind(this));
    }

    onSpreadsheetDelta(method, id, delta) {
        const state = this.state;

        const newState = { // lgtm [js/react/inconsistent-state-update]
            cells: state.cells.setAll(delta.referenceToCellMap()),
            columnWidths: state.columnWidths.setAll(delta.maxColumnWidths()),
            rowHeights: state.rowHeights.setAll(delta.maxRowHeights()),
            cellToLabels: state.cellToLabels.setAll(delta.cellToLabels()),
        };

        const window = delta.window();
        if(window.length > 0){
            newState.viewportRange = window[0]; // update the range of cells being shown in the viewport
        }

        this.setState(newState);
    }

    /**
     * If a label was saved o deleted refresh the viewport.
     */
    onSpreadsheetLabel(method, id, label) {
        switch(method) {
            case "DELETE":
            case "POST":
                const viewportTable = this.viewportTable.current;
                if(viewportTable){
                    this.viewportLoadCells(
                        new SpreadsheetViewport(
                            this.state.spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL),
                            0,
                            0,
                            viewportTable.offsetWidth,
                            viewportTable.offsetHeight,
                        )
                    );
                }
                break;
            default:
                break;
        }
    }

    onSpreadsheetMetadata(method, id, metadata) {
        this.setState({
            spreadsheetMetadata: metadata,
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.onSpreadsheetDeltaRemover && this.onSpreadsheetDeltaRemover();
        delete this.onSpreadsheetDeltaRemover;

        this.onSpreadsheetLabelCrudRemover && this.onSpreadsheetLabelCrudRemover();
        delete this.onSpreadsheetLabelCrudRemover;

        this.onSpreadsheetMetadataRemover && this.onSpreadsheetMetadataRemover();
        delete this.onSpreadsheetMetadataRemover;
    }

    initialStateFromProps(props) {
        return {
            cells: ImmutableMap.EMPTY,
            columnWidths: ImmutableMap.EMPTY,
            rowHeights: ImmutableMap.EMPTY,
            dimensions: props.dimensions,
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY,
            cellToLabels: ImmutableMap.EMPTY,
        };
    }

    stateFromHistoryTokens(tokens) {
        return {
            cellOrLabel: tokens[SpreadsheetHistoryHash.CELL],
            formula: tokens[SpreadsheetHistoryHash.CELL_FORMULA],
        };
    }

    /**
     * If the history cell changes and formula token is missing give focus.
     */
    historyTokensFromState(prevState) {
        const historyTokens = {};

        const state = this.state;
        let metadata = state.spreadsheetMetadata;
        const previousMetadata = prevState.spreadsheetMetadata;

        const viewportTable = this.viewportTable.current;

        let newState = {};

        if(viewportTable){
            const viewportCell = metadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);

            if(viewportCell){
                const viewportRange = state.viewportRange;

                const cellNew = state.cell;

                const width = viewportTable.offsetWidth;
                const height = viewportTable.offsetHeight;
                const prevDimensions = prevState.dimensions;

                const cellNewOutsideViewportRange = viewportRange && cellNew && !viewportRange.test(cellNew);

                // if the newCell is outside viewportRange
                // or any metadata properties which mean cells require re-rendering
                // of the viewport width/height increased in size
                // THEN reload all cells
                if(cellNewOutsideViewportRange || metadata.shouldUpdateViewport(previousMetadata) || (width > prevDimensions.width || height > prevDimensions.height)){
                    this.viewportLoadCells(
                        new SpreadsheetViewport(
                            //viewportRange && cellNewInsideViewportRange ? viewportCell : cellNew,
                            cellNewOutsideViewportRange ? cellNew : viewportCell,
                            0,
                            0,
                            width,
                            height
                        )
                    );

                    if(cellNewOutsideViewportRange){
                        metadata = metadata.set(SpreadsheetMetadata.VIEWPORT_CELL, cellNew);
                    }
                }

                const cellOrLabelOld = prevState.cellOrLabel;
                const cellOrLabelNew = state.cellOrLabel;
                const cellOld = prevState.cell;

                if(!Equality.safeEquals(cellOrLabelOld, cellOrLabelNew)){
                    if(cellOrLabelNew instanceof SpreadsheetLabelName){
                        this.resolveLabelToCell(cellOrLabelNew); // eventually updates state.cell
                    }else {
                        newState = {
                            cell: cellOrLabelNew,
                        };
                    }
                }

                historyTokens[SpreadsheetHistoryHash.CELL] = cellOrLabelNew;
                if(state.focused){
                    historyTokens[SpreadsheetHistoryHash.CELL_FORMULA] = null;
                }

                if(!Equality.safeEquals(cellNew, cellOld)){
                    if(!state.formula){
                        console.log("Missing " + SpreadsheetHistoryHash.CELL_FORMULA + " token giving focus to cell..." + cellNew);
                        this.giveFocus(cellNew);
                    }
                }
            }
        }

        // clear caches if spreadsheet-id changed.
        if(previousMetadata){
            if(!Equality.safeEquals(metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID), previousMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID))){
                newState = {
                    cells: ImmutableMap.EMPTY,
                    columnWidths: ImmutableMap.EMPTY,
                    rowHeights: ImmutableMap.EMPTY,
                    cellToLabels: ImmutableMap.EMPTY,
                };
            }
        }

        this.setState(newState);

        // save the updated metadata....................................................................................
        if(!Equality.safeEquals(metadata, previousMetadata)){
            this.props.spreadsheetMetadataCrud.post(
                metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID),
                metadata,
                () => {
                },
                this.props.showError
            );
        }

        return historyTokens;
    }

    /**
     * Queries the server to resolve a label to a cell reference.
     */
    resolveLabelToCell(label) {
        const props = this.props;

        const success = (cell) => this.setState({
            cell: cell,
            cellOrLabel: label,
            spreadsheetMetadata: this.state.spreadsheetMetadata.set(SpreadsheetMetadata.CELL, cell),
        });
        const failure = (message, error) => {
            this.setState({
                cell: null,
                cellOrLabel: null,
            });
            props.showError(message, error);
        }

        props.messenger.send(
            this.similaritiesUrl(label.toString(), 1),
            {
                method: "GET",
            },
            (json) => {
                if(json){
                    const mapping = SpreadsheetExpressionReferenceSimilarities.fromJson(json)
                        .labelMappings()
                        .find(m => m.label().equals(label));
                    if(mapping){
                        success(mapping.reference());
                    }else {
                        failure("Unknown label " + label);
                    }
                }
            },
            failure
        );
    }

    /**
     * Returns a URL that may be used to call the cell-reference end point
     */
    similaritiesUrl(text, count) {
        Preconditions.requireText(text, "text");
        Preconditions.requirePositiveNumber(count, "count");

        return this.spreadsheetMetadataApiUrl() + "/cell-reference/" + encodeURI(text) + "?count=" + count;
    }

    spreadsheetMetadataApiUrl() {
        return "/api/spreadsheet/" + this.state.spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID);
    }

    viewportLoadCells(viewport) {
        const props = this.props;
        props.spreadsheetDeltaCrud.get(
            "*",
            viewport.toQueryStringParameters(),
            () => {
            },
            props.showError
        );
    }

    giveFocus(cellReference) {
        const cellElement = document.getElementById("cell-" + cellReference);
        if(cellElement){
            cellElement.focus();
        }
    }

    /**
     * Renders a TABLE CONTAINER which contains the header and cells to fill the table body.
     */
    render() {
        const {dimensions, spreadsheetMetadata} = this.state;
        const home = spreadsheetMetadata && spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);

        return (dimensions && home && this.renderTable()) ||
            this.emptyTable();
    }

    renderTable() {
        const dimensions = this.state.dimensions;

        return <TableContainer key="viewport-TableContainer"
                               ref={this.viewportTable}
                               component={Paper}
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
        const {columnWidths, dimensions, spreadsheetMetadata} = this.state;

        const home = spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);
        const cell = spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.CELL);
        const defaultStyle = spreadsheetMetadata.effectiveStyle();

        const viewportWidth = dimensions.width;
        const defaultColumnWidth = defaultStyle.width().value();
        const cellColumn = cell && cell.column();

        let headers = [];
        headers.push(<TableCell key={"viewport-all"} id={"select-all-cells"} style={headerCell}></TableCell>); // TODO add select all support

        let x = 0;
        let column = home.column();

        while(x < viewportWidth) {
            headers.push(
                this.headerCell(column, column.equals(cellColumn))
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
        const {cells, columnWidths, rowHeights, spreadsheetMetadata, dimensions, cellToLabels} = this.state;

        const home = spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);
        const cell = spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.CELL);
        const defaultStyle = spreadsheetMetadata.effectiveStyle();

        const defaultColumnWidth = defaultStyle.width().value();
        const defaultRowHeight = defaultStyle.height().value();

        const viewportWidth = dimensions.width;
        const viewportHeight = dimensions.height;

        const cellRow = cell && cell.row();

        const tableRows = [];

        let y = 0;
        let row = home.row();

        while(y < viewportHeight) {

            const tableCells = [];
            let x = 0;
            let column = home.column();

            tableCells.push(this.headerCell(row, row.equals(cellRow)));

            // reference, formula, style, format, formatted
            while(x < viewportWidth) {
                const cellReference = new SpreadsheetCellReference(column, row);
                const cellWidget = cells.get(cellReference) || this.emptyCell(cellReference);

                const editing = cellReference.equals(cell);
                tableCells.push(
                    cellWidget.render(
                        defaultStyle,
                        () => this.onCellClick(cellReference),
                        editing ? (e) => this.onCellKeyDown(e, cellReference) : undefined,
                        cellToLabels.get(cellReference) || [],
                    )
                );

                x = x + (columnWidths.get(row) || defaultColumnWidth);
                column = column.add(1);
            }

            tableRows.push(
                <TableRow key={"viewport-row-" + row} id={"row-" + row}>
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
        const columnOrRow = column ? "column" : "row";

        return <TableCell key={"viewport-" + columnOrRow + "-cell-" + reference}
                          id={(columnOrRow) + "" + reference}
                          className={(columnOrRow) + (highlighted ? " selected" : "")}
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
            Text.EMPTY);
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

    onCellKeyDown(e, cellReference) {
        e.preventDefault();

        const key = e.key;
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
                this.saveEditCell(null);
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
        Preconditions.optionalInstance(cellReference, SpreadsheetCellReference, "cellReference");

        this.setState({
            cell: cellReference,
            cellOrLabel: cellReference,
            focused: false,
            spreadsheetMetadata: this.state.spreadsheetMetadata.set(SpreadsheetMetadata.CELL, cellReference),
        });
    }

    giveFormulaTextBoxFocus() {
        const tokens = {}
        tokens[SpreadsheetHistoryHash.CELL_FORMULA] = true;

        this.historyParseMergeAndPush(tokens);
    }

    blurFormulaTextBox() {
        const tokens = {}
        tokens[SpreadsheetHistoryHash.CELL] = null;
        tokens[SpreadsheetHistoryHash.CELL_FORMULA] = false;

        this.historyParseMergeAndPush(tokens);
    }
}

SpreadsheetViewportWidget.propTypes = {
    dimensions: PropTypes.object,
    history: PropTypes.object.isRequired,
    messenger: PropTypes.instanceOf(SpreadsheetMessenger),
    spreadsheetDeltaCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    spreadsheetLabelCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    spreadsheetMetadataCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    showError: PropTypes.func.isRequired,
}
