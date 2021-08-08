import SpreadsheetExpressionReference from "./SpreadsheetExpressionReference.js";
import SpreadsheetViewport from "../SpreadsheetViewport.js";

/**
 * Common base class for cell-reference and labels.
 */
export default class SpreadsheetCellReferenceOrLabelName extends SpreadsheetExpressionReference {

    viewport(xOffset, yOffset, width, height) {
        return new SpreadsheetViewport(this, xOffset, yOffset, width, height);
    }
}
