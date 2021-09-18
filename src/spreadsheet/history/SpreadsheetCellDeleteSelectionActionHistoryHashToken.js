import SpreadsheetCellSelectionActionHistoryHashToken from "./SpreadsheetCellSelectionActionHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * A history hash token that represents a cell or cell-range delete
 */
export default class SpreadsheetCellDeleteSelectionActionHistoryHashToken extends SpreadsheetCellSelectionActionHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetCellDeleteSelectionActionHistoryHashToken();

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.DELETE;
    }

    /**
     * Handles history hash token evens such as /column/A/delete or /column/B:C/delete
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