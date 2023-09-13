import _ from "lodash";
import CharSequences from "../../../CharSequences.js";
import Equality from "../../../Equality.js";
import HttpMethod from "../../../net/HttpMethod.js";
import ImmutableMap from "../../../util/ImmutableMap.js";
import Keys from "../../../Keys.js";
import Menu from "@mui/material/Menu";
import Paper from '@mui/material/Paper';
import Preconditions from "../../../Preconditions.js";
import PropTypes from "prop-types";
import React from 'react';
import Slider from "@mui/material/Slider";
import SpreadsheetCellColumnOrRowParse from "../cell/SpreadsheetCellColumnOrRowParse.js";
import SpreadsheetCellFormulaEditHistoryHashToken from "../cell/formula/SpreadsheetCellFormulaEditHistoryHashToken.js";
import SpreadsheetCellFormulaHistoryHashToken from "../cell/formula/SpreadsheetCellFormulaHistoryHashToken.js";
import SpreadsheetCellMenuHistoryHashToken from "../cell/SpreadsheetCellMenuHistoryHashToken.js";
import SpreadsheetCellRange from "../cell/SpreadsheetCellRange.js";
import SpreadsheetCellReference from "../cell/SpreadsheetCellReference.js";
import SpreadsheetCellStyleHistoryHashToken from "../cell/style/SpreadsheetCellStyleHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertAfterHistoryHashToken
    from "../columnrow/SpreadsheetColumnOrRowInsertAfterHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertBeforeHistoryHashToken
    from "../columnrow/SpreadsheetColumnOrRowInsertBeforeHistoryHashToken.js";
import SpreadsheetColumnOrRowMenuHistoryHashToken from "../columnrow/SpreadsheetColumnOrRowMenuHistoryHashToken.js";
import SpreadsheetColumnReference from "../columnrow/SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "../columnrow/SpreadsheetColumnReferenceRange.js";
import SpreadsheetContextMenu from "../../../widget/SpreadsheetContextMenu.js";
import SpreadsheetDelta from "../../engine/SpreadsheetDelta.js";
import SpreadsheetExpressionReference from "../SpreadsheetExpressionReference.js";
import SpreadsheetHistoryHash from "../../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelName from "../label/SpreadsheetLabelName.js";
import SpreadsheetMessenger from "../../message/SpreadsheetMessenger.js";
import SpreadsheetMessengerCrud from "../../message/SpreadsheetMessengerCrud.js";
import SpreadsheetMetadata from "../../meta/SpreadsheetMetadata.js";
import SpreadsheetReferenceKind from "../SpreadsheetReferenceKind.js";
import SpreadsheetRowReference from "../columnrow/SpreadsheetRowReference.js";
import SpreadsheetRowReferenceRange from "../columnrow/SpreadsheetRowReferenceRange.js";
import SpreadsheetSelectionWidget from "../SpreadsheetSelectionWidget.js";
import SpreadsheetViewportSelection from "./SpreadsheetViewportSelection.js";
import SpreadsheetViewportSelectionNavigation from "./SpreadsheetViewportSelectionNavigation.js";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import viewportSelectionSelectHistoryHashToken from "../../history/viewportSelectionSelectHistoryHashToken.js";

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
        selected ? SELECTED : {},
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
        selected ? SELECTED : {},
    )
};

const SCROLL_DEBOUNCE = 100;

const CONTEXT_MENU_X_OFFSET = 10;
const CONTEXT_MENU_Y_OFFSET = 10;

/**
 * This component holds the cells viewport as well as the column and row controls.
 * <ul>
 * <li>ImmutableMap cellReferenceToCells: A cache of the cells within the visible viewport</li>
 * <li>ImmutableMap cellReferenceToLabels: cell to Label lookup</li>
 * <li>ImmutableMap columnReferenceToColumns: column reference to the column</li>
 * <li>ImmutableMap labelsToReference: Used to map a label to reference</li>
 * <li>ImmutableMap rowReferenceToRows: row reference to row</li>
 * <li>ImmutableMap columnWidths: A cache of the column widths within the visible viewport</li>
 * <li>ImmutableMap rowHeights: A cache of the row heights within the visible viewport</li>
 * <li>object dimensions: Holds the width and height of the viewport in pixels</li>
 * <li>SpreadsheetMetadata spreadsheetMetadata: holds the viewport home cell & default style</li>
 * <li>Array of SpreadsheetCellRange window: One or more ranges that will hold any frozen column/rows and the actual viewport</li>
 * <li>boolean focused: When true the viewport has focus, and cleared when the blur event happens.</li>
 * <li>SpreadsheetContextMenu contextMenu When present indicates an open context menu with its state.</li>
 * <li>SpreadsheetViewportSelection selection: The currently active selection including ranges</li>
 * </ul>
 */
export default class SpreadsheetViewportWidget extends SpreadsheetSelectionWidget {

    static VIEWPORT_HORIZONTAL_SLIDER_ID = SpreadsheetViewportWidget.VIEWPORT_ID + "-horizontal-Slider";

    static VIEWPORT_VERTICAL_SLIDER_ID = SpreadsheetViewportWidget.VIEWPORT_ID + "-vertical-Slider";

    static VIEWPORT_SELECT_ALL_ID = SpreadsheetViewportWidget.VIEWPORT_ID + "-select-all-cells";

    init() {
        this.horizontalSlider = React.createRef();
        this.verticalSlider = React.createRef();
        this.viewportElement = React.createRef();
    }

    componentDidMount() {
        super.componentDidMount();

        const props = this.props;

        this.onSpreadsheetDeltaColumnRemover = props.spreadsheetDeltaColumnCrud.addListener(this.onSpreadsheetDelta.bind(this));
        this.onSpreadsheetDeltaRowRemover = props.spreadsheetDeltaRowCrud.addListener(this.onSpreadsheetDelta.bind(this));
        this.onSpreadsheetLabelCrudRemover = props.spreadsheetLabelCrud.addListener(this.onSpreadsheetLabel.bind(this));
        this.onSpreadsheetMetadataRemover = props.spreadsheetMetadataCrud.addListener(this.onSpreadsheetMetadata.bind(this));

        this.resizeObserver = new ResizeObserver(
            (entries) => {

                for(const entry of entries) {
                    this.setState({
                        dimensions: {
                            width: entry.contentRect.width,
                            height: entry.contentRect.height,
                        }
                    });
                }
            }
        );

        // need to watch viewport resizing because size changes require a reload of the viewport cells.
        this.resizeObserver.observe(this.viewportElement.current);
    }

    /**
     * Includes logic to clear any present cells etc that are within any present window in the response SpreadsheetDelta
     * before updating the cells, cell to labels, labels etc.
     */
    onSpreadsheetDelta(method, id, url, requestDelta, responseDelta) {
        if(responseDelta) {
            const viewportElement = this.viewportElement.current;
            if(viewportElement){
                const window = responseDelta.window();
                const state = this.state;

                var {
                    cellReferenceToCells,
                    cellReferenceToLabels,
                    columnReferenceToColumns,
                    labelToReferences,
                    rowReferenceToRows,
                    viewportSelection: viewportSelectionToken,
                    spreadsheetId,
                    spreadsheetMetadata,
                } = state;

                // first remove any deleted cells.
                responseDelta.deletedCells()
                    .forEach(r => {
                        cellReferenceToCells = cellReferenceToCells.remove(r)
                    });

                // if a window was present on the response delta, clear any label mappings within the window space
                if(window.length){
                    var tempCellReferenceToLabels = new Map();

                    cellReferenceToLabels = new ImmutableMap(tempCellReferenceToLabels);

                    // only copy labels that are not within the window.
                    var tempLabelToReferences = new Map();

                    for(const [label, reference] of labelToReferences.toMap().entries()) {
                        var all = true;

                        // resolve label to a cell OR range
                        var cellOrRange = reference;
                        while(cellOrRange instanceof SpreadsheetLabelName) {
                            cellOrRange = labelToReferences.get(cellOrRange);
                        }

                        if(!cellOrRange){
                            break;
                        }

                        for(const windowCellRange of window) {
                            if(cellOrRange.testCellRange(windowCellRange)){
                                all = false;
                                break;
                            }
                        }

                        if(!all){
                            tempLabelToReferences.set(label, reference);
                        }
                    }

                    labelToReferences = new ImmutableMap(tempLabelToReferences);
                }

                const newState = { // lgtm [js/react/inconsistent-state-update]
                    cellReferenceToCells: cellReferenceToCells.setAll(responseDelta.cellReferenceToCells()),
                    cellReferenceToLabels: cellReferenceToLabels.setAll(responseDelta.cellReferenceToLabels()),
                    columnReferenceToColumns: columnReferenceToColumns.setAll(responseDelta.columnReferenceToColumns()),
                    labelToReferences: labelToReferences.setAll(responseDelta.labelToReferences()),
                    rowReferenceToRows: rowReferenceToRows.setAll(responseDelta.rowReferenceToRows()),
                    columnWidths: state.columnWidths.setAll(responseDelta.columnWidths()),
                    rowHeights: state.rowHeights.setAll(responseDelta.rowHeights()),
                };

                if(window.length){
                    const queryParameters = url.queryParameters();
                    if(queryParameters.home){
                        Object.assign(
                            newState,
                            {
                                window: window,
                                spreadsheetMetadata: spreadsheetMetadata.set(
                                    SpreadsheetMetadata.VIEWPORT_CELL,
                                    SpreadsheetDelta.viewportRange(window)
                                        .begin()
                                )
                            }
                        );
                    }

                    // before replacing the history selection with the response.selection verify the queryparameters & state are equal.
                    const responseViewportSelection = responseDelta.viewportSelection();
                    if(responseViewportSelection && viewportSelectionToken && !(viewportSelectionToken instanceof SpreadsheetCellFormulaHistoryHashToken)){
                        const queryParameterSelection = queryParameters.selection && queryParameters.selection[0];
                        const selection = viewportSelectionToken.viewportSelection().selection();
                        if(selection.equalsIgnoringKind(queryParameterSelection)){
                            Object.assign(
                                newState,
                                {
                                    viewportSelection: viewportSelectionSelectHistoryHashToken(responseViewportSelection),
                                }
                            );
                        }
                    }
                }

                switch(method) {
                    case HttpMethod.DELETE:
                        Object.assign(
                            newState,
                            {
                                viewportSelection: null,
                            }
                        );
                        break;
                    case HttpMethod.POST:
                        if(viewportSelectionToken){
                            const viewportSelection = viewportSelectionToken.viewportSelection();
                            const selection = viewportSelection.selection();

                            if(viewportSelectionToken instanceof SpreadsheetColumnOrRowInsertBeforeHistoryHashToken){
                                const urlPaths = url.path().split("/");
                                if(urlPaths.length === 7){
                                    // 0 = ""
                                    // 1 == api
                                    // 2 == spreadsheet
                                    // 3 == $spreadsheet-id
                                    // 4 == column == Selection
                                    // 5 == $selection
                                    // 6 == before == insert-action.toUrl
                                    if(urlPaths[3] === spreadsheetId.toString()){
                                        if(selection.isApiInsertBeforePostUrl(urlPaths)){
                                            Object.assign(
                                                newState,
                                                {
                                                    viewportSelection: viewportSelectionSelectHistoryHashToken(
                                                        new SpreadsheetViewportSelection(
                                                            selection.viewportInsertBeforePostSuccessSelection(viewportSelectionToken.count()),
                                                            viewportSelection.anchor()
                                                        )
                                                    )
                                                }
                                            );
                                        }
                                    }
                                }
                                break;
                            }
                            if(viewportSelectionToken instanceof SpreadsheetColumnOrRowInsertAfterHistoryHashToken){
                                const urlPaths = url.path().split("/");
                                if(urlPaths.length === 7){
                                    // 0 = ""
                                    // 1 == api
                                    // 2 == spreadsheet
                                    // 3 == $spreadsheet-id
                                    // 4 == column == Selection
                                    // 5 == $selection
                                    // 6 == before == insert-action.toUrl
                                    if(urlPaths[3] === spreadsheetId.toString()){
                                        if(selection.isInsertAfterPostUrl(urlPaths)){
                                            Object.assign(
                                                newState,
                                                {
                                                    viewportSelection: viewportSelectionSelectHistoryHashToken(
                                                        new SpreadsheetViewportSelection(
                                                            selection,
                                                            viewportSelection.anchor()
                                                        )
                                                    )
                                                }
                                            );
                                        }
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    default:
                        break;
                }

                this.setState(newState);
            }
        }
    }

    /**
     * If a label was saved or deleted refresh the viewport.
     */
    onSpreadsheetLabel(method, id, url, requestLabel, responseLabel) {
        switch(method) {
            case HttpMethod.DELETE:
            case HttpMethod.POST:
                const viewportElement = this.viewportElement.current;
                if(viewportElement){
                    this.loadCells(
                        this.state.spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL)
                            .viewport(
                                viewportElement.offsetWidth - ROW_WIDTH,
                                viewportElement.offsetHeight - COLUMN_HEIGHT,
                            ),
                        null, // viewportSelection
                    );
                }
                break;
            default:
                break;
        }
    }

    onSpreadsheetMetadata(method, id, url, requestMetadata, responseMetadata) {
        if(responseMetadata) {
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
                            cellReferenceToCells: ImmutableMap.EMPTY,
                            cellReferenceToLabels: ImmutableMap.EMPTY,
                            columnReferenceToColumns: ImmutableMap.EMPTY,
                            labelToReferences: ImmutableMap.EMPTY,
                            rowReferenceToRows: ImmutableMap.EMPTY,
                            columnWidths: ImmutableMap.EMPTY,
                            rowHeights: ImmutableMap.EMPTY,
                        });
                }
            }

            this.setState(newState);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.onSpreadsheetDeltaColumnRemover && this.onSpreadsheetDeltaColumnRemover();
        delete this.onSpreadsheetDeltaColumnRemover;

        this.onSpreadsheetDeltaRowRemover && this.onSpreadsheetDeltaRowRemover();
        delete this.onSpreadsheetDeltaRowRemover;

        this.onSpreadsheetLabelCrudRemover && this.onSpreadsheetLabelCrudRemover();
        delete this.onSpreadsheetLabelCrudRemover;

        this.onSpreadsheetMetadataRemover && this.onSpreadsheetMetadataRemover();
        delete this.onSpreadsheetMetadataRemover;

        if(this.resizeObserver){
            this.resizeObserver.disconnect();
        }
    }

    initialStateFromProps(props) {
        const historyHashTokens = props.history.tokens();

        return {
            spreadsheetId: historyHashTokens[SpreadsheetHistoryHash.SPREADSHEET_ID],
            spreadsheetName: historyHashTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME],
            cellReferenceToCells: ImmutableMap.EMPTY,
            cellReferenceToLabels: ImmutableMap.EMPTY,
            columnReferenceToColumns: ImmutableMap.EMPTY,
            labelToReferences: ImmutableMap.EMPTY,
            rowReferenceToRows: ImmutableMap.EMPTY,
            columnWidths: ImmutableMap.EMPTY,
            rowHeights: ImmutableMap.EMPTY,
            dimensions: {},
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY,
            window: [],
            contextMenu: null, // no open context menu
        };
    }

    stateFromHistoryTokens(tokens) {
        return {
            spreadsheetId: tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID],
            spreadsheetName: tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME],
            viewportSelection: tokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION],
            contextMenu: null, // close context menu
        };
    }

    /**
     * If the history cell changes and formula token is missing give focus. Also handles refreshing viewport
     * if cell or range change.
     */
    historyTokensFromState(prevState) {
        var historyTokens;

        const state = this.state;
        const metadata = state.spreadsheetMetadata;
        const previousMetadata = prevState.spreadsheetMetadata;

        const props = this.props;
        const viewportElement = this.viewportElement.current;

        if(viewportElement){
            const window = state.window;
            const prevWindow = prevState.window;

            // if viewport range changed update the scrollbar values.
            if(prevWindow.length && window.length){
                const begin = SpreadsheetDelta.viewportRange(window)
                    .begin();
                if(!begin.equals(SpreadsheetDelta.viewportRange(prevWindow).begin())){
                    this.horizontalSlider.current.value = begin.column().value();
                    this.verticalSlider.current.value = SpreadsheetViewportWidget.toVerticalSliderValue(
                        begin.column()
                            .value()
                    );
                }
            }

            const viewportCell = metadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);
            const viewportSelectionToken = state.viewportSelection;

            if(viewportCell){
                const width = viewportElement.offsetWidth - ROW_WIDTH;
                const height = viewportElement.offsetHeight - COLUMN_HEIGHT;

                // some metadata properties changed that will mean formatting of values changed so reload
                if(metadata.viewportShouldLoadCells(previousMetadata)){
                    this.log(".historyTokensFromState Metadata change need to format all viewport cells", metadata, previousMetadata);

                    this.loadCells(
                        viewportCell.viewport(
                            width,
                            height
                        ),
                        viewportSelectionToken && viewportSelectionToken.viewportSelection()
                    );
                }else {
                    // if viewportSelection changed execute it...
                    if(viewportSelectionToken &&
                        (!(viewportSelectionToken instanceof SpreadsheetCellFormulaHistoryHashToken)) &&
                        (!(viewportSelectionToken instanceof SpreadsheetCellStyleHistoryHashToken))
                    ){
                        this.log(".historyTokensFromState executing " + viewportSelectionToken + ".spreadsheetViewportWidgetExecute");

                        historyTokens = viewportSelectionToken.spreadsheetViewportWidgetExecute(
                            this,
                            prevState.viewportSelection,
                            viewportCell,
                            width,
                            height
                        ); // perform delete/insert etc.
                    }else {
                        // if viewport width or height increased reload viewport cells
                        const {
                            width: previousWidth,
                            height: previousHeight
                        } = prevState.dimensions;

                        if(width > previousWidth || height > previousHeight){
                            this.log(
                                ".historyTokensFromState viewport width OR height increased from " +
                                previousWidth + "x" + previousHeight +
                                " to " +
                                width + "x" + height +
                                " need to reload viewport cells"
                            );

                            this.loadCells(
                                viewportCell.viewport(
                                    width,
                                    height
                                ),
                                viewportSelectionToken && viewportSelectionToken.viewportSelection()
                            );
                        }
                    }
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
    clearSelection(viewportSelection) {
        this.props.clearSelection(
            viewportSelection,
            this.state.window
        );
    }

    /**
     * Remove the selection, the deleted column, row etc and then perform the delete API.
     */
    deleteSelection(viewportSelection) {
        this.props.deleteSelection(
            viewportSelection,
            this.state.window
        );
    }

    freezeSelection(viewportSelection) {
        this.patchSpreadsheetMetadata(
            viewportSelection.selection().freezePatch()
        );
    }

    /**
     * Performs the insertAfter operation, leaving the selection unchanged.
     */
    insertAfterSelection(viewportSelection, count) {
        this.props.insertAfterSelection(
            viewportSelection,
            count,
            this.state.window
        );
    }

    /**
     * Performs the insert-before operation, leaving the selection unchanged.
     */
    insertBeforeSelection(viewportSelection, count) {
        this.props.insertBeforeSelection(
            viewportSelection,
            count,
            this.state.window
        );
    }

    patchColumnOrRow(viewportSelection, property, value) {
        Preconditions.requireInstance(viewportSelection, SpreadsheetViewportSelection, "viewportSelection");
        Preconditions.requireText(property, "property");

        const selection = viewportSelection.selection();
        const patched = selection.patch(property, value);
        const window = this.state.window;
        const props = this.props;

        if(selection instanceof SpreadsheetColumnReference || selection instanceof SpreadsheetColumnReferenceRange){
            props.spreadsheetDeltaColumnCrud.patch(
                selection,
                new SpreadsheetDelta(
                    viewportSelection,
                    [], // cells
                    Array.isArray(patched) ? patched : [patched], // columns
                    [], // labels
                    [], // rows
                    [], // deletedCells
                    [], // deletedColumns
                    [], // deletedRows
                    ImmutableMap.EMPTY, // columnWidths
                    ImmutableMap.EMPTY, // rowHeights
                    window
                ),
                props.showError,
            );
        }

        if(selection instanceof SpreadsheetRowReference || selection instanceof SpreadsheetRowReferenceRange){
            props.spreadsheetDeltaRowCrud.patch(
                selection,
                new SpreadsheetDelta(
                    viewportSelection,
                    [], // cells
                    [], // columns
                    [], // labels
                    Array.isArray(patched) ? patched : [patched], // rows
                    [], // deletedCells
                    [], // deletedColumns
                    [], // deletedRows
                    ImmutableMap.EMPTY, // columnWidths
                    ImmutableMap.EMPTY, // rowHeights
                    window
                ),
                props.showError,
            );
        }
    }

    /**
     * Does a PATCH with the given property and value
     */
    patchSpreadsheetMetadata(patch) {
        this.props.spreadsheetMetadataCrud.patch(
            this.state.spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID),
            JSON.stringify(patch),
            this.unknownSpreadsheetErrorHandler(
                null,
                this.showErrorErrorHandler(this.props.showError)
            )
        );
    }

    unFreezeSelection(viewportSelection) {
        this.patchSpreadsheetMetadata(
            viewportSelection.selection().unFreezePatch()
        );
    }

    /**
     * Updates the state so the context menu will be shown.
     */
    showContextMenu(viewportSelection) {
        const selection = viewportSelection.selection();

        const element = document.getElementById(selection.viewportId());
        if(element){
            const history = this.props.history;

            const {top, left} = element.getBoundingClientRect();
            const {
                spreadsheetMetadata
            } = this.state;

            const contextMenu = new SpreadsheetContextMenu(
                left + CONTEXT_MENU_X_OFFSET,
                top + CONTEXT_MENU_Y_OFFSET,
                selection.viewportContextMenu(
                    SpreadsheetHistoryHash.spreadsheetIdAndName(history.tokens()),
                    () => spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.FROZEN_COLUMNS),
                    () => spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.FROZEN_ROWS),
                    (c) => this.isColumnHidden(c),
                    (r) => this.isRowHidden(r),
                    (c) => new SpreadsheetColumnReferenceRange(
                        new SpreadsheetColumnReference(0, SpreadsheetReferenceKind.RELATIVE),
                        new SpreadsheetColumnReference(c, SpreadsheetReferenceKind.RELATIVE)
                    ),
                    (r) => new SpreadsheetRowReferenceRange(
                        new SpreadsheetRowReference(0, SpreadsheetReferenceKind.RELATIVE),
                        new SpreadsheetRowReference(r, SpreadsheetReferenceKind.RELATIVE)
                    ),
                    history
                )
            );

            setTimeout(() => {
                this.setState({
                    contextMenu: contextMenu,
                });
            }, 1);
        }
    }

    /**
     * Loads the requested cells, and includes the selection, anchor and any recently entered navigation.
     */
    loadCells(spreadsheetViewport, viewportSelection) {
        const props = this.props;

        props.spreadsheetDeltaCellCrud.get(
            "*",
            spreadsheetViewport.apiLoadCellsQueryStringParameters(
                viewportSelection && viewportSelection.selection(),
                viewportSelection && viewportSelection.anchor(),
                viewportSelection && viewportSelection.navigation()
            ),
            this.unknownLabelErrorHandler(
                this.showErrorErrorHandler(props.showError)
            )
        );
    }

    /**
     * Attempts to give focus to the selection including resolving of labels to cells, using the anchor to find
     * actual cell or column or row within a range etc.
     */
    giveViewportSelectionFocus(viewportSelection) {
        this.log(".giveViewportSelectionFocus " + viewportSelection);

        this.giveFocus(
            () => {
                var element;
                if(viewportSelection){
                    const stateViewportSelection = this.state.viewportSelection;
                    if(!(stateViewportSelection instanceof SpreadsheetCellFormulaHistoryHashToken)){
                        const selection = viewportSelection.selection();
                        const cellColumnOrRow = selection.viewportFocus(
                            this.state.labelToReferences,
                            viewportSelection.anchor()
                        );

                        if(cellColumnOrRow){
                            element = document.getElementById(cellColumnOrRow.viewportId().toString());
                        }
                    }
                }
                return element;
            }
        );
    }

    /**
     * Renders a TABLE which will hold all the columns, rows and cells visible in the spreadsheet viewport.
     */
    render() {
        const spreadsheetMetadata = this.state.spreadsheetMetadata;

        return <div ref={this.viewportElement} style={
            {
                flexGrow: 1,
                width: "100%",
            }}>
            {(spreadsheetMetadata.isEmpty()) ?
                this.renderViewportEmpty() :
                this.renderViewport(spreadsheetMetadata)
            }
        </div>;
    }

    static VIEWPORT_CONTEXT_MENU_ID = SpreadsheetViewportWidget.VIEWPORT_ID + "context-Menu";

    /**
     * Renders the column and row gutters and cells within the viewport.
     */
    renderViewport(spreadsheetMetadata) {
        const home = spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);

        // handles any viewport blur events, clearing the state.focused flag............................................
        const onBlur = (e) => {
            // only set focused to false if new focus is outside viewport table.
            if(!this.viewportElement.current.contains(e.relatedTarget)){
                this.log(".blur focused false");

                this.setState({
                    focused: false,
                });
            }
        };

        // translates any viewport clicks into selection history updates................................................
        const onClick = (e) => {
            const clickedSelection = this.findEventTargetSelection(e.target);
            if(clickedSelection){
                this.historyPushViewportSelection(
                    viewportSelectionSelectHistoryHashToken(
                        new SpreadsheetViewportSelection(clickedSelection)
                    )
                );
            }
        };

        // handles closing any previously open context menu.............................................................
        const onCloseContextMenu = () => {
            const stateViewportSelection = this.state.viewportSelection;
            if(stateViewportSelection instanceof SpreadsheetCellMenuHistoryHashToken || stateViewportSelection instanceof SpreadsheetColumnOrRowMenuHistoryHashToken){
                this.historyPushViewportSelection(
                    viewportSelectionSelectHistoryHashToken(
                        stateViewportSelection.viewportSelection()
                    )
                );
            }
        };

        // records that the viewport has just received focus...........................................................
        const onFocus = (e) => {
            this.log(".onFocus focused");

            if(!(this.state.viewportSelection instanceof SpreadsheetCellFormulaHistoryHashToken) || !this.state.focused){
                this.log(".onfocus setting focused=true");

                this.setState({
                    focused: true
                });
            }
        };

        // handles translating keyboard events often into selection navigation actions.................................
        const onKeyDown = (e) => {
            const key = e.key;
            this.log(".onKeyDown key=" + CharSequences.quoteAndEscape(key));

            e.preventDefault();

            const eventSelection = this.findEventTargetSelection(e.target);
            if(eventSelection){
                var viewportSelectionToken = this.state.viewportSelection;
                if(viewportSelectionToken){
                    const viewportSelection = viewportSelectionToken.viewportSelection();
                    var navigation = null;
                    const shifted = e.shiftKey;

                    switch(key) {
                        case Keys.ARROW_LEFT:
                            navigation = shifted ? SpreadsheetViewportSelectionNavigation.EXTEND_LEFT_COLUMN : SpreadsheetViewportSelectionNavigation.LEFT_COLUMN;
                            break;
                        case Keys.ARROW_UP:
                            navigation = shifted ? SpreadsheetViewportSelectionNavigation.EXTEND_UP_ROW : SpreadsheetViewportSelectionNavigation.UP_ROW;
                            break;
                        case Keys.ARROW_RIGHT:
                            navigation = shifted ? SpreadsheetViewportSelectionNavigation.EXTEND_RIGHT_COLUMN : SpreadsheetViewportSelectionNavigation.RIGHT_COLUMN;
                            break;
                        case Keys.ARROW_DOWN:
                            navigation = shifted ? SpreadsheetViewportSelectionNavigation.EXTEND_DOWN_ROW : SpreadsheetViewportSelectionNavigation.DOWN_ROW;
                            break;
                        case Keys.ENTER:
                            const selectionNotLabel = this.selectionNotLabel();
                            if(selectionNotLabel instanceof SpreadsheetCellReference){
                                this.historyMergeAndPush(
                                    SpreadsheetHistoryHashTokens.viewportSelection(
                                        new SpreadsheetCellFormulaEditHistoryHashToken(
                                            viewportSelection
                                        )
                                    )
                                );
                                this.log(".onKeyDown ENTER new selection: " + viewportSelectionToken);
                            }
                            break;
                        // ESCAPE clears any selection
                        case Keys.ESCAPE:
                            this.historyPushViewportSelection(null);
                            break;
                        default:
                            break;
                    }

                    if(navigation){
                        this.setState({
                            viewportSelection: viewportSelectionSelectHistoryHashToken(
                                viewportSelection.setNavigation(navigation)
                            ),
                        });
                    }
                }
            }
        };

        // handles any slider change events............................................................................
        const onHorizontalVerticalSliderChange = (newColumn, newRow) => {
            const window = this.state.window;

            if(window.length){
                const viewport = SpreadsheetDelta.viewportRange(window);
                const begin = viewport.begin();

                let topLeft = begin;
                if(null != newColumn){
                    topLeft = topLeft.setColumn(newColumn);
                }
                if(null != newRow){
                    topLeft = topLeft.setRow(newRow);
                }

                // updating will force a reload of viewport
                if(!begin.equals(topLeft)){
                    this.log(".onHorizontalVerticalSliderChange " + viewport + " TO " + new SpreadsheetCellRange(topLeft, topLeft));

                    const viewportElement = this.viewportElement.current;

                    const width = viewportElement.offsetWidth - ROW_WIDTH;
                    const height = viewportElement.offsetHeight - COLUMN_HEIGHT;

                    this.loadCells(
                        topLeft.viewport(
                            width,
                            height
                        ),
                        null // no viewportSelection
                    );
                    this.setState({
                        spreadsheetMetadata: this.state.spreadsheetMetadata.set(
                            SpreadsheetMetadata.VIEWPORT_CELL,
                            topLeft
                        ),
                    });
                }
            }
        };

        // first collect all columns and rows visible within the viewport, hidden columns and rows will be filtered.....
        const columns = [];
        const rows = [];

        this.state.window.forEach(w => {
            w.columnRange()
                .values()
                .forEach(c => {
                    if(!this.isColumnHidden(c)){
                        if(columns.findIndex(cc => c.equalsIgnoringKind(cc)) === -1){
                            columns.push(c);
                        }
                    }
                });

            w.rowRange()
                .values()
                .forEach(r => {
                    if(!this.isRowHidden(r)){
                        if(rows.findIndex(rr => r.equalsIgnoringKind(rr)) === -1){
                            rows.push(r);
                        }
                    }
                });
        });

        const comparator = (left, right) => left.compareTo(right);
        columns.sort(comparator);
        rows.sort(comparator);

        // create all the layout........................................................................................
        const {
            dimensions,
            columnWidths,
            rowHeights,
            contextMenu,
            spreadsheetId,
            spreadsheetName,
        } = this.state;

        const width = dimensions.width;
        const height = dimensions.height;
        const column = home.column().value();
        const row = home.row().value();

        const defaultStyle = spreadsheetMetadata.effectiveStyle();
        const defaultColumnWidth = defaultStyle.width().value();
        const defaultRowHeight = defaultStyle.height().value();

        const columnWidthsFn = (c) => columnWidths.get(c) | defaultColumnWidth;
        const rowHeightFn = (r) => rowHeights.get(r) | defaultRowHeight;

        const selectionNotLabel = this.selectionNotLabel();
        const menuItems = contextMenu && contextMenu.items();

        const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
        tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = spreadsheetId;
        tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = spreadsheetName;

        return [
            <TableContainer id={SpreadsheetViewportWidget.VIEWPORT_ID}
                            key={SpreadsheetViewportWidget.VIEWPORT_ID + "TableContainer"}
                            component={Paper}
                            style={{
                                width: width,
                                height: height,
                                overflow: "clip",
                                borderRadius: 0, // cancel paper rounding.
                                cursor: menuItems && "context-menu",
                            }}
                            onBlur={onBlur}
                            onClick={onClick}
                            onContextMenu={this.onContextMenu.bind(this)}
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
                            this.renderViewportColumnHeaders(columns, columnWidthsFn, selectionNotLabel, tokens)
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        this.renderViewportRowsAndBody(columns, rows, rowHeightFn, selectionNotLabel, defaultStyle, tokens)
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
                  open={Boolean(contextMenu)}
                  onClose={onCloseContextMenu}
                  anchorReference="anchorPosition"
                  anchorPosition={contextMenu && {
                      left: contextMenu.left(),
                      top: contextMenu.top(),
                  }}
            >
                {menuItems}
            </Menu>
        ];
    }

    /**
     * Gets any selection resolving any label to a cell or cell-range.
     */
    selectionNotLabel() {
        const viewportSelectionToken = this.state.viewportSelection;

        const selection = viewportSelectionToken &&
            viewportSelectionToken.viewportSelection()
                .selection();
        return selection instanceof SpreadsheetLabelName ?
            this.state.labelToReferences.get(selection) :
            selection;
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

    onContextMenu(e) {
        e.preventDefault();

        const clickedSelection = this.findEventTargetSelection(e.target);
        if(clickedSelection){
            const stateViewportSelection = this.state.viewportSelection;
            var contextMenuSelection = clickedSelection;

            if(stateViewportSelection){
                const selection = stateViewportSelection.viewportSelection()
                    .selection();
                contextMenuSelection = selection &&
                selection.viewportContextMenuClick(clickedSelection) ?
                    selection :
                    clickedSelection;
            }

            const viewportSelectionToken = new SpreadsheetViewportSelection(contextMenuSelection);
            const contextMenu = new SpreadsheetContextMenu(
                CONTEXT_MENU_X_OFFSET,
                CONTEXT_MENU_Y_OFFSET,
            );
            this.historyPushViewportSelection(
                contextMenuSelection instanceof SpreadsheetExpressionReference ?
                    new SpreadsheetCellMenuHistoryHashToken(viewportSelectionToken, contextMenu) :
                    new SpreadsheetColumnOrRowMenuHistoryHashToken(viewportSelectionToken, contextMenu)
            );
        }
    }

    static SLIDER_STEP = 1;

    /**
     * Normally the vertical slider has the max at the top and min at the bottom, however we wish to have the opposite, lower number rows at the top.
     */
    static toVerticalSliderValue(value) {
        return SpreadsheetRowReference.MAX - 1 - value;
    }

    /**
     * Returns an array of TableCell, one for each column header.
     */
    renderViewportColumnHeaders(columns, columnWidth, selection, tokens) {
        let headers = [
            <TableCell key={SpreadsheetViewportWidget.VIEWPORT_SELECT_ALL_ID}
                       id={SpreadsheetViewportWidget.VIEWPORT_SELECT_ALL_ID}
                       style={SELECT_ALL}
            >
                &nbsp;
            </TableCell> // TODO add select all support when range support is ready
        ];

        columns.forEach(c => {
            tokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION] = viewportSelectionSelectHistoryHashToken(
                new SpreadsheetViewportSelection(c)
            );

            headers.push(
                c.renderViewport(
                    COLUMN_HEADER(
                        columnWidth(c),
                        selection && selection.testColumn(c)
                    ),
                    "#" + SpreadsheetHistoryHash.stringify(tokens)
                )
            );
        });

        return headers;
    }

    /**
     * Renders the TABLE BODY where each TR represents a spreadsheet viewport row
     */
    renderViewportRowsAndBody(columns, rows, rowHeightFn, selection, defaultStyle, tokens) {
        const {
            cellReferenceToCells,
            cellReferenceToLabels,
        } = this.state;

        return rows.map(
            r => {
                const tableRowCells = [];
                const height = rowHeightFn(r);

                tokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION] = viewportSelectionSelectHistoryHashToken(
                    new SpreadsheetViewportSelection(r)
                );

                // render ROW gutter widget with row number.
                tableRowCells.push(
                    r.renderViewport(
                        ROW_HEADER(
                            height,
                            selection && selection.testRow(r)
                        ),
                        "#" + SpreadsheetHistoryHash.stringify(tokens)
                    )
                );

                // render all the cells in the row.
                columns.forEach(c => {
                    const cellReference = new SpreadsheetCellReference(c, r);
                    const cell = cellReferenceToCells.get(cellReference) || cellReference.emptyCell();

                    tableRowCells.push(
                        cell.renderViewport(
                            defaultStyle,
                            cellReferenceToLabels.get(cellReference) || [],
                        )
                    );
                });

                return <TableRow key={"row-" + r}>
                    {
                        tableRowCells
                    }
                </TableRow>
            }
        );
    }

    /**
     * Renders an empty table, this happens when ALL requirements are not yet available.
     */
    renderViewportEmpty() {
        return <TableContainer/>;
    }

    /**
     * Tests if the given {@link SpreadsheetColumnReference column} is hidden.
     */
    isColumnHidden(columnReference) {
        const column = this.state.columnReferenceToColumns.get(columnReference);
        return null != column && column.hidden();
    }

    /**
     * Tests if the given {@link SpreadsheetRowReference row} is hidden.
     */
    isRowHidden(rowReference) {
        const row = this.state.rowReferenceToRows.get(rowReference);
        return null != row && row.hidden();
    }

    isFocused() {
        return this.state.focused;
    }
}

SpreadsheetViewportWidget.propTypes = {
    clearSelection: PropTypes.func.isRequired,
    deleteSelection: PropTypes.func.isRequired,
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
