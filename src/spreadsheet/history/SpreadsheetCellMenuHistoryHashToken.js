import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * Represents a cell open menu history hash token.
 */
export default class SpreadsheetCellMenuHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetCellMenuHistoryHashToken();

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.MENU;
    }

    /**
     * Opens the context menu for the given cell
     */
    onViewportSelectionAction(viewportSelection, viewportWidget) {
        viewportWidget.showContextMenu(viewportSelection);
    }
}