import './SpreadsheetApp.css';

import {withStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Equality from "../Equality.js";
import ListenerCollection from "../event/ListenerCollection.js";
import Preconditions from "../Preconditions.js";
import React from 'react';
import SpreadsheetAppBar from "../widget/SpreadsheetAppBar.js";
import SpreadsheetBox from "../widget/SpreadsheetBox.js";
import SpreadsheetDelta from "./engine/SpreadsheetDelta.js";
import SpreadsheetEngineEvaluation from "./engine/SpreadsheetEngineEvaluation.js";
import SpreadsheetExpressionReferenceSimilarities from "./SpreadsheetExpressionReferenceSimilarities.js";
import SpreadsheetFormulaWidget from "./SpreadsheetFormulaWidget.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetLabelMapping from "./reference/SpreadsheetLabelMapping.js";
import SpreadsheetLabelName from "./reference/SpreadsheetLabelName.js";
import SpreadsheetLabelWidget from "./reference/SpreadsheetLabelWidget.js";
import SpreadsheetMetadata from "./meta/SpreadsheetMetadata.js";
import SpreadsheetMessenger from "./message/SpreadsheetMessenger.js";
import SpreadsheetMessengerCrud from "./message/SpreadsheetMessengerCrud.js";
import SpreadsheetNameWidget from "./SpreadsheetNameWidget.js";
import SpreadsheetNavigateAutocompleteWidget from "./reference/SpreadsheetNavigateAutocompleteWidget.js";
import SpreadsheetNavigateLinkWidget from "./reference/SpreadsheetNavigateLinkWidget.js";
import SpreadsheetNotification from "./notification/SpreadsheetNotification.js";
import SpreadsheetSettingsWidget from "./settings/SpreadsheetSettingsWidget.js";
import SpreadsheetViewportWidget from "./SpreadsheetViewportWidget.js";
import WindowResizer from "../widget/WindowResizer.js";

const useStyles = theme => ({
    header: {
        zIndex: theme.zIndex.settings + 1, // forces settings to not overlap application header
    },
});

/**
 * State
 * <ul>
 *      <li>spreadsheetId: The current spreadsheet id</li>
 *      <li>spreadsheetName: The current spreadsheet name</li>
 *      <li>boolean creatingEmptySpreadsheet: when true indicates a new spreadsheet is being created</li>
 *      <li>SpreadsheetMetadata spreadsheetMetadata: The current SpreadsheetMetadata</li>
 *      <li>{} windowDimensions: Holds the width and height of the viewport</li>
 * </ul>
 */
class SpreadsheetApp extends SpreadsheetHistoryAwareStateWidget {

    // init.............................................................................................................

    init() {
        const showError = this.props.showError;

        const messenger = new SpreadsheetMessenger(showError);
        messenger.setWebWorker(false); // TODO test webworker mode
        this.messenger = messenger;

        this.notification = React.createRef();
        this.settings = React.createRef();
        this.aboveViewport = React.createRef();
        this.formula = React.createRef();
        this.viewport = React.createRef();

        document.title = "Empty spreadsheet";

        this.spreadsheetDeltaCrud = new SpreadsheetMessengerCrud(
            (method, cellOrRange, queryStringParameters) => {
                return this.cellUrl(
                    cellOrRange,
                    method.toUpperCase() === "GET" ? SpreadsheetEngineEvaluation.FORCE_RECOMPUTE : null) + SpreadsheetMessengerCrud.toQueryString(queryStringParameters)
            },
            messenger,
            SpreadsheetDelta.fromJson,
            new ListenerCollection()
        );

        this.spreadsheetLabelCrud = new SpreadsheetMessengerCrud(
            (method, label) => this.labelUrl(label),
            messenger,
            SpreadsheetLabelMapping.fromJson,
            new ListenerCollection()
        );

        this.spreadsheetMetadataCrud = new SpreadsheetMessengerCrud(
            (method, spreadsheetId) => "/api/spreadsheet/" + (spreadsheetId ? spreadsheetId : ""),
            messenger,
            SpreadsheetMetadata.fromJson,
            new ListenerCollection()
        );

        this.onSpreadsheetMetadataRemover = this.spreadsheetMetadataCrud.addListener(this.onSpreadsheetMetadata.bind(this));
    }

    /**
     * Creates a state with some defaults and empty values.
     */
    initialStateFromProps(props) {
        return {
            creatingEmptySpreadsheet: false,
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY,
            windowDimensions: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
        };
    }

    /**
     * Returns a URL with the spreadsheet id and ONLY the provided cell selection.
     */
    cellUrl(selection, evaluation) {
        Preconditions.requireNonNull(selection, "selection");
        Preconditions.optionalInstance(evaluation, SpreadsheetEngineEvaluation, "evaluation")

        const url = this.spreadsheetMetadataApiUrl() + "/cell/" + selection;
        return evaluation ?
            url + "/" + evaluation.nameKebabCase() :
            url;
    }

    /**
     * Creates an URL for the given label.
     */
    labelUrl(label) {
        Preconditions.requireInstance(label, SpreadsheetLabelName, "label");
        return this.spreadsheetMetadataApiUrl() + "/label/" + label
    }

    /**
     * Uses the provided spreadsheetid or falls back to the current {@Link SpreadsheetMetadata} spreadsheet id
     */
    spreadsheetMetadataApiUrl(spreadsheetId) {
        const id = spreadsheetId || this.state.spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID);
        if(!id){
            throw new Error("Missing spreadsheetId parameter and current SpreadsheetMetadata.spreadsheetId");
        }
        if(typeof id !== "string"){
            throw new Error("Expected string spreadsheetId got " + id);
        }
        return "/api/spreadsheet/" + id;
    }

    // history..........................................................................................................

    /**
     * If the state.id has changed this will trigger a load, while if it is empty this will trigger a create empty.
     */
    stateFromHistoryTokens(tokens) {
        return {
            spreadsheetId: tokens[SpreadsheetHistoryHash.SPREADSHEET_ID],
            spreadsheetName: tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME],
        };
    }

    // state-change.....................................................................................................

    /**
     * This is called when the state changes and returns the history tokens equivalent. This may involve
     * creating a new spreadsheet, loading a new id, correcting the name and also updating the viewport dimensions.
     */
    historyTokensFromState(prevState) {
        const historyTokens = {};

        const previousId = prevState.spreadsheetId;
        const state = this.state;
        const id = state.spreadsheetId;

        if(!state.creatingEmptySpreadsheet){
            if(id){
                const metadata = state.spreadsheetMetadata;
                if(metadata.isEmpty() || !(Equality.safeEquals(id, previousId))){
                    console.log("stateSpreadsheetMetadataSpreadsheetId spreadsheetId changed from " + previousId + " to " + id);

                    this.spreadsheetMetadataCrud.get(
                        id,
                        {},
                        () => {
                        },
                        (message, error) => this.props.showError("Unable to load spreadsheet " + id, error)
                    );
                }

                const name = metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME);
                if(name){
                    document.title = name.toString();
                }
                historyTokens[SpreadsheetHistoryHash.SPREADSHEET_NAME] = name;
            }else {
                this.spreadsheetEmptyCreate();
            }
        }

        historyTokens[SpreadsheetHistoryHash.SPREADSHEET_ID] = id;

        // sync windowDimensions with the viewport widget
        const windowDimensions = state.windowDimensions;
        const aboveViewportDimensions = state.aboveViewportDimensions;

        const viewport = this.viewport.current;

        if(windowDimensions && aboveViewportDimensions && viewport){
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
        }

        return historyTokens;
    }

    /**
     * Makes a request which returns some basic default metadata, and without cells the spreadsheet will be empty.
     */
    spreadsheetEmptyCreate() {
        console.log("spreadsheetEmptyCreate");

        this.setState({
            creatingEmptySpreadsheet: true,
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY,
            spreadsheetId: null,
        });

        this.spreadsheetMetadataCrud.post(
            null,
            "",
            () => {
            },
            this.props.showError
        );
    }

    onSpreadsheetMetadata(method, id, metadata) {
        this.setState({
            spreadsheetId: metadata && metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID),
            spreadsheetName: metadata && metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME),
            creatingEmptySpreadsheet: false,
            spreadsheetMetadata: metadata,
        });

        this.props.notificationShow(SpreadsheetNotification.success("Spreadsheet metadata saved"));
    }

    // rendering........................................................................................................

    /**
     * Renders the basic spreadsheet layout.
     */
    render() {
        const {
            classes,
            history,
            notificationShow,
            showError,
        } = this.props;

        const {
            messenger,
            spreadsheetDeltaCrud,
            spreadsheetLabelCrud,
            spreadsheetMetadataCrud,
            state,
        } = this;

        console.log("render", state);

        return (
            <WindowResizer dimensions={this.onWindowResized.bind(this)}>
                <SpreadsheetNavigateAutocompleteWidget key="navigateAutocompleteWidget"
                                                       history={history}
                                                       getSimilarities={this.similaritiesGet.bind(this)}
                                                       notificationShow={notificationShow}
                                                       showError={showError}
                />
                <SpreadsheetLabelWidget key="labelWidget"
                                        history={history}
                                        spreadsheetLabelCrud={this.spreadsheetLabelCrud}
                                        notificationShow={notificationShow}
                                        showError={showError}
                />
                <SpreadsheetBox ref={this.aboveViewport}
                                key={{windowDimensions: state.windowDimensions}}
                                dimensions={this.onAboveViewportResize.bind(this)}
                                className={classes.header}
                >
                    <SpreadsheetAppBar menuClickListener={this.settingsToggle.bind(this)}>
                        <SpreadsheetNameWidget key={"SpreadsheetName"}
                                               history={history}
                                               spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                               showError={showError}
                        />
                    </SpreadsheetAppBar>
                    <SpreadsheetNavigateLinkWidget key="SpreadsheetNavigateLinkWidget"
                                                   history={history}
                                                   showError={showError}
                    />
                    <SpreadsheetFormulaWidget ref={this.formula}
                                              key={"spreadsheetFormula"}
                                              history={history}
                                              spreadsheetDeltaCrud={spreadsheetDeltaCrud}
                                              showError={showError}
                    />
                    <Divider/>
                </SpreadsheetBox>
                <SpreadsheetViewportWidget key={"viewport"}
                                           history={history}
                                           ref={this.viewport}
                                           messenger={messenger}
                                           spreadsheetDeltaCrud={spreadsheetDeltaCrud}
                                           spreadsheetLabelCrud={spreadsheetLabelCrud}
                                           spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                           showError={showError}
                />
                <SpreadsheetSettingsWidget ref={this.settings}
                                           history={history}
                                           spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                           notificationShow={notificationShow}
                                           showError={showError}
                />
            </WindowResizer>
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
            error || this.props.showError,
        )
    }

    // settings.........................................................................................................

    settingsToggle() {
        const widget = this.settings.current;
        widget && widget.toggle();
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
        Preconditions.requirePositiveNumber(count, "count");

        return this.spreadsheetMetadataApiUrl() + "/cell-reference/" + encodeURI(text) + "?count=" + count;
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

    // toString.........................................................................................................

    toString() {
        return this.spreadsheetMetadata().toString();
    }
}

export default withStyles(useStyles)(SpreadsheetApp);
