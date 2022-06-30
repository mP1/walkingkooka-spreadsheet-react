import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * A history hash token that represents a cell or cell-range delete
 */
export default class SpreadsheetCellDeleteHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetCellDeleteHistoryHashToken();

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.DELETE;
    }

    /**
     * Handles history hash token evens such as /cell/A1/delete or /cell/A1:B2/delete
     */
    onViewportSelectionAction(viewportSelection, viewportWidget) {
        viewportWidget.deleteSelection(viewportSelection);
    }

    labelMappingWidget(widget) {
        widget.deleteLabelMapping();
    }
}