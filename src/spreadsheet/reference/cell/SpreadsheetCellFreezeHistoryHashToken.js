import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import viewportSelectionSelectHistoryHashToken from "../../history/viewportSelectionSelectHistoryHashToken.js";

/**
 * Represents a command to freeze one or more cells.
 */
export default class SpreadsheetCellFreezeHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.FREEZE;
    }

    /**
     * Handles history hash token evens such as /cell/A1/freeze or /cell/B2:C3/freeze
     */
    spreadsheetViewportWidgetExecute(viewportWidget, previousViewportSelection, viewportCell, width, height) {
        const viewportSelection = this.viewportSelection();

        viewportWidget.freezeSelection(
            viewportSelection
        );

        return SpreadsheetHistoryHashTokens.viewportSelection(
            viewportSelectionSelectHistoryHashToken(
                viewportSelection
            )
        );
    }
}