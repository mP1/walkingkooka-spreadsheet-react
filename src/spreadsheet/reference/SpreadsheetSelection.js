import CharSequences from "../../CharSequences.js";
import Character from "../../Character.js";
import SpreadsheetCellDeleteHistoryHashToken from "../history/SpreadsheetCellDeleteHistoryHashToken.js";
import SpreadsheetColumnOrRowClearHistoryHashToken from "../history/SpreadsheetColumnOrRowClearHistoryHashToken.js";
import SpreadsheetColumnOrRowDeleteHistoryHashToken from "../history/SpreadsheetColumnOrRowDeleteHistoryHashToken.js";
import SpreadsheetColumnOrRowFreezeHistoryHashToken from "../history/SpreadsheetColumnOrRowFreezeHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertBeforeHistoryHashToken
    from "../history/SpreadsheetColumnOrRowInsertBeforeHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertAfterHistoryHashToken
    from "../history/SpreadsheetColumnOrRowInsertAfterHistoryHashToken.js";
import SpreadsheetColumnOrRowSaveHistoryHashToken from "../history/SpreadsheetColumnOrRowSaveHistoryHashToken.js";
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

    toMapKey() {
        return this.toString()
            .replaceAll("$", "")
            .toUpperCase();
    }

    columnOrRange() {
        SystemObject.throwUnsupportedOperation();
    }

    rowOrRange() {
        SystemObject.throwUnsupportedOperation();
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

    canFreeze() {
        SystemObject.throwUnsupportedOperation();
    }

    deleteHistoryHashToken() {
        SystemObject.throwUnsupportedOperation();
    }

    patch(property, value) {
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
    
    toHistoryHashToken() {
        SystemObject.throwUnsupportedOperation();
    }
    
    apiDeleteUrl() {
        SystemObject.throwUnsupportedOperation();
    }

    apiFreezeMetadataPropertyName() {
        SystemObject.throwUnsupportedOperation();
    }

    apiInsertAfterUrl(count) {
        SystemObject.throwUnsupportedOperation();
    }

    // 0 = ""
    // 1 == api
    // 2 == spreadsheet
    // 3 == $spreadsheet-id
    // 4 == column == Selection
    // 5 == $selection
    // 6 == before == insert-action.toUrl
    apiInsertBeforePostUrl(urlPaths) {
        SystemObject.throwUnsupportedOperation();
    }

    /**
     * This is the text that will appear in the {@link SpreadsheetSelectAutocompleteWidget}.
     */
    selectOptionText() {
        SystemObject.throwUnsupportedOperation();
    }

    // key events.......................................................................................................

    viewportContextMenuClick(clicked) {
        SystemObject.throwUnsupportedOperation();
    }

    /**
     * This method is called whenever the element for this selection is clicked, providing an opportunity to
     * build the context menu items that will be displayed ready for clicking.
     */
    viewportContextMenuItems(historyTokens, frozenColumns, frozenRows, isColumnHidden, isRowHidden, columnRange, rowRange, history){
        SystemObject.throwUnsupportedOperation();
    }

    static VIEWPORT_CONTEXT_MENU_ID = "viewport-context-menu";

    static VIEWPORT_CONTEXT_MENU_CLEAR_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-clear";

    static VIEWPORT_CONTEXT_MENU_DELETE_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-delete";

    // the id for the "delete column" menu item
    static VIEWPORT_CONTEXT_MENU_DELETE_COLUMN_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-delete-column";

    // the id for the "delete row" menu item
    static VIEWPORT_CONTEXT_MENU_DELETE_ROW_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-delete-row";

    // the id for the freeze column or row menu item.
    static VIEWPORT_CONTEXT_MENU_FREEZE_1_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-freeze-1";
    static VIEWPORT_CONTEXT_MENU_FREEZE_2_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-freeze-2";
    static VIEWPORT_CONTEXT_MENU_FREEZE_3_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-freeze-3";
    static VIEWPORT_CONTEXT_MENU_FREEZE_RANGE_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-freeze-range";

    // the id for the hide column or row menu item.
    static VIEWPORT_CONTEXT_MENU_HIDE_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-hide";

    static VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-insert-after-2";
    static VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-insert-after-1"
    static VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-insert-before-2";
    static VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-insert-before-1";

    static VIEWPORT_CONTEXT_MENU_UNHIDE_AFTER_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-unhide-after";
    static VIEWPORT_CONTEXT_MENU_UNHIDE_BEFORE_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-unhide-before";

    /**
     * Builds the context menu items for a cell or cell-range.
     */
    viewportContextMenuItemsCell(historyTokens, history) {
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = this;
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = null;
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR] = null;

        const menuItems = [];

        // delete cells
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = SpreadsheetCellDeleteHistoryHashToken.INSTANCE;

        menuItems.push(
            history.menuItem(
                this.viewportDeleteCellText(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ID,
                false, // disabled
                historyTokens
            )
        );

        // delete column
        const columnOrRange = this.columnOrRange();
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = columnOrRange;
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = SpreadsheetColumnOrRowDeleteHistoryHashToken.INSTANCE;

        menuItems.push(
            history.menuItem(
                columnOrRange.viewportDeleteCellColumnText(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_COLUMN_ID,
                false, // disabled
                historyTokens
            )
        );

        // delete row
        const rowOrRange = this.rowOrRange();
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = rowOrRange;
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = SpreadsheetColumnOrRowDeleteHistoryHashToken.INSTANCE;

        menuItems.push(
            history.menuItem(
                rowOrRange.viewportDeleteCellRowText(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ROW_ID,
                false, // disabled
                historyTokens
            )
        );

        return menuItems;
    }

    // delete
    // insert 1 before
    // insert 2 before
    // insert 1 after
    // insert 2 after
    viewportContextMenuItemsColumnOrRow(historyTokens, before, after, frozenColumnOrRows, isHidden, range, history) {
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = this;
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = null;
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR] = null;

        const menuItems = [];

        // clear........................................................................................................

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = SpreadsheetColumnOrRowClearHistoryHashToken.INSTANCE;

        menuItems.push(
            history.menuItem(
                this.viewportClearText(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_CLEAR_ID,
                false, // disabled
                historyTokens
            )
        );

        // delete.......................................................................................................

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = SpreadsheetColumnOrRowDeleteHistoryHashToken.INSTANCE;

        menuItems.push(
            history.menuItem(
                this.viewportDeleteText(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ID,
                false, // disabled
                historyTokens
            )
        );

        // insertBefore.................................................................................................

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(2);

        menuItems.push(
            history.menuItem(
                this.viewportInsertBefore2Text(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID,
                false, // disabled
                historyTokens
            )
        );

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(1);

        menuItems.push(
            history.menuItem(
                this.viewportInsertBefore1Text(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID,
                false, // disabled
                historyTokens
            )
        );

        // insertAfter..................................................................................................

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(1);

        menuItems.push(
            history.menuItem(
                this.viewportInsertAfter1Text(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID,
                false, // disabled
                historyTokens
            )
        );

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(2);

        menuItems.push(
            history.menuItem(
                this.viewportInsertAfter2Text(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID,
                false, // disabled
                historyTokens
            )
        );

        // freeze.......................................................................................................

        this.viewportContextMenuItemsColumnOrRowFreeze(
            range(0),
            historyTokens,
            frozenColumnOrRows,
            menuItems,
            SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_1_ID,
            history
        );

        this.viewportContextMenuItemsColumnOrRowFreeze(
            range(1),
            historyTokens,
            frozenColumnOrRows,
            menuItems,
            SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_2_ID,
            history
        );

        this.viewportContextMenuItemsColumnOrRowFreeze(
            range(2),
            historyTokens,
            frozenColumnOrRows,
            menuItems,
            SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_3_ID,
            history
        );

        // hide........................................................................................................

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = this;
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = new SpreadsheetColumnOrRowSaveHistoryHashToken("hidden", true);

        menuItems.push(
            history.menuItem(
                this.viewportHideText(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID,
                false, // disabled
                historyTokens
            )
        );

        // if the column/row BEFORE is hidden add Unhide column/row
        this.viewportContextMenuItemsColumnOrRowUnHide(
            before,
            isHidden,
            historyTokens,
            menuItems,
            SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNHIDE_BEFORE_ID,
            history
        );

        this.viewportContextMenuItemsColumnOrRowUnHide(
            after,
            isHidden,
            historyTokens,
            menuItems,
            SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNHIDE_AFTER_ID,
            history
        );

        return menuItems;
    }

    viewportContextMenuItemsColumnOrRowFreeze(columnOrRowRange, historyTokens, frozenColumnOrRows, menuItems, menuItemId, history) {
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = columnOrRowRange;
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = SpreadsheetColumnOrRowFreezeHistoryHashToken.INSTANCE;

        menuItems.push(
            history.menuItem(
                this.viewportFreezeColumnsRowsText(columnOrRowRange),
                menuItemId,
                columnOrRowRange.equals(frozenColumnOrRows()), // menuItemDisabled skip if given $columnOrRowRange already frozen
                historyTokens
            )
        );
    }

    viewportContextMenuItemsColumnOrRowUnHide(columnOrRowRange, isHidden, historyTokens, menuItems, menuItemId, history) {
        if(!columnOrRowRange.equals(this) && isHidden(columnOrRowRange)){
            historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = columnOrRowRange;
            historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = new SpreadsheetColumnOrRowSaveHistoryHashToken("hidden", false);

            menuItems.push(
                history.menuItem(
                    columnOrRowRange.viewportUnHideText(),
                    menuItemId,
                    false, // disabled
                    historyTokens
                )
            );
        }
    }

    viewportFocus(giveFormulaFocus) {
        SystemObject.throwUnsupportedOperation();
    }

    viewportClearText() {
        return "Clear";
    }

    viewportDeleteText() {
        return "Delete";
    }

    viewportDeleteCellText() {
        SystemObject.throwUnsupportedOperation();
    }

    viewportDeleteColumnText() {
        SystemObject.throwUnsupportedOperation();
    }

    viewportDeleteRowText() {
        SystemObject.throwUnsupportedOperation();
    }

    viewportFreezeColumnsRowsText(columns) {
        return "Freeze " + columns;
    }

    viewportHideText() {
        SystemObject.throwUnsupportedOperation();
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

    viewportUnHideText() {
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
        if(anchor) {
            const anchors = this.anchors();

            if(anchors.findIndex(a => a.equals(anchor)) === -1){
                throw new Error("Unknown anchor " + anchor + ", expected any of " + anchors.join(", ") + " for " + this);
            }
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

    kebabClassName() {
        SystemObject.throwUnsupportedOperation();
    }

    equalsIgnoringKind(other) {
        return SystemObject.throwUnsupportedOperation();
    }

    toString() {
        return this.toJson();
    }
}
