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

        let tokens = text.split(":");
        if (2 !== tokens.length) {
            throw new Error("Expected 2 tokens got " + text);
        }

        return new SpreadsheetRange(
            SpreadsheetCellReference.fromJson(tokens[0]),
            SpreadsheetCellReference.fromJson(tokens[1])
        );
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
        return this.begin() + ":" + this.end();
    }

    toString() {
        return this.toJson();
    }
}