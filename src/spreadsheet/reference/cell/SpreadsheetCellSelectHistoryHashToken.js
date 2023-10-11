import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import viewportSelectHistoryHashToken from "../../history/viewportSelectHistoryHashToken.js";

/**
 * Represents a cell or cell range selection with no action.
 */
export default class SpreadsheetCellSelectHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    /**
     * Loads cells to fill the viewport.
     */
    spreadsheetViewportWidgetExecute(viewportWidget, previousViewport, viewportCell, width, height) {
        const viewport = this.viewport();

        if(!this.equals(previousViewport)) {
            viewportWidget.loadCells(
                viewportCell.viewport(
                    width,
                    height
                ),
                viewport
            );

            viewportWidget.giveViewportFocus(viewport);
        }

        return viewportWidget.isFocused() &&
            SpreadsheetHistoryHashTokens.viewport(
                viewportSelectHistoryHashToken(
                    viewport
                )
            );
    }
}