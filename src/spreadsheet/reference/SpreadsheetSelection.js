import CharSequences from "../../CharSequences.js";
import Character from "../../Character.js";
import Keys from "../../Keys.js";
import SpreadsheetColumnOrRowClearHistoryHashToken from "../history/SpreadsheetColumnOrRowClearHistoryHashToken.js";
import SpreadsheetColumnOrRowDeleteHistoryHashToken from "../history/SpreadsheetColumnOrRowDeleteHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertBeforeHistoryHashToken
    from "../history/SpreadsheetColumnOrRowInsertBeforeHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertAfterHistoryHashToken
    from "../history/SpreadsheetColumnOrRowInsertAfterHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetViewportSelection from "./SpreadsheetViewportSelection.js";
import SystemObject from "../../SystemObject.js";

/**
 * Common base class for several types in this namespace
 */
export default class SpreadsheetSelection extends SystemObject {

    static reportInvalidCharacter(c, pos) {
        throw new Error("Invalid character " + CharSequences.quoteAndEscape(Character.fromJson(c)) + " at " + pos);
    }

    /**
     * Returns true if the selection is a cell or cell-range
     */
    isCellScalarOrRange() {
        return false;
    }

    /**
     * Returns true if the selection is a column/row or column-range/row-range.
     */
    isColumnOrRowScalarOrRange() {
        return false;
    }

    deleteHistoryHashToken() {
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

    toDeleteUrl() {
        SystemObject.throwUnsupportedOperation();
    }

    toInsertAfterUrl(count) {
        SystemObject.throwUnsupportedOperation();
    }

    // 0 = ""
    // 1 == api
    // 2 == spreadsheet
    // 3 == $spreadsheet-id
    // 4 == column == Selection
    // 5 == $selection
    // 6 == before == insert-action.toUrl
    isInsertBeforePostUrl(urlPaths) {
        SystemObject.throwUnsupportedOperation();
    }

    /**
     * This is the text that will appear in the {@link SpreadsheetSelectAutocompleteWidget}.
     */
    selectOptionText() {
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

    viewportContextMenuClick(clicked) {
        SystemObject.throwUnsupportedOperation();
    }

    /**
     * This method is called whenever the element for this selection is clicked, providing an opportunity to
     * build the context menu items that will be displayed ready for clicking.
     */
    viewportContextMenuItems(historyTokens){
        SystemObject.throwUnsupportedOperation();
    }

    static VIEWPORT_CONTEXT_MENU_ID = "viewport-context-menu";

    static VIEWPORT_CONTEXT_MENU_CLEAR_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-clear";

    static VIEWPORT_CONTEXT_MENU_DELETE_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-delete";

    static VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-insert-after-2";
    static VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-insert-after-1"
    static VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-insert-before-2";
    static VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-insert-before-1";

    // delete
    // insert 1 before
    // insert 2 before
    // insert 1 after
    // insert 2 after
    viewportContextMenuItemsColumnOrRow(historyTokens, history) {
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = this;
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = null;
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR] = null;

        const menuItems = [];

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = SpreadsheetColumnOrRowClearHistoryHashToken.INSTANCE;

        menuItems.push(
            history.menuItem(
                this.viewportClearText(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_CLEAR_ID,
                historyTokens
            )
        );

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = SpreadsheetColumnOrRowDeleteHistoryHashToken.INSTANCE;

        menuItems.push(
            history.menuItem(
                this.viewportDeleteText(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ID,
                historyTokens
            )
        );

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(2);

        menuItems.push(
            history.menuItem(
                this.viewportInsertBefore2Text(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID,
                historyTokens
            )
        );

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(1);

        menuItems.push(
            history.menuItem(
                this.viewportInsertBefore1Text(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID,
                historyTokens
            )
        );

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(1);

        menuItems.push(
            history.menuItem(
                this.viewportInsertAfter1Text(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID,
                historyTokens
            )
        );

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(2);

        menuItems.push(
            history.menuItem(
                this.viewportInsertAfter2Text(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID,
                historyTokens
            )
        );

        return menuItems;
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

    viewportClearText() {
        return "Clear";
    }

    viewportDeleteText() {
        return "Delete";
    }

    viewportInsertAfter1Id() {
        SystemObject.throwUnsupportedOperation();
    }

    viewportInsertAfter1Text() {
        SystemObject.throwUnsupportedOperation();
    }

    viewportInsertAfter2Id() {
        SystemObject.throwUnsupportedOperation();
    }

    viewportInsertAfter2Text() {
        SystemObject.throwUnsupportedOperation();
    }

    viewportInsertBefore1Id() {
        SystemObject.throwUnsupportedOperation();
    }

    viewportInsertBefore1Text() {
        SystemObject.throwUnsupportedOperation();
    }

    viewportInsertBefore2Id() {
        SystemObject.throwUnsupportedOperation();
    }

    viewportInsertBefore2Text() {
        SystemObject.throwUnsupportedOperation();
    }

    viewportId() {
        SystemObject.throwUnsupportedOperation();
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

    /**
     * Returns an array of allowed anchors for this selection.
     */
    anchors() {
        SystemObject.throwUnsupportedOperation();
    }

    viewportInsertBeforePostSuccessSelection(count) {
        SystemObject.throwUnsupportedOperation();
    }

    toString() {
        return this.toJson();
    }
}
