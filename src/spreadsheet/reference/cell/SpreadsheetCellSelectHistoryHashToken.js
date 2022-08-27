import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";

/**
 * Represents a cell or cell range selection with no action.
 */
export default class SpreadsheetCellSelectHistoryHashToken extends SpreadsheetCellHistoryHashToken {

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