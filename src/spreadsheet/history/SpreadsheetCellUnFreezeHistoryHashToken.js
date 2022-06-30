import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * Represents a command to unfreeze one or more cells.
 */
export default class SpreadsheetCellUnFreezeHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetCellUnFreezeHistoryHashToken();

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.UNFREEZE;
    }

    /**
     * Handles history hash token evens such as /cell/A1/unfreeze or /cell/B2:C3/unfreeze
     */
    onViewportSelectionAction(viewportSelection, viewportWidget) {
        viewportWidget.unFreezeSelection(viewportSelection);
    }
}