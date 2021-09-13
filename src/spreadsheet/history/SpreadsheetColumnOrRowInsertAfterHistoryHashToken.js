import SpreadsheetColumnOrRowInsertHistoryHashToken from "./SpreadsheetColumnOrRowInsertHistoryHashToken.js";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";

/**
 * Represents a column/row insert AFTER history hash token.
 */
export default class SpreadsheetColumnOrRowInsertAfterHistoryHashToken extends SpreadsheetColumnOrRowInsertHistoryHashToken {

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.INSERT_AFTER + "/" + this.count();
    }

    /**
     * Handles history hash token evens such as /column/A/insertAfter/1 or /column/B:C/insertAfter/2
     */
    onViewportSelectionAction(selection, viewportWidget) {
        viewportWidget.insertAfterSelection(selection, this.count());

        const tokens = {};
        tokens[SpreadsheetHistoryHash.SELECTION_ACTION] = null;
        viewportWidget.historyParseMergeAndPush(tokens);
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetColumnOrRowInsertAfterHistoryHashToken && this.count() === other.count());
    }
}