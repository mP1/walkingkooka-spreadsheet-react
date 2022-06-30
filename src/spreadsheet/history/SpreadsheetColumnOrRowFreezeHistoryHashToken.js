import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * Represents a command to freeze one or more columns or rows.
 */
export default class SpreadsheetColumnOrRowFreezeHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetColumnOrRowFreezeHistoryHashToken();

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.FREEZE;
    }

    /**
     * Handles history hash token evens such as /column/A/freeze or /column/A:C/freeze
     */
    onViewportSelectionAction(viewportSelection, viewportWidget) {
        viewportWidget.freezeSelection(viewportSelection);
    }
}