import SpreadsheetColumnOrRowInsertHistoryHashToken from "./SpreadsheetColumnOrRowInsertHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represents a column/row insert BEFORE history hash token.
 */
export default class SpreadsheetColumnOrRowInsertBeforeHistoryHashToken extends SpreadsheetColumnOrRowInsertHistoryHashToken {

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.INSERT_BEFORE +
            "/" +
            this.count();
    }

    /**
     * Handles history hash token evens such as /column/A/insertAfter/1 or /column/B:C/insertAfter/2
     */
    spreadsheetViewportWidgetExecute(viewportWidget, previousViewport, viewportCell, width, height) {
        if(!this.equals(previousViewport)) {
            viewportWidget.insertBeforeSelection(
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