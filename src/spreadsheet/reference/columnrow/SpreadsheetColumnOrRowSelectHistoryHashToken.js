import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import viewportSelectionSelectHistoryHashToken from "../../history/viewportSelectionSelectHistoryHashToken.js";

/**
 * Represents a selection one or more columns or rows.
 */
export default class SpreadsheetColumnOrRowSelectHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    /**
     * Loads cells to fill the viewport.
     */
    spreadsheetViewportWidgetExecute(viewportWidget, previousViewportSelection, viewportCell, width, height) {
        const viewportSelection = this.viewportSelection();

        if(!this.equals(previousViewportSelection)) {
            viewportWidget.loadCells(
                viewportCell.viewport(
                    width,
                    height
                ),
                viewportSelection
            );

            viewportWidget.giveViewportSelectionFocus(viewportSelection);
        }

        return viewportWidget.isFocused() &&
            SpreadsheetHistoryHashTokens.viewportSelection(
                viewportSelectionSelectHistoryHashToken(
                    viewportSelection
                )
            );
    }
}