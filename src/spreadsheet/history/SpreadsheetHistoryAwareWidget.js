import PropTypes from "prop-types";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";
import SpreadsheetWidget from "../SpreadsheetWidget.js";

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

    historyParseMergeAndPush(tokens) {
        const copy = Object.assign({}, tokens);

        const propertyCount = Object.keys(copy).length;
        if(propertyCount > (copy[SpreadsheetHistoryHashTokens.TX_ID] != null ? 1 : 0)){
            setTimeout(() => {
                console.log(this.prefix() + ".historyParseMergeAndPush: txId: " + SpreadsheetHistoryHashTokens.currentTxId() + " ", copy);
                this.props.history.mergeAndPush(copy);
            }, 1);
        }
    }

    showError(message, error) {
        throw new Error("Sub classes must override showError");
    }
}

SpreadsheetHistoryAwareWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired
}
