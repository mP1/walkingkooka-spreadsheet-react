import Keys from "../../Keys.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetColumnOrRowReference from "./SpreadsheetColumnOrRowReference";
import SpreadsheetColumnReferenceRange from "./SpreadsheetColumnReferenceRange.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import SpreadsheetSelection from "./SpreadsheetSelection.js";
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

    extendRangeLeft() {
        return new SpreadsheetColumnReferenceRange(
            this.addSaturated(-1),
            this
        ).columnOrRange();
    }

    extendRangeRight() {
        return new SpreadsheetColumnReferenceRange(
            this,
            this.addSaturated(+1)
        ).columnOrRange();
    }

    extendRangeUp() {
        return this;
    }

    extendRangeDown() {
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

    /**
     * LEFT | RIGHT Arrow keys update the column selection or when down selects the first visible cell or ESC clears the current selection.
     */
    onViewportKeyDown(key, setSelection, giveFormulaFocus, viewportHome) {
        console.log("onViewportKeyDown: " + key + " " + this);

        switch(key) {
            case Keys.ARROW_LEFT:
                setSelection(this.addSaturated(-1));
                break;
            case Keys.ARROW_DOWN:
                setSelection(viewportHome.setColumn(this));
                break;
            case Keys.ARROW_RIGHT:
                setSelection(this.addSaturated(+1));
                break;
            case Keys.ESCAPE:
                setSelection(null);
                break;
            default:
                // ignore other keys
                break;
        }
    }

    toQueryStringParameterSelectionType() {
        return "column";
    }

    toSelectionHashToken() {
        return SpreadsheetHistoryHash.COLUMN + "/" + this;
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