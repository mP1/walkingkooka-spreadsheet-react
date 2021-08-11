import CharSequences from "../../CharSequences.js";
import Character from "../../Character.js";
import SystemObject from "../../SystemObject.js";

/**
 * Common base class for several types in this namespace
 */
export default class SpreadsheetSelection extends SystemObject {

    static reportInvalidCharacter(c, pos) {
        throw new Error("Invalid character " + CharSequences.quoteAndEscape(Character.fromJson(c)) + " at " + pos);
    }

    extendRangeLeft(viewportHome) {
        throw new Error("Not yet implemented");
    }

    extendRangeRight(viewportHome) {
        throw new Error("Not yet implemented");
    }

    extendRangeUp(viewportHome) {
        throw new Error("Not yet implemented");
    }

    extendRangeDown(viewportHome) {
        throw new Error("Not yet implemented");
    }

    testCell(cellReference) {
        throw new Error("Not yet implemented");
    }

    testColumn(columnReference) {
        throw new Error("Not yet implemented");
    }

    testRow(rowReference) {
        throw new Error("Not yet implemented");
    }

    toQueryStringParameterSelectionType() {
        throw new Error("Not yet implemented");
    }

    toSelectionHashToken() {
        throw new Error("Not yet implemented");
    }

    toString() {
        return this.toJson();
    }

    /**
     * This function is called by the viewport widget when a click event happens.
     */
    onViewportClick(setSelection, giveFormulaFocus) {
        throw new Error("Not yet implemented");
    }

    /**
     * This function is called by the viewport widget when a keydown event happens.
     */
    onViewportKeyDown(key, setSelection, giveFormulaFocus, viewportHome) {
        throw new Error("Not yet implemented");
    }
}
