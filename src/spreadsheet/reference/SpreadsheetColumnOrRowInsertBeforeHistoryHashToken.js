import SpreadsheetColumnOrRowInsertHistoryHashToken from "./SpreadsheetColumnOrRowInsertHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represents a column/row insert BEFORE history hash token.
 */
export default class SpreadsheetColumnOrRowInsertBeforeHistoryHashToken extends SpreadsheetColumnOrRowInsertHistoryHashToken {

    toHistoryHashToken() {
        return super.toHistoryHashToken() +
            "/" +
            SpreadsheetHistoryHashTokens.INSERT_BEFORE +
            "/" +
            this.count();
    }

    /**
     * Handles history hash token evens such as /column/A/insertAfter/1 or /column/B:C/insertAfter/2
     */
    spreadsheetViewportWidgetExecute(viewportCell, width, height, viewportWidget) {
        viewportWidget.insertBeforeSelection(
            this.viewportSelection(),
            this.count()
        );
    }

    equals(other) {
        return super.equals(other) &&
            this.count() === other.count();
    }
}