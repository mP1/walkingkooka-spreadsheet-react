import Link from "@mui/material/Link";
import PropTypes from 'prop-types';
import React from 'react';
import SpreadsheetHistoryAwareStateWidget from "../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";

/**
 * A widget that updates the href of a Link to which when clicked will display the navigate modal.
 * <ol>
 *     <li>cell: the cell displayed as text by the link</li>
 * </ol>
 */
export default class SpreadsheetSelectLinkWidget extends SpreadsheetHistoryAwareStateWidget {

    static SELECT_LINK_ID = "select-Link";

    init() {
    }

    initialStateFromProps(props) {
        const historyHashTokens = props.history.tokens();

        return {
            spreadsheetId: historyHashTokens[SpreadsheetHistoryHash.SPREADSHEET_ID],
        };
    }

    /**
     * Recreate the target of the link.
     */
    stateFromHistoryTokens(tokens) {
        return {
            spreadsheetId: tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID],
            spreadsheetName: tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME],
            viewportSelection: tokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION],
        };
    }

    historyTokensFromState(prevState) {
        return SpreadsheetHistoryHashTokens.emptyTokens(); // never update history from state.
    }

    render() {
        const history = this.props.history;
        const state = this.state;
        state[SpreadsheetHistoryHashTokens.SELECT] = true;
        const target = '#' + history.mergeAndStringify(state)

        const viewportSelectionToken = state.viewportSelection;

        return <Link id={SpreadsheetSelectLinkWidget.SELECT_LINK_ID}
                     disabled={!Boolean(viewportSelectionToken)}
                     href={target}
                     style={{
                         display: "inline-block",
                         paddingLeft: "1ex",
                         paddingRight: "1ex",
                         paddingTop: "2px",
                         paddingBottom: "2px",
                     }}>{
            viewportSelectionToken ? viewportSelectionToken.viewportSelection().selection().toString() : "Go"
        }</Link>
    }
}

SpreadsheetSelectLinkWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    showError: PropTypes.func.isRequired,
}