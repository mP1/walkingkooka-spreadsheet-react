import _ from "lodash";
import Equality from "../Equality.js";
import HttpMethod from "../net/HttpMethod.js";
import ImmutableMap from "../util/ImmutableMap.js";
import Menu from "@mui/material/Menu";
import Paper from '@mui/material/Paper';
import Preconditions from "../Preconditions.js";
import PropTypes from "prop-types";
import React from 'react';
import Slider from "@mui/material/Slider";
import SpreadsheetCellColumnOrRowParse from "./reference/SpreadsheetCellColumnOrRowParse.js";
import SpreadsheetCellMenuHistoryHashToken from "./history/SpreadsheetCellMenuHistoryHashToken.js";
import SpreadsheetCellRange from "./reference/SpreadsheetCellRange.js";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetColumnOrRowInsertAfterHistoryHashToken
    from "./history/SpreadsheetColumnOrRowInsertAfterHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertBeforeHistoryHashToken
    from "./history/SpreadsheetColumnOrRowInsertBeforeHistoryHashToken.js";
import SpreadsheetColumnOrRowMenuHistoryHashToken from "./history/SpreadsheetColumnOrRowMenuHistoryHashToken.js";
import SpreadsheetColumnReference from "./reference/SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "./reference/SpreadsheetColumnReferenceRange.js";
import SpreadsheetDelta from "./engine/SpreadsheetDelta.js";
import SpreadsheetFormulaLoadAndEditHistoryHashToken from "./history/SpreadsheetFormulaLoadAndEditHistoryHashToken.js";
import SpreadsheetFormulaSelectionActionHistoryHashToken
    from "./history/SpreadsheetFormulaSelectionActionHistoryHashToken.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashToken from "./history/SpreadsheetHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelName from "./reference/SpreadsheetLabelName.js";
import SpreadsheetMessenger from "./message/SpreadsheetMessenger.js";
import SpreadsheetMessengerCrud from "./message/SpreadsheetMessengerCrud.js";
import SpreadsheetMetadata from "./meta/SpreadsheetMetadata.js";
import SpreadsheetReferenceKind from "./reference/SpreadsheetReferenceKind.js";
import SpreadsheetRowReference from "./reference/SpreadsheetRowReference.js";
import SpreadsheetRowReferenceRange from "./reference/SpreadsheetRowReferenceRange.js";
import SpreadsheetSelection from "./reference/SpreadsheetSelection.js";
import SpreadsheetViewport from "./SpreadsheetViewport.js";
import SpreadsheetViewportSelectionAnchor from "./reference/SpreadsheetViewportSelectionAnchor.js";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// default header cell styles

const ROW_WIDTH = 80; // approximately 10ex
const ROW_WIDTH_PX = ROW_WIDTH + "px";

const COLUMN_HEIGHT = 25;
const COLUMN_HEIGHT_PX = COLUMN_HEIGHT + "px";

const HEADER = {
    minWidth: "4ex",

    boxSizing: "border-box",

    margin: "0",
    borderColor: "#000",
    borderStyle: "solid",
    borderWidth: "1px",
    padding: "0",
    fontWeight: "normal",

    textAlign: "center",
    verticalAlign: "middle",

    backgroundColor: "#ccc", // TODO take colours from theme
    color: "#333",
};

const SELECTED = {
    backgroundColor: "#444", // TODO take colours from theme
    color: "#bbb",
};

const SELECT_ALL = Object.assign(
    {},
    HEADER,
    {
        width: ROW_WIDTH_PX,
        height: COLUMN_HEIGHT_PX,
    },
);

const COLUMN_HEADER = (width, selected) => {
    return Object.assign(
        {},
        HEADER,
        {
            width: width,
            height: COLUMN_HEIGHT_PX,
        },
        selected ? SELECTED: {},
    )
};

const ROW_HEADER = (height, selected) => {
    return Object.assign(
        {},
        HEADER,
        {
            width: ROW_WIDTH_PX,
            height: height,
        },
        selected ? SELECTED: {},
    )
};

const SCROLL_DEBOUNCE = 100;

const CONTEXT_MENU_X_OFFSET = 10;
const CONTEXT_MENU_Y_OFFSET = 10;

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
        this.onSpreadsheetDeltaCellRemover = props.spreadsheetDeltaCellCrud.addListener(this.onSpreadsheetDelta.bind(this));
        this.onSpreadsheetDeltaColumnRemover = props.spreadsheetDeltaColumnCrud.addListener(this.onSpreadsheetDelta.bind(this));
        this.onSpreadsheetDeltaRowRemover = props.spreadsheetDeltaRowCrud.addListener(this.onSpreadsheetDelta.bind(this));

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
            const width = viewportTable.offsetWidth - ROW_WIDTH;
            const height = viewportTable.offsetHeight - COLUMN_HEIGHT;

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

            var {cells, cellToLabels, labelToReferences} = state;

            // first remove any deleted cells.
            responseDelta.deletedCells()
                .forEach(r => {
                    cells = cells.remove(r)
                });

            // if a window was present on the response delta, clear any label mappings within the window space
            if(window){
                var tempCellToLabels = new Map();

                cellToLabels = new ImmutableMap(tempCellToLabels);

                // only copy labels that are not within the window.
                var tempLabelToReferences = new Map();
                for(const [label, reference] of labelToReferences.toMap().entries()) {
                    if(!window.testCell(reference)){
                        tempLabelToReferences.set(reference.toString(), label);
                    }
                }

                labelToReferences = new ImmutableMap(tempLabelToReferences);
            }

            const newState = { // lgtm [js/react/inconsistent-state-update]
                cells: cells.setAll(responseDelta.cellReferenceToCells()),
                cellToLabels: cellToLabels.setAll(responseDelta.cellToLabels()),
                labelToReferences: labelToReferences.setAll(responseDelta.labelToReferences()),
                columnWidths: state.columnWidths.setAll(responseDelta.columnWidths()),
                rowHeights: state.rowHeights.setAll(responseDelta.rowHeights()),
            };

            if(window && Equality.safeEquals(url.queryParameters(), viewport.apiLoadCellsQueryStringParameters(selection))){
                Object.assign(
                    newState,
                    {
                        viewportRange: window,
                        spreadsheetMetadata: metadata.set(SpreadsheetMetadata.VIEWPORT_CELL, window.begin())
                    }
                );
            }

            switch(method) {
                case HttpMethod.DELETE:
                    Object.assign(
                        newState,
                        {
                            selection: null,
                            selectionAction: null,
                        }
                    );
                    break;
                case HttpMethod.POST:
                    const historyTokens = this.props.history.tokens();
                    const selectionAction = historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION];
                    if(selectionAction instanceof SpreadsheetColumnOrRowInsertBeforeHistoryHashToken){
                        const urlPaths = url.path().split("/");
                        if(urlPaths.length === 7){
                            // 0 = ""
                            // 1 == api
                            // 2 == spreadsheet
                            // 3 == $spreadsheet-id
                            // 4 == column == Selection
                            // 5 == $selection
                            // 6 == before == insert-action.toUrl
                            if(urlPaths[3] === historyTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID].toString()){
                                const selection = historyTokens[SpreadsheetHistoryHashTokens.SELECTION];
                                if(selection && selection.apiInsertBeforePostUrl(urlPaths)){
                                    Object.assign(
                                        newState,
                                        {
                                            selection: selection.viewportInsertBeforePostSuccessSelection(selectionAction.count()),
                                            selectionAction: null,
                                        }
                                    );
                                }
                            }
                        }
                        break;
                    }
                    if(selectionAction instanceof SpreadsheetColumnOrRowInsertAfterHistoryHashToken){
                        const urlPaths = url.path().split("/");
                        if(urlPaths.length === 7){
                            // 0 = ""
                            // 1 == api
                            // 2 == spreadsheet
                            // 3 == $spreadsheet-id
                            // 4 == column == Selection
                            // 5 == $selection
                            // 6 == before == insert-action.toUrl
                            if(urlPaths[3] === historyTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID].toString()){
                                const selection = historyTokens[SpreadsheetHistoryHashTokens.SELECTION];
                                if(selection && selection.isInsertAfterPostUrl(urlPaths)){
                                    Object.assign(
                                        newState,
                                        {
                                            selection: selection,
                                            selectionAction: null,
                                        }
                                    );
                                }
                            }
                        }
                        break;
                    }
                    break;
                default:
                    break;
            }

            this.setState(newState);
        }

        this.giveDeltaSelectionFocus(responseDelta);
    }

    /**
     * If a label was saved or deleted refresh the viewport.
     */
    onSpreadsheetLabel(method, id, url, requestLabel, responseLabel) {
        switch(method) {
            case HttpMethod.DELETE:
            case HttpMethod.POST:
                const viewportTable = this.viewportTable.current;
                if(viewportTable){
                    this.loadCells(
                        new SpreadsheetViewport(
                            this.state.spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL),
                            0,
                            0,
                            viewportTable.offsetWidth - ROW_WIDTH,
                            viewportTable.offsetHeight - COLUMN_HEIGHT,
                        ),
                        null,
                        null
                    );
                }
                break;
            default:
                break;
        }
    }

    onSpreadsheetMetadata(method, id, url, requestMetadata, responseMetadata) {
        const newState = {
            spreadsheetMetadata: responseMetadata,
        };

        const previousMetadata = this.state.spreadsheetMetadata;
        if(previousMetadata){
            const previousId = previousMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID);

            // if id changed clear caches...
            if(!Equality.safeEquals(previousId, responseMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID))){
                Object.assign(
                    newState,
                    {
                        cells: ImmutableMap.EMPTY,
                        columnWidths: ImmutableMap.EMPTY,
                        rowHeights: ImmutableMap.EMPTY,
                        cellToLabels: ImmutableMap.EMPTY,
                    });
            }
        }

        this.setState(newState);
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.onSpreadsheetDeltaCellRemover && this.onSpreadsheetDeltaCellRemover();
        delete this.onSpreadsheetDeltaCellRemover;

        this.onSpreadsheetDeltaColumnRemover && this.onSpreadsheetDeltaColumnRemover();
        delete this.onSpreadsheetDeltaColumnRemover;

        this.onSpreadsheetDeltaRowRemover && this.onSpreadsheetDeltaRowRemover();
        delete this.onSpreadsheetDeltaRowRemover;

        this.onSpreadsheetLabelCrudRemover && this.onSpreadsheetLabelCrudRemover();
        delete this.onSpreadsheetLabelCrudRemover;

        this.onSpreadsheetMetadataRemover && this.onSpreadsheetMetadataRemover();
        delete this.onSpreadsheetMetadataRemover;
    }

    initialStateFromProps(props) {
        const historyHashTokens = props.history.tokens();

        return {
            spreadsheetId: historyHashTokens[SpreadsheetHistoryHash.SPREADSHEET_ID],
            cells: ImmutableMap.EMPTY,
            columnWidths: ImmutableMap.EMPTY,
            rowHeights: ImmutableMap.EMPTY,
            dimensions: props.dimensions,
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY,
            cellToLabels: ImmutableMap.EMPTY,
            labelToReferences: ImmutableMap.EMPTY,
            contextMenu: {},
        };
    }

    stateFromHistoryTokens(tokens) {
        return {
            selection: tokens[SpreadsheetHistoryHashTokens.SELECTION],
            selectionAnchor: tokens[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR],
            selectionAction: tokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION],
            contextMenu: {}, // close context menu
        };
    }

    /**
     * If the history cell changes and formula token is missing give focus. Also handles refreshing viewport
     * if cell or range change.
     */
    historyTokensFromState(prevState) {
        const historyTokens = SpreadsheetHistoryHashTokens.emptyTokens();

        const state = this.state;
        const metadata = state.spreadsheetMetadata;
        const previousMetadata = prevState.spreadsheetMetadata;

        const props = this.props;

        const viewportTable = this.viewportTable.current;

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

            const selectionOld = prevState.selection;
            const selectionNew = state.selection;

            const viewportCell = metadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);

            if(viewportCell){
                const width = viewportTable.offsetWidth - ROW_WIDTH;
                const height = viewportTable.offsetHeight - COLUMN_HEIGHT;

                const selectionAnchor = state.selectionAnchor;

                const selectionActionOld = prevState.selectionAction;
                const selectionActionNew = state.selectionAction;

                let viewportLoadCells = false;
                var giveFocus = false;

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
                        giveFocus = true; // only give focus if selection changed
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
                    if(metadata.viewportShouldLoadCells(previousMetadata)){
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
                        giveFocus ? selectionNew : null,
                        giveFocus ? selectionAnchor : null
                    );

                    if(state.focused) {
                        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = selectionNew;
                        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = selectionActionNew;
                    }
                }

                if(!Equality.safeEquals(selectionNew, selectionOld)){
                    this.giveSelectionFocus(selectionNew, selectionAnchor);
                }
            }
        }

        if(metadata.viewportShouldSaveMetadata(previousMetadata)){
            props.spreadsheetMetadataCrud.post(
                metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID),
                metadata,
                props.showError
            );
        }

        return historyTokens;
    }

    /**
     * Remove the selection, the cleard column, row etc and then perform the clear API.
     */
    clearSelection(selection) {
        this.props.clearSelection(
            selection,
            this.state.viewportRange
        );

        this.removeHistoryHashSelectionAction();
    }
    
    /**
     * Remove the selection, the deleted column, row etc and then perform the delete API.
     */
    deleteSelection(selection) {
        this.props.deleteSelection(
            selection,
            this.state.viewportRange
        );

        this.removeHistoryHashSelectionAction();
    }

    /**
     * Performs the insertAfter operation, leaving the selection unchanged.
     */
    insertAfterSelection(selection, count) {
        this.props.insertAfterSelection(selection, count);
    }

    /**
     * Performs the insert-before operation, leaving the selection unchanged.
     */
    insertBeforeSelection(selection, count) {
        this.props.insertBeforeSelection(selection, count);
    }

    /**
     * Clears the selection action from the history hash. This is done after a clear and other similar actions.
     */
    removeHistoryHashSelectionAction() {
        const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
        tokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = null;
        this.historyParseMergeAndPush(tokens);
    }

    patchColumnOrRow(selection, property, value) {
        const props = this.props;

        const patched = selection.patch(property, value);
        const window = this.state.viewportRange;

        if(selection instanceof SpreadsheetColumnReference || selection instanceof SpreadsheetColumnReferenceRange){
            props.spreadsheetDeltaColumnCrud.patch(
                selection,
                new SpreadsheetDelta(
                    null,
                    [], // cells
                    Array.isArray(patched) ? patched : [patched], // columns
                    [], // labels
                    [], // rows
                    [], // deletedCells
                    [], // deletedColumns
                    [], // deletedRows
                    ImmutableMap.EMPTY, // columnWidths
                    ImmutableMap.EMPTY, // rowHeights
                    window // window
                ),
                props.showError,
            );
        }

        if(selection instanceof SpreadsheetRowReference || selection instanceof SpreadsheetRowReferenceRange){
            props.spreadsheetDeltaRowCrud.patch(
                selection,
                new SpreadsheetDelta(
                    null,
                    [], // cells
                    [], // columns
                    [], // labels
                    Array.isArray(patched) ? patched : [patched], // rows
                    [], // deletedCells
                    [], // deletedColumns
                    [], // deletedRows
                    ImmutableMap.EMPTY, // columnWidths
                    ImmutableMap.EMPTY, // rowHeights
                    window // window
                ),
                props.showError,
            );
        }
    }

    /**
     * Updates the state so the context menu will be shown.
     */
    showContextMenu(selection) {
        const element = document.getElementById(selection.viewportId());
        if(element) {
            const history = this.props.history;

            const {top, left} = element.getBoundingClientRect();

            const contextMenuState = {
                anchorPosition: {
                    left: left + CONTEXT_MENU_X_OFFSET,
                    top: top + CONTEXT_MENU_Y_OFFSET,
                },
                menuItems: selection.viewportContextMenuItems(
                    SpreadsheetHistoryHash.spreadsheetIdAndName(history.tokens()),
                    history
                ),
            };

            setTimeout(() => {
                this.setState({
                    contextMenu: contextMenuState,
                });
            }, 1);
        }
    }

    loadCells(viewport, selection, anchor) {
        const props = this.props;

        props.spreadsheetDeltaCellCrud.get(
            "*",
            viewport.apiLoadCellsQueryStringParameters(selection, anchor),
            props.showError
        );
    }

    giveDeltaSelectionFocus(delta) {
        var viewportSelection = delta.selection();

        if(viewportSelection){
            this.giveSelectionFocus(
                viewportSelection.selection(),
                viewportSelection.anchor()
            );
        }
    }

    /**
     * Attempts to give focus to the selection including resolving of labels to cells, using the anchor to find
     * actual cell or column or row within a range etc.
     */
    giveSelectionFocus(selection, anchor) {
        if(!(this.state.selectionAction instanceof SpreadsheetFormulaSelectionActionHistoryHashToken)){
            if(selection){
                const cellColumnOrRow = selection.viewportFocus(
                    this.state.labelToReferences,
                    anchor
                );

                if(cellColumnOrRow){
                    const element = document.getElementById(cellColumnOrRow.viewportId());
                    if(element){
                        console.log("Missing " + SpreadsheetHistoryHash.SELECTION_ACTION + " token giving focus to ..." + cellColumnOrRow);
                        this.giveFocus(element);
                    }
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

    static VIEWPORT_CONTEXT_MENU_ID = SpreadsheetViewportWidget.VIEWPORT_ID + "context-Menu";

    renderTable(dimensions, home) {
        const column = home.column().value();
        const row = home.row().value();

        const state = this.state;
        const selection = state.selection;

        // need to resolve the selection to an actual cell or range so these may be highlighted
        let selectionNotLabel = selection instanceof SpreadsheetLabelName ?
            state.labelToReferences.get(selection) :
            selection;

        const contextMenu = state.contextMenu;
        const {anchorPosition, menuItems} = contextMenu;
        const contextMenuOpen = !!menuItems;

        const history = this.props.history;

        const onBlur = (e) => {
            // only set focused to false if new focus is outside viewport table.
            if(!this.viewportTable.current.contains(e.relatedTarget)){
                this.setState({
                    focused: false,
                });
            }
        };

        const onClick = (e) => {
            const selection = this.findEventTargetSelection(e.target);
            if(selection){
                const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
                tokens[SpreadsheetHistoryHashTokens.SELECTION] = selection;
                tokens[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR] = null;
                tokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = null;

                this.historyParseMergeAndPush(tokens);
            }
        };

        const onCloseContextMenu = () => {
            const tokens = history.tokens();

            const action = tokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION];
            if(action instanceof SpreadsheetCellMenuHistoryHashToken || action instanceof SpreadsheetColumnOrRowMenuHistoryHashToken){
                tokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = null;
                this.historyParseMergeAndPush(tokens);
            }
        };

        const onContextMenu = (e) => {
            e.preventDefault();

            const clickedSelection = this.findEventTargetSelection(e.target);
            if(clickedSelection){
                const historyHashTokens = history.tokens();
                const historyHashTokenSelection = historyHashTokens[SpreadsheetHistoryHashTokens.SELECTION];

                const selection = historyHashTokenSelection && historyHashTokenSelection.viewportContextMenuClick(clickedSelection) ?
                    historyHashTokenSelection :
                    clickedSelection;

                historyHashTokens[SpreadsheetHistoryHashTokens.SELECTION] = selection;
                historyHashTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = selection instanceof SpreadsheetCellReference ||
                selection instanceof SpreadsheetCellRange ?
                    SpreadsheetCellMenuHistoryHashToken.INSTANCE :
                    SpreadsheetColumnOrRowMenuHistoryHashToken.INSTANCE;

                this.historyParseMergeAndPush(historyHashTokens);
            }
        };

        const onFocus = (e) => {
            // only update state if formula not active and focus changed.
            const {selectionAction, focused} = state;
            if(!(selectionAction instanceof SpreadsheetFormulaSelectionActionHistoryHashToken) || !focused){
                this.setState({
                    focused: true
                });
            }
        };

        const onKeyDown = (e) => {
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
        };

        const onHorizontalVerticalSliderChange = (newColumn, newRow) => {

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

                    const width = viewportTable.offsetWidth - ROW_WIDTH;
                    const height = viewportTable.offsetHeight - COLUMN_HEIGHT;

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
        };

        const width =  dimensions.width;
        const height = dimensions.height;

        return [
            <TableContainer id={SpreadsheetViewportWidget.VIEWPORT_ID}
                            key={SpreadsheetViewportWidget.VIEWPORT_ID + "TableContainer"}
                            ref={this.viewportTable}
                            component={Paper}
                            style={{
                                width: width,
                                height: height,
                                overflow: "clip",
                                borderRadius: 0, // cancel paper rounding.
                                cursor: contextMenuOpen && "context-menu",
                            }}
                            onBlur={onBlur}
                            onClick={onClick}
                            onContextMenu={onContextMenu}
                            onFocus={onFocus}
                            onKeyDown={onKeyDown}
            ><Table key={SpreadsheetViewportWidget.VIEWPORT_ID + "Table"}
                    style={{
                        tableLayout: "fixed",
                        width: width,
                        //height: height,
                        //overflow: "hidden",
                    }}>
                    <TableHead>
                        <TableRow>
                            {
                                this.renderTableColumnHeaders(selectionNotLabel)
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.renderTableBody(selectionNotLabel)
                        }
                    </TableBody>
                </Table>
                <Slider ref={this.horizontalSlider}
                        id={SpreadsheetViewportWidget.VIEWPORT_HORIZONTAL_SLIDER_ID}
                        key={SpreadsheetViewportWidget.VIEWPORT_HORIZONTAL_SLIDER_ID}
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
                            onHorizontalVerticalSliderChange(new SpreadsheetColumnReference(newColumn, SpreadsheetReferenceKind.RELATIVE), null)
                        }, SCROLL_DEBOUNCE)}
                />
                <Slider ref={this.verticalSlider}
                        id={SpreadsheetViewportWidget.VIEWPORT_VERTICAL_SLIDER_ID}
                        key={SpreadsheetViewportWidget.VIEWPORT_VERTICAL_SLIDER_ID}
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
                        onChange={_.debounce((e, newRow) => {
                            onHorizontalVerticalSliderChange(null, new SpreadsheetRowReference(1048576 - 1 - newRow, SpreadsheetReferenceKind.RELATIVE));
                        }, SCROLL_DEBOUNCE)}
                />
            </TableContainer>,
            <Menu key={SpreadsheetViewportWidget.VIEWPORT_CONTEXT_MENU_ID}
                  id={SpreadsheetViewportWidget.VIEWPORT_CONTEXT_MENU_ID}
                  keepMounted
                  open={contextMenuOpen}
                  onClose={onCloseContextMenu}
                  anchorReference="anchorPosition"
                  anchorPosition={anchorPosition || {left: 0, top: 0}}
            >
                {menuItems}
            </Menu>
        ];
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
            <TableCell key={SpreadsheetViewportWidget.VIEWPORT_SELECT_ALL_ID}
                       id={SpreadsheetViewportWidget.VIEWPORT_SELECT_ALL_ID}
                       style={SELECT_ALL}
            >
                &nbsp;
            </TableCell> // TODO add select all support when range support is ready
        ];

        let x = ROW_WIDTH;
        let column = home.column();

        while(x < viewportWidth) {
            const width = columnWidths.get(column) | defaultColumnWidth;

            headers.push(
                column.renderViewport(
                    COLUMN_HEADER(
                        width,
                        selection && selection.testColumn(column)
                    )
                )
            );

            x = x + width;
            column = column.add(1);
        }

        return headers;
    }

    /**
     * Render the required TABLE ROW each filled with available or empty TABLE CELL cells.
     */
    renderTableBody(selection) {
        const {cells, columnWidths, rowHeights, spreadsheetMetadata, dimensions, cellToLabels} = this.state;

        const home = spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);
        const defaultStyle = spreadsheetMetadata.effectiveStyle();

        const defaultColumnWidth = defaultStyle.width().value();
        const defaultRowHeight = defaultStyle.height().value();

        const viewportWidth = dimensions.width;
        const viewportHeight = dimensions.height;

        const tableRows = [];

        let y = COLUMN_HEIGHT;
        let row = home.row();

        while(y < viewportHeight) {

            const tableCells = [];
            let x = 0;
            let column = home.column();

            const height = (rowHeights.get(row) | defaultRowHeight);

            tableCells.push(
                row.renderViewport(
                    ROW_HEADER(
                        height,
                        selection && selection.testRow(row)
                    )
                )
            );

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

            y = y + height;
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

        const tokens = SpreadsheetHistoryHashTokens.emptyTokens();

        tokens[SpreadsheetHistoryHashTokens.SELECTION] = selection;
        tokens[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR] = anchor
        tokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = action;

        this.historyParseMergeAndPush(tokens);
    }
}

SpreadsheetViewportWidget.propTypes = {
    clearSelection: PropTypes.func.isRequired,
    deleteSelection: PropTypes.func.isRequired,
    dimensions: PropTypes.object,
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    insertAfterSelection: PropTypes.func.isRequired,
    insertBeforeSelection: PropTypes.func.isRequired,
    messenger: PropTypes.instanceOf(SpreadsheetMessenger),
    spreadsheetDeltaCellCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    spreadsheetDeltaColumnCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    spreadsheetDeltaRowCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    spreadsheetLabelCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    spreadsheetMetadataCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    showError: PropTypes.func.isRequired,
};
