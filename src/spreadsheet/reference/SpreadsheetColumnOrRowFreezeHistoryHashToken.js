import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represents a command to freeze one or more columns or rows.
 */
export default class SpreadsheetColumnOrRowFreezeHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    toHistoryHashToken() {
        return super.toHistoryHashToken() +
            "/" +
            SpreadsheetHistoryHashTokens.FREEZE;
    }

    /**
     * Handles history hash token evens such as /column/A/freeze or /column/A:C/freeze
     */
    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        viewportWidget.freezeSelection(
            this.viewportSelection()
        );
    }
}