import CharSequences from "../../CharSequences.js";
import Character from "../../Character.js";
import Keys from "../../Keys.js";
import SpreadsheetViewportSelection from "./SpreadsheetViewportSelection.js";
import SystemObject from "../../SystemObject.js";

/**
 * Common base class for several types in this namespace
 */
export default class SpreadsheetSelection extends SystemObject {

    static reportInvalidAnchor(anchor) {
        throw new Error("Invalid anchor=" + anchor);
    }

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

    // context menu events..............................................................................................

    /**
     * This method is called whenever the element for this selection is clicked, providing an opportunity to
     * prepare the context menu items that will be displayed ready for clicking.
     */
    onContextMenu(spreadsheetDeltaCellCrud) {
        SystemObject.throwUnsupportedOperation();
    }

    // key events.......................................................................................................

    /**
     * LEFT | RIGHT Arrow keys update the column selection or when down selects the first visible cell or ESC clears the current selection.
     */
    onViewportKeyDown(key, selectRange, selection, anchor, viewportHome, setSelection, giveFormulaFocus) {
        console.log("onViewportKeyDown: " + key + " " + (selectRange ? "selecting range ": "") + this + " " + (selection ? selection + " ":  "") + (anchor ? anchor + " ": "") + (viewportHome ? " home=" + viewportHome : ""));

        const selectionOrThis = (selection ? selection : this);

        switch(key) {
            case Keys.ARROW_LEFT:
                setSelection(
                    selectRange ?
                        selectionOrThis.extendRangeLeft(anchor, this, viewportHome):
                        this.navigateLeft(viewportHome).setAnchor()
                );
                break;
            case Keys.ARROW_RIGHT:
                setSelection(
                    selectRange ?
                        selectionOrThis.extendRangeRight(anchor, this, viewportHome):
                        this.navigateRight(viewportHome).setAnchor()
                );
                break;
            case Keys.ARROW_UP:
                setSelection(
                    selectRange ?
                        selectionOrThis.extendRangeUp(anchor, this, viewportHome):
                        this.navigateUp(viewportHome).setAnchor()
                );
                break;
            case Keys.ARROW_DOWN:
                setSelection(
                    selectRange ?
                        selectionOrThis.extendRangeDown(anchor, this, viewportHome):
                        this.navigateDown(viewportHome).setAnchor()
                );
                break;
            case Keys.ENTER:
                selectionOrThis.selectionEnter(giveFormulaFocus);
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

    /**
     * Resolves a selection which may be a label or range into a single element namely one of cell, column or row.
     */
    selectionFocus(labelToReference, anchor) {
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

    toLoadCellsQueryStringParameterSelectionType() {
        SystemObject.throwUnsupportedOperation();
    }

    toHistoryHashToken() {
        SystemObject.throwUnsupportedOperation();
    }

    /**
     * This is the text that will appear in the {@link SpreadsheetSelectAutocompleteWidget}.
     */
    selectOptionText() {
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
