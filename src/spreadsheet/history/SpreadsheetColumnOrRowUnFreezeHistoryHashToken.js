import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * Represents a command to unfreeze a column or row selection.
 */
export default class SpreadsheetColumnOrRowUnFreezeHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetColumnOrRowUnFreezeHistoryHashToken();

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.UNFREEZE;
    }

    /**
     * Handles history hash token evens such as /column/A/unfreeze or /column/A:C/unfreeze
     */
    onViewportSelectionAction(viewportSelection, viewportWidget) {
        viewportWidget.unFreezeSelection(viewportSelection);
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetColumnOrRowUnFreezeHistoryHashToken);
    }
}