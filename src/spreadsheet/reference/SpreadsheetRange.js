import CharSequences from "../../CharSequences.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetExpressionReference from "./SpreadsheetExpressionReference.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-range";
/**
 * A range is marked by two cell references.
 */
export default class SpreadsheetRange extends SpreadsheetExpressionReference {

    static fromJson(json) {
        return SpreadsheetRange.parse(json);
    }

    static parse(text) {
        Preconditions.requireNonEmptyText(text, "text");

        var range;
        const tokens = text.split(":");
        switch(tokens.length) {
            case 1:
                const cell = SpreadsheetCellReference.fromJson(tokens[0]);
                range = new SpreadsheetRange(cell, cell);
                break;
            case 2:
                const beginText = tokens[0];
                if(!beginText) {
                    throw new Error("Missing begin");
                }
                const beginCell = SpreadsheetCellReference.fromJson(beginText);
                const endText = tokens[1];
                if(!endText) {
                    throw new Error("Missing end");
                }

                let endCell;
                try {
                    endCell = SpreadsheetCellReference.fromJson(endText);
                } catch(e) {
                    const message = e.message;
                    if(message.startsWith("Invalid character ")){
                        const at = message.indexOf(" at ");
                        const pos = parseInt(message.substring(at + 4));
                        throw new Error(message.substring(0, at + 4) + (1 + pos + text.indexOf(":")));
                    }else {
                        throw e;
                    }
                }

                range = new SpreadsheetRange(
                    beginCell,
                    endCell);
                break;
            default:
                throw new Error("Expected 1 or 2 tokens got " + CharSequences.quoteAndEscape(text));
        }

        return range;
    }

    constructor(begin, end) {
        super();
        Preconditions.requireInstance(begin, SpreadsheetCellReference, "begin");
        this.beginValue = begin;

        Preconditions.requireInstance(end, SpreadsheetCellReference, "end");
        this.endValue = end;
    }

    begin() {
        return this.beginValue;
    }

    end() {
        return this.endValue;
    }

    /**
     * Tests if the given {@link SpreadsheetCellReference} is within this range.
     */
    testCell(cellReference) {
        Preconditions.requireInstance(cellReference, SpreadsheetCellReference, "cellReference");

        return this.testColumn(cellReference.column()) &&
            this.testRow(cellReference.row());
    }

    testColumn(columnReference) {
        Preconditions.requireInstance(columnReference, SpreadsheetColumnReference, "columnReference");

        const begin = this.begin();
        const end = this.end();

        return columnReference.compareTo(begin.column()) >= 0 &&
            columnReference.compareTo(end.column()) <= 0;
    }

    testRow(rowReference) {
        Preconditions.requireInstance(rowReference, SpreadsheetRowReference, "rowReference");

        const begin = this.begin();
        const end = this.end();

        return rowReference.compareTo(begin.row()) >= 0 &&
            rowReference.compareTo(end.row()) <= 0;
    }
    
    toJson() {
        const begin = this.begin();
        const end = this.end();
        return begin.equals(end) ?
            begin.toJson() :
            begin.toJson() + ":" + end.toJson();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetRange && this.begin().equals(other.begin()) && this.end().equals(other.end()));
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetRange.fromJson);