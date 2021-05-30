import {withRouter} from "react-router";
import './SpreadsheetApp.css';

import {withStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Equality from "../Equality.js";
import ImmutableMap from "../util/ImmutableMap.js";
import Preconditions from "../Preconditions.js";
import React from 'react';
import SpreadsheetAppBar from "../widget/SpreadsheetAppBar.js";
import SpreadsheetBox from "../widget/SpreadsheetBox.js";
import SpreadsheetCell from "./SpreadsheetCell.js";
import SpreadsheetCellBox from "./reference/SpreadsheetCellBox.js";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetCellReferenceOrLabelName from "./reference/SpreadsheetCellReferenceOrLabelName.js";
import SpreadsheetContainerWidget from "../widget/SpreadsheetContainerWidget.js";
import SpreadsheetCoordinates from "./SpreadsheetCoordinates.js";
import SpreadsheetDelta from "./engine/SpreadsheetDelta.js";
import SpreadsheetEngineEvaluation from "./engine/SpreadsheetEngineEvaluation.js";
import SpreadsheetExpressionReferenceSimilarities from "./SpreadsheetExpressionReferenceSimilarities.js";
import SpreadsheetFormula from "./SpreadsheetFormula.js";
import SpreadsheetFormulaWidget from "./SpreadsheetFormulaWidget.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetLabelMapping from "./reference/SpreadsheetLabelMapping.js";
import SpreadsheetLabelName from "./reference/SpreadsheetLabelName.js";
import SpreadsheetLabelWidget from "./reference/SpreadsheetLabelWidget.js";
import SpreadsheetMetadata from "./meta/SpreadsheetMetadata.js";
import SpreadsheetMessenger from "./message/SpreadsheetMessenger.js";
import SpreadsheetName from "./SpreadsheetName.js";
import SpreadsheetNameWidget from "./SpreadsheetNameWidget.js";
import SpreadsheetNavigateWidget from "./reference/SpreadsheetNavigateWidget.js";
import SpreadsheetNotification from "./notification/SpreadsheetNotification.js";
import SpreadsheetNotificationWidget from "./notification/SpreadsheetNotificationWidget.js";
import SpreadsheetRange from "./reference/SpreadsheetRange.js";
import SpreadsheetSettingsWidget from "./settings/SpreadsheetSettingsWidget.js";
import SpreadsheetViewportWidget from "./SpreadsheetViewportWidget.js";
import TextStyle from "../text/TextStyle.js";
import WindowResizer from "../widget/WindowResizer.js";

const useStyles = theme => ({
    header: {
        zIndex: theme.zIndex.settings + 1, // forces settings to not overlap application header
    },
});

class SpreadsheetApp extends SpreadsheetHistoryAwareStateWidget {

    // init.............................................................................................................

    init() {
        this.messenger = new SpreadsheetMessenger(this.showError.bind(this));
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

    /**
     * Creates a state with some defaults and empty values.
     */
    initialStateFromProps(props) {
        return {
            creatingEmptySpreadsheet: false,
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY,
            cells: ImmutableMap.EMPTY,
            columnWidths: ImmutableMap.EMPTY,
            rowHeights: ImmutableMap.EMPTY,
            windowDimensions: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
        };
    }

    // history..........................................................................................................

    /**
     * If the state.id has changed this will trigger a load, while if it is empty this will trigger a create empty.
     */
    stateFromHistoryTokens(tokens) {
        const id = tokens[SpreadsheetHistoryHash.SPREADSHEET_ID];
        const name = tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME];

        return {
            spreadsheetId: id,
            spreadsheetName: name,
        };
    }

    // state-change.....................................................................................................

    /**
     * This is called when the state changes and returns the history tokens equivalent.
     */
    historyTokensFromState(prevState) {
        this.stateSync(prevState.spreadsheetMetadata);

        const historyTokens = {};

        this.stateCreateEmptyOrLoadOrNothing(prevState, historyTokens);
        this.stateSpreadsheetViewport(prevState);
        this.stateSpreadsheetViewportRange(prevState);

        return historyTokens;
    }

    /**
     * If the SpreadsheetMetadata and cells has changed tell the formula and viewport so they can refresh themselves.
     */
    stateSync(previousMetadata) {
        const state = this.state;

        const metadata = state.spreadsheetMetadata;
        if(!(metadata.isEmpty() || metadata.equalsMost(previousMetadata))){
            const formula = this.formula.current;
            formula && formula.setState({
                reload: true,
            });
        }

        const viewport = this.viewport.current;
        viewport.setState({
            cells: state.cells,
        });

        const settings = this.settings.current;
        settings && settings.setState(
            {
                spreadsheetMetadata: metadata,
            }
        );
    }

    /**
     * Tests whether an empty spreadsheet or updating the id and name of the hash should occur.
     */
    stateCreateEmptyOrLoadOrNothing(prevState, historyTokens) {
        const previous = prevState.spreadsheetId;
        const state = this.state;
        const current = state.spreadsheetId;

        if(!state.creatingEmptySpreadsheet) {
            console.log("stateSpreadsheetMetadataSpreadsheetId spreadsheetId changed from " + previous + " to " + current);
            if(current) {
                if(Equality.safeEquals(current, previous)){
                    this.stateSpreadsheetMetadataSpreadsheetName(historyTokens);
                } else {
                    this.spreadsheetMetadataLoad(current);
                }
            } else {
                this.spreadsheetEmptyCreate();
            }
        }

        historyTokens[SpreadsheetHistoryHash.SPREADSHEET_ID] = current;
    }

    /**
     * Updates the history tokens name to match the state.
     */
    stateSpreadsheetMetadataSpreadsheetName(hash) {
        const state = this.state;
        const metadata = state.spreadsheetMetadata;
        const widget = this.spreadsheetName.current;
        const name = metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME);

        if(widget){
            widget.setState({
                loaded: name,
                value: name,
            });
        }

        if(name){
            document.title = name.toString();
        }
        hash[SpreadsheetHistoryHash.SPREADSHEET_NAME] = name;

        if(!Equality.safeEquals(name, state.name)){
            this.setState({
                spreadsheetName: name,
            });
        }
    }

    /**
     * Update the viewport after computing the viewport metrics.
     */
    stateSpreadsheetViewport(prevState) {
        const state = this.state;

        const metadata = state.spreadsheetMetadata;
        const viewportCell = metadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);
        const viewportCoordinates = metadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_COORDINATES);
        const windowDimensions = state.windowDimensions;
        const aboveViewportDimensions = state.aboveViewportDimensions;

        const viewport = this.viewport.current;

        if(viewportCell && viewportCoordinates && windowDimensions && aboveViewportDimensions && viewport){
            viewport.setState({
                home: viewportCell,
                cells: state.cells,
                columnWidths: state.columnWidths,
                rowHeights: state.rowHeights,
                defaultStyle: metadata.effectiveStyle(),
            });
            const previous = viewport.state.dimensions || {
                width: 0,
                height: 0,
            };
            const width = windowDimensions.width;
            const height = windowDimensions.height - aboveViewportDimensions.height;


            if(previous.width !== width || previous.height !== height){
                viewport.setState({
                    dimensions: {
                        width: width,
                        height: height,
                    }
                });
            }

            const previousMetadata = prevState.spreadsheetMetadata;
            const previousViewportCell = previousMetadata && previousMetadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);

            if((width > previous.width || height > previous.height) || (viewportCell && !viewportCell.equals(previousViewportCell))){
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

    /**
     * If the range changed, clear the cells and load the viewport cells.
     */
    stateSpreadsheetViewportRange(prevState) {
        const viewportRange = this.state.viewportRange;
        const previousViewportRange = prevState.viewportRange;

        if(viewportRange && !Equality.safeEquals(viewportRange, previousViewportRange)){
            this.cellOrRangeLoad(
                viewportRange,
                SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY,
            );
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

        const metadata = this.spreadsheetMetadata();

        const spreadsheetName = metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME);

        const style = metadata.getIgnoringDefaults(SpreadsheetMetadata.STYLE);
        const {cells, columnWidths, rowHeights} = state;

        const viewportCell = metadata.getIgnoringDefaults(SpreadsheetMetadata.VIEWPORT_CELL);

        const history = this.props.history;

        const notificationShow = this.notificationShow.bind(this);
        const showError = this.notificationShowError.bind(this);

        return (
            <WindowResizer dimensions={this.onWindowResized.bind(this)}>
                <SpreadsheetNotificationWidget ref={this.notification}
                                               key="notification"
                />
                <SpreadsheetNavigateWidget key="navigateWidget"
                                           history={history}
                                           getSimilarities={this.similaritiesGet.bind(this)}
                                           notificationShow={notificationShow}
                                           showError={showError}
                />
                <SpreadsheetLabelWidget key="labelWidget"
                                        history={history}
                                        loadLabelMapping={this.labelMappingLoad.bind(this)}
                                        saveLabelMapping={this.labelMappingSave.bind(this)}
                                        deleteLabelMapping={this.labelMappingDelete.bind(this)}
                                        notificationShow={notificationShow}
                                        showError={showError}
                />
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
                                               setValue={this.spreadsheetNameSave.bind(this)}
                                               showError={showError}
                        />
                    </SpreadsheetAppBar>
                    <SpreadsheetContainerWidget ref={this.formulaContainer}
                                                style={{
                                                    margin: 0,
                                                    border: 0,
                                                    padding: 0,
                                                    width: this.appBarWidth() + "px",
                                                }}>
                        <SpreadsheetFormulaWidget ref={this.formula}
                                                  key={"spreadsheetFormula"}
                                                  history={history}
                                                  getValue={this.formulaTextLoad.bind(this)}
                                                  setValue={this.formulaTextSave.bind(this)}
                                                  showError={showError}
                        />
                    </SpreadsheetContainerWidget>
                    <Divider/>
                </SpreadsheetBox>
                <SpreadsheetViewportWidget key={[cells, columnWidths, rowHeights, style, viewportCell]}
                                           history={history}
                                           ref={this.viewport}
                                           cells={cells}
                                           columnWidths={columnWidths}
                                           rowHeights={rowHeights}
                                           defaultStyle={style}
                                           home={viewportCell}
                                           labelToCell={this.labelToCell.bind(this)}
                                           showError={showError}
                />
                <SpreadsheetSettingsWidget ref={this.settings}
                                           history={history}
                                           notificationShow={notificationShow}
                                           spreadsheetMetadata={metadata}
                                           setSpreadsheetMetadata={this.spreadsheetMetadataSave.bind(this)}
                                           formatCreateDateTimeModifiedDateTime={this.settingsFormatCreateDateTimeModifiedDateTime.bind(this)}
                                           showError={showError}
                />
            </WindowResizer>
        );
    }

    // cell.............................................................................................................

    /**
     * Accepts a cell or range along with an evaluation and makes a call to the server.
     */
    cellOrRangeLoad(selection, evaluation, onSuccess) {
        Preconditions.requireNonNull(selection, "selection");
        Preconditions.requireInstance(evaluation, SpreadsheetEngineEvaluation, "evaluation");
        Preconditions.optionalFunction(onSuccess, "onSuccess");

        console.log("cellOrRangeLoad " + selection + " " + evaluation);

        this.messageSend(
            this.cellUrl(selection) + "/" + evaluation.nameKebabCase(),
            {
                method: "GET"
            },
            (json) => {
                this.onSpreadsheetDelta(json);
                onSuccess && onSuccess(json);
            }
        );
    }

    /**
     * Saves the given cell. Eventually the returned value will trigger a re-render.
     */
    cellSave(cell) {
        Preconditions.requireInstance(cell, SpreadsheetCell, "cell");

        const reference = cell.reference();

        if(cell.equals(this.state.cells.get(reference))){
            console.log("saveSpreadsheetCell cell unchanged save skipped", cell);
        }else {
            console.log("saveSpreadsheetCell", cell);

            this.messageSend(
                this.cellUrl(cell.reference()),
                {
                    method: "POST",
                    body: JSON.stringify(new SpreadsheetDelta([cell],
                        ImmutableMap.EMPTY,
                        ImmutableMap.EMPTY,
                        [this.state.viewportRange])
                        .toJson()),
                },
                this.onSpreadsheetDelta.bind(this)
            );
        }
    }

    /**
     * Returns a URL with the spreadsheet id and ONLY the provided cell selection.
     */
    cellUrl(selection) {
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

    // COORDINATES......................................................................................................

    onSpreadsheetCoordinates(json) {
        this.setState({
            viewportCoordinates: SpreadsheetCoordinates.fromJson(json),
        });
    }

    // formula.........................................................................................................

    /**
     * Accepts a cell reference and eventually sets the formula text on the second call back function.
     */
    formulaTextLoad(cellOrLabel, setFormulaText, onError) {
        Preconditions.requireInstance(cellOrLabel, SpreadsheetCellReferenceOrLabelName, "cellOrLabel");
        Preconditions.requireFunction(setFormulaText, "setFormulaText");
        Preconditions.requireFunction(onError, "onError");

        console.log("formulaTextLoad " + cellOrLabel);

        if(cellOrLabel instanceof SpreadsheetCellReference) {
            this.formulaTextLoadCellReference(cellOrLabel, setFormulaText, onError);
        } else {
            this.labelToCell(
                cellOrLabel,
                (cell) => this.formulaTextLoadCellReference(cell, setFormulaText),
                this.showError.bind(this),
            );
        }
    }

    /**
     * This is the final phase of loading formula text for a cell and occurs once the history hash cell is resolved
     * from a cell or label to a cell.
     */
    formulaTextLoadCellReference(cellReference, setFormulaText, onError) {

        this.cellOrRangeLoad(
            cellReference,
            SpreadsheetEngineEvaluation.FORCE_RECOMPUTE,
            (json) => {
                const delta = SpreadsheetDelta.fromJson(json);
                const cell = delta.referenceToCellMap().get(cellReference);
                var formulaText = "";
                if(cell){
                    const formula = cell.formula();
                    formulaText = formula.text();
                }
                setFormulaText(cellReference, formulaText);
            },
            onError
        );
    }

    /**
     * Saves the given formula text to the given cell reference. This assumes the cell has been previously loaded.
     */
    formulaTextSave(cellReference, formulaText) {
        Preconditions.requireInstance(cellReference, SpreadsheetCellReference, "cellReference");
        Preconditions.requireText(formulaText, "formulaText");

        console.log("formulaTextSave " + cellReference + " " + formulaText);

        const cell = this.cellGetOrEmpty(cellReference);
        const formula = cell.formula();
        this.cellSave(cell.setFormula(formula.setText(formulaText)));
    }

    /**
     * Fetches the cell by the given reference or returns an empty {@link SpreadsheetCell}.
     */
    cellGetOrEmpty(reference) {
        Preconditions.requireInstance(reference, SpreadsheetCellReference, "reference");

        return this.state.cells.get(reference) ||
            new SpreadsheetCell(
                reference,
                new SpreadsheetFormula(""),
                TextStyle.EMPTY
            );
    }

    // label............................................................................................................

    /**
     * Accepts a label and calls the mapping callback with the SpreadsheetLabelMapping.
     */
    labelMappingLoad(label, success, failure) {
        this.messageSend(
            this.labelUrl(label),
            {
                method: "GET",
            },
            (json) => success(null != json && SpreadsheetLabelMapping.fromJson(json)),
            failure,
        );
    }

    /**
     * Saves the given SpreadsheetLabelMapping
     */
    labelMappingSave(label, mapping, success, failure) {
        this.messageSend(
            this.labelUrl(label),
            {
                method: "POST",
                body: JSON.stringify(mapping.toJson()),
            },
            success,
            failure,
        );
    }

    /**
     * Deletes the given SpreadsheetLabelMapping, and when completed the deleted callback is invoked.
     */
    labelMappingDelete(label, success, failure) {
        this.messageSend(
            this.labelUrl(label),
            {
                method: "DELETE",
            },
            success,
            failure,
        );
    }

    /**
     * Creates an URL for the given label.
     */
    labelUrl(label) {
        Preconditions.requireInstance(label, SpreadsheetLabelName, "label");
        return this.spreadsheetMetadataApiUrl() + "/label/" + label
    }

    /**
     * Given the {@link SpreadsheetLabelName} returns the target {@link SpreadsheetCellReference}.
     */
    labelToCell(label, success, failure) {
        Preconditions.optionalInstance(label, SpreadsheetLabelName, "label");
        Preconditions.requireFunction(success, "success");
        Preconditions.requireFunction(failure, "failure");

        this.messenger.send(
            this.similaritiesUrl(label.toString(), 1),
            {
                method: "GET",
            },
            (json) => {
                if(json) {
                    const mapping = SpreadsheetExpressionReferenceSimilarities.fromJson(json)
                        .labelMappings()
                        .find(m => m.label().equals(label));
                    if(mapping) {
                        success(mapping.reference());
                    } else {
                        failure("Unknown label " + label);
                    }
                }
            },
            failure
        );
    }

    // messenger........................................................................................................

    /**
     * Centralises calls to messenger.send. This may be used to add a default error.
     */
    messageSend(url, parameters, response, error) {
        this.messenger.send(
            url,
            parameters,
            response,
            error || this.showError.bind(this),
        )
    }

    // Notifications....................................................................................................

    notificationShow(notification) {
        Preconditions.optionalInstance(notification, SpreadsheetNotification, "notification");

        console.log("notificationShow ", notification);

        const widget = this.notification.current;
        widget && widget.setState(
            {
                notification: notification
            }
        );
    }

    notificationShowError(error) {
        this.notificationShow(SpreadsheetNotification.error(error));
    }

    // RANGE............................................................................................................

    /**
     * Handles a range response which contains the range of cells that fill the viewport for the home cell and dimensions
     * of the viewport area.
     */
    onSpreadsheetRange(json) {
        console.log("onSpreadsheetRange: ", json);

        this.setState({
            viewportRange: SpreadsheetRange.fromJson(json),
        });
    }

    // settings.........................................................................................................

    settingsToggle() {
        const widget = this.settings.current;
        widget && widget.toggle();
    }

    /**
     * Formats a SpreadsheetMultiFormatRequest holding the create-date-time and modified-date-time.
     */
    settingsFormatCreateDateTimeModifiedDateTime(multiFormatRequest, success, errorHandler) {
        console.log("settingsFormatCreateDateTimeModifiedDateTime ", multiFormatRequest);

        this.messageSend(
            this.spreadsheetMetadataApiUrl() + "/format",
            {
                method: "POST",
                body: JSON.stringify(multiFormatRequest.toJson()),
            },
            success,
            errorHandler,
        );
    }

    // similarities.....................................................................................................

    similaritiesGet(text, count, success, failure) {
        Preconditions.requireText(text, "text");
        Preconditions.requirePositiveNumber(count, "count");
        Preconditions.requireFunction(success, "success");
        Preconditions.requireFunction(failure, "failure");

        this.messageSend(
            this.similaritiesUrl(text, count),
            {
                method: "GET",
            },
            (json) => success(SpreadsheetExpressionReferenceSimilarities.fromJson(json)),
            failure,
        );
    }

    /**
     * Returns a URL that may be used to call the cell-reference end point
     */
    similaritiesUrl(text, count) {
        Preconditions.requireText(text, "text");
        Preconditions.requireNumber(count, "count"); // TODO https://github.com/mP1/walkingkooka-spreadsheet-react/issues/854 Preconditions.requirePositiveNumber

        return this.spreadsheetMetadataApiUrl() + "/cell-reference/" + encodeURI(text) + "?count=" + count;
    }

    // SpreadsheetMetadata..............................................................................................

    /**
     * Makes a request which returns some basic default metadata, and without cells the spreadsheet will be empty.
     */
    spreadsheetEmptyCreate() {
        console.log("spreadsheetEmptyCreate");

        this.setState({
            creatingEmptySpreadsheet: true,
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY,
            spreadsheetId: null,
            viewportRange: null,
            cells: ImmutableMap.EMPTY,
            columnWidths: ImmutableMap.EMPTY,
            rowHeights: ImmutableMap.EMPTY,
        });

        this.messageSend(
            "/api/spreadsheet",
            {
                method: "POST"
            },
            (json) => this.onSpreadsheetMetadata(SpreadsheetMetadata.fromJson(json), true)
        );
    }

    spreadsheetMetadata() {
        return this.state.spreadsheetMetadata;
    }

    /**
     * Loads the spreadsheet metadata with the given spreadsheet id.
     */
    spreadsheetMetadataLoad(id) {
        Preconditions.requireNonNull(id, "id");

        console.log("spreadsheetMetadataLoad " + id);

        this.messageSend(
            this.spreadsheetMetadataApiUrl(id),
            {
                method: "GET",
            },
            (json) => this.onSpreadsheetMetadata(SpreadsheetMetadata.fromJson(json), true),
            (e) => this.showError("Unable to load spreadsheet " + id)
        );
    }

    /**
     * If the new metadata is different call the save service otherwise skip.
     */
    spreadsheetMetadataSave(metadata, success, failure) {
        Preconditions.requireInstance(metadata, SpreadsheetMetadata, "metadata");
        Preconditions.requireFunction(success, "success");
        Preconditions.requireFunction(failure, "failure");

        if(metadata.equals(this.spreadsheetMetadata())){
            console.log("saveSpreadsheetMetadata unchanged, save skipped", metadata);
            success(metadata);
        }else {
            console.log("saveSpreadsheetMetadata", metadata);

            this.messageSend(
                this.spreadsheetMetadataApiUrl(),
                {
                    method: "POST",
                    body: JSON.stringify(metadata.toJson())
                },
                (json) => {
                    const loaded = SpreadsheetMetadata.fromJson(json);
                    success(loaded);
                    this.onSpreadsheetMetadata(loaded, false);
                },
                failure,
            );
        }
    }

    spreadsheetNameSave(name, success, failure) {
        Preconditions.requireInstance(name, SpreadsheetName, "spreadsheetName");
        Preconditions.requireFunction(success, "success");
        Preconditions.requireFunction(failure, "failure");

        this.spreadsheetMetadataSave(
            this.state.spreadsheetMetadata.set(SpreadsheetMetadata.SPREADSHEET_NAME, name),
            (m) => success(m.get(SpreadsheetMetadata.SPREADSHEET_NAME)),
            failure,
        );
    }

    /**
     * Uses the provided spreadsheetid or falls back to the current {@Link SpreadsheetMetadata} spreadsheet id
     */
    spreadsheetMetadataApiUrl(spreadsheetId) {
        const id = spreadsheetId || this.spreadsheetMetadata().getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID);
        if(!id){
            throw new Error("Missing spreadsheetId parameter and current SpreadsheetMetadata.spreadsheetId");
        }
        if(typeof id !== "string"){
            throw new Error("Expected string spreadsheetId got " + id);
        }
        return "/api/spreadsheet/" + id;
    }

    /**
     * Handles the response.json which contains a SpreadsheetMetadata. The different flag also indicates
     * this is loading a new spreadsheet metadata and some extra state fields should be cleared.
     */
    onSpreadsheetMetadata(metadata, different) {
        const state = {
            spreadsheetId: metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID),
            spreadsheetName: metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME),
            creatingEmptySpreadsheet: false,
            spreadsheetMetadata: metadata,
        }

        if(different){
            Object.assign(
                state,
                {
                    cells: ImmutableMap.EMPTY,
                    columnWidths: ImmutableMap.EMPTY,
                    rowHeights: ImmutableMap.EMPTY,
                    viewportRange: null, // this will force reloading of all viewport cells
                }
            );
        } else {
            this.notificationShow(SpreadsheetNotification.success("Spreadsheet metadata saved"));
        }

        this.setState(state);
    }

    // VIEWPORT ........................................................................................................

    /**
     * Accepts {@link SpreadsheetCellBox} and requests the {@link SpreadsheetRange} that fill the content.
     */
    onCellBox(cellBox) {
        console.log("cellBox: ", cellBox);

        this.messageSend(
            this.spreadsheetMetadataApiUrl() + "/viewport/" + cellBox.viewport(),
            {
                method: "GET"
            },
            this.onSpreadsheetRange.bind(this),
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

    showError(error) {
        this.notificationShow(SpreadsheetNotification.error(error));
    }

    // toString.........................................................................................................

    toString() {
        return this.spreadsheetMetadata().toString();
    }
}

export default withRouter(withStyles(useStyles)(SpreadsheetApp));