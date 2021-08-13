import CharSequences from "../../CharSequences.js";
import Character from "../../Character.js";
import SystemObject from "../../SystemObject.js";
import Keys from "../../Keys.js";

/**
 * Common base class for several types in this namespace
 */
export default class SpreadsheetSelection extends SystemObject {

    static reportInvalidCharacter(c, pos) {
        throw new Error("Invalid character " + CharSequences.quoteAndEscape(Character.fromJson(c)) + " at " + pos);
    }

    checkAnchor(anchor) {
        throw new Error("Not yet implemented");
    }

    /**
     * Cell, column and row should not have an anchor.
     */
    static checkNoAnchor(anchor) {
        if(null != anchor){
            throw new Error("Expected no anchor got " + anchor);
        }
    }

    /**
     * Verifies that the given anchor is one of the valid anchor options.
     */
    static checkAnyAnchor(anchor, valid) {
        if(null == anchor){
            throw new Error("Missing anchor");
        }

        if(valid.findIndex(a => a.equals(anchor)) === -1 ) {
            throw new Error("Unknown anchor " + anchor + ", expected any of " + valid.join(", "));
        }
    }

    /**
     * LEFT | RIGHT Arrow keys update the column selection or when down selects the first visible cell or ESC clears the current selection.
     */
    onViewportKeyDown(key, selectRange, setSelection, giveFormulaFocus, viewportHome) {
        console.log("onViewportKeyDown: " + key + " " + this);

        switch(key) {
            case Keys.ARROW_LEFT:
                setSelection(
                    selectRange ?
                        this.extendRangeLeft(viewportHome) :
                        this.navigateLeft(viewportHome)
                );
                break;
            case Keys.ARROW_RIGHT:
                setSelection(
                    selectRange ?
                        this.extendRangeRight(viewportHome) :
                        this.navigateRight(viewportHome)
                );
                break;
            case Keys.ARROW_UP:
                setSelection(
                    selectRange ?
                        this.extendRangeUp(viewportHome) :
                        this.navigateUp(viewportHome)
                );
                break;
            case Keys.ARROW_DOWN:
                setSelection(
                    selectRange ?
                        this.extendRangeDown(viewportHome) :
                        this.navigateDown(viewportHome)
                );
                break;
            case Keys.ENTER:
                this.selectionEnter(giveFormulaFocus);
                break;
            case Keys.ESCAPE:
                setSelection(null);
                break;
            default:
                // ignore other keys
                break;
        }
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

    navigateLeft(viewportHome) {
        throw new Error("Not yet implemented");
    }

    navigateRight(viewportHome) {
        throw new Error("Not yet implemented");
    }

    navigateUp(viewportHome) {
        throw new Error("Not yet implemented");
    }

    navigateDown(viewportHome) {
        throw new Error("Not yet implemented");
    }

    selectionEnter(giveFormulaFocus) {
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
}
