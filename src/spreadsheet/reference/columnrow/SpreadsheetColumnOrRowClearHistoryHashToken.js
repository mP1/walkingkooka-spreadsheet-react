import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import viewportSelectHistoryHashToken from "../../history/viewportSelectHistoryHashToken.js";

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
    spreadsheetViewportWidgetExecute(viewportWidget, previousViewport, viewportCell, width, height) {
        const viewport = this.viewport();

        viewportWidget.clearSelection(
            viewport
        );

        return SpreadsheetHistoryHashTokens.viewport(
            viewportSelectHistoryHashToken(
                viewport
            )
        );
    }
}