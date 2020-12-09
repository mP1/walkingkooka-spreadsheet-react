import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetRectangle from "./SpreadsheetRectangle";

/**
 * A range is marked by two cell references.
 */
export default class SpreadsheetRange extends SpreadsheetRectangle{

    static fromJson(json) {
        return SpreadsheetRange.parse(json);
    }

    static parse(text) {
        if (!text) {
            throw new Error("Missing text");
        }
        if (typeof text !== "string") {
            throw new Error("Expected string got " + text);
        }

        var range;
        const tokens = text.split(":");
        switch (tokens.length) {
            case 1:
                const cell = SpreadsheetCellReference.fromJson(tokens[0]);
                range = new SpreadsheetRange(cell, cell);
                break;
            case 2:
                range = new SpreadsheetRange(
                    SpreadsheetCellReference.fromJson(tokens[0]),
                    SpreadsheetCellReference.fromJson(tokens[1]));
                break;
            default:
                throw new Error("Expected 1 or 2 tokens got " + text);
        }

        return range;
    }

    constructor(begin, end) {
        super();
        if (!begin) {
            throw new Error("Missing begin");
        }
        if (!(begin instanceof SpreadsheetCellReference)) {
            throw new Error("Expected SpreadsheetCellReference begin got " + begin);
        }
        this.beginValue = begin;

        if (!end) {
            throw new Error("Missing end");
        }
        if (!(end instanceof SpreadsheetCellReference)) {
            throw new Error("Expected SpreadsheetCellReference end got " + end);
        }
        this.endValue = end;
    }

    begin() {
        return this.beginValue;
    }

    end() {
        return this.endValue;
    }

    toJson() {
        const begin = this.begin();
        const end = this.end();
        return begin.equals(end) ?
            begin.toJson() :
            begin.toJson() + ":" + end.toJson();
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetRange && this.begin().equals(other.begin()) && this.end().equals(other.end()));
    }

    toString() {
        return this.toJson();
    }
}