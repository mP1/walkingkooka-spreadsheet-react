import SpreadsheetColumnOrRowInsertHistoryHashToken from "./SpreadsheetColumnOrRowInsertHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";
import selectHistoryHashToken from "./selectHistoryHashToken.js";

/**
 * Represents a column/row insert AFTER history hash token.
 */
export default class SpreadsheetColumnOrRowInsertAfterHistoryHashToken extends SpreadsheetColumnOrRowInsertHistoryHashToken {

    toHistoryHashToken() {
        return super.toHistoryHashToken() +
            "/" +
            SpreadsheetHistoryHashTokens.INSERT_AFTER +
            "/" +
            this.count();
    }

    /**
     * Handles history hash token evens such as /column/A/insertAfter/1 or /column/B:C/insertAfter/2
     */
    spreadsheetViewportWidgetExecute(viewportCell, width, height, viewportWidget) {
        viewportWidget.insertAfterSelection(
            this.viewportSelection(),
            this.count()
        );
    }

    equals(other) {
        return super.equals(other) &&
            this.count() === other.count();
    }
}