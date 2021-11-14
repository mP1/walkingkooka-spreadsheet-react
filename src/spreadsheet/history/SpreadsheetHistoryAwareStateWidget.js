import Equality from "../../Equality.js";
import PropTypes from "prop-types";
import SpreadsheetHistoryAwareWidget from "./SpreadsheetHistoryAwareWidget.js";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";

/**
 * A React.Component that is also interested in history change events. Some of the basics like registering a history
 * listener, and reacting to history and state changes are implemented with template methods requiring overriding.
 */
export default class SpreadsheetHistoryAwareStateWidget extends SpreadsheetHistoryAwareWidget {

    constructor(props) {
        super(props);
        this.initializeState();
    }

    initializeState() {
        this.state = this.initialStateFromProps(this.props);
    }

    /**
     * Loads the initial state from props. This will be merged with the history hash to form the initial state.
     */
    initialStateFromProps(props) {
        throw new Error("Sub classes must override initialStateFromProps");
    }

    onHistoryChange(tokens) {
        if(this.historyUnlisten) {
            this.setState(this.stateFromHistoryTokens(tokens));
        }
    }

    /**
     * Accepts the tokens from the history hash. This may in turn be used to create state for this widget.
     * This is mostly a filter and mapping process from hash tokens to state.
     */
    stateFromHistoryTokens(tokens) {
        throw new Error("Sub classes must override stateFromHistoryTokens");
    }

    setState(newState) {
        if(this.insideHistoryTokensFromState){
            throw new Error("Cannot call setState inside historyTokensFromState(), state:" + JSON.stringify(this.state) + ", newState: " + JSON.stringify(newState));
        }
        return super.setState(newState);
    }

    /**
     * Only perform an update if the state actually changed.
     */
    shouldComponentUpdate(nextProps, nextState) {
        return !Equality.safeEquals(this.state, nextState);
    }

    /**
     * Handles a state change, invoking {@link #historyTokensFromState} and updating the history hash with the result.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.insideHistoryTokensFromState = true;
        try {
            const historyHashTokens = this.historyTokensFromState(prevState);
            this.historyParseMergeAndPush(historyHashTokens);
        } finally {
            delete this.insideHistoryTokensFromState;
        }
    }

    /**
     * This method is called when state changes, and should translates the state to history tokens, and update the UI.
     */
    historyTokensFromState(prevState) {
        throw new Error("Sub classes must override historyTokensFromState()");
    }

    showError(message, error) {
        this.props.showError(message, error);
    }
}

SpreadsheetHistoryAwareStateWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired
}
