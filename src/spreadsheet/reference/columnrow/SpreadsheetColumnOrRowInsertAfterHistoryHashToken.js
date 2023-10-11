import SpreadsheetColumnOrRowInsertHistoryHashToken from "./SpreadsheetColumnOrRowInsertHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represents a column/row insert AFTER history hash token.
 */
export default class SpreadsheetColumnOrRowInsertAfterHistoryHashToken extends SpreadsheetColumnOrRowInsertHistoryHashToken {

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.INSERT_AFTER +
            "/" +
            this.count();
    }

    /**
     * Handles history hash token evens such as /column/A/insertAfter/1 or /column/B:C/insertAfter/2
     */
    spreadsheetViewportWidgetExecute(viewportWidget, previousViewport, viewportCell, width, height) {
        if(!this.equals(previousViewport)) {
            viewportWidget.insertAfterSelection(
                this.viewport(),
                this.count()
            );
        }

        return null;
    }

    equals(other) {
        return super.equals(other) &&
            this.count() === other.count();
    }
}