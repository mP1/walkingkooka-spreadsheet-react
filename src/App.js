import {withRouter} from "react-router";
import './App.css';

import {withStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Equality from "./Equality.js";
import HistoryHash from "./spreadsheet/history/HistoryHash.js";
import ImmutableMap from "./util/ImmutableMap";
import React from 'react';
import SpreadsheetAppBar from "./widget/SpreadsheetAppBar.js";
import SpreadsheetBox from "./widget/SpreadsheetBox";
import SpreadsheetCell from "./spreadsheet/SpreadsheetCell";
import SpreadsheetCellBox from "./spreadsheet/reference/SpreadsheetCellBox";
import SpreadsheetCellReference from "./spreadsheet/reference/SpreadsheetCellReference.js";
import SpreadsheetContainerWidget from "./widget/SpreadsheetContainerWidget.js";
import SpreadsheetCoordinates from "./spreadsheet/SpreadsheetCoordinates.js";
import SpreadsheetDrawerWidget from "./spreadsheet/SpreadsheetDrawerWidget.js";
import SpreadsheetDelta from "./spreadsheet/engine/SpreadsheetDelta";
import SpreadsheetEngineEvaluation from "./spreadsheet/engine/SpreadsheetEngineEvaluation";
import SpreadsheetFormula from "./spreadsheet/SpreadsheetFormula";
import SpreadsheetFormulaWidget from "./spreadsheet/SpreadsheetFormulaWidget.js";
import SpreadsheetMetadata from "./spreadsheet/meta/SpreadsheetMetadata.js";
import SpreadsheetMessenger from "./spreadsheet/message/SpreadsheetMessenger.js";
import SpreadsheetName from "./spreadsheet/SpreadsheetName.js";
import SpreadsheetNameWidget from "./spreadsheet/SpreadsheetNameWidget.js";
import SpreadsheetRange from "./spreadsheet/reference/SpreadsheetRange";
import SpreadsheetViewportWidget from "./widget/SpreadsheetViewportWidget.js";
import TextStyle from "./text/TextStyle.js";
import WindowResizer from "./widget/WindowResizer";

/**
 * The width of the drawer in pixels holding settings and tools.
 */
const DRAWER_WIDTH = 400;

/**
 * History token noting that a cell formula is being edited.
 */
const FORMULA_EDIT_HASH = "formula";

const useStyles = theme => ({
    header: {
        zIndex: theme.zIndex.drawer + 1, // forces drawer to not overlap application header
    },
});

class App extends React.Component {
    constructor(props) {
        super(props);

        this.history = props.history;

        this.state = {
            createEmptySpreadsheet: false,
            settingsAndToolsDrawer: false, // initially the drawer on the right is "hidden" (false)
            spreadsheetEngineEvaluation: SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY,
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY,
            cells: ImmutableMap.EMPTY,
            columnWidths: ImmutableMap.EMPTY,
            rowHeights: ImmutableMap.EMPTY,
            windowDimensions: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
        };

        // the names must match the Class.getSimpleName in walkingkooka-spreadsheet
        this.messenger = new SpreadsheetMessenger();
        this.messenger.setWebWorker(false); // TODO test webworker mode

        this.settingsAndToolsDrawer = React.createRef();
        this.aboveViewport = React.createRef();
        this.spreadsheetName = React.createRef();
        this.formula = React.createRef();
        this.formulaContainer = React.createRef(); // a container that includes the formula text box. Will include other related tools
        this.viewport = React.createRef();

        document.title = "Empty spreadsheet";
    }

    // app lifecycle....................................................................................................

    /**
     * Updates the editability of the spreadsheet name, which also includes updating the history.
     */
    editSpreadsheetNameAndUpdateHistory(mode) {
        this.editSpreadsheetName(mode);

        const metadata = this.spreadsheetMetadata();
        const spreadsheetId = metadata.get(SpreadsheetMetadata.SPREADSHEET_ID);
        const spreadsheetName = metadata.get(SpreadsheetMetadata.SPREADSHEET_NAME);

        var message;
        const hash = [spreadsheetId, spreadsheetName];
        if (mode) {
            hash.push("name", "edit");
            message = "History hash updated, begin edit spreadsheet name";
        } else {
            message = "History hash updated, stop edit spreadsheet name";
        }

        this.historyPush(hash, message);
    }

    /**
     * Updates the editability of the spreadsheet name, without updating the history.
     */
    editSpreadsheetName(mode) {
        const widget = this.spreadsheetName.current;
        widget && widget.edit(mode);

        // stop editing cell if an edit was happening.
        if(mode) {
            this.editCell();
        }
    }

    // history lifecycle................................................................................................

    /**
     * Fired whenever the browser hash changes.
     */
    onHistoryChange(location) {
        const pathname = location.pathname;
        const historyLocation = this.history.location;
        const currentPathname = historyLocation.pathname;
        if (currentPathname !== pathname) {
            console.log("onHistoryChange from " + currentPathname + " to " + pathname, historyLocation);

            this.historyHashVerify(pathname);
        }
    }

    currentHistoryHashVerify() {
        const location = this.history.location;
        const pathname = location.pathname;
        console.log("currentHistoryHashVerify " + pathname, "location", location, "state", this.state);

        this.historyHashVerify(pathname);
    }

    /**
     * Verifies the hash pathname against the state
     */
    historyHashVerify(pathname) {
        // wait until sizes are known then check hash against state.
        if (this.mounted) {
            const state = this.state;
            const metadata = state.spreadsheetMetadata;
            const createEmptySpreadsheet = state.createEmptySpreadsheet;

            console.log("historyHashVerify " + pathname);

            if (!createEmptySpreadsheet) {
                const historyHashTokens = HistoryHash.tokenize(pathname);
                const spreadsheetId = historyHashTokens.shift();
                if (this.historySpreadsheetIdCreateEmptyOrLoadOrNothing(spreadsheetId, metadata)) {

                    const spreadsheetName = historyHashTokens.shift();
                    if (this.historySpreadsheetNameDifferentUpdateHistory(spreadsheetId, spreadsheetName, metadata)) {

                        var verifiedHistoryHashTokens = [spreadsheetId, spreadsheetName];
                        var valid = true;
                        var cell = false;
                        var name = false;
                        var closeDrawer = true;
                        const duplicate = [];

                        while (valid && historyHashTokens.length > 0) {
                            const target = historyHashTokens.shift();
                            if (duplicate.includes(target)) {
                                valid = this.historyUnknownTarget(metadata); // returns false, which will stop editcell, edit name and close drawer
                                break;
                            }
                            duplicate.push(target);

                            switch (target) {
                                case "":
                                    this.settingsAndToolsDrawerOpen(true);
                                    verifiedHistoryHashTokens.push("");
                                    closeDrawer = false;
                                    valid = true;
                                    break;
                                case "cell":
                                    // cell after name is a fail
                                    if (name) {
                                        valid = this.historyUnknownTarget(metadata); // returns false, which will stop editcell, edit name and close drawer
                                        break;
                                    }
                                    cell = true;
                                    const cellReference = historyHashTokens.shift();
                                    const action = historyHashTokens.shift();
                                    valid = this.historyCellAction(cellReference, action, metadata);
                                    if(valid) {
                                        verifiedHistoryHashTokens.push(target, cellReference, action);
                                    }
                                    break;
                                case "name":
                                    // name after cell is a fail.
                                    if (cell) {
                                        valid = this.historyUnknownTarget(metadata); // returns false, which will stop editcell, edit name and close drawer
                                        break;
                                    }
                                    valid = this.historySpreadsheetNameAction(historyHashTokens.shift());
                                    break;
                                default:
                                    valid = this.historyUnknownTarget(metadata);
                                    break;
                            }
                        }

                        if (!cell || !valid) {
                            this.editCell(); // clear any edit cell
                            if(metadata.get(SpreadsheetMetadata.EDIT_CELL)) {
                                this.setState({
                                    spreadsheetMetadata: metadata.remove(SpreadsheetMetadata.EDIT_CELL),
                                });
                            }
                        }
                        if (!name || !valid) {
                            this.editSpreadsheetName();
                        }
                        if (!valid || closeDrawer) {
                            this.settingsAndToolsDrawerOpen(false, metadata);
                        }
                        if (valid) {
                            this.historyPush(verifiedHistoryHashTokens, "Verified history hash", pathname);
                        }
                    }
                }
            }
        }
    }

    /**
     * Tests if the given spreadsheetId is different from the existing, creating or loading an existing new spreadsheet and return false.
     * The history is not changed.
     */
    historySpreadsheetIdCreateEmptyOrLoadOrNothing(spreadsheetId, metadata) {
        // if already loading dont check if hash matches state
        const previous = metadata.get(SpreadsheetMetadata.SPREADSHEET_ID);
        const same = Equality.safeEquals(spreadsheetId, previous);

        if(same) {
            if(!previous) {
                console.log("history hash spreadsheetId missing creating initial empty spreadsheet");
                this.createEmptySpreadsheet();
            }
        } else {
            console.log("history hash spreadsheetId changed from " + previous + " to " + spreadsheetId);

            // load the spreadsheet with $spreadsheetId or create a new spreadsheet if missing.
            if(spreadsheetId) {
                this.loadSpreadsheetMetadata(spreadsheetId);
            } else {
                this.createEmptySpreadsheet();
            }
        }

        return same;
    }

    /**
     * If the history spreadsheet name is invalid/different from SpreadsheetMetadata update the history and return false.
     */
    historySpreadsheetNameDifferentUpdateHistory(spreadsheetId, hashName, metadata) {
        var hashSpreadsheetName;
        try {
            hashSpreadsheetName = new SpreadsheetName(hashName);
        } catch (invalidName) {
        }

        const metadataSpreadsheetName = metadata.get(SpreadsheetMetadata.SPREADSHEET_NAME);
        const same = Equality.safeEquals(hashSpreadsheetName, metadataSpreadsheetName);
        if (!same) {
            // update url to match actual SpreadsheetMetadata.spreadsheetName
            this.historyPush([spreadsheetId, metadataSpreadsheetName],
                "Updating from " + hashName + " to match state " + metadataSpreadsheetName);
        }
        return same;
    }

    /**
     * If the cell is invalid reset the history hash to $spreadsheetId / $spreadsheetName.
     * When the cell reference is valid, verify the action, if either changed update the history to $spreadsheetId / $spreadsheetName / $cell / $action
     */
    historyCellAction(cellReference, action, metadata) {
        var clearHistoryCellAction = true; // only leave if both are valid.

        if (cellReference && action) {
            // cellReference and action present validate the combination.
            try {
                const hashSpreadsheetCellReference = SpreadsheetCellReference.parse(cellReference);

                switch (action) {
                    case FORMULA_EDIT_HASH:
                        // state does not match hash, update state.
                        const metadataEditCell = metadata.get(SpreadsheetMetadata.EDIT_CELL);
                        if (!Equality.safeEquals(cellReference, metadataEditCell)) {
                            this.setState({
                                spreadsheetMetadata: metadata.set(SpreadsheetMetadata.EDIT_CELL, hashSpreadsheetCellReference),
                            });
                        }
                        clearHistoryCellAction = false;
                        break;
                    default:
                        // invalid action update history clearing cellReference/action.
                        clearHistoryCellAction = true;
                        break;
                }
            } catch (invalidCellReference) {
            }
        }

        if (clearHistoryCellAction) {
            this.historyPush(
                [
                    metadata.get(SpreadsheetMetadata.SPREADSHEET_ID),
                    metadata.get(SpreadsheetMetadata.SPREADSHEET_NAME)
                ],
                "Invalid cell reference or action, clearing cell/action (" + cellReference + "/" + action + ")");
        }

        return !clearHistoryCellAction;
    }

    /**
     * Handles any actions in the hash directly related to the spreadsheet name.
     */
    historySpreadsheetNameAction(action) {
        var pass;

        switch (action) {
            case "edit":
                this.editSpreadsheetName(true);
                pass = true;
                break;
            default:
                this.editSpreadsheetName(false);
                pass = false;
                break;
        }
        return pass;
    }

    /**
     * The history hash contains an unknown target remove the target and following from the history hash.
     */
    historyUnknownTarget(metadata) {
        this.historyPush([metadata.get(SpreadsheetMetadata.SPREADSHEET_ID), metadata.get(SpreadsheetMetadata.SPREADSHEET_NAME)], "History hash invalid target and parameters");
        return false;
    }

    /**
     * If the location is new log the message and push the history token.
     */
    historyPush(tokens, message, ...messageParameters) {
        if (!message) {
            throw new Error("Missing message");
        }
        if (typeof message !== "string") {
            throw new Error("Expected String message got " + message);
        }

        const history = this.history;
        const pathname = HistoryHash.join(tokens);
        if (history.location.pathname !== pathname) {
            console.log("History push \"" + pathname + "\": " + message, ...messageParameters);
            this.history.push(pathname);
        } else {
            console.log("History push unchanged \"" + history.location.pathname + "\" new \"" + pathname + "\"");
        }
    }

    // component lifecycle..............................................................................................

    componentDidMount() {
        console.log("App mounted");
        this.mounted = true;
        this.history.listen(this.onHistoryChange.bind(this));
        this.currentHistoryHashVerify();
    }

    componentWillUnmount() {
        console.log("App unmounted");
        this.mounted = false;
        // TODO history.unlisten
    }

    /**
     * Reads the state and verifies each component with a special case remembering if the spreadsheet name is being edited.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        const state = this.state;
        console.log("componentDidUpdate", "prevState", prevState, "state", state);

        const hash = []; // spreadsheet-id / spreadsheet-name / cell / cell-reference / formula
        this.onSpreadsheetMetadataSpreadsheetId(prevState, hash);
        this.onSpreadsheetMetadataSpreadsheetName(hash);
        this.onSpreadsheetViewport(prevState);
        this.onSpreadsheetFormula(hash);
        this.onSpreadsheetDrawer(hash);

        // special case restore /name/edit if spreadsheet name is being edited.
        if(hash.length >= 2) {
            const spreadsheetNameWidget = this.spreadsheetName.current;
            if(spreadsheetNameWidget && spreadsheetNameWidget.isEdit()) {
                hash.length = 2;
                hash.push("name", "edit");
            }
        }

        const open = state.settingsAndToolsDrawer;
        if(open) {
            hash.push(""); // append !
        }
        const settingsAndToolsDrawer = this.settingsAndToolsDrawer.current;
        settingsAndToolsDrawer && settingsAndToolsDrawer.setState({open: open});

        this.historyPush(hash, "State updated from ", prevState, "to", state);
    }

    /**
     * If spreadsheet id changed clear caches related to the previous spreadsheet.
     */
    onSpreadsheetMetadataSpreadsheetId(prevState, hash) {
        const previous = prevState.spreadsheetMetadata.get(SpreadsheetMetadata.SPREADSHEET_ID);
        const current = this.state.spreadsheetMetadata.get(SpreadsheetMetadata.SPREADSHEET_ID);

        if (!Equality.safeEquals(current, previous)) {
            console.log("spreadsheetId changed from " + previous + " to " + current + " clearing state cell, columnWidths, rowHeight (caches)");
            this.setState({
                createEmptySpreadsheet: false,
                spreadsheetEngineEvaluation: SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY,
                cells: ImmutableMap.EMPTY,
                columnWidths: ImmutableMap.EMPTY,
                rowHeights: ImmutableMap.EMPTY,
            });
        }
        hash[0] = current; // spreadsheetId
    }

    /**
     * Updates the SpreadsheetNameWidget whenever metadata is updated.
     */
    onSpreadsheetMetadataSpreadsheetName(hash) {
        const metadata = this.state.spreadsheetMetadata;
        const widget = this.spreadsheetName.current;
        const name = metadata.get(SpreadsheetMetadata.SPREADSHEET_NAME);

        if (widget && !Equality.safeEquals(name, widget.state.value)) {
            console.log("onSpreadsheetMetadataSpreadsheetName updated from " + widget.state.value + " to " + name);

            widget.setState({
                value: name,
            });
            document.title = name.toString();
        } else {
            console.log("onSpreadsheetMetadataSpreadsheetName widget not updated", "widget", widget.current, "name: " + name);
        }

        hash[1] = name; // spreadsheetId/spreadsheetName
    }

    /**
     * Update the viewport after computing the viewport metrics.
     */
    onSpreadsheetViewport(prevState) {
        const state = this.state;

        const metadata = state.spreadsheetMetadata;
        const viewportCell = metadata.get(SpreadsheetMetadata.VIEWPORT_CELL);
        const viewportCoordinates = metadata.get(SpreadsheetMetadata.VIEWPORT_COORDINATES);
        const windowDimensions = state.windowDimensions;
        const aboveViewportDimensions = state.aboveViewportDimensions;

        const viewport = this.viewport.current;

        if (viewportCell && viewportCoordinates && windowDimensions && aboveViewportDimensions && viewport) {
            viewport.setState({
                home: viewportCell,
                cells: state.cells,
                columnWidths: state.columnWidths,
                rowHeights: state.rowHeights,
                editCell: metadata.get(SpreadsheetMetadata.EDIT_CELL),
                defaultStyle: metadata.get(SpreadsheetMetadata.STYLE),
            });
            const previous = viewport.state.dimensions;
            const width = windowDimensions.width;
            const height = windowDimensions.height - aboveViewportDimensions.height;

            if (previous.width !== width || previous.height !== height) {
                viewport.setState({
                    dimensions: {
                        width: width,
                        height: height,
                    }
                });

                const previousMetadata = prevState.spreadsheetMetadata;
                const previousViewportCell = previousMetadata && previousMetadata.get(SpreadsheetMetadata.VIEWPORT_CELL);

                if ((width > previous.width || height > previous.height) && (viewportCell.equals(previousViewportCell) || !previousViewportCell)) {
                    this.onCellBoxViewportRangeUpdate(
                        new SpreadsheetCellBox(viewportCell,
                            viewportCoordinates.x(),
                            viewportCoordinates.y(),
                            width,
                            height)
                    );
                }
            }
        }
    }

    /**
     * Updates the state of the formula widget so it matches the metadata editCell
     */
    onSpreadsheetFormula(hash) {
        const metadata = this.state.spreadsheetMetadata;
        const formula = this.formula.current;
        const reference = metadata.get(SpreadsheetMetadata.EDIT_CELL);

        console.log("onSpreadsheetFormula", "formula", formula.current, "metadata", metadata);

        if (formula) {
            const width = this.appBarWidth();
            this.formulaContainer.current.setState({
                style: {
                    margin: 0,
                    border: 0,
                    padding: 0,
                    width: width,
                }
            });

            if (reference) {
                const cell = this.getCellOrEmpty(reference);
                formula.setValue = this.cellToFormulaTextSetter(cell);

                const formulaText = this.cellToFormulaText(cell);

                console.log("onSpreadsheetFormula " + reference + " formula text=" + formulaText + " width: " + width);
                formula.setState({
                    value: formulaText,
                    reference: reference,
                });
            } else {
                formula.setState({
                    value: null,
                    reference: null,
                });
            }
        }

        if (reference) {
            hash[2] = "cell";
            hash[3] = reference;
            hash[4] = FORMULA_EDIT_HASH;
        }
    }

    // COORDINATES......................................................................................................

    onSpreadsheetCoordinates(json) {
        this.setState({
            viewportCoordinates: SpreadsheetCoordinates.fromJson(json),
        });
    }

    // VIEWPORT ........................................................................................................

    /**
     * Returns the viewport dimensions of the area allocated to the cells.
     */
    viewportDimensions() {
        const viewport = this.viewport.current;
        return (viewport && viewport.state.dimensions) || {
            width: 0,
            height: 0,
        };
    }

    /**
     * Accepts {@link SpreadsheetCellBox} and requests the {@link SpreadsheetRange} that fill the content.
     */
    onCellBoxViewportRangeUpdate(cellBox) {
        console.log("onCellBoxViewportRangeUpdate " + cellBox);

        this.messenger.send(
            this.spreadsheetMetadataApiUrl() + "/viewport/" + cellBox.viewport(),
            {
                method: "GET"
            },
            this.onSpreadsheetRange.bind(this),
            error
        );
    }

    // RANGE............................................................................................................

    /**
     * Handles a range response which contains the range of cells that fill the viewport for the home cell and dimensions
     * of the viewport area.
     */
    onSpreadsheetRange(json) {
        this.setState({
            viewportRange: SpreadsheetRange.fromJson(json),
        });
    }

    // CELL.............................................................................................................

    /**
     * Accepts the {@link SpreadsheetRange} returned by {@link #spreadsheetViewport} and then loads all the cells in the
     * range
     */
    loadSpreadsheetCellOrRange(selection) {
        console.log("loadSpreadsheetCellOrRange " + selection);

        const evaluation = this.state.spreadsheetEngineEvaluation || SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY;

        this.messenger.send(
            this.spreadsheetCellApiUrl(selection) + "/" + evaluation,
            {
                method: "GET"
            },
            this.onSpreadsheetDelta.bind(this),
            error
        );
    }

    /**
     * Saves the given cell. Eventually the returned value will trigger a re-render.
     */
    saveSpreadsheetCell(cell) {
        const reference = cell.reference();

        if (cell.equals(this.state.cells.get(reference))) {
            console.log("saveSpreadsheetCell cell unchanged save skipped", cell);
        } else {
            console.log("saveSpreadsheetCell", cell);

            this.messenger.send(this.spreadsheetCellApiUrl(cell.reference()),
                {
                    method: "POST",
                    body: JSON.stringify(new SpreadsheetDelta([cell],
                        ImmutableMap.EMPTY,
                        ImmutableMap.EMPTY,
                        [this.state.viewportRange])
                        .toJson()),
                },
                this.onSpreadsheetDelta.bind(this),
                error
            );
        }
    }

    /**
     * Returns a URL with the spreadsheet id and ONLY the provided cell selection.
     */
    spreadsheetCellApiUrl(selection) {
        return this.spreadsheetMetadataApiUrl() + "/cell/" + selection;
    }

    /**
     * Handles spreadsheet delta responses, resulting from cell saves or loads.
     */
    onSpreadsheetDelta(json) {
        const delta = SpreadsheetDelta.fromJson(json);
        const state = this.state;
        this.setState({ // lgtm [js/react/inconsistent-state-update]
            cells: state.cells.set(delta.referenceToCellMap()),
            columnWidths: state.columnWidths.set(delta.maxColumnWidths()),
            rowHeights: state.rowHeights.set(delta.maxRowHeights()),
        });
    }

    /**
     * This is called whenever a cell is clicked or selected for editing and may be used to stop editing a cell.
     */
    editCell(reference) {
        console.log("editCell " + reference);

        const metadata = this.spreadsheetMetadata();
        const metadataEditCell = metadata.get(SpreadsheetMetadata.EDIT_CELL);

        if (Equality.safeEquals(reference, metadataEditCell)) {
            if (reference) {
                // focus cell again
                const formula = this.formula.current;
                formula && formula.focus();
            }
        } else {
            this.saveSpreadsheetMetadata(reference ?
                metadata.set(SpreadsheetMetadata.EDIT_CELL, reference) :
                metadata.remove(SpreadsheetMetadata.EDIT_CELL));

            if(reference) {
                this.editSpreadsheetName(); // stop editing spreadsheet name
            }
        }
    }

    // SpreadsheetFormula...............................................................................................

    /**
     * Returns the formula text to be edited or undefined.
     */
    cellToFormulaText(cell) {
        return (cell && cell.formula().text()) || "";
    }

    /**
     * Returns a function that updates the value of a {@link SpreadsheetFormula} triggering a cell reload.
     */
    cellToFormulaTextSetter(cell) {
        var setter;

        if (cell) {
            const formula = cell.formula();
            setter = (text) => this.saveSpreadsheetCell(cell.setFormula(formula.setText(text)));
        }
        return setter;
    }

    /**
     * Fetches the cell by the given reference or returns an empty {@link SpreadsheetCell}.
     */
    getCellOrEmpty(reference) {
        return this.state.cells.get(reference) || new SpreadsheetCell(reference, new SpreadsheetFormula(""), TextStyle.EMPTY);
    }

    // drawer...........................................................................................................

    /**
     * Shows or hides the drawer on the right which holds a variety of settings and context aware tools.
     */
    settingsAndToolsDrawerOpen(open) {
        console.log("settingsAndToolsDrawerOpen " + open);

        this.setState({
            settingsAndToolsDrawer: open,
        });
    }

    /**
     * Toggles the drawer and updates the history
     */
    settingsAndToolsDrawerToggleAndUpdateHistory() {
        this.settingsAndToolsDrawerOpenAndUpdateHistory(!this.state.settingsAndToolsDrawer);
    }

    /**
     * Shows or hides the drawer and updates the history hash.
     */
    settingsAndToolsDrawerOpenAndUpdateHistory(open) {
        this.settingsAndToolsDrawerOpen(open);

        const metadata = this.state.spreadsheetMetadata;
        this.historyPush([metadata.get(SpreadsheetMetadata.SPREADSHEET_ID), metadata.get(SpreadsheetMetadata.SPREADSHEET_NAME), open ? "" : null], "settingsAndToolsDrawer " + (open ? "opened" : "closed"));
    }

    /**
     * Handles updates to the state and hash.
     */
    onSpreadsheetDrawer(hash) {
        const widget = this.settingsAndToolsDrawer.current;
        if (widget) {
            const state = this.state;
            widget.setState({
                spreadsheetMetadata: state.spreadsheetMetadata,
            });
        }
    }

    // rendering........................................................................................................

    /**
     * Renders the basic spreadsheet layout.
     */
    render() {
        const {classes} = this.props;

        const state = this.state;
        console.log("render", state);

        const settingsAndToolsDrawer = state.settingsAndToolsDrawer;

        const metadata = this.spreadsheetMetadata();

        const spreadsheetName = metadata.get(SpreadsheetMetadata.SPREADSHEET_NAME);

        const style = metadata.get(SpreadsheetMetadata.STYLE);
        const {cells, columnWidths, rowHeights} = state;

        const viewportDimensions = this.viewportDimensions();
        const viewportCell = metadata.get(SpreadsheetMetadata.VIEWPORT_CELL);

        const editCellReference = metadata.get(SpreadsheetMetadata.EDIT_CELL); // SpreadsheetCellReference: may be undefined,
        const editCell = editCellReference && this.getCellOrEmpty(editCellReference);

        const appBarWidth = this.appBarWidth();
        const formulaText = this.cellToFormulaText(editCell);
        return (
            <WindowResizer dimensions={this.onWindowResized.bind(this)}>
                <SpreadsheetBox ref={this.aboveViewport}
                                key={{windowDimensions: state.windowDimensions}}
                                dimensions={this.onAboveViewportResize.bind(this)}
                                className={classes.header}
                    >
                    <SpreadsheetAppBar menuClickListener={this.settingsAndToolsDrawerToggleAndUpdateHistory.bind(this)}>
                        <SpreadsheetNameWidget ref={this.spreadsheetName}
                                               key={spreadsheetName}
                                               value={spreadsheetName}
                                               setValue={this.saveSpreadsheetName.bind(this)}
                                               setEdit={this.editSpreadsheetNameAndUpdateHistory.bind(this)}
                        />
                    </SpreadsheetAppBar>
                    <SpreadsheetContainerWidget
                        ref={this.formulaContainer}
                        style={{
                        margin: 0,
                        border: 0,
                        padding: 0,
                        width: appBarWidth + "px",
                    }}>
                        <SpreadsheetFormulaWidget ref={this.formula}
                                                  key={[editCellReference, formulaText]}
                                                  reference={editCellReference}
                                                  value={formulaText}
                                                  setValue={editCellReference && this.cellToFormulaTextSetter(editCell)}
                        />
                    </SpreadsheetContainerWidget>
                    <Divider/>
                </SpreadsheetBox>
                <SpreadsheetViewportWidget key={[viewportDimensions, cells, columnWidths, rowHeights, style, viewportCell, editCell]}
                                           ref={this.viewport}
                                           dimensions={viewportDimensions}
                                           cells={cells}
                                           columnWidths={columnWidths}
                                           rowHeights={rowHeights}
                                           defaultStyle={style}
                                           home={viewportCell}
                                           editCell={editCell}
                                           editCellSetter={this.editCell.bind(this)}
                />
                <SpreadsheetDrawerWidget ref={this.settingsAndToolsDrawer}
                                         open={settingsAndToolsDrawer}
                                         onClose={this.settingsAndToolsDrawerOpenAndUpdateHistory.bind(this)}
                                         width={DRAWER_WIDTH}
                                         spreadsheetMetadata={metadata}
                />
            </WindowResizer>
        );
    }

    // resizing.........................................................................................................

    /**
     * Updates the state windowDimensions which will triggers a redraw of the spreadsheet content and reloading of
     * the viewport cells
     */
    onWindowResized(dimensions) {
        console.log("onWindowResized", dimensions);

        this.setState({
            windowDimensions: dimensions,
        });

        this.aboveViewport.current.fireResize();
    }

    /**
     * Fired whenever the header and other tools above the cells viewport know their new size
     */
    onAboveViewportResize(dimensions) {
        console.log("onAboveViewportResize", dimensions);

        this.setState({
            aboveViewportDimensions: dimensions,
        });
    }

    /**
     * Computes the visible width of the app bar less if the settings/tool drawer if it is visible.
     */
    appBarWidth() {
        const state = this.state;
        const aboveViewportDimensions = state.aboveViewportDimensions;

        return aboveViewportDimensions ?
            (aboveViewportDimensions.width -  (state.settingsAndToolsDrawer ? DRAWER_WIDTH : 0)) + "px" :
            "";
    }

    // SpreadsheetMetadata..............................................................................................
    /**
     * Makes a request which returns some basic default metadata, and without cells the spreadsheet will be empty.
     */
    createEmptySpreadsheet() {
        console.log("createEmptySpreadsheet");

        this.setState({
            createEmptySpreadsheet: true,
        });

        this.messenger.send(
            "/api/spreadsheet",
            {
                method: "POST"
            },
            this.onSpreadsheetMetadata.bind(this),
            error
        );
    }

    /**
     * Uses the provided spreadsheetid or falls back to the current {@Link SpreadsheetMetadata} spreadsheet id
     */
    spreadsheetMetadataApiUrl(spreadsheetId) {
        const id = spreadsheetId || this.spreadsheetMetadata().get(SpreadsheetMetadata.SPREADSHEET_ID);
        if (!id) {
            throw new Error("Missing spreadsheetId parameter and current SpreadsheetMetadata.spreadsheetId");
        }
        if (typeof id !== "string") {
            throw new Error("Expected string spreadsheetId got " + id);
        }
        return "/api/spreadsheet/" + id;
    }

    spreadsheetMetadata() {
        return this.state.spreadsheetMetadata;
    }

    /**
     * Loads the spreadsheet metadata with the given spreadsheet id.
     */
    // TODO handle unknown spreadsheet id
    loadSpreadsheetMetadata(id) {
        console.log("loadSpreadsheetMetadata " + id);

        this.messenger.send(
            this.spreadsheetMetadataApiUrl(id),
            {
                method: "GET",
            },
            this.onSpreadsheetMetadata.bind(this),
            error
        );
    }

    /**
     * If the new metadata is different call the save service otherwise skip.
     */
    saveSpreadsheetMetadata(metadata) {
        if (metadata.equals(this.spreadsheetMetadata())) {
            console.log("saveSpreadsheetMetadata unchanged, save skipped", metadata);
        } else {
            console.log("saveSpreadsheetMetadata", metadata);

            this.messenger.send(
                this.spreadsheetMetadataApiUrl(),
                {
                    method: "POST",
                    body: JSON.stringify(metadata.toJson())
                },
                this.onSpreadsheetMetadata.bind(this),
                error
            );
        }
    }

    saveSpreadsheetName(name) {
        this.saveSpreadsheetMetadata(this.state.spreadsheetMetadata.set(SpreadsheetMetadata.SPREADSHEET_NAME, name));
    }

    /**
     * Handles the response.json which contains a SpreadsheetMetadata.
     */
    onSpreadsheetMetadata(json) {
        this.setState({
            createEmptySpreadsheet: false, // cancel any wait for a create, this stops history/state checks from failing and creating again and again
            spreadsheetMetadata: SpreadsheetMetadata.fromJson(json)
        });
    }

    // toString.........................................................................................................

    toString() {
        return this.spreadsheetMetadata().toString();
    }
}

export default withRouter(withStyles(useStyles)(App));

function error(message) {
    alert(message);
}