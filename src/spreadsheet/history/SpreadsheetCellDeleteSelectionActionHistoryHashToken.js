import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * A history hash token that represents a cell or cell-range delete
 */
export default class SpreadsheetCellDeleteSelectionActionHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetCellDeleteSelectionActionHistoryHashToken();

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.DELETE;
    }

    /**
     * Handles history hash token evens such as /cell/A1/delete or /cell/A1:B2/delete
     */
    onViewportSelectionAction(selection, viewportWidget) {
        viewportWidget.deleteSelection(selection);
    }

    labelMappingWidget(widget) {
        widget.deleteLabelMapping();
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetCellDeleteSelectionActionHistoryHashToken);
    }
}