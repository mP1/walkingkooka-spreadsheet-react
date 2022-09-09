import PropTypes from "prop-types";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";
import SpreadsheetWidget from "../SpreadsheetWidget.js";
import viewportSelectionSelectHistoryHashToken from "./viewportSelectionSelectHistoryHashToken.js";

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
    historyPushViewportSelectionSelect() {
        const tokens = this.props.history.tokens();
        const viewportSelectionToken = tokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION];
        if(viewportSelectionToken){
            this.historyPushViewportSelection(
                viewportSelectionSelectHistoryHashToken(
                    viewportSelectionToken.viewportSelection()
                )
            );
        }
    }

    historyPushViewportSelection(viewportSelection) {
        const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
        tokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION] = viewportSelection;
        this.historyMergeAndPush(tokens);
    }

    historyMergeAndPush(tokens) {
        const copy = Object.assign({}, tokens);

        const propertyCount = Object.keys(copy).length;
        if(propertyCount > (copy[SpreadsheetHistoryHashTokens.TX_ID] != null ? 1 : 0)){

            if(SpreadsheetHistoryHash.stringify(this.props.history.tokens()).includes("/cell/B1")) {
                this.b1 = true;
            }
            if(this.b1 && SpreadsheetHistoryHash.stringify(this.props.history.tokens()).includes("A1:B1")) {
                debugger;
            }


            setTimeout(() => {
                console.log(this.prefix() + ".historyMergeAndPush: txId: " + SpreadsheetHistoryHashTokens.currentTxId() + " ", copy);
                this.props.history.mergeAndPush(copy);
            }, 1);
        }
    }

    showError(message, error) {
        throw new Error("Sub classes must override showError");
    }

    log(...params) {
        console.log(this.prefix() + params[0], params.shift());
    }
}

SpreadsheetHistoryAwareWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired
}
