import Preconditions from "../../Preconditions.js";
import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represents a cell open menu history hash token.
 */
export default class SpreadsheetCellMenuHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    constructor(viewportSelection, contextMenu) {
        super(viewportSelection);
        this.contextMenuValue = Preconditions.requireObject(contextMenu, "contextMenu");
    }

    contextMenu() {
        return this.contextMenuValue;
    }

    toHistoryHashToken() {
        return super.toHistoryHashToken() + "/" + SpreadsheetHistoryHashTokens.MENU;
    }

    /**
     * Opens the context menu for the given cell
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