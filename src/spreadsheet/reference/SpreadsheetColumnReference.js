import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetColumnOrRowReference from "./SpreadsheetColumnOrRowReference";
import SpreadsheetColumnOrRowInsertAfterHistoryHashToken
    from "../history/SpreadsheetColumnOrRowInsertAfterHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertBeforeHistoryHashToken
    from "../history/SpreadsheetColumnOrRowInsertBeforeHistoryHashToken.js";
import SpreadsheetColumnReferenceRange from "./SpreadsheetColumnReferenceRange.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import SpreadsheetSelection from "./SpreadsheetSelection.js";
import SpreadsheetViewportSelectionAnchor from "./SpreadsheetViewportSelectionAnchor.js";
import SystemObject from "../../SystemObject.js";

const A = 65;
const TYPE_NAME = "spreadsheet-column-reference";

export default class SpreadsheetColumnReference extends SpreadsheetColumnOrRowReference {

    static RADIX = 26;
    static MAX = 16384;

    static fromJson(json) {
        return SpreadsheetColumnReference.parse(json);
    }

    static parse(text) {
        Preconditions.requireNonEmptyText(text, "text");

        let kind;
        let startIndex;

        if(text.startsWith("$")){
            kind = SpreadsheetReferenceKind.ABSOLUTE;
            startIndex = 1;
        }else {
            kind = SpreadsheetReferenceKind.RELATIVE;
            startIndex = 0;
        }

        var value = 0;
        for(var i = startIndex; i < text.length; i++) {
            const c = text.charAt(i).toUpperCase();
            if(c < 'A' || c > 'Z'){
                SpreadsheetSelection.reportInvalidCharacter(c, i);
            }
            value = value * SpreadsheetColumnReference.RADIX + c.charCodeAt(0) - A + 1;
        }
        if(value > SpreadsheetColumnReference.MAX){
            throw new Error("Invalid value > " + SpreadsheetColumnReference.MAX + " got " + value);
        }

        return new SpreadsheetColumnReference(value - 1, kind);
    }

    max() {
        return SpreadsheetColumnReference.MAX;
    }

    setRow(row) {
        return new SpreadsheetCellReference(this, row);
    }

    testCell(cellReference) {
        Preconditions.requireInstance(cellReference, SpreadsheetCellReference, "cellReference");

        return this.testColumn(cellReference.column());
    }

    testColumn(columnReference) {
        Preconditions.requireInstance(columnReference, SpreadsheetColumnReference, "columnReference");

        return this.value() === columnReference.value();
    }

    testRow(rowReference) {
        Preconditions.requireInstance(rowReference, SpreadsheetRowReference, "rowReference");

        return false;
    }

    // context menu events..............................................................................................

    // context menu events..............................................................................................

    // delete
    // insert 1 before
    // insert 2 before
    // insert 1 after
    // insert 2 after
    buildContextMenuItems(historyTokens, history) {
        historyTokens[SpreadsheetHistoryHash.SELECTION] = this;
        historyTokens[SpreadsheetHistoryHash.SELECTION_ACTION] = null;
        historyTokens[SpreadsheetHistoryHash.SELECTION_ANCHOR] = null;

        const menuItems = [];

        const before2 = this.addSaturated(-2);
        const before1 = this.addSaturated(-1);

        if(!before2.equals(before1)){
            historyTokens[SpreadsheetHistoryHash.SELECTION_ACTION] = new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(2);

            menuItems.push(
                history.menuItem(
                    "Insert 2 before",
                    SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_2,
                    historyTokens
                )
            );
        }

        if(!before1.equals(this)){
            historyTokens[SpreadsheetHistoryHash.SELECTION_ACTION] = new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(1);

            menuItems.push(
                history.menuItem(
                    "Insert 1 before",
                    SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_1,
                    historyTokens
                )
            );
        }

        const after2 = this.addSaturated(+2);
        const after1 = this.addSaturated(+1);

        if(!after1.equals(this)){
            historyTokens[SpreadsheetHistoryHash.SELECTION_ACTION] = new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(1);

            menuItems.push(
                history.menuItem(
                    "Insert 1 after",
                    SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_1,
                    historyTokens
                )
            );
        }

        if(!after2.equals(after1)){
            historyTokens[SpreadsheetHistoryHash.SELECTION_ACTION] = new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(2);

            menuItems.push(
                history.menuItem(
                    "Insert 2 after",
                    SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_2,
                    historyTokens
                )
            );
        }

        return menuItems;
    }

    static VIEWPORT_COLUMN_INSERT_BEFORE_2 = "viewport-column-insert-before-2";
    static VIEWPORT_COLUMN_INSERT_BEFORE_1 = "viewport-column-insert-before-1";
    static VIEWPORT_COLUMN_INSERT_AFTER_1 = "viewport-column-insert-after-1";
    static VIEWPORT_COLUMN_INSERT_AFTER_2 = "viewport-column-insert-after-2";

    viewportId() {
        return "viewport-column-" + this.toString().toUpperCase();
    }

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.COLUMN + "/" + this;
    }

    toLoadCellsQueryStringParameterSelectionType() {
        return "column";
    }

    toDeleteUrl() {
        return "/column/" + this;
    }

    toInsertAfterUrl(count) {
        return "/column/" + this + "/after?count=" + count;
    }

    toInsertBeforeUrl(count) {
        return "/column/" + this + "/before?count=" + count;
    }

    // 0 = ""
    // 1 == api
    // 2 == spreadsheet
    // 3 == $spreadsheet-id
    // 4 == column == Selection
    // 5 == $selection
    // 6 == after === insert-action.toUrl
    isInsertAfterPostUrl(urlPaths) {
        return urlPaths[4] === "column" &&
            urlPaths[5] === this.toString() &&
            urlPaths[6] === "after";
    }

    // 0 = ""
    // 1 == api
    // 2 == spreadsheet
    // 3 == $spreadsheet-id
    // 4 == column == Selection
    // 5 == $selection
    // 6 == before == insert-action.toUrl
    isInsertBeforePostUrl(urlPaths) {
        return urlPaths[4] === "column" &&
            urlPaths[5] === this.toString() &&
            urlPaths[6] === "before";
    }

    // viewport.........................................................................................................

    viewportLeft() {
        return this.addSaturated(-1);
    }

    viewportRight() {
        return this.addSaturated(+1);
    }

    viewportUp(viewportHome) {
        return this;
    }

    viewportDown(viewportHome) {
        return viewportHome.row()
            .setColumn(this);
    }

    viewportLeftExtend(anchor, current, viewportHome) {
        return new SpreadsheetColumnReferenceRange(
            this.viewportLeft(),
            this
        ).columnOrRange()
            .setAnchorConditional(SpreadsheetViewportSelectionAnchor.RIGHT);
    }

    viewportRightExtend(anchor, current, viewportHome) {
        return new SpreadsheetColumnReferenceRange(
            this,
            this.viewportRight()
        ).columnOrRange()
            .setAnchorConditional(SpreadsheetViewportSelectionAnchor.LEFT);
    }

    viewportUpExtend(anchor, current, viewportHome) {
        return this.setAnchor();
    }

    viewportDownExtend(anchor, current, viewportHome) {
        return viewportHome.row()
            .setColumn(this)
            .setAnchor();
    }
    
    // JSON.............................................................................................................

    toJson() {
        return this.kind().prefix() + toString0(this.value());
    }

    typeName() {
        return TYPE_NAME;
    }
}

function toString0(value) {
    let s = "";

    const v = Math.floor(value / SpreadsheetColumnReference.RADIX);
    if(v > 0){
        s = s + toString0(v - 1);
    }
    return s + String.fromCharCode(value % SpreadsheetColumnReference.RADIX + A);
}

SystemObject.register(TYPE_NAME, SpreadsheetColumnReference.fromJson);