import SpreadsheetExpressionReference from "./SpreadsheetExpressionReference.js";
import SpreadsheetViewport from "../SpreadsheetViewport.js";

/**
 * Common base class for cell-reference and labels.
 */
export default class SpreadsheetCellReferenceOrLabelName extends SpreadsheetExpressionReference {

    cellOrRange() {
        return this;
    }

    isCellScalarOrRange() {
        return true;
    }

    apiClearUrl() {
        return "/cell/" + this + "/clear";
    }

    apiDeleteUrl() {
        return "/cell/" + this;
    }

    viewport(width, height) {
        return new SpreadsheetViewport(this, width, height);
    }

    defaultAnchor() {
        return null;
    }
}
