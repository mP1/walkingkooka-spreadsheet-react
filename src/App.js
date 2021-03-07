import {withRouter} from "react-router";
import './App.css';

import {withStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Equality from "./Equality.js";
import ImmutableMap from "./util/ImmutableMap";
import React from 'react';
import SpreadsheetAppBar from "./widget/SpreadsheetAppBar.js";
import SpreadsheetBox from "./widget/SpreadsheetBox";
import SpreadsheetCell from "./spreadsheet/SpreadsheetCell";
import SpreadsheetCellBox from "./spreadsheet/reference/SpreadsheetCellBox";
import SpreadsheetContainerWidget from "./widget/SpreadsheetContainerWidget.js";
import SpreadsheetCoordinates from "./spreadsheet/SpreadsheetCoordinates.js";
import SpreadsheetDelta from "./spreadsheet/engine/SpreadsheetDelta";
import SpreadsheetEngineEvaluation from "./spreadsheet/engine/SpreadsheetEngineEvaluation";
import SpreadsheetFormula from "./spreadsheet/SpreadsheetFormula";
import SpreadsheetFormulaWidget from "./spreadsheet/SpreadsheetFormulaWidget.js";
import SpreadsheetHistoryHash from "./spreadsheet/history/SpreadsheetHistoryHash.js";
import SpreadsheetMetadata from "./spreadsheet/meta/SpreadsheetMetadata.js";
import SpreadsheetMessenger from "./spreadsheet/message/SpreadsheetMessenger.js";
import SpreadsheetNameWidget from "./spreadsheet/SpreadsheetNameWidget.js";
import SpreadsheetNotification from "./spreadsheet/notification/SpreadsheetNotification.js";
import SpreadsheetNotificationWidget from "./spreadsheet/notification/SpreadsheetNotificationWidget.js";
import SpreadsheetRange from "./spreadsheet/reference/SpreadsheetRange";
import SpreadsheetSettingsWidget from "./spreadsheet/settings/SpreadsheetSettingsWidget.js";
import SpreadsheetViewportWidget from "./widget/SpreadsheetViewportWidget.js";
import TextStyle from "./text/TextStyle.js";
import WindowResizer from "./widget/WindowResizer";

const useStyles = theme => ({
    header: {
        zIndex: theme.zIndex.settings + 1, // forces settings to not overlap application header
    },
});

class App extends React.Component {
    constructor(props) {
        super(props);

        this.history = props.history;

        this.state = {
            createEmptySpreadsheet: false,
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

        this.notification = React.createRef();
        this.settings = React.createRef();
        this.aboveViewport = React.createRef();
        this.spreadsheetName = React.createRef();
        this.formula = React.createRef();
        this.formulaContainer = React.createRef(); // a container that includes the formula text box. Will include other related tools
        this.viewport = React.createRef();

        document.title = "Empty spreadsheet";
    }

    // history lifecycle................................................................................................

    /**
     * Fired whenever the browser hash changes.
     */
    onHistoryChange(location) {
        const tokens = SpreadsheetHistoryHash.parse(location.pathname);
        this.historyUpdateFromState(tokens);
        this.onHistoryChangeUpdateEditCell(tokens);
    }

    /**
     * Updates the history to match the state spreadsheet id and spreadsheet name.
     */
    historyUpdateFromState(tokens) {
        if(this.mounted){
            const state = this.state;
            const metadata = state.spreadsheetMetadata;
            const createEmptySpreadsheet = state.createEmptySpreadsheet;

            if(!createEmptySpreadsheet){
                var replacements = {};

                const spreadsheetId = tokens[SpreadsheetHistoryHash.SPREADSHEET_ID];

                if(this.historySpreadsheetIdCreateEmptyOrLoadOrNothing(spreadsheetId, metadata)){
                    replacements[SpreadsheetHistoryHash.SPREADSHEET_ID] = spreadsheetId;
                    replacements[SpreadsheetHistoryHash.SPREADSHEET_NAME] = metadata.get(SpreadsheetMetadata.SPREADSHEET_NAME);
                }

                const history = this.history;
                const current = history.location.pathname;
                const updatedPathname = SpreadsheetHistoryHash.merge(
                    tokens,
                    replacements,
                );
                if(current !== updatedPathname){
                    history.push(updatedPathname);
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

        if(same){
            if(!previous){
                console.log("history hash spreadsheetId missing creating initial empty spreadsheet");
                this.createEmptySpreadsheet();
            }
        }else {
            console.log("history hash spreadsheetId changed from " + previous + " to " + spreadsheetId);

            // load the spreadsheet with $spreadsheetId or create a new spreadsheet if missing.
            if(spreadsheetId){
                this.loadSpreadsheetMetadata(spreadsheetId);
            }else {
                this.createEmptySpreadsheet();
            }
        }

        return same;
    }

    /**
     * Update and save the metadata if the history hash cell is different.
     */
    onHistoryChangeUpdateEditCell(tokens) {
        const reference = tokens[SpreadsheetHistoryHash.CELL];
        const metadata = this.spreadsheetMetadata();

        this.saveSpreadsheetMetadata(reference ?
            metadata.set(SpreadsheetMetadata.EDIT_CELL, reference) :
            metadata.remove(SpreadsheetMetadata.EDIT_CELL)
        );
    }

    // component lifecycle..............................................................................................

    componentDidMount() {
        console.log("App mounted");
        this.mounted = true;

        const history = this.history;
        this.historyUnlisten = history.listen(this.onHistoryChange.bind(this));
        this.historyUpdateFromState(SpreadsheetHistoryHash.parse(history.location.pathname));
    }

    componentWillUnmount() {
        console.log("App unmounted");
        this.mounted = false;
        this.historyUnlisten();
    }

    /**
     * Reads the state and verifies each component with a special case remembering if the spreadsheet name is being edited.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        const state = this.state;
        console.log("componentDidUpdate", "prevState", prevState, "state", state);

        this.stateSpreadsheetMetadata(prevState.spreadsheetMetadata);

        const hash = {};
        this.stateSpreadsheetMetadataSpreadsheetId(prevState, hash);
        this.stateSpreadsheetMetadataSpreadsheetName(hash);
        this.stateSpreadsheetViewport(prevState);
        this.stateSpreadsheetViewportRange(prevState);

        const history = this.history;
        const current = history.location.pathname;
        const updatedPathname = SpreadsheetHistoryHash.merge(
            SpreadsheetHistoryHash.parse(current),
            hash,
        );
        if(current !== updatedPathname) {
            history.push(updatedPathname);
        }
    }

    /**
     * If the SpreadsheetMetadata has changed tell the formula and viewport so they can refresh themselves.
     */
    stateSpreadsheetMetadata(previousMetadata) {
        const state = this.state;

        const metadata = state.spreadsheetMetadata;
        if(!metadata.isEmpty()){
            if(!metadata.equalsMost(previousMetadata)){
                this.formulaReloadIfEditing();

                const viewport = this.viewport.current;
                viewport.setState({
                    cells: state.cells,
                });
            }
        }

        const settings = this.settings.current;
        settings && settings.setState(
            {
                spreadsheetMetadata: this.state.spreadsheetMetadata,
            }
        );
    }

    /**
     * If spreadsheet id changed clear caches related to the previous spreadsheet.
     */
    stateSpreadsheetMetadataSpreadsheetId(prevState, hash) {
        const previous = prevState.spreadsheetMetadata.get(SpreadsheetMetadata.SPREADSHEET_ID);
        const current = this.state.spreadsheetMetadata.get(SpreadsheetMetadata.SPREADSHEET_ID);

        if(!Equality.safeEquals(current, previous)){
            console.log("spreadsheetId changed from " + previous + " to " + current + " clearing state cell, columnWidths, rowHeight (caches)");
            this.setState({
                createEmptySpreadsheet: false,
                cells: ImmutableMap.EMPTY,
                columnWidths: ImmutableMap.EMPTY,
                rowHeights: ImmutableMap.EMPTY,
            });
        }
        hash[SpreadsheetHistoryHash.SPREADSHEET_ID] = current;
    }

    /**
     * Updates the SpreadsheetNameWidget whenever metadata is updated.
     */
    stateSpreadsheetMetadataSpreadsheetName(hash) {
        const metadata = this.state.spreadsheetMetadata;
        const widget = this.spreadsheetName.current;
        const name = metadata.get(SpreadsheetMetadata.SPREADSHEET_NAME);

        if(widget && !Equality.safeEquals(name, widget.state.value)){
            console.log("onSpreadsheetMetadataSpreadsheetName updated from " + widget.state.value + " to " + name);

            widget.setState({
                value: name,
            });
            document.title = name.toString();
        }else {
            console.log("onSpreadsheetMetadataSpreadsheetName widget not updated", "widget", widget.current, "name: " + name);
        }

        hash[SpreadsheetHistoryHash.SPREADSHEET_NAME] = name;
    }

    /**
     * Update the viewport after computing the viewport metrics.
     */
    stateSpreadsheetViewport(prevState) {
        const state = this.state;

        const metadata = state.spreadsheetMetadata;
        const viewportCell = metadata.get(SpreadsheetMetadata.VIEWPORT_CELL);
        const viewportCoordinates = metadata.get(SpreadsheetMetadata.VIEWPORT_COORDINATES);
        const windowDimensions = state.windowDimensions;
        const aboveViewportDimensions = state.aboveViewportDimensions;

        const viewport = this.viewport.current;

        if(viewportCell && viewportCoordinates && windowDimensions && aboveViewportDimensions && viewport){
            viewport.setState({
                home: viewportCell,
                cells: state.cells,
                columnWidths: state.columnWidths,
                rowHeights: state.rowHeights,
                defaultStyle: metadata.get(SpreadsheetMetadata.STYLE),
            });
            const previous = viewport.state.dimensions || {
                width: 0,
                height: 0,
            }
            const width = windowDimensions.width;
            const height = windowDimensions.height - aboveViewportDimensions.height;

            if(previous.width !== width || previous.height !== height){
                viewport.setState({
                    dimensions: {
                        width: width,
                        height: height,
                    }
                });

                const previousMetadata = prevState.spreadsheetMetadata;
                const previousViewportCell = previousMetadata && previousMetadata.get(SpreadsheetMetadata.VIEWPORT_CELL);

                if((width > previous.width || height > previous.height) && (viewportCell.equals(previousViewportCell) || !previousViewportCell)){
                    this.onCellBox(
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
     * If the range changed, clear the cells and load the viewport cells.
     */
    stateSpreadsheetViewportRange(prevState) {
        const viewportRange = this.state.viewportRange;
        const previousViewportRange = prevState.viewportRange;

        if(!Equality.safeEquals(viewportRange, previousViewportRange)){
            this.loadSpreadsheetCellOrRange(viewportRange, SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY);
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
     * Accepts {@link SpreadsheetCellBox} and requests the {@link SpreadsheetRange} that fill the content.
     */
    onCellBox(cellBox) {
        console.log("onCellBoxViewportRangeUpdate " + cellBox);

        this.send(
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
     * Accepts a cell or range along with an evaluation and makes a call to the server.
     */
    loadSpreadsheetCellOrRange(selection, evaluation, onSuccess) {
        console.log("loadSpreadsheetCellOrRange " + selection + " " + evaluation);
        if(!selection){
            throw new Error("Missing selection");
        }
        if(!evaluation){
            throw new Error("Missing evaluation");
        }

        const onSpreadsheetDelta = this.onSpreadsheetDelta.bind(this);

        this.send(
            this.spreadsheetCellApiUrl(selection) + "/" + evaluation,
            {
                method: "GET"
            },
            (json) => {
                onSpreadsheetDelta(json);
                if(onSuccess) {
                    onSuccess(json);
                }
            },
            error
        );
    }

    /**
     * Saves the given cell. Eventually the returned value will trigger a re-render.
     */
    saveSpreadsheetCell(cell) {
        const reference = cell.reference();

        if(cell.equals(this.state.cells.get(reference))){
            console.log("saveSpreadsheetCell cell unchanged save skipped", cell);
        }else {
            console.log("saveSpreadsheetCell", cell);

            this.send(
                this.spreadsheetCellApiUrl(cell.reference()),
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
     * Formats a SpreadsheetMultiFormatRequest holding the create-date-time and modified-date-time.
     */
    onFormatCreateDateTimeModifiedDateTime(multiFormatRequest, success, errorHandler) {
        console.log("onFormatCreateDateTimeModifiedDateTime ", multiFormatRequest);

        this.send(
            this.spreadsheetMetadataApiUrl() + "/format",
            {
                method: "POST",
                body: JSON.stringify(multiFormatRequest.toJson()),
            },
            success,
            errorHandler || error,
        );
    }

    // rendering........................................................................................................

    /**
     * Renders the basic spreadsheet layout.
     */
    render() {
        const {classes} = this.props;

        const state = this.state;
        console.log("render", state);

        const metadata = this.spreadsheetMetadata();

        const spreadsheetName = metadata.get(SpreadsheetMetadata.SPREADSHEET_NAME);

        const style = metadata.get(SpreadsheetMetadata.STYLE);
        const {cells, columnWidths, rowHeights} = state;

        const viewportCell = metadata.get(SpreadsheetMetadata.VIEWPORT_CELL);

        const appBarWidth = this.appBarWidth();

        const history = this.history;

        return (
            <WindowResizer dimensions={this.onWindowResized.bind(this)}>
                <SpreadsheetNotificationWidget ref={this.notification}
                                               key="notification"
                                               notification={this.state.notification}
                                               onClose={this.onNotificationClose.bind(this)} />
                <SpreadsheetBox ref={this.aboveViewport}
                                key={{windowDimensions: state.windowDimensions}}
                                dimensions={this.onAboveViewportResize.bind(this)}
                                className={classes.header}
                >
                    <SpreadsheetAppBar menuClickListener={this.settingsToggle.bind(this)}>
                        <SpreadsheetNameWidget ref={this.spreadsheetName}
                                               key={spreadsheetName}
                                               history={history}
                                               value={spreadsheetName}
                                               setValue={this.saveSpreadsheetName.bind(this)}
                        />
                    </SpreadsheetAppBar>
                    <SpreadsheetContainerWidget ref={this.formulaContainer}
                                                style={{
                                                    margin: 0,
                                                    border: 0,
                                                    padding: 0,
                                                    width: appBarWidth + "px",
                                                }}>
                        <SpreadsheetFormulaWidget ref={this.formula}
                                                  key={"spreadsheetFormula"}
                                                  history={history}
                                                  getValue={this.formulaTextLoad.bind(this)}
                                                  setValue={this.formulaTextSave.bind(this)}
                        />
                    </SpreadsheetContainerWidget>
                    <Divider/>
                </SpreadsheetBox>
                <SpreadsheetViewportWidget key={[cells, columnWidths, rowHeights, style, viewportCell/*, editCell*/]}
                                           history={history}
                                           ref={this.viewport}
                                           cells={cells}
                                           columnWidths={columnWidths}
                                           rowHeights={rowHeights}
                                           defaultStyle={style}
                                           home={viewportCell}
                />
                <SpreadsheetSettingsWidget ref={this.settings}
                                           history={history}
                                           spreadsheetMetadata={metadata}
                                           setSpreadsheetMetadata={this.saveSpreadsheetMetadata.bind(this)}
                                           formatCreateDateTimeModifiedDateTime={this.onFormatCreateDateTimeModifiedDateTime.bind(this)}
                />
            </WindowResizer>
        );
    }

    // formula.........................................................................................................

    /**
     * Accepts a cell reference and eventually sets the formula text on the second call back function.
     */
    formulaTextLoad(cellReference, setFormulaText) {
        console.log("formulaTextLoad " + cellReference + " " + setFormulaText);

        this.loadSpreadsheetCellOrRange(
            cellReference,
            SpreadsheetEngineEvaluation.FORCE_RECOMPUTE,
            (json) => {
                const delta = SpreadsheetDelta.fromJson(json);
                const cell = delta.referenceToCellMap().get(cellReference);
                var formulaText = "";
                if(cell) {
                    const formula = cell.formula();
                    formulaText = formula.text();
                }
                setFormulaText(formulaText);
            }
        );
    }

    /**
     * Saves the given formula text to the given cell reference. This assumes the cell has been previously loaded.
     */
    formulaTextSave(cellReference, formulaText) {
        console.log("formulaTextSave " + cellReference + " " + formulaText);

        const cell = this.getCellOrEmpty(cellReference);
        const formula = cell.formula();
        this.saveSpreadsheetCell(cell.setFormula(formula.setText(formulaText)));
    }

    /**
     * Fetches the cell by the given reference or returns an empty {@link SpreadsheetCell}.
     */
    getCellOrEmpty(reference) {
        return this.state.cells.get(reference) ||
            new SpreadsheetCell(
                reference,
                new SpreadsheetFormula(""),
                TextStyle.EMPTY
            );
    }

    /**
     * This is called whenever the spreadsheet metadata is updated and is necessary because properties such as decimal-separator will require the formula text to be reloaded.
     */
    formulaReloadIfEditing() {
        this.formula.current.reloadIfEditing();
    }

    // settings.........................................................................................................

    settingsOpen(open) {
        const widget = this.settings.current;
        widget && widget.setState({
            open: open,
        });
    }

    settingsToggle() {
        const widget = this.settings.current;
        widget && widget.toggle();
    }

    // Notifications....................................................................................................

    notificationSave(notification) {
        console.log("saveNotifications ", notification);

        this.notification.current.setState(
            {
                notification: notification
            }
        );
    }

    onNotificationClose() {
        this.notificationSave();
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

        const widget = this.aboveViewport.current;
        widget && widget.fireResize();
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
     * Computes the visible width of the app bar less if the settings/tool settings if it is visible.
     */
    appBarWidth() {
        const state = this.state;
        const aboveViewportDimensions = state.aboveViewportDimensions;

        return aboveViewportDimensions ?
            (aboveViewportDimensions.width - (state.settings ? SpreadsheetSettingsWidget.WIDTH : 0)) + "px" :
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

        this.send(
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
        if(!id){
            throw new Error("Missing spreadsheetId parameter and current SpreadsheetMetadata.spreadsheetId");
        }
        if(typeof id !== "string"){
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

        this.send(
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
        if(metadata.equals(this.spreadsheetMetadata())){
            console.log("saveSpreadsheetMetadata unchanged, save skipped", metadata);
        }else {
            console.log("saveSpreadsheetMetadata", metadata);

            this.send(
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

        this.notificationSave(SpreadsheetNotification.success("Spreadsheet metadata saved"));
    }

    // messenger........................................................................................................

    /**
     * Centralises calls to messenger.send. This may be used to add a default error.
     */
    send(url, parameters, response, error) {
       this.messenger.send(
           url,
           parameters,
           response,
           error || this.onSendError,
       )
    }

    onSendError(error) {
        this.notificationSave(Notification.error(error));
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