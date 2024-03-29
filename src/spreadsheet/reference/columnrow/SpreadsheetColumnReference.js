import Preconditions from "../../../Preconditions.js";
import SpreadsheetCellRange from "../cell/SpreadsheetCellRange.js";
import SpreadsheetCellReference from "../cell/SpreadsheetCellReference.js";
import SpreadsheetColumn from "./SpreadsheetColumn.js";
import SpreadsheetColumnOrRowReference from "./SpreadsheetColumnOrRowReference.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetReferenceKind from "../SpreadsheetReferenceKind.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import SpreadsheetSelection from "../SpreadsheetSelection.js";
import SystemObject from "../../../SystemObject.js";

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

    columnOrRange() {
        return this;
    }

    patch(property, value) {
        return new SpreadsheetColumn(this, false)
            .patch(property, value);
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

    testCellRange(range) {
        Preconditions.requireInstance(range, SpreadsheetCellRange, "range");

        return this.compareTo(range.begin().column()) >= 0 &&
            this.compareTo(range.end().column()) <= 0;
    }

    toRelative() {
        return new SpreadsheetColumnReference(
            this.value(),
            SpreadsheetReferenceKind.RELATIVE
        );
    }

    // context menu events..............................................................................................

    viewportContextMenu(historyTokens, frozenColumns, frozenRows, isColumnHidden, isRowHidden, columnRange, rowRange, history) {
        return this.viewportContextMenuColumnOrRow(
            historyTokens,
            this.addSaturated(-1),
            this.addSaturated(+1),
            frozenColumns,
            isColumnHidden,
            columnRange,
            history
        );
    }

    viewportDeleteCellColumnText() {
        return "Delete column";
    }

    static VIEWPORT_INSERT_AFTER_1_TEXT = "Insert 1 after";
    static VIEWPORT_INSERT_AFTER_2_TEXT = "Insert 2 after";

    static VIEWPORT_INSERT_BEFORE_1_TEXT = "Insert 1 before";
    static VIEWPORT_INSERT_BEFORE_2_TEXT = "Insert 2 before";

    viewportInsertAfter1Text() {
        return SpreadsheetColumnReference.VIEWPORT_INSERT_AFTER_1_TEXT;
    }

    viewportInsertAfter2Text() {
        return SpreadsheetColumnReference.VIEWPORT_INSERT_AFTER_2_TEXT;
    }

    viewportInsertBefore1Text() {
        return SpreadsheetColumnReference.VIEWPORT_INSERT_BEFORE_1_TEXT;
    }

    viewportInsertBefore2Text() {
        return SpreadsheetColumnReference.VIEWPORT_INSERT_BEFORE_2_TEXT;
    }

    viewportId() {
        return "viewport-column-" + this.toString().toUpperCase();
    }

    historyHashPath() {
        return SpreadsheetHistoryHashTokens.COLUMN + "/" + this;
    }

    freezePatch() {
        return {
            "frozen-columns": this.toString()
        };
    }

    unFreezePatch() {
        return {
            "frozen-columns": null
        };
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

    // viewport.........................................................................................................

    viewportHideText() {
        return "Hide";
    }

    viewportUnHideText() {
        return "Unhide column " + this;
    }

    kebabClassName() {
        return "column";
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