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

    toDeleteUrl() {
        SystemObject.throwUnsupportedOperation();
    }

    /**
     * This is the text that will appear in the {@link SpreadsheetSelectAutocompleteWidget}.
     */
    selectOptionText() {
        SystemObject.throwUnsupportedOperation();
    }

    // context menu events..............................................................................................

    /**
     * This method is called whenever the element for this selection is clicked, providing an opportunity to
     * build the context menu items that will be displayed ready for clicking.
     */
    buildContextMenuItems(historyTokens){
        SystemObject.throwUnsupportedOperation();
    }

    // key events.......................................................................................................

    /**
     *
     */
    onViewportKeyDown(key, selectRange, selection, anchor, viewportHome, saveSelection, giveFormulaFocus) {
        console.log("onViewportKeyDown: " + key + " " + (selectRange ? "selecting range ": "") + this + " " + (selection ? selection + " ":  "") + (anchor ? anchor + " ": "") + (viewportHome ? " home=" + viewportHome : ""));

        const selectionOrThis = selection ? selection : this;

        switch(key) {
            case Keys.ARROW_LEFT:
                saveSelection(
                    selectRange ?
                        selectionOrThis.viewportLeftExtend(anchor, this, viewportHome):
                        this.viewportLeft(viewportHome).setAnchor()
                );
                break;
            case Keys.ARROW_RIGHT:
                saveSelection(
                    selectRange ?
                        selectionOrThis.viewportRightExtend(anchor, this, viewportHome):
                        this.viewportRight(viewportHome).setAnchor()
                );
                break;
            case Keys.ARROW_UP:
                saveSelection(
                    selectRange ?
                        selectionOrThis.viewportUpExtend(anchor, this, viewportHome):
                        this.viewportUp(viewportHome).setAnchor()
                );
                break;
            case Keys.ARROW_DOWN:
                saveSelection(
                    selectRange ?
                        selectionOrThis.viewportDownExtend(anchor, this, viewportHome):
                        this.viewportDown(viewportHome).setAnchor()
                );
                break;
            case Keys.ENTER:
                selectionOrThis.viewportEnter(giveFormulaFocus);
                break;
            case Keys.ESCAPE:
                saveSelection(null);
                break;
            default:
                // ignore other keys
                break;
        }
    }

    viewportEnter(giveFormulaFocus) {
        SystemObject.throwUnsupportedOperation();
    }

    viewportFocus(giveFormulaFocus) {
        SystemObject.throwUnsupportedOperation();
    }

    viewportLeft(start) {
        SystemObject.throwUnsupportedOperation()
    }

    viewportRight(start) {
        SystemObject.throwUnsupportedOperation()
    }

    viewportUp(start) {
        SystemObject.throwUnsupportedOperation()
    }

    viewportDown(start) {
        SystemObject.throwUnsupportedOperation()
    }

    viewportLeftExtend(start) {
        SystemObject.throwUnsupportedOperation()
    }

    viewportRightExtend(start) {
        SystemObject.throwUnsupportedOperation()
    }

    viewportUpExtend(start) {
        SystemObject.throwUnsupportedOperation()
    }

    viewportDownExtend(start) {
        SystemObject.throwUnsupportedOperation()
    }

    static reportInvalidAnchor(anchor) {
        throw new Error("Invalid anchor=" + anchor);
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
        const anchors = this.anchors();

        switch(anchors.length) {
            case 0:
                if(null != anchor){
                    throw new Error("Expected no anchor got " + anchor);
                }
                break;
            default:
                if(null == anchor){
                    throw new Error("Missing anchor");
                }

                if(anchors.findIndex(a => a.equals(anchor)) === -1){
                    throw new Error("Unknown anchor " + anchor + ", expected any of " + anchors.join(", "));
                }
                break;
        }
    }

    defaultAnchor() {
        SystemObject.throwUnsupportedOperation();
    }

    toInsertAfterUrl(count) {
        SystemObject.throwUnsupportedOperation();
    }

    /**
     * Returns an array of allowed anchors for this selection.
     */
    anchors() {
        SystemObject.throwUnsupportedOperation();
    }

    toString() {
        return this.toJson();
    }
}
