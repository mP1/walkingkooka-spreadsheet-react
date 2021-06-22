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
        const history = this.props.history;
        this.historyUnlisten = history.listen(
            (location) => {
                // before firing events, verify the history has is actually valid, if invalid push the fixed
                const pathname = location.pathname;
                const tokens = SpreadsheetHistoryHash.parse(
                    pathname,
                    this.showError.bind(this)
                );

                const merged = SpreadsheetHistoryHash.merge(
                    tokens,
                    {}
                );
                const updatedPathname = SpreadsheetHistoryHash.join(merged);
                if(updatedPathname !== history.location.pathname){
                    history.push(updatedPathname);
                }

                this.onHistoryChange(tokens);
            }
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
