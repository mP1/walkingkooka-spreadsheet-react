import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import viewportSelectionSelectHistoryHashToken from "../../history/viewportSelectionSelectHistoryHashToken.js";

/**
 * A history hash token that represents a cell or cell-range clear
 */
export default class SpreadsheetCellClearHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.CLEAR;
    }

    /**
     * Handles history hash token evens such as /cell/A1/clear or /cell/A1:B2/clear
     */
    spreadsheetViewportWidgetExecute(viewportWidget, previousViewportSelection, viewportCell, width, height) {
        const viewportSelection = this.viewportSelection();

        viewportWidget.clearSelection(
            viewportSelection
        );

        return SpreadsheetHistoryHashTokens.viewportSelection(
            viewportSelectionSelectHistoryHashToken(
                viewportSelection
            )
        );
    }
}