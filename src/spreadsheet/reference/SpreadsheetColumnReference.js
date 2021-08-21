import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetColumnOrRowReference from "./SpreadsheetColumnOrRowReference";
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

    // viewport keyboard................................................................................................

    navigateLeft(viewportHome) {
        return this.addSaturated(-1);
    }

    navigateRight(viewportHome) {
        return this.addSaturated(+1);
    }

    navigateUp(viewportHome) {
        return this;
    }

    navigateDown(viewportHome) {
        return viewportHome.row()
            .setColumn(this);
    }

    extendRangeLeft(anchor, current, viewportHome) {
        return new SpreadsheetColumnReferenceRange(
            this.addSaturated(-1),
            this
        ).columnOrRange()
            .setAnchorConditional(SpreadsheetViewportSelectionAnchor.RIGHT);
    }

    extendRangeRight(anchor, current, viewportHome) {
        return new SpreadsheetColumnReferenceRange(
            this,
            this.addSaturated(+1)
        ).columnOrRange()
            .setAnchorConditional(SpreadsheetViewportSelectionAnchor.LEFT);
    }

    extendRangeUp(anchor, current, viewportHome) {
        Preconditions.requireInstance(viewportHome, SpreadsheetCellReference, "viewportHome");

        return this.setAnchor();
    }

    extendRangeDown(anchor, current, viewportHome) {
        Preconditions.requireInstance(viewportHome, SpreadsheetCellReference, "viewportHome");

        return viewportHome.row()
            .setColumn(this)
            .setAnchor();
    }

    selectionFocus(labelToReference, anchor) {
        return this;
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

    viewportId() {
        return "viewport-column-" + this.toString().toUpperCase();
    }

    typeName() {
        return TYPE_NAME;
    }

    toQueryStringParameterSelectionType() {
        return "column";
    }

    toSelectionHashToken() {
        return SpreadsheetHistoryHash.COLUMN + "/" + this;
    }

    selectOptionText() {
        return this.toString();
    }

    toJson() {
        return this.kind().prefix() + toString0(this.value());
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