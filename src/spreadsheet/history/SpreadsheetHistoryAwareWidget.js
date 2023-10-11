import PropTypes from "prop-types";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";
import SpreadsheetWidget from "../SpreadsheetWidget.js";
import viewportSelectHistoryHashToken from "./viewportSelectHistoryHashToken.js";

/**
 * A React.Component that is also interested in history change events. Some of the basics like registering a history
 */
export default class SpreadsheetHistoryAwareWidget extends SpreadsheetWidget {

    constructor(props) {
        super(props);

        this.init();
    }

    init() {
        throw new Error("Sub classes must override init()");
    }

    componentDidMount() {
        this.historyUnlisten = this.props.history.addListener(this.onHistoryChange.bind(this));
    }

    componentWillUnmount() {
        this.historyUnlisten();
        delete this.historyUnlisten;
    }

    onHistoryChange(tokens) {
        throw new Error("Sub classes must override onHistoryChange");
    }

    /**
     * If a viewport selection is present replace it with only a basic selection and not some other action,
     * eg formula-edit becomes cell select.
     */
    historyPushViewportSelect() {
        const tokens = this.props.history.tokens();
        const viewportToken = tokens[SpreadsheetHistoryHashTokens.VIEWPORT];
        if(viewportToken){
            this.historyPushViewport(
                viewportSelectHistoryHashToken(
                    viewportToken.viewport()
                )
            );
        }
    }

    historyPushViewport(viewport) {
        this.historyMergeAndPush(
            SpreadsheetHistoryHashTokens.viewport(viewport)
        );
    }

    historyMergeAndPush(tokens) {
        const copy = Object.assign({}, tokens);

        const propertyCount = Object.keys(copy).length;
        if(propertyCount > (copy[SpreadsheetHistoryHashTokens.TX_ID] != null ? 1 : 0)){
            setTimeout(() => {
                this.log(".historyMergeAndPush: txId: " + SpreadsheetHistoryHashTokens.currentTxId() + " " + JSON.stringify(copy));
                this.props.history.mergeAndPush(copy);
            }, 1);
        }
    }

    /**
     * Wraps another error handler but when invoked clears the viewport. This is useful for cases such as
     * clearing the selection of an invalid or unknown label.
     */
    unknownLabelErrorHandler(showError) {
        const history = this.props.history;

        return (statusCode, statusMessage) => {
            this.log("statusCode: " + statusCode + " statusMessage: " + statusMessage);

            if(statusCode >= 400){
                const tokens = SpreadsheetHistoryHash.emptyTokens();
                tokens[SpreadsheetHistoryHashTokens.VIEWPORT] = null;
                history.mergeAndPush(tokens);

                showError(statusCode, statusMessage);
            }
        }
    }

    /**
     * Displays the error, and then restores the original (given) spreadsheetId.
     */
    unknownSpreadsheetErrorHandler(spreadsheetId, showError) {
        const history = this.props.history;

        return (statusCode, statusMessage) => {
            this.log("statusCode: " + statusCode + " statusMessage: " + statusMessage);

            showError(statusCode, statusMessage);

            const tokens = SpreadsheetHistoryHash.emptyTokens();
            tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = spreadsheetId;
            tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = null;
            history.mergeAndPush(tokens);
        };
    }

    log(...params) {
        params[0] = this.prefix() + params[0];
        console.log(...params);
    }
}

SpreadsheetHistoryAwareWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired
}
