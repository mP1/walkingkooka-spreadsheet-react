import _ from "lodash";
import Equality from "../Equality.js";
import ImmutableMap from "../util/ImmutableMap.js";
import Paper from '@material-ui/core/Paper';
import Preconditions from "../Preconditions.js";
import PropTypes from "prop-types";
import React from 'react';
import Slider from "@material-ui/core/Slider";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "./reference/SpreadsheetColumnReference.js";
import SpreadsheetExpressionReferenceSimilarities from "./SpreadsheetExpressionReferenceSimilarities.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetLabelName from "./reference/SpreadsheetLabelName.js";
import SpreadsheetMessenger from "./message/SpreadsheetMessenger.js";
import SpreadsheetMessengerCrud from "./message/SpreadsheetMessengerCrud.js";
import SpreadsheetMetadata from "./meta/SpreadsheetMetadata.js";
import SpreadsheetRange from "./reference/SpreadsheetRange.js";
import SpreadsheetReferenceKind from "./reference/SpreadsheetReferenceKind.js";
import SpreadsheetRowReference from "./reference/SpreadsheetRowReference.js";
import SpreadsheetViewport from "./SpreadsheetViewport.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const SCROLL_DEBOUNCE = 100;

/**
 * This component holds the cells viewport as well as the column and row controls.
 * <ul>
 * <li>ImmutableMap cells: A cache of the cells within the visible viewport</li>
 * <li>ImmutableMap columnWidths: A cache of the column widths within the visible viewport</li>
 * <li>ImmutableMap rowHeights: A cache of the row heights within the visible viewport</li>
 * <li>object dimensions: Holds the width and height of the viewport in pixels</li>
 * <li>SpreadsheetMetadata spreadsheetMetadata: holds the viewport home cell & default style</li>
 * <li>SpreadsheetRange viewportRange: holds a range of all the cells within the viewport</li>
 * <li>Immutable cellToLabels: cell to Label lookup</li>
 * </ul>
 */
export default class SpreadsheetViewportWidget extends SpreadsheetHistoryAwareStateWidget {

    init() {
        this.horizontalSlider = React.createRef();
        this.verticalSlider = React.createRef();
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
            const viewportRange = window[0]; // update the range of cells being shown in the viewport;

            Object.assign(
                newState,
                {
                    viewportRange: viewportRange,
                    spreadsheetMetadata: state.spreadsheetMetadata.set(SpreadsheetMetadata.VIEWPORT_CELL, viewportRange.begin())
                }
            );
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
     * If the history cell changes and formula token is missing give focus. Also handles refreshing viewport
     * if cell or range change.
     */
    historyTokensFromState(prevState) {
        const historyTokens = {};

        const state = this.state;
        let metadata = state.spreadsheetMetadata;
        const previousMetadata = prevState.spreadsheetMetadata;

        const viewportTable = this.viewportTable.current;

        let newState = {};

        if(viewportTable){
            const viewportRange = state.viewportRange;
            const prevViewportRange = prevState.viewportRange;

            // if viewport range changed update the scollbar values.
            if(prevViewportRange && viewportRange){
                const begin = viewportRange.begin();
                if(!begin.equals(prevViewportRange.begin())){
                    this.horizontalSlider.current.value = (begin.column().value());
                    this.verticalSlider.current.value = (SpreadsheetViewportWidget.toVerticalSliderValue(begin.column().value()));
                }
            }

            const width = viewportTable.offsetWidth;
            const height = viewportTable.offsetHeight;

            const cellOrLabelOld = prevState.cellOrLabel;
            const cellOrLabelNew = state.cellOrLabel;

            const cellNew = state.cell;
            const cellOld = prevState.cell;

            for(;;) {
                const viewportCell = metadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);
                if(viewportCell) {
                    // some metadata properties changed that will mean formatting of values changed so reload
                    if(metadata.shouldUpdateViewport(previousMetadata)) {
                        console.log("Metadata change need to reformat viewport cells", metadata);

                        this.viewportLoadCells(
                            new SpreadsheetViewport(
                                viewportCell,
                                0,
                                0,
                                width,
                                height
                            )
                        );
                        break;
                    }

                    // if viewport width or height increased reload viewport cells
                    const prevDimensions = prevState.dimensions;
                    if(width > prevDimensions.width || height > prevDimensions.height){
                        console.log("Viewport width/height increased need to reload viewport cells");

                        this.viewportLoadCells(
                            new SpreadsheetViewport(
                                viewportCell,
                                0,
                                0,
                                width,
                                height
                            )
                        );
                        break;
                    }

                    if(viewportRange && cellNew && !cellNew.equals(cellOld) && !viewportRange.test(cellNew)){
                        console.log("New cell " + cellNew + " outside" + viewportRange + " scroll to");

                        this.viewportLoadCells(
                            new SpreadsheetViewport(
                                cellNew,
                                0,
                                0,
                                width,
                                height
                            )
                        );
                    }
                }
                break;
            }

            if(!Equality.safeEquals(cellOrLabelOld, cellOrLabelNew)){
                if(cellOrLabelNew instanceof SpreadsheetLabelName){
                    this.resolveLabelToCell(cellOrLabelNew); // eventually updates state.cell
                }else {
                    newState = {
                        cell: cellOrLabelNew,
                    };
                    metadata = metadata.setOrRemove(SpreadsheetMetadata.SELECTION, cellOrLabelNew);
                }
            }

            historyTokens[SpreadsheetHistoryHash.CELL] = cellOrLabelNew;
            if(state.focused){
                historyTokens[SpreadsheetHistoryHash.CELL_FORMULA] = null;
            }

            if(!Equality.safeEquals(cellNew, cellOld)){
                if(!state.formula){
                    console.log("Missing " + SpreadsheetHistoryHash.CELL_FORMULA + " token giving focus to cell..." + cellNew);
                    this.giveSelectionFocus(cellNew);
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
            spreadsheetMetadata: this.state.spreadsheetMetadata.set(SpreadsheetMetadata.SELECTION, cell),
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

    giveSelectionFocus(selection) {
        if(selection && selection.viewportId){
            const cellElement = document.getElementById(selection.viewportId());
            if(cellElement){
                cellElement.focus();
            }
        }
    }

    /**
     * Renders a TABLE CONTAINER which contains the header and cells to fill the table body.
     */
    render() {
        const {dimensions, spreadsheetMetadata} = this.state;
        const home = spreadsheetMetadata && spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);

        return (dimensions && home && this.renderTable(dimensions, home)) ||
            this.emptyTable();
    }

    renderTable(dimensions, home) {
        const column = home.column().value();
        const row = home.row().value();

        return <TableContainer key="viewport-TableContainer"
                               ref={this.viewportTable}
                               component={Paper}
                               style={{
                                   width: dimensions.width,
                                   height: dimensions.height,
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
            <Slider ref={this.horizontalSlider}
                    id="viewport-horizontal-Slider"
                    orientation="horizontal"
                    aria-labelledby="horizontal-slider"
                    track={false}
                    valueLabelDisplay="off"
                    min={0}
                    max={SpreadsheetColumnReference.MAX -1}
                    step={SpreadsheetViewportWidget.SLIDER_STEP}
                    defaultValue={0}
                    style={{
                        position: "absolute",
                        left: "40px",
                        bottom: "10px",
                        width: dimensions.width - 75,
                    }}
                    value={column}
                    onChange={_.debounce((e, newColumn) => {this.onHorizontalSliderChange(newColumn)}, SCROLL_DEBOUNCE)}
            />
            <Slider ref={this.verticalSlider}
                    id="viewport-vertical-Slider"
                    orientation="vertical"
                    aria-labelledby="vertical-slider"
                    track={false}
                    valueLabelDisplay="off"
                    min={0}
                    max={SpreadsheetRowReference.MAX -1}
                    step={SpreadsheetViewportWidget.SLIDER_STEP}
                    defaultValue={SpreadsheetViewportWidget.toVerticalSliderValue(0)}
                    style={{
                        position: "absolute",
                        bottom: "25px",
                        right: "10px",
                        height: dimensions.height - 60,
                    }}
                    value={SpreadsheetViewportWidget.toVerticalSliderValue(row)}
                    onChange={_.debounce((e, newColumn) => {this.onVerticalSliderChange(newColumn)}, SCROLL_DEBOUNCE)}
            />
        </TableContainer>;
    }

    static SLIDER_STEP = 1;

    /**
     * Normally the vertical slider has the max at the top and min at the bottom, however we wish to have the opposite, lower number rows at the top.
     */
    static toVerticalSliderValue(value) {
        return SpreadsheetRowReference.MAX -1 - value;
    }

    onHorizontalSliderChange(newColumn) {
        this.onHorizontalVerticalSliderChange(new SpreadsheetColumnReference(newColumn, SpreadsheetReferenceKind.RELATIVE), null);
    }

    onVerticalSliderChange(newRow) {
        this.onHorizontalVerticalSliderChange(null, new SpreadsheetRowReference(1048576 - 1 - newRow, SpreadsheetReferenceKind.RELATIVE));
    }

    onHorizontalVerticalSliderChange(newColumn, newRow) {
        const state = this.state;

        const viewportRange = this.state.viewportRange;
        if(viewportRange) {
            const begin = viewportRange.begin();

            let topLeft = begin;
            if(null != newColumn){
                topLeft = topLeft.setColumn(newColumn);
            }
            if(null != newRow){
                topLeft = topLeft.setRow(newRow);
            }

            // updating will force a reload of viewport
            if(!begin.equals(topLeft)){
                console.log("onHorizontalVerticalSliderChange " + viewportRange + " TO " + new SpreadsheetRange(topLeft, topLeft));

                const viewportTable = this.viewportTable.current;

                const width = viewportTable.offsetWidth;
                const height = viewportTable.offsetHeight;

                this.viewportLoadCells(
                    new SpreadsheetViewport(
                        topLeft,
                        0,
                        0,
                        width,
                        height
                    )
                );
                this.setState({
                    spreadsheetMetadata: state.spreadsheetMetadata.set(SpreadsheetMetadata.VIEWPORT_CELL, topLeft),
                });
            }
        }
    }

    /**
     * Returns an array of TableCell, one for each column header.
     */
    headers() {
        const {columnWidths, dimensions, spreadsheetMetadata} = this.state;

        const home = spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);
        const selection = spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.SELECTION);
        const defaultStyle = spreadsheetMetadata.effectiveStyle();

        const viewportWidth = dimensions.width;
        const defaultColumnWidth = defaultStyle.width().value();

        let headers = [
            <TableCell key={"viewport-all"} id={"viewport-select-all-cells"}></TableCell> // TODO add select all support when range support is ready
        ];

        let x = 0;
        let column = home.column();

        while(x < viewportWidth) {
            headers.push(
                column.renderViewport(selection && selection.testColumn(column))
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
        const selection = spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.SELECTION);
        const defaultStyle = spreadsheetMetadata.effectiveStyle();

        const defaultColumnWidth = defaultStyle.width().value();
        const defaultRowHeight = defaultStyle.height().value();

        const viewportWidth = dimensions.width;
        const viewportHeight = dimensions.height;

        const tableRows = [];

        let y = 0;
        let row = home.row();

        while(y < viewportHeight) {

            const tableCells = [];
            let x = 0;
            let column = home.column();

            tableCells.push(row.renderViewport(selection && selection.testRow(row)));

            // reference, formula, style, format, formatted
            while(x < viewportWidth) {
                const cellReference = new SpreadsheetCellReference(column, row);
                const cell = cells.get(cellReference) || cellReference.emptyCell();

                const selected = selection && selection.test(cellReference);

                tableCells.push(
                    cell.renderViewport(
                        defaultStyle,
                        () => this.onCellClick(cellReference),
                        selected ? (e) => this.onCellKeyDown(e, cellReference) : undefined,
                        cellToLabels.get(cellReference) || [],
                    )
                );

                x = x + (columnWidths.get(row) || defaultColumnWidth);
                column = column.add(1);
            }

            const id = row.viewportId();
            tableRows.push(
                <TableRow key={id} id={id}>
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
            spreadsheetMetadata: this.state.spreadsheetMetadata.set(SpreadsheetMetadata.SELECTION, cellReference),
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
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    messenger: PropTypes.instanceOf(SpreadsheetMessenger),
    spreadsheetDeltaCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    spreadsheetLabelCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    spreadsheetMetadataCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    showError: PropTypes.func.isRequired,
}
