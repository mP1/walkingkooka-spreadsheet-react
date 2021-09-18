import SpreadsheetColumnOrRowSelectionActionHistoryHashToken
    from "./SpreadsheetColumnOrRowSelectionActionHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * Represents a column/row delete history hash token.
 */
export default class SpreadsheetColumnOrRowDeleteHistoryHashToken extends SpreadsheetColumnOrRowSelectionActionHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetColumnOrRowDeleteHistoryHashToken();

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.DELETE;
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