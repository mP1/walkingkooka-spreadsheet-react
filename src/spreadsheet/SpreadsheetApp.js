import './SpreadsheetApp.css';

import {withStyles} from '@mui/styles';
import Divider from '@mui/material/Divider';
import Equality from "../Equality.js";
import ListenerCollection from "../event/ListenerCollection.js";
import Preconditions from "../Preconditions.js";
import React from 'react';
import RelativeUrl from "../net/RelativeUrl.js";
import SpreadsheetAppBar from "../widget/SpreadsheetAppBar.js";
import SpreadsheetBox from "../widget/SpreadsheetBox.js";
import SpreadsheetDelta from "./engine/SpreadsheetDelta.js";
import SpreadsheetEngineEvaluation from "./engine/SpreadsheetEngineEvaluation.js";
import SpreadsheetExpressionReferenceSimilarities from "./SpreadsheetExpressionReferenceSimilarities.js";
import SpreadsheetFormulaWidget from "./SpreadsheetFormulaWidget.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHashTokens from "./history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelMapping from "./reference/SpreadsheetLabelMapping.js";
import SpreadsheetLabelName from "./reference/SpreadsheetLabelName.js";
import SpreadsheetLabelMappingWidget from "./reference/SpreadsheetLabelMappingWidget.js";
import SpreadsheetMetadata from "./meta/SpreadsheetMetadata.js";
import SpreadsheetMessenger from "./message/SpreadsheetMessenger.js";
import SpreadsheetMessengerCrud from "./message/SpreadsheetMessengerCrud.js";
import SpreadsheetNameWidget from "./SpreadsheetNameWidget.js";
import SpreadsheetNotification from "./notification/SpreadsheetNotification.js";
import SpreadsheetSelectAutocompleteWidget from "./reference/SpreadsheetSelectAutocompleteWidget.js";
import SpreadsheetSelectLinkWidget from "./reference/SpreadsheetSelectLinkWidget.js";
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
        this.aboveViewport = React.createRef();
        this.formula = React.createRef();
        this.viewport = React.createRef();

        document.title = "Empty spreadsheet";

        this.spreadsheetDeltaCellCrud = new SpreadsheetMessengerCrud(
            (method, cellOrRange, queryStringParameters) => {
                var url = this.spreadsheetMetadataApiUrl() + "/cell/" + cellOrRange;
                if(method.toUpperCase() === "GET") {
                    url = url + "/" + SpreadsheetEngineEvaluation.FORCE_RECOMPUTE.nameKebabCase();
                }
                return new RelativeUrl(
                    url,
                    queryStringParameters
                );
            },
            messenger,
            SpreadsheetDelta.fromJson,
            new ListenerCollection()
        );

        this.spreadsheetLabelCrud = new SpreadsheetMessengerCrud(
            (method, label) => {
                Preconditions.requireInstance(label, SpreadsheetLabelName, "label");
                return new RelativeUrl(
                    this.spreadsheetMetadataApiUrl() + "/label/" + label,
                    {}
                );
            },
            messenger,
            SpreadsheetLabelMapping.fromJson,
            new ListenerCollection()
        );

        this.spreadsheetMetadataCrud = new SpreadsheetMessengerCrud(
            (method, spreadsheetId) => new RelativeUrl(
                "/api/spreadsheet/" + (spreadsheetId ? spreadsheetId : ""),
                    {}
            ),
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
        const historyHashTokens = props.history.tokens();

        return {
            creatingEmptySpreadsheet: false,
            spreadsheetId: historyHashTokens[SpreadsheetHistoryHash.SPREADSHEET_ID],
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY,
            windowDimensions: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
        };
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
            spreadsheetId: tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID],
            spreadsheetName: tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME],
        };
    }

    // state-change.....................................................................................................

    /**
     * This is called when the state changes and returns the history tokens equivalent. This may involve
     * creating a new spreadsheet, loading a new id, correcting the name and also updating the viewport dimensions.
     */
    historyTokensFromState(prevState) {
        const historyTokens = SpreadsheetHistoryHashTokens.emptyTokens();

        const previousId = prevState.spreadsheetId;

        const state = this.state;
        const id = state.spreadsheetId;
        const differentId = !(Equality.safeEquals(id, previousId));

        if(!state.creatingEmptySpreadsheet){
            if(id){
                const metadata = state.spreadsheetMetadata;
                if(metadata.isEmpty() || differentId){
                    console.log("stateSpreadsheetMetadataSpreadsheetId spreadsheetId changed from " + previousId + " to " + id);

                    this.spreadsheetMetadataCrud.get(
                        id,
                        {},
                        (message, error) => this.props.showError("Unable to load spreadsheet " + id, error)
                    );
                }

                const name = metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME);
                if(name){
                    document.title = name.toString();
                }

                if(differentId || !(Equality.safeEquals(name, prevState.spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME)))){
                    historyTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = id;
                    historyTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = name;
                }
            }else {
                this.spreadsheetEmptyCreate();
            }
        }

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

        this.spreadsheetMetadataCrud.post(
            null,
            "",
            this.props.showError
        );
    }

    onSpreadsheetMetadata(method, id, url, requestMetadata, responseMetadata) {
        this.setState({
            spreadsheetId: responseMetadata && responseMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID),
            spreadsheetName: responseMetadata && responseMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME),
            creatingEmptySpreadsheet: false,
            spreadsheetMetadata: responseMetadata,
        });

        switch(method) {
            case "POST":
                this.props.notificationShow(SpreadsheetNotification.success("Spreadsheet metadata saved"));
                break;
            default:
                break;
        }
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
            spreadsheetDeltaCellCrud,
            spreadsheetLabelCrud,
            spreadsheetMetadataCrud,
            state,
        } = this;

        return (
            <WindowResizer dimensions={this.onWindowResized.bind(this)}>
                <SpreadsheetSelectAutocompleteWidget key="navigateAutocompleteWidget"
                                                     history={history}
                                                     getSimilarities={this.similaritiesGet.bind(this)}
                                                     notificationShow={notificationShow}
                                                     showError={showError}
                />
                <SpreadsheetLabelMappingWidget key="labelWidget"
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
                    <SpreadsheetAppBar key={"AppBar"}
                                       history={history}>
                        <SpreadsheetNameWidget key={"SpreadsheetName"}
                                               history={history}
                                               spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                               showError={showError}
                        />
                    </SpreadsheetAppBar>
                    <SpreadsheetSelectLinkWidget key="SpreadsheetSelectLinkWidget"
                                                 history={history}
                                                 showError={showError}
                    />
                    <SpreadsheetFormulaWidget ref={this.formula}
                                              key={"spreadsheetFormula"}
                                              history={history}
                                              spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}
                                              showError={showError}
                    />
                    <Divider/>
                </SpreadsheetBox>
                <SpreadsheetViewportWidget key={"viewport"}
                                           deleteSelection={this.deleteSelection.bind(this)}
                                           history={history}
                                           insertAfterSelection={this.insertAfterSelection.bind(this)}
                                           insertBeforeSelection={this.insertBeforeSelection.bind(this)}
                                           ref={this.viewport}
                                           messenger={messenger}
                                           spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}
                                           spreadsheetLabelCrud={spreadsheetLabelCrud}
                                           spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                           showError={showError}
                />
                <SpreadsheetSettingsWidget history={history}
                                           spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                           notificationShow={notificationShow}
                                           showError={showError}
                />
            </WindowResizer>
        );
    }

    /**
     * Deletes the given selection and appends the window if present as a query parameter.
     */
    deleteSelection(selection, window) {
        const query = window ? "?window=" + window : "";

        this.performSpreadsheetDelta(
            "DELETE",
            RelativeUrl.parse(this.spreadsheetMetadataApiUrl() + selection.toDeleteUrl() + query),
            selection
        );
    }

    /**
     * Does a POST to a url which will insert after the requested count columns or rows.
     */
    insertAfterSelection(selection, count, window) {
        const query = window ? "?window=" + window : "";

        this.performSpreadsheetDelta(
            "POST",
            RelativeUrl.parse(this.spreadsheetMetadataApiUrl() + selection.toInsertAfterUrl(count) + query),
            selection
        );
    }

    /**
     * Does a POST to a url which will insert before the requested count columns or rows.
     */
    insertBeforeSelection(selection, count, window) {
        const query = window ? "?window=" + window : "";

        this.performSpreadsheetDelta(
            "POST",
            RelativeUrl.parse(this.spreadsheetMetadataApiUrl() + selection.toInsertBeforeUrl(count) + query),
            selection
        );
    }
    
    /**
     * Invokes a service which will return a SpreadsheetDelta. On both success and failure the history hash the
     * selection & selection-action tokens will be cleared.
     */
    performSpreadsheetDelta(method, url, id) {
        const crud = this.spreadsheetDeltaCellCrud;

        const parameters = {
            method: method,
        };
        const requestValue = null;

        const failure = this.props.showError;

        crud.messenger.send(
            url,
            parameters,
            (json) => {
                crud.fireResponse(method, id, url, requestValue, json)
            },
            () => {
                failure();
            },
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

    // similarities.....................................................................................................

    similaritiesGet(text, count, success, failure) {
        Preconditions.requireText(text, "text");
        Preconditions.requirePositiveNumber(count, "count");
        Preconditions.requireFunction(success, "success");
        Preconditions.requireFunction(failure, "failure");

        this.messageSend(
            RelativeUrl.parse(this.spreadsheetMetadataApiUrl() + "/cell-reference/" + encodeURI(text) + "?count=" + count),
            {
                method: "GET",
            },
            (json) => success(SpreadsheetExpressionReferenceSimilarities.fromJson(json)),
            failure,
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

    // toString.........................................................................................................

    toString() {
        return this.spreadsheetMetadata().toString();
    }
}

export default withStyles(useStyles)(SpreadsheetApp);
