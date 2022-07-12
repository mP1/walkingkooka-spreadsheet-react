import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * Represents a column/row clear history hash token.
 */
export default class SpreadsheetColumnOrRowClearHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    toHistoryHashToken() {
        return super.toHistoryHashToken() +
            "/" +
            SpreadsheetHistoryHashTokens.CLEAR;
    }

    /**
     * Handles history hash token evens such as /column/A/clear or /column/B:C/clear or /row/1/clear or /row/1:2/clear
     */
    spreadsheetViewportWidgetExecute(viewportCell, width, height, viewportWidget) {
        viewportWidget.clearSelection(
            this.viewportSelection()
        );
    }
}