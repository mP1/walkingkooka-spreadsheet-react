import React from 'react';
import {withRouter} from "react-router";
import './App.css';

import SpreadsheetAppBarTop from "./widget/SpreadsheetAppBarTop.js";
import SpreadsheetViewportWidget from "./widget/SpreadsheetViewportWidget.js";
import SpreadsheetFormulaWidget from "./spreadsheet/SpreadsheetFormulaWidget.js";
import SpreadsheetMetadata from "./spreadsheet/meta/SpreadsheetMetadata.js";
import SpreadsheetMessenger from "./util/SpreadsheetMessenger.js";

import Divider from '@material-ui/core/Divider';
import SpreadsheetCellBox from "./spreadsheet/reference/SpreadsheetCellBox";
import SpreadsheetCoordinates from "./spreadsheet/SpreadsheetCoordinates";
import SpreadsheetRange from "./spreadsheet/reference/SpreadsheetRange";
import SpreadsheetDelta from "./spreadsheet/engine/SpreadsheetDelta";
import SpreadsheetEngineEvaluation from "./spreadsheet/engine/SpreadsheetEngineEvaluation";
import SpreadsheetBox from "./widget/SpreadsheetBox";
import WindowResizer from "./widget/WindowResizer";
import ImmutableMap from "./util/ImmutableMap";
import SpreadsheetCell from "./spreadsheet/SpreadsheetCell";
import SpreadsheetFormula from "./spreadsheet/SpreadsheetFormula";
import TextStyle from "./text/TextStyle.js";
import SpreadsheetNameWidget from "./spreadsheet/SpreadsheetNameWidget.js";
import Equality from "./Equality.js";
import SpreadsheetName from "./spreadsheet/SpreadsheetName.js";
import SpreadsheetCellReference from "./spreadsheet/reference/SpreadsheetCellReference.js";
import HistoryHash from "./util/HistoryHash.js";

/**
 * History token noting that a cell formula is being edited.
 */
const FORMULA_EDIT_HASH = "formula";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.history = props.history;

        this.state = {
            spreadsheetEngineEvaluation: SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY,
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY,
            cells: ImmutableMap.EMPTY,
            columnWidths: ImmutableMap.EMPTY,
            rowHeights: ImmutableMap.EMPTY,
            windowDimensions: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
        }

        // the names must match the Class.getSimpleName in walkingkooka-spreadsheet
        this.messenger = new SpreadsheetMessenger({
            "SpreadsheetCellBox": json => this.onCellBoxViewportRangeUpdate(SpreadsheetCellBox.fromJson(json)),
            "SpreadsheetCoordinates": json => this.setState({viewportCoordinates: SpreadsheetCoordinates.fromJson(json)}),
            "SpreadsheetDelta": json => {
                const delta = SpreadsheetDelta.fromJson(json);
                const state = this.state;
                this.setState({
                    cells: state.cells.set(delta.referenceToCellMap()),
                    columnWidths: state.columnWidths.set(delta.maxColumnWidths()),
                    rowHeights: state.rowHeights.set(delta.maxRowHeights()),
                });
            },
            "SpreadsheetMetadata": json => this.setState({
                createEmptySpreadsheet: false, // cancel any wait for a create, this stops history/state checks from failing and creating again and again
                spreadsheetMetadata: SpreadsheetMetadata.fromJson(json)
            }),
            "SpreadsheetRange": json => this.setState({viewportRange: SpreadsheetRange.fromJson(json)}),
        });

        this.messenger.setWebWorker(false); // TODO test webworker mode

        this.spreadsheetName = React.createRef();
        this.formula = React.createRef();
        this.viewport = React.createRef();
    }

    // app lifecycle....................................................................................................

    /**
     * Makes a request which returns some basic default metadata, and without cells the spreadsheet will be empty.
     */
    createEmptySpreadsheet() {
        console.log("createEmptySpreadsheet");

        this.setState({
           createEmptySpreadsheet: true,
        });

        this.messenger.send("/api/spreadsheet",
            {
                method: "POST"
            });
    }

    // history lifecycle................................................................................................

    /**
     * Fired whenever the browser hash changes.
     */
    onHistoryChange(location) {
        const pathname = location.pathname;
        console.log("onHistoryChange " + pathname, location);

        this.historyHashVerify(pathname);
    }

    currentHistoryHashVerify() {
        const location = this.history.location;
        const pathname = location.pathname;
        console.log("currentHistoryHashVerify " + pathname, "location", location, "state", this.state);

        this.historyHashVerify(pathname);
    }

    historyHashVerify(pathname) {
        // wait until sizes are known then check hash against state.
        if(this.mounted) {
            const state = this.state;
            const metadata = state.spreadsheetMetadata;
            const createEmptySpreadsheet = state.createEmptySpreadsheet;

            const {spreadsheetId, spreadsheetName, cellReference, action} = HistoryHash.parse(pathname);
            console.log("historyHashVerify " + pathname, "spreadsheetId", spreadsheetId, "spreadsheetName", spreadsheetName, "cell", cellReference, "action", action, "metadata", metadata, "createEmptySpreadsheet", createEmptySpreadsheet);

            // each method returns true if no history/state change happened allowing the next method to execute
            !createEmptySpreadsheet &&
            this.historySpreadsheetIdCreateEmptyOrLoadOrNothing(spreadsheetId, metadata) &&
            this.historySpreadsheetNameDifferentUpdateHistory(spreadsheetName, metadata) &&
            this.historyCellActionUpdate(cellReference, action, metadata);
        }
    }

    /**
     * Tests if the given spreadsheetId is different from the existing, creating or loading an existing new spreadsheet and return false.
     * The history is not changed.
     */
    historySpreadsheetIdCreateEmptyOrLoadOrNothing(spreadsheetId, metadata) {
        // if already loading dont check if hash matches state
        const previous = metadata.spreadsheetId();
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
    historySpreadsheetNameDifferentUpdateHistory(hashName, metadata) {
        var hashSpreadsheetName;
        try {
            hashSpreadsheetName = new SpreadsheetName(hashName);
        } catch (invalidName) {
        }

        const metadataSpreadsheetName = metadata.spreadsheetName();
        const same = Equality.safeEquals(hashSpreadsheetName, metadataSpreadsheetName);
        if (!same) {
            // update url to match actual SpreadsheetMetadata.spreadsheetName
            this.historyPush([metadata.spreadsheetId(), metadataSpreadsheetName],
                "History hash updating from " + hashName + " to match state " + metadataSpreadsheetName);
        }
        return same;
    }

    /**
     * If the cell is invalid reset the history hash to $spreadsheetId / $spreadsheetName.
     * When the cell reference is valid, verify the action, if either changed update the history to $spreadsheetId / $spreadsheetName / $cell / $action
     */
    historyCellActionUpdate(cell, action, metadata) {
        var clearHistoryCellAction = true; // only leave if both are valid.

        if (cell && action) {
            // cell and action present validate the combination.
            try {
                const hashSpreadsheetCellReference = SpreadsheetCellReference.parse(cell);

                switch (action) {
                    case FORMULA_EDIT_HASH:
                        // state does not match hash, update state.
                        const metadataEditCell = metadata.editCell();
                        if (!Equality.safeEquals(cell, metadataEditCell)) {
                            this.setState({
                                spreadsheetMetadata: metadata.setEditCell(hashSpreadsheetCellReference),
                            });
                        }
                        clearHistoryCellAction = false;
                        break;
                    default:
                        // invalid action update history clearing cell/action.
                        clearHistoryCellAction = true;
                        break;
                }
            } catch (invalidCellReference) {
            }
        }

        if(clearHistoryCellAction) {
            if(metadata.editCell()) {
                console.log("History hash invalid clearing editCell", metadata);

                this.setState({
                    spreadsheetMetadata: metadata.removeEditCell(),
                });
            }

            this.historyPush([metadata.spreadsheetId(), metadata.spreadsheetName()],
                "Invalid hash cell reference or action, clearing cell/action (" + cell + "/" + action + ")");
        }
    }

    /**
     * If the location is new log the message and push the history token.
     */
    historyPush(tokens, message) {
        // find the first undefined and ignore following tokens.
        for(var i = 0; i < tokens.length; i++) {
            if(!tokens[i]) {
                tokens = tokens.slice(0, i);
                break;
            }
        }

        const location = HistoryHash.concat(tokens);
        if (!message) {
            throw new Error("Missing message");
        }
        if (typeof message !== "string") {
            throw new Error("Expected String message got " + message);
        }

        const history = this.history;
        if (history.location.pathname !== location) {
            console.log(message);
            this.history.push(location);
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
     * Computes and returns the cell viewport dimensions. This should be called whenever the window or header size changes.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        const state = this.state;
        console.log("componentDidUpdate", "prevState", prevState, "state", state);

        const hash = {};
        this.onSpreadsheetMetadataSpreadsheetId(prevState, hash);
        this.onSpreadsheetMetadataSpreadsheetName(hash);
        this.onSpreadsheetViewport(prevState);
        this.onSpreadsheetFormula(hash);

        const {spreadsheetId, spreadsheetName, cellReference, action} = hash;
        this.historyPush([spreadsheetId, spreadsheetName, cellReference, action], "state updated");
    }

    /**
     * If spreadsheet id changed clear caches related to the previous spreadsheet.
     */
    onSpreadsheetMetadataSpreadsheetId(prevState, hash) {
        const previous = prevState.spreadsheetMetadata.spreadsheetId();
        const current = this.state.spreadsheetMetadata.spreadsheetId();

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
        hash.spreadsheetId = current;
    }

    /**
     * Updates the SpreadsheetNameWidget whenever metadata is updated.
     */
    onSpreadsheetMetadataSpreadsheetName(hash) {
        const metadata = this.state.spreadsheetMetadata;
        const widget = this.spreadsheetName.current;
        const name = metadata.spreadsheetName();

        if (widget && name) {
            console.log("onSpreadsheetMetadataSpreadsheetName updated from " + widget.state.value + " to ", metadata);

            widget.setState({
                value: name,
            });
        } else {
            console.log("onSpreadsheetMetadataSpreadsheetName widget not updated", "widget", widget.current, "state.metadata", metadata);
        }

        hash.spreadsheetName = name;
    }

    /**
     * Update the viewport after computing the viewport metrics.
     */
    onSpreadsheetViewport(prevState) {
        const state = this.state;

        const metadata = state.spreadsheetMetadata;
        const viewportCell = metadata.viewportCell();
        const viewportCoordinates = metadata.viewportCoordinates();
        const windowDimensions = state.windowDimensions;
        const aboveViewportDimensions = state.aboveViewportDimensions;

        const viewport = this.viewport.current;

        if (viewportCell && viewportCoordinates && windowDimensions && aboveViewportDimensions && viewport) {
            viewport.setState({
                home: viewportCell,
                cells: state.cells,
                columnWidths: state.columnWidths,
                rowHeights: state.rowHeights,
                editCell: metadata.editCell(),
                defaultStyle: metadata.style(),
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
                const previousViewportCell = previousMetadata && previousMetadata.viewportCell();

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
        const reference = metadata.editCell();

        console.log("onSpreadsheetFormula", "formula", formula.current, "metadata", metadata);

        if (formula) {
            if (reference) {
                const cell = this.getCellOrEmpty(reference);
                formula.setValue = this.cellToFormulaTextSetter(cell);

                const formulaText = this.cellToFormulaText(cell);

                console.log("onSpreadsheetFormula " + reference + " formula text=" + formulaText);

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

        if(reference) {
            hash.cellReference = reference;
            hash.action = FORMULA_EDIT_HASH;
        }
    }

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

        this.messenger.send(this.spreadsheetMetadataApiUrl() + "/viewport/" + cellBox.viewport(),
            {
                method: "GET"
            });
    }

    /**
     * Accepts the {@link SpreadsheetRange} returned by {@link #spreadsheetViewport} and then loads all the cells in the
     * range
     */
    loadSpreadsheetCellOrRange(selection) {
        console.log("loadSpreadsheetCellOrRange " + selection);

        const evaluation = this.state.spreadsheetEngineEvaluation || SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY;

        this.messenger.send(this.spreadsheetCellApiUrl(selection) + "/" + evaluation,
            {
                method: "GET"
            });
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
                });
        }
    }

    /**
     * Returns a URL with the spreadsheet id and ONLY the provided cell selection.
     */
    spreadsheetCellApiUrl(selection) {
        return this.spreadsheetMetadataApiUrl() + "/cell/" + selection;
    }

    /**
     * This is called whenever a cell is clicked or selected for editing.
     */
    editCell(reference) {
        console.log("setEditCell " + reference);

        const metadata = this.spreadsheetMetadata();
        if (reference.equals(metadata.editCell())) {
            const formula = this.formula.current;
            formula && formula.focus();
        } else {
            this.saveSpreadsheetMetadata(metadata.setEditCell(reference));
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

    // rendering........................................................................................................

    /**
     * Renders the basic spreadsheet layout.
     */
    render() {
        const state = this.state;
        console.log("render", state);

        const metadata = this.spreadsheetMetadata();

        const spreadsheetName = metadata.spreadsheetName();

        const style = metadata.style();
        const {cells, columnWidths, rowHeights} = state;

        const viewportDimensions = this.viewportDimensions();
        const viewportCell = metadata.viewportCell();

        const editCellReference = metadata.editCell(); // SpreadsheetCellReference: may be undefined,
        const editCell = editCellReference && this.getCellOrEmpty(editCellReference);

        const formulaText = this.cellToFormulaText(editCell);
        return (
            <WindowResizer dimensions={this.onWindowResized.bind(this)}>
                <SpreadsheetBox key={"above-viewport"}
                                dimensions={this.onAboveViewportResize.bind(this)}>
                    <SpreadsheetAppBarTop>
                        <SpreadsheetNameWidget ref={this.spreadsheetName}
                                               key={spreadsheetName}
                                               value={spreadsheetName}
                                               setValue={this.saveSpreadsheetName.bind(this)}
                        />
                    </SpreadsheetAppBarTop>
                    <Divider/>
                    <SpreadsheetFormulaWidget ref={this.formula}
                                              key={[editCellReference, formulaText]}
                                              reference={editCellReference}
                                              value={formulaText}
                                              setValue={editCellReference && this.cellToFormulaTextSetter(editCell)}/>
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

    // SpreadsheetMetadata..............................................................................................

    /**
     * Uses the provided spreadsheetid or falls back to the current {@Link SpreadsheetMetadata} spreadsheet id
     */
    spreadsheetMetadataApiUrl(spreadsheetId) {
        const id = spreadsheetId || this.spreadsheetMetadata().spreadsheetId();
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

        this.messenger.send(this.spreadsheetMetadataApiUrl(id), {
            method: "GET",
        });
    }

    /**
     * If the new metadata is different call the save service otherwise skip.
     */
    saveSpreadsheetMetadata(metadata) {
        if (metadata.equals(this.spreadsheetMetadata())) {
            console.log("saveSpreadsheetMetadata unchanged, save skipped", metadata);
        } else {
            console.log("saveSpreadsheetMetadata", metadata);

            this.messenger.send(this.spreadsheetMetadataApiUrl(), {
                method: "POST",
                body: JSON.stringify(metadata.toJson())
            });
        }
    }

    saveSpreadsheetName(name) {
        this.saveSpreadsheetMetadata(this.state.spreadsheetMetadata.setSpreadsheetName(name));
    }

    // toString.........................................................................................................

    toString() {
        return this.spreadsheetMetadata().toString();
    }
}

export default withRouter(App);