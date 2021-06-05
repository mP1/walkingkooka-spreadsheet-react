import PropTypes from "prop-types";
import React from 'react';
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";

/**
 * A React.Component that is also interested in history change events. Some of the basics like registering a history
 */
export default class SpreadsheetHistoryAwareWidget extends React.Component {

    constructor(props) {
        super(props);

        this.init();
    }

    init() {
        throw new Error("Sub classes must override init()");
    }

    componentDidMount() {
        this.historyUnlisten = this.props.history.listen(
            (location) => this.onHistoryChange(
                SpreadsheetHistoryHash.parse(
                    location.pathname,
                    this.showError.bind(this)
                )
            )
        );
    }

    componentWillUnmount() {
        this.historyUnlisten();
        delete this.historyUnlisten;
    }

    onHistoryChange(tokens) {
        throw new Error("Sub classes must override onHistoryChange");
    }

    historyParseMergeAndPush(tokens) {
        SpreadsheetHistoryHash.parseMergeAndPush(
            this.props.history,
            tokens,
            this.showError.bind(this)
        );
    }

    showError(message) {
        throw new Error("Sub classes must override showError");
    }
}

SpreadsheetHistoryAwareWidget.propTypes = {
    history: PropTypes.object.isRequired,
}
