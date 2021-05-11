import PropTypes from "prop-types";
import React from 'react';
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";

/**
 * A React.Component that is also interested in history change events. Some of the basics like registering a history
 */
export default class SpreadsheetHistoryAwareWidget extends React.Component {

    constructor(props) {
        super(props);
        this.history = props.history;

        this.init();
    }

    init() {
        throw new Error("Sub classes must override init()");
    }

    componentDidMount() {
        this.historyUnlisten = this.history.listen(
            (location) => this.onHistoryChange(
                SpreadsheetHistoryHash.parse(
                    location.pathname,
                    this.props.showError
                )
            )
        );
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
        this.historyUnlisten();
    }

    onHistoryChange(tokens) {
        throw new Error("Sub classes must override onHistoryChange");
    }

    historyParseMergeAndPush(tokens) {
        SpreadsheetHistoryHash.parseMergeAndPush(
            this.history,
            tokens,
            this.props.showError);
    }
}

SpreadsheetHistoryAwareWidget.propTypes = {
    history: PropTypes.object.isRequired,
    showError: PropTypes.func.isRequired,
}
