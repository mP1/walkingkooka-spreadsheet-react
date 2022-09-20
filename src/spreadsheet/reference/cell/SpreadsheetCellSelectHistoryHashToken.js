import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import viewportSelectionSelectHistoryHashToken from "../../history/viewportSelectionSelectHistoryHashToken.js";

/**
 * Represents a cell or cell range selection with no action.
 */
export default class SpreadsheetCellSelectHistoryHashToken extends SpreadsheetCellHistoryHashToken {

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