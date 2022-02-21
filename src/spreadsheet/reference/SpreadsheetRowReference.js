import CharSequences from "../../CharSequences.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetColumnOrRowReference from "./SpreadsheetColumnOrRowReference";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";
import SpreadsheetRowReferenceRange from "./SpreadsheetRowReferenceRange.js";
import SpreadsheetSelection from "./SpreadsheetSelection.js";
import SpreadsheetViewportSelectionAnchor from "./SpreadsheetViewportSelectionAnchor.js";
import SystemObject from "../../SystemObject.js";

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

    testCell(cellReference) {
        Preconditions.requireInstance(cellReference, SpreadsheetCellReference, "cellReference");

        return this.value() === cellReference.row().value();
    }

    testColumn(columnReference) {
        Preconditions.requireInstance(columnReference, SpreadsheetColumnReference, "columnReference");

        return false;
    }

    testRow(rowReference) {
        Preconditions.requireInstance(rowReference, SpreadsheetRowReference, "rowReference");

        return this.value() === rowReference.value();
    }

    // context menu events..............................................................................................

    apiLoadCellsQueryStringParameterSelectionType() {
        return "row";
    }

    viewportDeleteCellRowText() {
        return "Delete row";
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

    viewportId() {
        return "viewport-row-" + this.toString().toUpperCase();
    }

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.ROW + "/" + this;
    }

    apiClearUrl() {
        return "/row/" + this + "/clear";
    }

    apiDeleteUrl() {
        return "/row/" + this;
    }

    apiInsertAfterUrl(count) {
        return "/row/" + this + "/after?count=" + count;
    }

    apiInsertBeforeUrl(count) {
        return "/row/" + this + "/before?count=" + count;
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

    // 0 = ""
    // 1 == api
    // 2 == spreadsheet
    // 3 == $spreadsheet-id
    // 4 == column == Selection
    // 5 == $selection
    // 6 == before == insert-action.toUrl
    apiInsertBeforePostUrl(urlPaths) {
        return urlPaths[4] === "row" &&
            urlPaths[5] === this.toString() &&
            urlPaths[6] === "before";
    }

    // viewport.........................................................................................................

    viewportLeft() {
        return this;
    }

    viewportRight(home) {
        return this.setColumn(home.column());
    }

    viewportUp() {
        return this.addSaturated(-1);
    }

    viewportDown() {
        return this.addSaturated(+1);
    }

    viewportLeftExtend(anchor, current, home) {
        return this.setAnchor();
    }

    viewportRightExtend(anchor, current, home) {
        return home.column()
            .setRow(this)
            .setAnchor()
    }

    viewportUpExtend(anchor, current, home) {
        return new SpreadsheetRowReferenceRange(
            this.viewportUp(),
            this
        ).rowOrRange()
            .setAnchorConditional(SpreadsheetViewportSelectionAnchor.BOTTOM)
    }

    viewportDownExtend(anchor, current, home) {
        return new SpreadsheetRowReferenceRange(
            this,
            this.viewportDown(),
        ).rowOrRange()
            .setAnchorConditional(SpreadsheetViewportSelectionAnchor.TOP)
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