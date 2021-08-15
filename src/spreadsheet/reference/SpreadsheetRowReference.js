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

    // viewport keyboard................................................................................................

    navigateLeft(viewportHome) {
        return this;
    }

    navigateRight(viewportHome) {
        return this.setColumn(viewportHome.column());
    }

    navigateUp(viewportHome) {
        return this.addSaturated(-1);
    }

    navigateDown(viewportHome) {
        return this.addSaturated(+1);
    }

    extendRangeLeft(anchor, current, viewportHome) {
        Preconditions.requireInstance(viewportHome, SpreadsheetCellReference, "viewportHome");

        return this.setAnchor();
    }

    extendRangeRight(anchor, current, viewportHome) {
        Preconditions.requireInstance(viewportHome, SpreadsheetCellReference, "viewportHome");

        return viewportHome.column()
            .setRow(this)
            .setAnchor()
    }

    extendRangeUp(anchor, current, viewportHome) {
        return new SpreadsheetRowReferenceRange(
            this.addSaturated(-1),
            this
        ).rowOrRange()
            .setAnchorConditional(SpreadsheetViewportSelectionAnchor.BOTTOM)
    }

    extendRangeDown(anchor, current, viewportHome) {
        return new SpreadsheetRowReferenceRange(
            this,
            this.addSaturated(+1),
        ).rowOrRange()
            .setAnchorConditional(SpreadsheetViewportSelectionAnchor.TOP)
    }

    selectionFocus(labelToReference, anchor) {
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

    toQueryStringParameterSelectionType() {
        return "row";
    }

    viewportId() {
        return "viewport-row-" + this.toString().toUpperCase();
    }

    toSelectionHashToken() {
        return SpreadsheetHistoryHash.ROW + "/" + this;
    }

    typeName() {
        return TYPE_NAME;
    }

    toJson() {
        return this.kind().prefix() + (1 + this.value());
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetRowReference.fromJson);