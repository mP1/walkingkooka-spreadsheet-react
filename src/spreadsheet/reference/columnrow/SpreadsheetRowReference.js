import CharSequences from "../../../CharSequences.js";
import Preconditions from "../../../Preconditions.js";
import SpreadsheetCellRange from "../cell/SpreadsheetCellRange.js";
import SpreadsheetCellReference from "../cell/SpreadsheetCellReference.js";
import SpreadsheetColumnOrRowReference from "./SpreadsheetColumnOrRowReference.js";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetReferenceKind from "../SpreadsheetReferenceKind.js";
import SpreadsheetRow from "./SpreadsheetRow.js";
import SpreadsheetSelection from "../SpreadsheetSelection.js";
import SystemObject from "../../../SystemObject.js";

const TYPE_NAME = "spreadsheet-row-reference";

export default class SpreadsheetRowReference extends SpreadsheetColumnOrRowReference {

    static MAX = 1048576;

    static fromJson(json) {
        return SpreadsheetRowReference.parse(json);
    }

    static parse(text) {
        Preconditions.requireText(text, "text");

        let kind;
        let startIndex;

        if(text.startsWith("$")){
            kind = SpreadsheetReferenceKind.ABSOLUTE;
            startIndex = 1;
        }else {
            kind = SpreadsheetReferenceKind.RELATIVE;
            startIndex = 0;
        }

        const length = text.length;
        for(var i = startIndex; i < length; i++) {
            const c = text.charAt(i);
            if(c < '0' || c > '9'){
                SpreadsheetSelection.reportInvalidCharacter(c, i);
            }
        }

        const value = Number(text.substring(startIndex));
        if(!value){
            throw new Error("Missing row got " + CharSequences.quoteAndEscape(text));
        }
        if(value > SpreadsheetRowReference.MAX){
            throw new Error("Invalid value " + value + " > " + SpreadsheetRowReference.MAX);
        }

        return new SpreadsheetRowReference(value - 1, kind);
    }

    max() {
        return SpreadsheetRowReference.MAX;
    }

    setColumn(column) {
        return new SpreadsheetCellReference(column, this);
    }

    rowOrRange() {
        return this;
    }

    patch(property, value) {
        return new SpreadsheetRow(this, false)
            .patch(property, value);
    }

    testCell(cellReference) {
        Preconditions.requireInstance(cellReference, SpreadsheetCellReference, "cellReference");

        return this.testRow(cellReference.row());
    }

    testColumn(columnReference) {
        Preconditions.requireInstance(columnReference, SpreadsheetColumnReference, "columnReference");

        return false;
    }

    testRow(rowReference) {
        Preconditions.requireInstance(rowReference, SpreadsheetRowReference, "rowReference");

        return this.value() === rowReference.value();
    }

    testCellRange(range) {
        Preconditions.requireInstance(range, SpreadsheetCellRange, "range");

        return this.compareTo(range.begin().row()) >= 0 &&
            this.compareTo(range.end().row()) <= 0;
    }

    toRelative() {
        return new SpreadsheetRowReference(
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
            frozenRows,
            isRowHidden,
            rowRange,
            history
        );
    }

    viewportDeleteCellRowText() {
        return "Delete row";
    }

    viewportHideText() {
        return "Hide";
    }

    static VIEWPORT_INSERT_AFTER_1_TEXT = "Insert 1 after";
    static VIEWPORT_INSERT_AFTER_2_TEXT = "Insert 2 after";

    static VIEWPORT_INSERT_BEFORE_1_TEXT = "Insert 1 before";
    static VIEWPORT_INSERT_BEFORE_2_TEXT = "Insert 2 before";

    static VIEWPORT_INSERT_AFTER_1_ID = "viewport-row-insert-after-1";
    static VIEWPORT_INSERT_AFTER_2_ID = "viewport-row-insert-after-2";

    static VIEWPORT_INSERT_BEFORE_1_ID = "viewport-row-insert-before-1";
    static VIEWPORT_INSERT_BEFORE_2_ID = "viewport-row-insert-before-2";

    viewportInsertAfter1Text() {
        return SpreadsheetRowReference.VIEWPORT_INSERT_AFTER_1_TEXT;
    }

    viewportInsertAfter2Text() {
        return SpreadsheetRowReference.VIEWPORT_INSERT_AFTER_2_TEXT;
    }

    viewportInsertBefore1Text() {
        return SpreadsheetRowReference.VIEWPORT_INSERT_BEFORE_1_TEXT;
    }

    viewportInsertBefore2Text() {
        return SpreadsheetRowReference.VIEWPORT_INSERT_BEFORE_2_TEXT;
    }

    viewportUnHideText() {
        return "Unhide row " + this;
    }

    viewportId() {
        return "viewport-row-" + this.toString().toUpperCase();
    }

    historyHashPath() {
        return SpreadsheetHistoryHashTokens.ROW + "/" + this;
    }

    freezePatch() {
        return {
            "frozen-rows": this.toString()
        };
    }

    unFreezePatch() {
        return {
            "frozen-rows": null
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
        return urlPaths[4] === "row" &&
            urlPaths[5] === this.toString() &&
            urlPaths[6] === "after";
    }

    kebabClassName() {
        return "row";
    }

    // JSON............................................................................................................

    typeName() {
        return TYPE_NAME;
    }

    toJson() {
        return this.kind().prefix() + (1 + this.value());
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetRowReference.fromJson);