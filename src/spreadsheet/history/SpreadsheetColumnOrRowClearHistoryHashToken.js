import SpreadsheetColumnOrRowSelectionActionHistoryHashToken
    from "./SpreadsheetColumnOrRowSelectionActionHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * Represents a column/row clear history hash token.
 */
export default class SpreadsheetColumnOrRowClearHistoryHashToken extends SpreadsheetColumnOrRowSelectionActionHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetColumnOrRowClearHistoryHashToken();

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.CLEAR;
    }

    /**
     * Handles history hash token evens such as /column/A/clear or /column/B:C/clear or /row/1/clear or /row/1:2/clear
     */
    onViewportSelectionAction(selection, viewportWidget) {
        viewportWidget.clearSelection(selection);

        const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
        tokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = null;
        viewportWidget.historyParseMergeAndPush(tokens);
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetColumnOrRowClearHistoryHashToken);
    }
}