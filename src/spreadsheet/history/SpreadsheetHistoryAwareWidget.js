import PropTypes from "prop-types";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
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
        return this.props.history.mergeAndPush(tokens);
    }

    showError(message, error) {
        throw new Error("Sub classes must override showError");
    }
}

SpreadsheetHistoryAwareWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired
}
