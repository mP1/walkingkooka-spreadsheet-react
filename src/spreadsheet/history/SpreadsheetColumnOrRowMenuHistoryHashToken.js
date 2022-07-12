import Preconditions from "../../Preconditions.js";
import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * Represents a column/row open menu history hash token.
 */
export default class SpreadsheetColumnOrRowMenuHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    constructor(viewportSelection, contextMenu) {
        super(viewportSelection);
        this.contextMenuValue = Preconditions.requireObject(contextMenu, "contextMenu");
    }

    contextMenu() {
        return this.contextMenuValue;
    }

    toHistoryHashToken() {
        return super.toHistoryHashToken() +
            "/" +
            SpreadsheetHistoryHashTokens.MENU;
    }

    /**
     * Opens the context menu for the given column/row
     */
    spreadsheetViewportWidgetExecute(viewportCell, width, height, viewportWidget) {
        viewportWidget.showContextMenu(
            this.viewportSelection()
        );
    }

    equals(other) {
        return super.equals(other) &&
            this.contextMenu().equals(other.contextMenu());
    }
}