import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represents a command to unfreeze a column or row selection.
 */
export default class SpreadsheetColumnOrRowUnFreezeHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    toHistoryHashToken() {
        return super.toHistoryHashToken() +
            "/" +
            SpreadsheetHistoryHashTokens.UNFREEZE;
    }

    /**
     * Handles history hash token evens such as /column/A/unfreeze or /column/A:C/unfreeze
     */
    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        viewportWidget.unFreezeSelection(
            this.viewportSelection()
        );
    }
}