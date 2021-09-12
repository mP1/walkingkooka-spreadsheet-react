import CharSequences from "../../CharSequences.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetColumnOrRowReference from "./SpreadsheetColumnOrRowReference";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
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

    buildContextMenuItems(historyTokens){
        // nop
    }

    toLoadCellsQueryStringParameterSelectionType() {
        return "row";
    }

    viewportId() {
        return "viewport-row-" + this.toString().toUpperCase();
    }

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.ROW + "/" + this;
    }

    toDeleteUrl() {
        return "/row/" + this;
    }

    // viewport.........................................................................................................

    viewportLeft() {
        return this;
    }

    viewportRight(viewportHome) {
        return this.setColumn(viewportHome.column());
    }

    viewportUp() {
        return this.addSaturated(-1);
    }

    viewportDown() {
        return this.addSaturated(+1);
    }

    viewportLeftExtend(anchor, current, viewportHome) {
        return this.setAnchor();
    }

    viewportRightExtend(anchor, current, viewportHome) {
        return viewportHome.column()
            .setRow(this)
            .setAnchor()
    }

    viewportUpExtend(anchor, current, viewportHome) {
        return new SpreadsheetRowReferenceRange(
            this.viewportUp(),
            this
        ).rowOrRange()
            .setAnchorConditional(SpreadsheetViewportSelectionAnchor.BOTTOM)
    }

    viewportDownExtend(anchor, current, viewportHome) {
        return new SpreadsheetRowReferenceRange(
            this,
            this.viewportDown(),
        ).rowOrRange()
            .setAnchorConditional(SpreadsheetViewportSelectionAnchor.TOP)
    }

    // JSON............................................................................................................

    toInsertAfterUrl(count) {
        return "/row/" + this + "/after?count=" + count;
    }

    typeName() {
        return TYPE_NAME;
    }

    toJson() {
        return this.kind().prefix() + (1 + this.value());
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetRowReference.fromJson);