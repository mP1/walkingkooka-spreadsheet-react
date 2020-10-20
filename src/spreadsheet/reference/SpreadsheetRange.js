import SpreadsheetCellReference from "./SpreadsheetCellReference";

/**
 * A range is marked by two cell references.
 */
export default class SpreadsheetRange {

    static fromJson(json) {
        if (!json) {
            throw new Error("Json missing");
        }
        if (typeof json != "string") {
            throw new Error("Expected string got " + json);
        }

        let tokens = json.split(":");
        if (2 != tokens.length) {
            throw new Error("Expected 2 tokens got " + json);
        }

        return new SpreadsheetRange(new SpreadsheetCellReference(tokens[0]), new SpreadsheetCellReference(tokens[1]));
    }

    constructor(begin, end) {
        if (!begin) {
            throw new Error("Begin missing");
        }
        if (!(begin instanceof SpreadsheetCellReference)) {
            throw new Error("Expected SpreadsheetCellReference begin got " + begin);
        }
        this.beginValue = begin;

        if (!end) {
            throw new Error("End missing");
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