import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * A history hash token that represents a cell or cell-range clear
 */
export default class SpreadsheetCellClearHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetCellClearHistoryHashToken();

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.CLEAR;
    }

    /**
     * Handles history hash token evens such as /cell/A1/clear or /cell/A1:B2/clear
     */
    onViewportSelectionAction(selection, viewportWidget) {
        viewportWidget.clearSelection(selection);
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetCellClearHistoryHashToken);
    }
}