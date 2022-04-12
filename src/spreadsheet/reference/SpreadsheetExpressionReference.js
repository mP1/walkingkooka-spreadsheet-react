import SpreadsheetSelection from "./SpreadsheetSelection.js";

/**
 * Common base class for cell-range, cell reference and label name.
 */
export default class SpreadsheetExpressionReference extends SpreadsheetSelection {

    // insertBefore not supported by cell or cell range or label
    apiInsertBeforePostUrl(urlPaths) {
        return false;
    }

    selectOptionText() {
        return this.toString();
    }

    toHistoryHashToken() {
        // avoid referencing constant to avoid runtime TypeErrors.
        return /*SpreadsheetHistoryHash.CELL*/ "cell/" + this;
    }

    viewportContextMenuItems(historyTokens, frozenColumns, frozenRows, isColumnHidden, isRowHidden, columnRange, rowRange, history) {
        return this.viewportContextMenuItemsCell(historyTokens, history);
    }
}
