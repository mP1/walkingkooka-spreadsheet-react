import _ from "lodash";
import Equality from "../Equality.js";
import ImmutableMap from "../util/ImmutableMap.js";
import Paper from '@material-ui/core/Paper';
import Preconditions from "../Preconditions.js";
import PropTypes from "prop-types";
import React from 'react';
import Slider from "@material-ui/core/Slider";
import SpreadsheetCellColumnOrRowParse from "./reference/SpreadsheetCellColumnOrRowParse.js";
import SpreadsheetCellRange from "./reference/SpreadsheetCellRange.js";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "./reference/SpreadsheetColumnReference.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetMessenger from "./message/SpreadsheetMessenger.js";
import SpreadsheetMessengerCrud from "./message/SpreadsheetMessengerCrud.js";
import SpreadsheetMetadata from "./meta/SpreadsheetMetadata.js";
import SpreadsheetReferenceKind from "./reference/SpreadsheetReferenceKind.js";
import SpreadsheetRowReference from "./reference/SpreadsheetRowReference.js";
import SpreadsheetSelection from "./reference/SpreadsheetSelection.js";
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
 * <li>Immutable cellToLabels: cell to Label lookup</li>
 * <li>ImmutableMap columnWidths: A cache of the column widths within the visible viewport</li>
 * <li>ImmutableMap rowHeights: A cache of the row heights within the visible viewport</li>
 * <li>object dimensions: Holds the width and height of the viewport in pixels</li>
 * <li>SpreadsheetSelection selection: The current selection which may include unresolved labels</li>
 * <li>SpreadsheetMetadata spreadsheetMetadata: holds the viewport home cell & default style</li>
 * <li>SpreadsheetCellRange viewportRange: holds a range of all the cells within the viewport</li>
 * <li>Immutable cellToLabels: cell to Label lookup</li>
 * <li>boolean giveFocus: if cells changed give focus to the selected cell. This helps giving focus after a delta load.</li>
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

    onSpreadsheetDelta(method, id, queryParameters, requestDelta, responseDelta) {
        const state = this.state;

        const newState = { // lgtm [js/react/inconsistent-state-update]
            cells: state.cells.setAll(responseDelta.referenceToCellMap()),
            columnWidths: state.columnWidths.setAll(responseDelta.columnWidths()),
            rowHeights: state.rowHeights.setAll(responseDelta.rowHeights()),
            cellToLabels: state.cellToLabels.setAll(responseDelta.cellToLabels()),
        };

        switch(method) {
            case "GET":
                const window = responseDelta.window();
                if(window.length > 0){
                    const viewportTable = this.viewportTable.current;
                    if(viewportTable){
                        const width = viewportTable.offsetWidth;
                        const height = viewportTable.offsetHeight;

                        const metadata = state.spreadsheetMetadata;
                        const selection = state.selection;
                        const viewportCell = metadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);

                        const viewport = new SpreadsheetViewport(
                            viewportCell,
                            0,
                            0,
                            width,
                            height
                        );

                        if(Equality.safeEquals(queryParameters, viewport.toQueryStringParameters(selection))){
                            const viewportRange = window[0];
                            
                            Object.assign(
                                newState,
                                {
                                    viewportRange: viewportRange,
                                    spreadsheetMetadata: metadata.set(SpreadsheetMetadata.VIEWPORT_CELL, viewportRange.begin())
                                }
                            );
                        }
                    }
                }
                break;
            default:
                break;
        }

        this.setState(newState);
    }

    /**
     * If a label was saved o deleted refresh the viewport.
     */
    onSpreadsheetLabel(method, id, queryParameters, requestLabel, responseLabel) {
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
                        ),
                        this.state.selection
                    );
                }
                break;
            default:
                break;
        }
    }

    onSpreadsheetMetadata(method, id, queryParameters, requestMetadata, responseMetadata) {
        this.setState({
            spreadsheetMetadata: responseMetadata,
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
            selection: tokens[SpreadsheetHistoryHash.SELECTION],
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

            // if viewport range changed update the scrollbar values.
            if(prevViewportRange && viewportRange){
                const begin = viewportRange.begin();
                if(!begin.equals(prevViewportRange.begin())){
                    this.horizontalSlider.current.value = (begin.column().value());
                    this.verticalSlider.current.value = (SpreadsheetViewportWidget.toVerticalSliderValue(begin.column().value()));
                }
            }

            const width = viewportTable.offsetWidth;
            const height = viewportTable.offsetHeight;

            const selectionOld = prevState.selection;
            const selectionNew = state.selection;

            let viewportLoadCells = false;
            const viewportCell = metadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);

            do {
                if(viewportCell){
                    if(!Equality.safeEquals(selectionNew, selectionOld)){
                        console.log("New selection " + selectionOld + " to " + selectionNew);

                        viewportLoadCells = true;
                        break;
                    }

                    // if viewport width or height increased reload viewport cells
                    const prevDimensions = prevState.dimensions;
                    if(width > prevDimensions.width || height > prevDimensions.height){
                        console.log("Viewport width/height increased need to reload viewport cells");

                        viewportLoadCells = true;
                        break;
                    }

                    // some metadata properties changed that will mean formatting of values changed so reload
                    if(metadata.shouldUpdateViewport(previousMetadata)){
                        console.log("Metadata change need to format all viewport cells", metadata);
                        viewportLoadCells = true;
                        break;
                    }
                }
            } while(false);

            if(viewportLoadCells){
                this.viewportLoadCells(
                    new SpreadsheetViewport(
                        viewportCell,
                        0,
                        0,
                        width,
                        height
                    ),
                    selectionNew
                );
            }

            historyTokens[SpreadsheetHistoryHash.SELECTION] = selectionNew;
            if(state.focused){
                historyTokens[SpreadsheetHistoryHash.CELL_FORMULA] = null;
            }

            if(!Equality.safeEquals(selectionNew, selectionOld)){
                if(!state.formula){
                    console.log("Missing " + SpreadsheetHistoryHash.CELL_FORMULA + " token giving focus to " + selectionNew);
                    this.giveSelectionFocus(selectionNew);
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
                this.props.showError
            );
        }

        return historyTokens;
    }

    viewportLoadCells(viewport, selection) {
        const props = this.props;

        props.spreadsheetDeltaCrud.get(
            "*",
            viewport.toQueryStringParameters(selection),
            props.showError
        );

        if(!this.state.formula & selection instanceof SpreadsheetCellReference){
            console.log("Missing " + SpreadsheetHistoryHash.CELL_FORMULA + " token giving focus to cell..." + selection);
            this.giveSelectionFocus(selection);
        }
    }

    giveSelectionFocus(selection) {
        if(selection && selection.viewportId){
            const element = document.getElementById(selection.viewportId());
            if(element){
                element.focus();
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
            this.renderViewportEmptyTable();
    }

    renderTable(dimensions, home) {
        const column = home.column().value();
        const row = home.row().value();

        return <TableContainer key="viewport-TableContainer"
                               ref={this.viewportTable}
                               component={Paper}
                               onClick={this.onClick.bind(this)}
                               onKeyDown={this.onKeyDown.bind(this)}
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
                            this.renderViewportTableColumnHeaders()
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        this.renderViewportTableContent()
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

    onClick(e) {
        e.preventDefault();

        let target = e.target;
        while(target) {
            const selection = target.dataset && target.dataset.selection;
            if(selection){
                SpreadsheetCellColumnOrRowParse(selection)
                    .onViewportClick(
                        (s) => this.saveSelection(s),
                        this.giveFormulaTextBoxFocus.bind(this),
                    );
                break;
            }
            target = target.parentNode;
        }
    }

    onKeyDown(e) {
        e.preventDefault();

        let target = e.target;
        while(target) {
            const selection = target.dataset && target.dataset.selection;
            if(selection){
                SpreadsheetCellColumnOrRowParse(selection)
                    .onViewportKeyDown(
                        e.key,
                        (s) => this.saveSelection(s),
                        this.giveFormulaTextBoxFocus.bind(this),
                        this.state.viewportRange.begin()
                    );
                break;
            }
            target = target.parentNode;
        }
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

        const viewportRange = state.viewportRange;
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
                console.log("onHorizontalVerticalSliderChange " + viewportRange + " TO " + new SpreadsheetCellRange(topLeft, topLeft));

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
                    ),
                    null // ignore selection, unnecessary to keep it within view etc.
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
    renderViewportTableColumnHeaders() {
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
    renderViewportTableContent() {
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

                tableCells.push(
                    cell.renderViewport(
                        defaultStyle,
                        cellToLabels.get(cellReference) || [],
                    )
                );

                x = x + (columnWidths.get(row) || defaultColumnWidth);
                column = column.add(1);
            }

            tableRows.push(
                <TableRow key={"row-" + row}>
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
    renderViewportEmptyTable() {
        return <TableContainer/>;
    }

    /**
     * Saves the new selection which may be made by using arrow keys to move around the viewport or a mouse click on
     * a cell etc.
     */
    saveSelection(selection) {
        Preconditions.optionalInstance(selection, SpreadsheetSelection, "selection");

        this.setState({
            selection: selection,
            focused: false,
            spreadsheetMetadata: this.state.spreadsheetMetadata.setOrRemove(SpreadsheetMetadata.SELECTION, selection),
        });
    }

    giveFormulaTextBoxFocus() {
        const tokens = {}
        tokens[SpreadsheetHistoryHash.CELL_FORMULA] = true;

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
