import SpreadsheetExpressionReference from "./SpreadsheetExpressionReference.js";
import SpreadsheetViewport from "../SpreadsheetViewport.js";

/**
 * Common base class for cell-reference and labels.
 */
export default class SpreadsheetCellReferenceOrLabelName extends SpreadsheetExpressionReference {

    viewport(xOffset, yOffset, width, height) {
        return new SpreadsheetViewport(this, xOffset, yOffset, width, height);
    }

    toSelectionHashToken() {
        // avoid referencing constant to avoid runtime TypeErrors.
        return /*SpreadsheetHistoryHash.CELL*/ "cell/" + this;
    }
}
