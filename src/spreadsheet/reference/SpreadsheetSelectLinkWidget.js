import Link from "@mui/material/Link";
import PropTypes from 'prop-types';
import React from 'react';
import SpreadsheetHistoryAwareStateWidget from "../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";

/**
 * A widget that updates the href of a Link to which when clicked will display the navigate modal.
 * <ol>
 *     <li>target: the target link hash that will be displayed by the link</li>
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
        tokens[SpreadsheetHistoryHashTokens.SELECT] = true;

        return {
            target: '#' + this.props.history.mergeAndStringify(tokens),
            cell: tokens[SpreadsheetHistoryHashTokens.SELECTION],
        };
    }

    historyTokensFromState(prevState) {
        return SpreadsheetHistoryHashTokens.emptyTokens(); // never update history from state.
    }

    render() {
        const {cell, target} = this.state;

        return <Link id={SpreadsheetSelectLinkWidget.SELECT_LINK_ID}
                     disabled={!cell}
                     href={target}
                     style={{
                         display: "inline-block",
                         paddingLeft: "1ex",
                         paddingRight: "1ex",
                         paddingTop: "2px",
                         paddingBottom: "2px",
                     }}>{
            cell ? cell.toString() : "Go"
        }</Link>
    }
}

SpreadsheetSelectLinkWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    showError: PropTypes.func.isRequired,
}