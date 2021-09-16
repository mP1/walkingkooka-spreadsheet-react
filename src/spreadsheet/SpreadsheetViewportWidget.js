import _ from "lodash";
import Equality from "../Equality.js";
import ImmutableMap from "../util/ImmutableMap.js";
import Menu from "@material-ui/core/Menu";
import Paper from '@material-ui/core/Paper';
import Preconditions from "../Preconditions.js";
import PropTypes from "prop-types";
import React from 'react';
import Slider from "@material-ui/core/Slider";
import SpreadsheetCellColumnOrRowParse from "./reference/SpreadsheetCellColumnOrRowParse.js";
import SpreadsheetCellRange from "./reference/SpreadsheetCellRange.js";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "./reference/SpreadsheetColumnReference.js";
import SpreadsheetFormulaLoadAndEditHistoryHashToken from "./history/SpreadsheetFormulaLoadAndEditHistoryHashToken.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashToken from "./history/SpreadsheetHistoryHashToken.js";
import SpreadsheetLabelName from "./reference/SpreadsheetLabelName.js";
import SpreadsheetMessenger from "./message/SpreadsheetMessenger.js";
import SpreadsheetMessengerCrud from "./message/SpreadsheetMessengerCrud.js";
import SpreadsheetMetadata from "./meta/SpreadsheetMetadata.js";
import SpreadsheetReferenceKind from "./reference/SpreadsheetReferenceKind.js";
import SpreadsheetRowReference from "./reference/SpreadsheetRowReference.js";
import SpreadsheetSelection from "./reference/SpreadsheetSelection.js";
import SpreadsheetViewport from "./SpreadsheetViewport.js";
import SpreadsheetViewportSelectionAnchor from "./reference/SpreadsheetViewportSelectionAnchor.js";
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
 * <li>ImmutableMap cellToLabels: cell to Label lookup</li>
 * <li>ImmutableMap labelsToReference: Used to map a label to reference</li>
 * <li>ImmutableMap columnWidths: A cache of the column widths within the visible viewport</li>
 * <li>ImmutableMap rowHeights: A cache of the row heights within the visible viewport</li>
 * <li>object dimensions: Holds the width and height of the viewport in pixels</li>
 * <li>SpreadsheetMetadata spreadsheetMetadata: holds the viewport home cell & default style</li>
 * <li>SpreadsheetCellRange viewportRange: holds a range of all the cells within the viewport</li>
 * <li>boolean giveFocus: if cells changed give focus to the selected cell. This helps giving focus after a delta load.</li>
 * <li>boolean focused: When true the viewport has focus, and cleared when the blur event happens.</li>
 * <li>SpreadsheetSelection selection: The currently active selection including ranges</li>
 * <li>SpreadsheetViewportSelectionAnchor anchor: When a range is the current selection this will hold the anchor.</li>
 * <li>contextMenu object an object with two properties anchorPosition and menuList both which are given to the Menu to present itself.</li>
 * </ul>
 */
export default class SpreadsheetViewportWidget extends SpreadsheetHistoryAwareStateWidget {

    static VIEWPORT_ID = "viewport";

    static VIEWPORT_HORIZONTAL_SLIDER_ID = SpreadsheetViewportWidget.VIEWPORT_ID + "-horizontal-Slider";

    static VIEWPORT_VERTICAL_SLIDER_ID = SpreadsheetViewportWidget.VIEWPORT_ID + "-vertical-Slider";

    static VIEWPORT_SELECT_ALL_ID = SpreadsheetViewportWidget.VIEWPORT_ID + "-select-all-cells";

    init() {
        this.horizontalSlider = React.createRef();
        this.verticalSlider = React.createRef();
        this.viewportTable = React.createRef();
    }

    componentDidMount() {
        super.componentDidMount();

        const props = this.props;
        this.onSpreadsheetDeltaRemover = props.spreadsheetDeltaCellCrud.addListener(this.onSpreadsheetDelta.bind(this));
        this.onSpreadsheetLabelCrudRemover = props.spreadsheetLabelCrud.addListener(this.onSpreadsheetLabel.bind(this));
        this.onSpreadsheetMetadataRemover = props.spreadsheetMetadataCrud.addListener(this.onSpreadsheetMetadata.bind(this));
    }

    /**
     * Includes logic to clear any present cells etc that are within any present window in the response SpreadsheetDelta
     * before updating the cells, cell to labels, labels etc.
     */
    onSpreadsheetDelta(method, id, url, requestDelta, responseDelta) {
        const state = this.state;

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

            const window = responseDelta.window();

            var {cells, cellToLabels, labelToReference} = state;

            // first remove any deleted cells.
            responseDelta.deletedCells()
                .forEach(r => {
                    cells = cells.remove(r)
                });

            // if a window was present on the response delta, clear any OLD cells etc.
            if(window){
                var tempCells = new Map();
                var tempCellToLabels = new Map();

                // only copy cells that are not within the window.
                for(var cell in cells.toMap().values()) {
                    if(!window.testCell(cell)){
                        const reference = cell.reference();
                        tempCells.set(reference.toString(), cell);

                        var label = cellToLabels.get(reference);
                        if(label){
                            tempCellToLabels.set(reference.toString(), label);
                        }
                    }
                }

                cells = new ImmutableMap(tempCells);
                cellToLabels = new ImmutableMap(tempCellToLabels);

                // only copy labels that are not within the window.
                var tempLabelToReference = new Map();
                for(const [label, reference] of labelToReference.toMap().entries()) {
                    if(!window.testCell(reference)){
                        tempLabelToReference.set(reference.toString(), label);
                    }
                }

                labelToReference = new ImmutableMap(tempLabelToReference);
            }

            const newState = { // lgtm [js/react/inconsistent-state-update]
                cells: cells.setAll(responseDelta.referenceToCellMap()),
                cellToLabels: cellToLabels.setAll(responseDelta.cellToLabels()),
                labelToReference: labelToReference.setAll(responseDelta.labelToReference()),
                columnWidths: state.columnWidths.setAll(responseDelta.columnWidths()),
                rowHeights: state.rowHeights.setAll(responseDelta.rowHeights()),
            };

            if(window && Equality.safeEquals(url.queryParameters(), viewport.toLoadCellsQueryStringParameters(selection))){
                Object.assign(
                    newState,
                    {
                        viewportRange: window,
                        spreadsheetMetadata: metadata.set(SpreadsheetMetadata.VIEWPORT_CELL, window.begin())
                    }
                );
            }

            switch(method) {
                case "DELETE":
                    Object.assign(
                        newState,
                        {
                            selection: null,
                            selectionAction: null,
                        }
                    );
                    break;
                default:
                    break;
            }

            this.setState(newState);
        }
    }

    /**
     * If a label was saved o deleted refresh the viewport.
     */
    onSpreadsheetLabel(method, id, url, requestLabel, responseLabel) {
        switch(method) {
            case "DELETE":
            case "POST":
                const viewportTable = this.viewportTable.current;
                if(viewportTable){
                    const {selection, anchor, spreadsheetMetadata} = this.state;

                    this.loadCells(
                        new SpreadsheetViewport(
                            spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL),
                            0,
                            0,
                            viewportTable.offsetWidth,
                            viewportTable.offsetHeight,
                        ),
                        selection,
                        anchor
                    );
                }
                break;
            default:
                break;
        }
    }

    onSpreadsheetMetadata(method, id, url, requestMetadata, responseMetadata) {
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
            labelToReference: ImmutableMap.EMPTY,
            contextMenu: {},
        };
    }

    stateFromHistoryTokens(tokens) {
        return {
            selection: tokens[SpreadsheetHistoryHash.SELECTION],
            selectionAnchor: tokens[SpreadsheetHistoryHash.SELECTION_ANCHOR],
            selectionAction: tokens[SpreadsheetHistoryHash.SELECTION_ACTION],
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

        const props = this.props;

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
            const selectionAnchor = state.selectionAnchor;

            const selectionActionOld = prevState.selectionAction;
            const selectionActionNew = state.selectionAction;

            let viewportLoadCells = false;
            const viewportCell = metadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);

            if(viewportCell){
                do {
                    if(!Equality.safeEquals(selectionActionNew, selectionActionOld)){
                        // new action perform
                        if(selectionActionNew){
                            selectionActionNew.onViewportSelectionAction(selectionNew, this); // perform delete/insert etc.
                            break;
                        }
                    }
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
                } while(false);

                if(viewportLoadCells){
                    this.loadCells(
                        new SpreadsheetViewport(
                            viewportCell,
                            0,
                            0,
                            width,
                            height
                        ),
                        selectionNew,
                        selectionAnchor
                    );
                }
            }

            historyTokens[SpreadsheetHistoryHash.SELECTION] = selectionNew;
            historyTokens[SpreadsheetHistoryHash.SELECTION_ACTION] = selectionActionNew;
            
            if(!Equality.safeEquals(selectionNew, selectionOld)){
                if(!state.formula){
                    this.giveSelectionFocus(selectionNew, selectionAnchor);
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
            props.spreadsheetMetadataCrud.post(
                metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID),
                metadata,
                props.showError
            );
        }

        return historyTokens;
    }

    /**
     * Remove the selection, the deleted column, row etc and then perform the delete API.
     */
    deleteSelection(selection) {
        this.props.deleteSelection(
            selection,
            this.state.viewportRange
        );
    }

    /**
     * Performs the insertAfter operation, leaving the selection unchanged.
     */
    insertAfterSelection(selection, count) {
        this.props.insertAfterSelection(selection, count);
    }

    loadCells(viewport, selection, anchor) {
        const props = this.props;

        props.spreadsheetDeltaCellCrud.get(
            "*",
            viewport.toLoadCellsQueryStringParameters(selection),
            props.showError
        );

        if(!this.state.formula){
            this.giveSelectionFocus(selection, anchor);
        }
    }

    /**
     * Attempts to give focus to the selection including resolving of labels to cells, using the anchor to find
     * actual cell or column or row within a range etc.
     */
    giveSelectionFocus(selection, anchor) {
        if(selection){
            const cellColumnOrRow = selection.viewportFocus(
                this.state.labelToReference,
                anchor
            );

            if(cellColumnOrRow){
                const element = document.getElementById(cellColumnOrRow.viewportId());
                if(element){
                    console.log("Missing " + SpreadsheetHistoryHash.SELECTION_ACTION + " token giving focus to ..." + cellColumnOrRow);
                    element.focus();
                }
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
            this.renderTableEmpty();
    }

    renderTable(dimensions, home) {
        const column = home.column().value();
        const row = home.row().value();

        const state = this.state;
        const selection = state.selection;

        // need to resolve the selection to an actual cell or range so these may be highlighted
        let selectionNotLabel = selection instanceof SpreadsheetLabelName ?
            state.labelToReference.get(selection) :
            selection;

        const contextMenu = state.contextMenu;
        const {anchorPosition, menuItems} = contextMenu;
        const contextMenuOpen = !!menuItems;

        return [
            <TableContainer key="viewport-TableContainer"
                            ref={this.viewportTable}
                            component={Paper}
                            onFocus={this.onFocus.bind(this)}
                            onBlur={this.onBlur.bind(this)}
                            onClick={this.onClick.bind(this)}
                            onContextMenu={this.onContextMenu.bind(this)}
                            onKeyDown={this.onKeyDown.bind(this)}
                            style={{
                                width: dimensions.width,
                                height: dimensions.height,
                                overflow: "hidden",
                                borderRadius: 0, // cancel paper rounding.
                                cursor: contextMenuOpen && "context-menu",
                            }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                this.renderTableColumnHeaders(selectionNotLabel)
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.renderTableContent(selectionNotLabel)
                        }
                    </TableBody>
                </Table>
                <Slider ref={this.horizontalSlider}
                        id={SpreadsheetViewportWidget.VIEWPORT_HORIZONTAL_SLIDER_ID}
                        orientation="horizontal"
                        aria-labelledby="horizontal-slider"
                        track={false}
                        valueLabelDisplay="off"
                        min={0}
                        max={SpreadsheetColumnReference.MAX - 1}
                        step={SpreadsheetViewportWidget.SLIDER_STEP}
                        defaultValue={0}
                        style={{
                            position: "absolute",
                            left: "40px",
                            bottom: "10px",
                            width: dimensions.width - 75,
                        }}
                        value={column}
                        onChange={_.debounce((e, newColumn) => {
                            this.onHorizontalSliderChange(newColumn)
                        }, SCROLL_DEBOUNCE)}
                />
                <Slider ref={this.verticalSlider}
                        id={SpreadsheetViewportWidget.VIEWPORT_VERTICAL_SLIDER_ID}
                        orientation="vertical"
                        aria-labelledby="vertical-slider"
                        track={false}
                        valueLabelDisplay="off"
                        min={0}
                        max={SpreadsheetRowReference.MAX - 1}
                        step={SpreadsheetViewportWidget.SLIDER_STEP}
                        defaultValue={SpreadsheetViewportWidget.toVerticalSliderValue(0)}
                        style={{
                            position: "absolute",
                            bottom: "25px",
                            right: "10px",
                            height: dimensions.height - 60,
                        }}
                        value={SpreadsheetViewportWidget.toVerticalSliderValue(row)}
                        onChange={_.debounce((e, newColumn) => {
                            this.onVerticalSliderChange(newColumn)
                        }, SCROLL_DEBOUNCE)}
                />
            </TableContainer>,
            <Menu
                keepMounted
                open={contextMenuOpen}
                onClose={() => this.setState({
                    contextMenu: {},
                })}
                anchorReference="anchorPosition"
                anchorPosition={anchorPosition || { left: 0, top: 0}}
            >
                {menuItems}
            </Menu>
        ];
    }

    onFocus(e) {
        this.setState({
            focused: true,
        });
    }

    onBlur(e) {
        this.setState({
            focused: false,
        });
    }

    /**
     * Clicking on any selection component within a viewport updates the history hash and clears the selection action.
     */
    onClick(e) {
        const selection = this.findEventTargetSelection(e.target);
        if(selection){
            const tokens = {};
            tokens[SpreadsheetHistoryHash.SELECTION] = selection;
            tokens[SpreadsheetHistoryHash.SELECTION_ANCHOR] = null;
            tokens[SpreadsheetHistoryHash.SELECTION_ACTION] = null;
            
            this.historyParseMergeAndPush(tokens);
        }
    }

    /**
     * This method is invoked whenever any element within the viewport is right mouse clicked. When this
     * happens the {@link SpreadsheetSelection} is asked to prepare the menu items and they are shown.
     */
    onContextMenu(e) {
        e.preventDefault();

        let contextMenuState = {};

        const selection = this.findEventTargetSelection(e.target);
        if(selection){
            contextMenuState = {
                anchorPosition: {
                    left: e.clientX - 2,
                    top: e.clientY - 4,
                },
                menuItems: selection.buildContextMenuItems(
                    SpreadsheetHistoryHash.spreadsheetIdAndName(this.props.history.hash())
                ),
            }
        }

        this.setState({
            contextMenu: contextMenuState,
        });
    }

    onKeyDown(e) {
        e.preventDefault();

        const selection = this.findEventTargetSelection(e.target);
        if(selection){
            const state = this.state;

            selection.onViewportKeyDown(
                e.key, // key
                e.shiftKey, // selectRange
                state.selection, // current selection may be null
                state.selectionAnchor, // anchor
                state.spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL), // viewportHome
                (s) => this.saveSelection(s && s.selection(), s && s.anchor(), null), // setSelection
                () => this.saveSelection(selection, null, new SpreadsheetFormulaLoadAndEditHistoryHashToken()),
            );
        }
    }

    /**
     * Accepts an event target and attempts to locate the {@link SpreadsheetSelection}
     */
    findEventTargetSelection(target) {
        let targetSelection;

        while(target) {
            const selection = target.dataset && target.dataset.selection;
            if(selection){
                targetSelection = SpreadsheetCellColumnOrRowParse(selection);
                break;
            }
            target = target.parentNode;
        }

        return targetSelection;
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

                this.loadCells(
                    new SpreadsheetViewport(
                        topLeft,
                        0,
                        0,
                        width,
                        height
                    ),
                    null, // ignore selection, unnecessary to keep it within view etc.
                    null // no anchor
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
    renderTableColumnHeaders(selection) {
        const {columnWidths, dimensions, spreadsheetMetadata} = this.state;

        const home = spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);
        const defaultStyle = spreadsheetMetadata.effectiveStyle();

        const viewportWidth = dimensions.width;
        const defaultColumnWidth = defaultStyle.width().value();

        let headers = [
            <TableCell key={SpreadsheetViewportWidget.VIEWPORT_SELECT_ALL_ID} id={SpreadsheetViewportWidget.VIEWPORT_SELECT_ALL_ID}></TableCell> // TODO add select all support when range support is ready
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
    renderTableContent(selection) {
        const {cells, columnWidths, rowHeights, spreadsheetMetadata, dimensions, cellToLabels} = this.state;

        const home = spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);
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
    renderTableEmpty() {
        return <TableContainer/>;
    }

    /**
     * Saves the new selection which may be made by using arrow keys to move around the viewport or a mouse click on
     * a cell etc.
     */
    saveSelection(selection, anchor, action) {
        Preconditions.optionalInstance(selection, SpreadsheetSelection, "selection");
        Preconditions.optionalInstance(anchor, SpreadsheetViewportSelectionAnchor, "anchor");
        Preconditions.optionalInstance(action, SpreadsheetHistoryHashToken, "action");

        const tokens = {};

        tokens[SpreadsheetHistoryHash.SELECTION] = selection;
        tokens[SpreadsheetHistoryHash.SELECTION_ANCHOR] = anchor
        tokens[SpreadsheetHistoryHash.SELECTION_ACTION] = action;

        this.historyParseMergeAndPush(tokens);
    }
}

SpreadsheetViewportWidget.propTypes = {
    deleteSelection: PropTypes.func.isRequired,
    dimensions: PropTypes.object,
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    insertAfterSelection: PropTypes.func.isRequired,
    messenger: PropTypes.instanceOf(SpreadsheetMessenger),
    spreadsheetDeltaCellCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    spreadsheetLabelCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    spreadsheetMetadataCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    showError: PropTypes.func.isRequired,
}
