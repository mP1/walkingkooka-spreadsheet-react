import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import viewportSelectHistoryHashToken from "../../history/viewportSelectHistoryHashToken.js";

/**
 * Represents a selection one or more columns or rows.
 */
export default class SpreadsheetColumnOrRowSelectHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

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