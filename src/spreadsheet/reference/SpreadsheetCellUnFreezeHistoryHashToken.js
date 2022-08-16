import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represents a command to unfreeze one or more cells.
 */
export default class SpreadsheetCellUnFreezeHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    toHistoryHashToken() {
        return super.toHistoryHashToken() +
            "/" +
            SpreadsheetHistoryHashTokens.UNFREEZE;
    }

    /**
     * Handles history hash token evens such as /cell/A1/unfreeze or /cell/B2:C3/unfreeze
     */
    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        viewportWidget.unFreezeSelection(
            this.viewportSelection()
        );
    }
}