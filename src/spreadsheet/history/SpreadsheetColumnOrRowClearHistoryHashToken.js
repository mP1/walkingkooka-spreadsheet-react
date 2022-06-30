import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * Represents a column/row clear history hash token.
 */
export default class SpreadsheetColumnOrRowClearHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

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
    onViewportSelectionAction(viewportSelection, viewportWidget) {
        viewportWidget.clearSelection(viewportSelection);
    }
}