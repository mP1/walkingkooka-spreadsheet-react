import CharSequences from "../../CharSequences.js";
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
        const props = this.props;

        this.state = Object.assign(
            this.initialStateFromProps(props),
            props.history.tokens()
        );
    }

    /**
     * Loads the initial state from props. This will be merged with the history hash to form the initial state.
     */
    initialStateFromProps(props) {
        throw new Error("Sub classes must override initialStateFromProps");
    }

    onHistoryChange(tokens) {
        this.setState(this.stateFromHistoryTokens(tokens));
    }

    /**
     * Accepts the tokens from the history hash. This may in turn be used to create state for this widget.
     * This is mostly a filter and mapping process from hash tokens to state.
     */
    stateFromHistoryTokens(tokens) {
        throw new Error("Sub classes must override stateFromHistoryTokens");
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
        const state = this.state;
        console.log(this.prefix() +".componentDidUpdate", "prevState", prevState, "state", state);

        const historyHashTokens = this.historyTokensFromState(prevState);
        const newHash = this.historyParseMergeAndPush(historyHashTokens);
        if(newHash) {
            console.log(this.prefix() +".componentDidUpdate changed hash to " + CharSequences.quoteAndEscape(newHash), "tokens", historyHashTokens, "prevState", prevState, "state", state);
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
