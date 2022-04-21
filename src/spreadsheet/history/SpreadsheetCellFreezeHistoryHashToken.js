import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * Represents a command to freeze one or more cells.
 */
export default class SpreadsheetCellFreezeHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetCellFreezeHistoryHashToken();

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.FREEZE;
    }

    /**
     * Handles history hash token evens such as /cell/A1/freeze or /cell/B2:C3/freeze
     */
    onViewportSelectionAction(viewportSelection, viewportWidget) {
        viewportWidget.freezeSelection(viewportSelection);
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetCellFreezeHistoryHashToken);
    }
}