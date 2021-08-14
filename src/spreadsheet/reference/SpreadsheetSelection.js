import CharSequences from "../../CharSequences.js";
import Character from "../../Character.js";
import Keys from "../../Keys.js";
import SpreadsheetViewportSelection from "./SpreadsheetViewportSelection.js";
import SystemObject from "../../SystemObject.js";

/**
 * Common base class for several types in this namespace
 */
export default class SpreadsheetSelection extends SystemObject {

    static reportInvalidCharacter(c, pos) {
        throw new Error("Invalid character " + CharSequences.quoteAndEscape(Character.fromJson(c)) + " at " + pos);
    }

    setAnchor(anchor) {
        return new SpreadsheetViewportSelection(this, anchor);
    }

    /**
     * If the sub class is a range, call setAnchor with the given anchor otherwise call with null.
     */
    setAnchorConditional(anchor) {
        SystemObject.throwUnsupportedOperation();
    }

    checkAnchor(anchor) {
        SystemObject.throwUnsupportedOperation();
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
    onViewportKeyDown(key, selectRange, setSelection, giveFormulaFocus, anchor, viewportHome) {
        console.log("onViewportKeyDown: " + key + " " + this);

        switch(key) {
            case Keys.ARROW_LEFT:
                setSelection(
                    selectRange ?
                        this.extendRangeLeft(anchor, viewportHome) :
                        this.navigateLeft(viewportHome).setAnchor()
                );
                break;
            case Keys.ARROW_RIGHT:
                setSelection(
                    selectRange ?
                        this.extendRangeRight(anchor, viewportHome) :
                        this.navigateRight(viewportHome).setAnchor()
                );
                break;
            case Keys.ARROW_UP:
                setSelection(
                    selectRange ?
                        this.extendRangeUp(anchor, viewportHome) :
                        this.navigateUp(viewportHome).setAnchor()
                );
                break;
            case Keys.ARROW_DOWN:
                setSelection(
                    selectRange ?
                        this.extendRangeDown(anchor, viewportHome) :
                        this.navigateDown(viewportHome).setAnchor()
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

    extendRangeLeft(anchor, viewportHome) {
        SystemObject.throwUnsupportedOperation();
    }

    extendRangeRight(anchor, viewportHome) {
        SystemObject.throwUnsupportedOperation();
    }

    extendRangeUp(anchor, viewportHome) {
        SystemObject.throwUnsupportedOperation();
    }

    extendRangeDown(anchor, viewportHome) {
        SystemObject.throwUnsupportedOperation();
    }

    // all navigate methods must return SpreadsheetSelection

    navigateLeft(anchor, viewportHome) {
        SystemObject.throwUnsupportedOperation();
    }

    navigateRight(anchor, viewportHome) {
        SystemObject.throwUnsupportedOperation();
    }

    navigateUp(anchor, viewportHome) {
        SystemObject.throwUnsupportedOperation();
    }

    navigateDown(anchor, viewportHome) {
        SystemObject.throwUnsupportedOperation();
    }

    selectionEnter(giveFormulaFocus) {
        SystemObject.throwUnsupportedOperation();
    }

    testCell(cellReference) {
        SystemObject.throwUnsupportedOperation();
    }

    testColumn(columnReference) {
        SystemObject.throwUnsupportedOperation();
    }

    testRow(rowReference) {
        SystemObject.throwUnsupportedOperation();
    }

    toQueryStringParameterSelectionType() {
        SystemObject.throwUnsupportedOperation();
    }

    toSelectionHashToken() {
        SystemObject.throwUnsupportedOperation();
    }

    toString() {
        return this.toJson();
    }

    /**
     * This function is called by the viewport widget when a click event happens.
     */
    onViewportClick(setSelection, giveFormulaFocus) {
        SystemObject.throwUnsupportedOperation();
    }
}
