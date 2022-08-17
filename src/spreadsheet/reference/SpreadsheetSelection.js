import CharSequences from "../../CharSequences.js";
import Character from "../../Character.js";
import SpreadsheetCellFreezeHistoryHashToken from "./SpreadsheetCellFreezeHistoryHashToken.js";
import SpreadsheetCellUnFreezeHistoryHashToken from "./SpreadsheetCellUnFreezeHistoryHashToken.js";
import SpreadsheetColumnOrRowClearHistoryHashToken from "./SpreadsheetColumnOrRowClearHistoryHashToken.js";
import SpreadsheetColumnOrRowDeleteHistoryHashToken from "./SpreadsheetColumnOrRowDeleteHistoryHashToken.js";
import SpreadsheetColumnOrRowFreezeHistoryHashToken from "./SpreadsheetColumnOrRowFreezeHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertBeforeHistoryHashToken
    from "./SpreadsheetColumnOrRowInsertBeforeHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertAfterHistoryHashToken from "./SpreadsheetColumnOrRowInsertAfterHistoryHashToken.js";
import SpreadsheetColumnOrRowSaveHistoryHashToken from "./SpreadsheetColumnOrRowSaveHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetViewportSelection from "./viewport/SpreadsheetViewportSelection.js";
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

    toRelative() {
        SystemObject.throwUnsupportedOperation();
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

    testCellRange(range) {
        SystemObject.throwUnsupportedOperation();
    }
    
    historyHashPath() {
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

    freezePatch() {
        SystemObject.throwUnsupportedOperation();
    }

    unFreezePatch() {
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
    viewportContextMenu(historyTokens, frozenColumns, frozenRows, isColumnHidden, isRowHidden, columnRange, rowRange, history){
        SystemObject.throwUnsupportedOperation();
    }

    static VIEWPORT_CONTEXT_MENU_ID = "viewport-context-menu";

    static VIEWPORT_CONTEXT_MENU_CLEAR_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-clear";

    static VIEWPORT_CONTEXT_MENU_DELETE_CELL_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-delete-cell";

    // the id for the "delete column" menu item
    static VIEWPORT_CONTEXT_MENU_DELETE_COLUMN_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-delete-column";

    // the id for the "delete row" menu item
    static VIEWPORT_CONTEXT_MENU_DELETE_ROW_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-delete-row";

    // the id for the freeze column or row menu item.
    static VIEWPORT_CONTEXT_MENU_FREEZE_1_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-freeze-1";
    static VIEWPORT_CONTEXT_MENU_FREEZE_2_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-freeze-2";
    static VIEWPORT_CONTEXT_MENU_FREEZE_3_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-freeze-3";
    static VIEWPORT_CONTEXT_MENU_FREEZE_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-freeze";

    // the id for the hide column or row menu item.
    static VIEWPORT_CONTEXT_MENU_HIDE_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-hide";

    static VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-insert-after-2";
    static VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-insert-after-1"
    static VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-insert-before-2";
    static VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-insert-before-1";

    static VIEWPORT_CONTEXT_MENU_UNFREEZE_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-unfreeze";

    static VIEWPORT_CONTEXT_MENU_UNHIDE_AFTER_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-unhide-after";
    static VIEWPORT_CONTEXT_MENU_UNHIDE_BEFORE_ID = SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_ID + "-unhide-before";

    /**
     * Builds the context menu items for a cell or cell-range.
     */
    // viewportContextMenuColumnOrRow(historyTokens, before, after, frozenColumnOrRows, isHidden, range, history)
    viewportContextMenuCell(asRange, frozenRange, historyTokens, history) {
        const menuItems = [];

        this.viewportContextMenuCellDelete(historyTokens, menuItems, history);
        this.viewportContextMenuColumnDelete(historyTokens, menuItems, history);
        this.viewportContextMenuRowDelete(historyTokens, menuItems, history);

        this.viewportContextMenuCellFreeze(asRange, historyTokens, menuItems, history);
        this.viewportContextMenuCellUnFreeze(asRange, frozenRange, historyTokens, menuItems, history);

        return menuItems;
    }

    viewportContextMenuCellDelete(historyTokens, menuItems, history) {
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = new SpreadsheetColumnOrRowDeleteHistoryHashToken(
            new SpreadsheetViewportSelection(this)
        );

        menuItems.push(
            history.menuItem(
                this.viewportDeleteCellText(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_CELL_ID,
                false, // disabled
                historyTokens
            )
        );
    }

    viewportContextMenuCellFreeze(range, historyTokens, menuItems, history) {
        const canFreeze = range.canFreeze();

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = new SpreadsheetCellFreezeHistoryHashToken(
            new SpreadsheetViewportSelection(range)
        );

        menuItems.push(
            history.menuItem(
                this.viewportFreezeCellsText(range),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_ID,
                !canFreeze, // disabled
                historyTokens
            )
        );
    }

    viewportContextMenuCellUnFreeze(range, frozenRange, historyTokens, menuItems, history) {
        const unfreeze = range.equalsIgnoringKind(frozenRange);

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = new SpreadsheetCellUnFreezeHistoryHashToken(
            new SpreadsheetViewportSelection(this)
        );

        menuItems.push(
            history.menuItem(
                this.viewportUnFreezeCellText(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNFREEZE_ID,
                !unfreeze, // disabled, enable if range == frozen
                historyTokens
            )
        );
    }

    viewportContextMenuColumnDelete(historyTokens, menuItems, history) {
        const columnOrRange = this.columnOrRange();

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = new SpreadsheetColumnOrRowDeleteHistoryHashToken(
            new SpreadsheetViewportSelection(columnOrRange),
        );

        menuItems.push(
            history.menuItem(
                columnOrRange.viewportDeleteCellColumnText(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_COLUMN_ID,
                false, // disabled
                historyTokens
            )
        );
    }

    viewportContextMenuColumnOrRow(historyTokens, before, after, frozenColumnOrRows, isHidden, range, history) {
        const menuItems = [];

        // clear........................................................................................................

        this.viewportContextMenuColumnOrRowClear(historyTokens, menuItems, history);
        this.viewportContextMenuCellDelete(historyTokens, menuItems, history);
        this.viewportContextMenuColumnOrRowInsertBefore(historyTokens, menuItems, history);
        this.viewportContextMenuColumnOrRowInsertAfter(historyTokens, menuItems, history);

        // freeze.......................................................................................................

        this.viewportContextMenuColumnOrRowFreeze(range, historyTokens, frozenColumnOrRows, menuItems, history);

        this.viewportContextMenuColumnOrRowUnFreeze(
            historyTokens,
            frozenColumnOrRows,
            menuItems,
            SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNFREEZE_ID,
            history
        );

        this.viewportContextMenuColumnOrRowHide(historyTokens, menuItems, history);
        this.viewportContextMenuColumnOrRowUnHide(before, isHidden, historyTokens, menuItems, history, after);

        return menuItems;
    }

    viewportContextMenuColumnOrRowClear(historyTokens, menuItems, history) {
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = new SpreadsheetColumnOrRowClearHistoryHashToken(
            new SpreadsheetViewportSelection(this),
        );

        menuItems.push(
            history.menuItem(
                this.viewportClearText(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_CLEAR_ID,
                false, // disabled
                historyTokens
            )
        );
    }

    viewportContextMenuColumnOrRowFreeze(range, historyTokens, frozenColumnOrRows, menuItems, history) {
        this.viewportContextMenuColumnOrRowFreeze0(
            range(0),
            historyTokens,
            frozenColumnOrRows,
            menuItems,
            SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_1_ID,
            history
        );

        this.viewportContextMenuColumnOrRowFreeze0(
            range(1),
            historyTokens,
            frozenColumnOrRows,
            menuItems,
            SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_2_ID,
            history
        );

        this.viewportContextMenuColumnOrRowFreeze0(
            range(2),
            historyTokens,
            frozenColumnOrRows,
            menuItems,
            SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_3_ID,
            history
        );
    }

    viewportContextMenuColumnOrRowFreeze0(columnOrRowRange, historyTokens, frozenColumnOrRows, menuItems, menuItemId, history) {
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = columnOrRowRange &&
            new SpreadsheetColumnOrRowFreezeHistoryHashToken(
                new SpreadsheetViewportSelection(columnOrRowRange),
            );

        menuItems.push(
            history.menuItem(
                this.viewportFreezeColumnsRowsText(columnOrRowRange),
                menuItemId,
                columnOrRowRange.equals(frozenColumnOrRows()), // menuItemDisabled skip if given $columnOrRowRange already frozen
                historyTokens
            )
        );
    }

    viewportContextMenuColumnOrRowHide(historyTokens, menuItems, history) {
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = new SpreadsheetColumnOrRowSaveHistoryHashToken(
            new SpreadsheetViewportSelection(this),
            "hidden",
            true
        );

        menuItems.push(
            history.menuItem(
                this.viewportHideText(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID,
                false, // disabled
                historyTokens
            )
        );
    }

    viewportContextMenuColumnOrRowInsertAfter(historyTokens, menuItems, history) {
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(
            new SpreadsheetViewportSelection(this),
            1
        );

        menuItems.push(
            history.menuItem(
                this.viewportInsertAfter1Text(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID,
                false, // disabled
                historyTokens
            )
        );

        //historyTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(2);

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(
            new SpreadsheetViewportSelection(this),
            2
        );

        menuItems.push(
            history.menuItem(
                this.viewportInsertAfter2Text(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID,
                false, // disabled
                historyTokens
            )
        );
    }

    viewportContextMenuColumnOrRowInsertBefore(historyTokens, menuItems, history) {
        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(
            new SpreadsheetViewportSelection(this),
            2
        );

        menuItems.push(
            history.menuItem(
                this.viewportInsertBefore2Text(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID,
                false, // disabled
                historyTokens
            )
        );

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(
            new SpreadsheetViewportSelection(this),
            1
        );

        menuItems.push(
            history.menuItem(
                this.viewportInsertBefore1Text(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID,
                false, // disabled
                historyTokens
            )
        );
    }

    viewportContextMenuColumnOrRowUnFreeze(historyTokens, frozenColumnOrRows, menuItems, menuItemId, history) {
        const frozen = frozenColumnOrRows();

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = frozen && new SpreadsheetColumnOrRowSaveHistoryHashToken(
            new SpreadsheetViewportSelection(frozen),
        );

        menuItems.push(
            history.menuItem(
                this.viewportUnFreezeColumnsRowsText(frozen),
                menuItemId,
                !Boolean(frozen), // menuItemDisabled skip if nothing is frozen
                frozen && historyTokens
            )
        );
    }

    viewportContextMenuColumnOrRowUnHide(before, isHidden, historyTokens, menuItems, history, after) {
        // if the column/row BEFORE is hidden add Unhide column/row
        this.viewportContextMenuColumnOrRowUnHide0(
            before,
            isHidden,
            historyTokens,
            menuItems,
            SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNHIDE_BEFORE_ID,
            history
        );

        this.viewportContextMenuColumnOrRowUnHide0(
            after,
            isHidden,
            historyTokens,
            menuItems,
            SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNHIDE_AFTER_ID,
            history
        );
    }

    viewportContextMenuColumnOrRowUnHide0(columnOrRowRange, isHidden, historyTokens, menuItems, menuItemId, history) {
        if(!columnOrRowRange.equals(this) && isHidden(columnOrRowRange)){
            historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = new SpreadsheetColumnOrRowSaveHistoryHashToken(
                new SpreadsheetViewportSelection(columnOrRowRange),
                "hidden",
                false
            );

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

    viewportContextMenuRowDelete(historyTokens, menuItems, history) {
        const rowOrRange = this.rowOrRange();

        historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = new SpreadsheetColumnOrRowDeleteHistoryHashToken(
            new SpreadsheetViewportSelection(rowOrRange)
        );

        menuItems.push(
            history.menuItem(
                rowOrRange.viewportDeleteCellRowText(),
                SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ROW_ID,
                false, // disabled
                historyTokens
            )
        );
    }

    viewportFocus(giveFormulaFocus) {
        SystemObject.throwUnsupportedOperation();
    }

    viewportClearText() {
        return "Clear";
    }

    viewportDeleteCellText() {
        return "Delete";
    }

    viewportDeleteColumnText() {
        SystemObject.throwUnsupportedOperation();
    }

    viewportDeleteRowText() {
        SystemObject.throwUnsupportedOperation();
    }

    viewportFreezeCellsText(cells) {
        return "Freeze " + cells;
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

    viewportUnFreezeCellText() {
        return "Un Freeze " + this;
    }

    viewportUnFreezeColumnsRowsText(columnsRowRange) {
        return "Un Freeze" + (
            columnsRowRange ?
                " " + columnsRowRange :
                ""
        );
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
