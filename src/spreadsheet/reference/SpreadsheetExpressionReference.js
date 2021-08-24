import SpreadsheetSelection from "./SpreadsheetSelection.js";

/**
 * Common base class for cell-range, cell reference and label name.
 */
export default class SpreadsheetExpressionReference extends SpreadsheetSelection {

    selectOptionText() {
        return this.toString();
    }

    toHistoryHashToken() {
        // avoid referencing constant to avoid runtime TypeErrors.
        return /*SpreadsheetHistoryHash.CELL*/ "cell/" + this;
    }
}
