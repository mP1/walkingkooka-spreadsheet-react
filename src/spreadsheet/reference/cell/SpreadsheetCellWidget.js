import ImmutableMap from "../../../util/ImmutableMap.js";
import Preconditions from "../../../Preconditions.js";
import PropTypes from 'prop-types';
import selectHistoryHashToken from "../../history/selectHistoryHashToken.js";
import SpreadsheetCell from "../../SpreadsheetCell.js";
import SpreadsheetDelta from "../../engine/SpreadsheetDelta.js";
import SpreadsheetHistoryAwareStateWidget from "../../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "../../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetMessengerCrud from "../../message/SpreadsheetMessengerCrud.js";
import SystemObject from "../../../SystemObject.js";

/**
 * An abstract widget that contains some cell related helper methods..
 */
export default class SpreadsheetCellWidget extends SpreadsheetHistoryAwareStateWidget {

    componentDidMount() {
        super.componentDidMount();

        this.onSpreadsheetDeltaRemover = this.props.spreadsheetDeltaCellCrud.addListener(this.onSpreadsheetDelta.bind(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.onSpreadsheetDeltaRemover && this.onSpreadsheetDeltaRemover();
        delete this.onSpreadsheetDeltaRemover;
    }

    /**
     * Clears the selection action from the history hash. This is done after a clear and other similar actions.
     */
    historyPushSelectionOnly() {
        const tokens = this.props.history.tokens();
        const viewportSelectionToken = tokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION];
        if(viewportSelectionToken){
            const viewportSelection = viewportSelectionToken.viewportSelection();
            tokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION] = selectHistoryHashToken(
                viewportSelection
            );
            this.historyParseMergeAndPush(tokens);
        }
    }

    onSpreadsheetDelta(method, cellOrLabel, url, requestDelta, responseDelta) {
        SystemObject.throwUnsupportedOperation();
    }

    /**
     * Calls the server to PATCH a cell and also handles updating the history hash leaving just the selection.
     */
    patchCell(cell) {
        Preconditions.requireInstance(cell, SpreadsheetCell, "cell");

        const props = this.props;
        props.spreadsheetDeltaCellCrud.patch(
            cell.reference(),
            new SpreadsheetDelta(
                null,
                [cell],
                [],
                [],
                [],
                [],
                [],
                [],
                ImmutableMap.EMPTY,
                ImmutableMap.EMPTY,
                this.state.window,
            ),
            props.showError,
        );
    }
}

SpreadsheetCellWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetDeltaCellCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    showError: PropTypes.func.isRequired,
}