import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * Represents a column/row open menu history hash token.
 */
export default class SpreadsheetColumnOrRowMenuHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetColumnOrRowMenuHistoryHashToken();

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.MENU;
    }

    /**
     * Opens the context menu for the given column/row
     */
    onViewportSelectionAction(selection, viewportWidget) {
        viewportWidget.showContextMenu(selection);
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetColumnOrRowMenuHistoryHashToken);
    }
}