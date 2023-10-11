import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import viewportSelectHistoryHashToken from "../../history/viewportSelectHistoryHashToken.js";

/**
 * Represents a command to freeze one or more columns or rows.
 */
export default class SpreadsheetColumnOrRowFreezeHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.FREEZE;
    }

    /**
     * Handles history hash token evens such as /column/A/freeze or /column/A:C/freeze
     */
    spreadsheetViewportWidgetExecute(viewportWidget, previousViewport, viewportCell, width, height) {
        const viewport = this.viewport();

        viewportWidget.freezeSelection(
            viewport
        );

        return SpreadsheetHistoryHashTokens.viewport(
            viewportSelectHistoryHashToken(
                viewport
            )
        );
    }
}