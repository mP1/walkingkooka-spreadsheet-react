import Character from "../../Character.js";
import CharSequences from "../../CharSequences.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetColumnOrRowReference from "./SpreadsheetColumnOrRowReference";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import SystemObject from "../../SystemObject.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";

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
                throw new Error("Invalid character, got " + CharSequences.quoteAndEscape(Character.fromJson(c)) + " at " + i + " in " + CharSequences.quoteAndEscape(text));
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

    toSelectionHashToken() {
        return SpreadsheetHistoryHash.COLUMN + "/" + this;
    }

    toString() {
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