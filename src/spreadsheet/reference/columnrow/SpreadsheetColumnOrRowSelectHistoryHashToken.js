import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";

/**
 * Represents a selection one or more columns or rows.
 */
export default class SpreadsheetColumnOrRowSelectHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    /**
     * Loads cells to fill the viewport.
     */
    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        viewportWidget.loadCells(
            viewportCell.viewport(
                width,
                height
            ),
            this.viewportSelection()
        );
    }
}