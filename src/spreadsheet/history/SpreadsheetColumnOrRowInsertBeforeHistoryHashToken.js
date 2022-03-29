import SpreadsheetColumnOrRowInsertHistoryHashToken from "./SpreadsheetColumnOrRowInsertHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * Represents a column/row insert BEFORE history hash token.
 */
export default class SpreadsheetColumnOrRowInsertBeforeHistoryHashToken extends SpreadsheetColumnOrRowInsertHistoryHashToken {

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.INSERT_BEFORE + "/" + this.count();
    }

    /**
     * Handles history hash token evens such as /column/A/insertAfter/1 or /column/B:C/insertAfter/2
     */
    onViewportSelectionAction(viewportSelection, viewportWidget) {
        viewportWidget.insertBeforeSelection(
            viewportSelection,
            this.count()
        );
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetColumnOrRowInsertBeforeHistoryHashToken && this.count() === other.count());
    }
}