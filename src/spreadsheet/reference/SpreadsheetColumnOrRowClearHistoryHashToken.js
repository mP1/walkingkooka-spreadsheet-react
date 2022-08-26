import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represents a column/row clear history hash token.
 */
export default class SpreadsheetColumnOrRowClearHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.CLEAR;
    }

    /**
     * Handles history hash token evens such as /column/A/clear or /column/B:C/clear or /row/1/clear or /row/1:2/clear
     */
    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        viewportWidget.clearSelection(
            this.viewportSelection()
        );

        viewportWidget.historyPushSelectionOnly();
    }
}