import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetSelectionActionHistoryHashToken from "./SpreadsheetSelectionActionHistoryHashToken.js";

/**
 * Represents a column/row delete history hash token.
 */
export default class SpreadsheetColumnOrRowDeleteHistoryHashToken extends SpreadsheetSelectionActionHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetColumnOrRowDeleteHistoryHashToken();

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.DELETE_COLUMN_OR_ROW;
    }

    /**
     * Handles history hash token evens such as /column/A/delete or /column/B:C/delete
     */
    onViewportSelectionAction(selection, viewportWidget) {
        viewportWidget.deleteSelection(selection);
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetColumnOrRowDeleteHistoryHashToken);
    }
}