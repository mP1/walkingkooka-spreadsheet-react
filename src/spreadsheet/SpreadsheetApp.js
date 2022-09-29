import './SpreadsheetApp.css';

import {withStyles} from '@mui/styles';
import CharSequences from "../CharSequences.js";
import Divider from '@mui/material/Divider';
import Equality from "../Equality.js";
import ExpressionNumber from "../math/ExpressionNumber.js";
import HttpMethod from "../net/HttpMethod.js";
import ListenerCollection from "../event/ListenerCollection.js";
import Preconditions from "../Preconditions.js";
import React from 'react';
import RelativeUrl from "../net/RelativeUrl.js";
import SpreadsheetAppBar from "../widget/SpreadsheetAppBar.js";
import SpreadsheetDelta from "./engine/SpreadsheetDelta.js";
import SpreadsheetEngineEvaluation from "./engine/SpreadsheetEngineEvaluation.js";
import SpreadsheetExpressionReferenceSimilarities from "./SpreadsheetExpressionReferenceSimilarities.js";
import SpreadsheetFormulaWidget from "./reference/cell/formula/SpreadsheetFormulaWidget.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHashTokens from "./history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelMapping from "./reference/label/SpreadsheetLabelMapping.js";
import SpreadsheetLabelName from "./reference/label/SpreadsheetLabelName.js";
import SpreadsheetLabelMappingWidget from "./reference/label/SpreadsheetLabelMappingWidget.js";
import SpreadsheetMessenger from "./message/SpreadsheetMessenger.js";
import SpreadsheetMessengerCrud from "./message/SpreadsheetMessengerCrud.js";
import SpreadsheetMetadata from "./meta/SpreadsheetMetadata.js";
import SpreadsheetMetadataDrawerWidget from "./meta/drawer/SpreadsheetMetadataDrawerWidget.js";
import SpreadsheetNameWidget from "./meta/name/SpreadsheetNameWidget.js";
import SpreadsheetNotification from "./notification/SpreadsheetNotification.js";
import SpreadsheetSelectAutocompleteWidget from "./reference/SpreadsheetSelectAutocompleteWidget.js";
import SpreadsheetSelectLinkWidget from "./reference/SpreadsheetSelectLinkWidget.js";
import SpreadsheetToolbarWidget from "./reference/cell/toolbar/SpreadsheetToolbarWidget.js";
import SpreadsheetViewportWidget from "./reference/viewport/SpreadsheetViewportWidget.js";

const useStyles = theme => ({
    header: {
        zIndex: theme.zIndex.metadata + 1, // forces metadata to not overlap application header
    },
});

/**
 * State
 * <ul>
 *      <li>spreadsheetId: The current spreadsheet id</li>
 *      <li>spreadsheetName: The current spreadsheet name</li>
 *      <li>boolean creatingOrLoadingSpreadsheet: when true indicates a new spreadsheet is being created</li>
 *      <li>SpreadsheetMetadata spreadsheetMetadata: The current SpreadsheetMetadata</li>
 * </ul>
 */
class SpreadsheetApp extends SpreadsheetHistoryAwareStateWidget {

    // init.............................................................................................................

    init() {
        ExpressionNumber.fromJson("0"); // force json unmarshaller registry

        const showError = this.props.showError;

        const messenger = new SpreadsheetMessenger(showError);
        messenger.setWebWorker(false); // TODO test webworker mode
        this.messenger = messenger;

        this.notification = React.createRef();
        this.formula = React.createRef();
        this.viewport = React.createRef();

        document.title = "Empty spreadsheet";

        this.spreadsheetDeltaCellCrud = new SpreadsheetMessengerCrud(
            (method, cellOrRange, queryStringParameters) => {
                var url = this.apiSpreadsheetMetadataUrl() + "/cell/" + cellOrRange;
                if(method.equals(HttpMethod.GET)){
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

        this.spreadsheetDeltaColumnCrud = new SpreadsheetMessengerCrud(
            (method, columnOrRange, queryStringParameters) => {
                const url = this.apiSpreadsheetMetadataUrl() + "/column/" + columnOrRange;

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
                    this.apiSpreadsheetMetadataUrl() + "/label/" + label,
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

        this.spreadsheetDeltaRowCrud = new SpreadsheetMessengerCrud(
            (method, rowOrRange, queryStringParameters) => {
                const url = this.apiSpreadsheetMetadataUrl() + "/row/" + rowOrRange;

                return new RelativeUrl(
                    url,
                    queryStringParameters
                );
            },
            messenger,
            SpreadsheetDelta.fromJson,
            new ListenerCollection()
        );

        this.onSpreadsheetMetadataRemover = this.spreadsheetMetadataCrud.addListener(this.onSpreadsheetMetadata.bind(this));

        // initiate an empty spreadsheet
        setTimeout(
            () =>
                this.setState({
                    creatingOrLoadingSpreadsheet: true,
                    spreadsheetId: this.props.history.tokens()[SpreadsheetHistoryHash.SPREADSHEET_ID],
                    spreadsheetMetadata: null,
                }),
            1
        );
    }

    /**
     * Creates a state with some defaults and empty values.
     */
    initialStateFromProps(props) {
        return {
        }
    }

    /**
     * Uses the provided spreadsheetid or falls back to the current {@Link SpreadsheetMetadata} spreadsheet id
     */
    apiSpreadsheetMetadataUrl(spreadsheetId) {
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

    historyTokensFromState(prevState) {
        const historyTokens = SpreadsheetHistoryHashTokens.emptyTokens();

        const {
            creatingOrLoadingSpreadsheet,
            spreadsheetId,
            spreadsheetMetadata
        } = this.state;

        const previousId = prevState.spreadsheetId;
        const differentId = (!Equality.safeEquals(spreadsheetId, previousId));

        if(creatingOrLoadingSpreadsheet) {
            if(spreadsheetId) {
                this.log(".historyTokensFromState loading " + spreadsheetId);

                this.spreadsheetMetadataCrud.get(
                    spreadsheetId,
                    {},
                    this.unknownSpreadsheetErrorHandler(
                        null, // $previousId broken in StrictMode
                        (statusCode, statusMessage) => {
                            this.props.showError("Unable to load spreadsheet " + spreadsheetId);
                        }
                    )
                );
            } else {
                this.spreadsheetEmptyCreate();
            }
        } else {
            if(differentId) {
                this.log(".historyTokensFromState spreadsheetId changed from " + previousId + " to " + spreadsheetId);

                setTimeout(
                    () =>
                        this.setState({
                            creatingOrLoadingSpreadsheet: true,
                        }),
                    1
                );
            }

            const name = spreadsheetMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME);
            document.title = name ? name.toString() : "";

            historyTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = spreadsheetId;
            historyTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = name;
        }

        return historyTokens;
    }

    /**
     * Makes a request which returns some basic default metadata, and without cells the spreadsheet will be empty.
     */
    spreadsheetEmptyCreate() {
        this.log("spreadsheetEmptyCreate");

        this.spreadsheetMetadataCrud.post(
            null,
            "",
            this.showErrorErrorHandler(this.props.showError)
        );
    }

    onSpreadsheetMetadata(method, id, url, requestMetadata, responseMetadata) {
        if(responseMetadata) {
            const spreadsheetName = responseMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME);

            this.setState({
                spreadsheetId: responseMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_ID),
                spreadsheetName: spreadsheetName,
                creatingOrLoadingSpreadsheet: false,
                spreadsheetMetadata: responseMetadata,
            });

            // save notification...
            switch(method) {
                case HttpMethod.POST:
                    this.props.notificationShow(SpreadsheetNotification.success("Spreadsheet metadata saved"));
                    break;
                default:
                    break;
            }
        }
    }

    // rendering........................................................................................................

    /**
     * Renders the basic spreadsheet layout.
     */
    render() {
        const {
            history,
            notificationShow,
            showError,
        } = this.props;

        const {
            messenger,
            spreadsheetDeltaCellCrud,
            spreadsheetDeltaColumnCrud,
            spreadsheetLabelCrud,
            spreadsheetMetadataCrud,
            spreadsheetDeltaRowCrud,
        } = this;

        return (
            <React.Fragment>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "nowrap",
                    width: "100%",
                    height: "100vh",
                }}>
                    <SpreadsheetAppBar key={"AppBar"}
                                       history={history}>
                        <SpreadsheetNameWidget key={"SpreadsheetName"}
                                               history={history}
                                               spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                               showError={showError}
                        />
                        <SpreadsheetToolbarWidget key={"SpreadsheetToolbarWidget"}
                                                  history={history}
                                                  spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}
                                                  showError={showError}
                        />
                    </SpreadsheetAppBar>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        width: "100%"
                    }}>
                        <SpreadsheetSelectLinkWidget key="SpreadsheetSelectLinkWidget"
                                                     history={history}
                                                     showError={showError}
                        />
                        <SpreadsheetFormulaWidget ref={this.formula}
                                                  key={"spreadsheetFormula"}
                                                  history={history}
                                                  spreadsheetViewportWidget={this.viewport}
                                                  spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}
                                                  showError={showError}
                        />
                    </div>
                    <Divider/>
                    <SpreadsheetViewportWidget ref={this.viewport}
                                               key={"viewport"}
                                               clearSelection={this.clearSelection.bind(this)}
                                               deleteSelection={this.deleteSelection.bind(this)}
                                               history={history}
                                               insertAfterSelection={this.insertAfterSelection.bind(this)}
                                               insertBeforeSelection={this.insertBeforeSelection.bind(this)}
                                               messenger={messenger}
                                               spreadsheetDeltaCellCrud={spreadsheetDeltaCellCrud}
                                               spreadsheetDeltaColumnCrud={spreadsheetDeltaColumnCrud}
                                               spreadsheetDeltaRowCrud={spreadsheetDeltaRowCrud}
                                               spreadsheetLabelCrud={spreadsheetLabelCrud}
                                               spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                               showError={showError}
                    />
                </div>
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
                <SpreadsheetMetadataDrawerWidget history={history}
                                                 spreadsheetMetadataCrud={spreadsheetMetadataCrud}
                                                 notificationShow={notificationShow}
                                                 showError={showError}
                />
            </React.Fragment>
        );
    }

    /**
     * Clears the given selection and appends the window if present as a query parameter.
     */
    clearSelection(viewportSelection, window) {
        const selection = viewportSelection.selection();

        this.performSpreadsheetDelta(
            HttpMethod.POST,
            RelativeUrl.parse(
                this.apiSpreadsheetMetadataUrl() +
                "/" +
                selection.historyHashPath() +
                "/" +
                SpreadsheetHistoryHashTokens.CLEAR +
                "?window=" + CharSequences.csv(window) +
                viewportSelection.toQueryString("&")
            ),
            selection,
            JSON.stringify(SpreadsheetDelta.EMPTY.toJson()),
        );
    }

    /**
     * Deletes the given selection and appends the window if present as a query parameter.
     */
    deleteSelection(viewportSelection, window) {
        const selection = viewportSelection.selection();

        this.performSpreadsheetDelta(
            HttpMethod.DELETE,
            RelativeUrl.parse(
                this.apiSpreadsheetMetadataUrl() +
                "/" +
                selection.historyHashPath() +
                "?window=" + CharSequences.csv(window) +
                viewportSelection.toQueryString("&")
            ),
            selection
        );
    }

    /**
     * Does a POST to a url which will insert after the requested count columns or rows.
     */
    insertAfterSelection(viewportSelection, count, window) {
        const selection = viewportSelection.selection();

        this.performSpreadsheetDelta(
            HttpMethod.POST,
            RelativeUrl.parse(
                this.apiSpreadsheetMetadataUrl() +
                "/" +
                selection.historyHashPath() +
                "/after?count=" +
                count +
                "&window=" + CharSequences.csv(window) +
                viewportSelection.toQueryString("&")
            ),
            selection
        );
    }

    /**
     * Does a POST to a url which will insert before the requested count columns or rows.
     */
    insertBeforeSelection(viewportSelection, count, window) {
        const selection = viewportSelection.selection();

        this.performSpreadsheetDelta(
            HttpMethod.POST,
            RelativeUrl.parse(
                this.apiSpreadsheetMetadataUrl() +
                "/" +
                selection.historyHashPath() +
                "/before?count=" +
                count +
                "&window=" + CharSequences.csv(window) +
                viewportSelection.toQueryString("&")
            ),
            selection
        );
    }

    /**
     * Invokes a service which will return a SpreadsheetDelta.
     */
    performSpreadsheetDelta(method, url, id, body) {
        const crud = this.spreadsheetDeltaCellCrud;

        const parameters = {
            method: method,
            body: body,
        };
        const requestValue = null;

        crud.messenger.send(
            url,
            parameters,
            (json) => {
                crud.fireResponse(method, id, url, requestValue, json)
            },
            this.unknownLabelErrorHandler(
                this.showErrorErrorHandler(this.props.showError)
            ),
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
            error || this.showErrorErrorHandler(this.props.showError),
        )
    }

    // similarities.....................................................................................................

    similaritiesGet(text, count, success, failure) {
        Preconditions.requireText(text, "text");
        Preconditions.requirePositiveNumber(count, "count");
        Preconditions.requireFunction(success, "success");
        Preconditions.requireFunction(failure, "failure");

        this.messageSend(
            RelativeUrl.parse(this.apiSpreadsheetMetadataUrl() + "/cell-reference/" + encodeURI(text) + "?count=" + count),
            {
                method: HttpMethod.GET,
            },
            (json) => success(SpreadsheetExpressionReferenceSimilarities.fromJson(json)),
            failure,
        );
    }

    // toString.........................................................................................................

    toString() {
        return this.spreadsheetMetadata().toString();
    }
}

export default withStyles(useStyles)(SpreadsheetApp);
