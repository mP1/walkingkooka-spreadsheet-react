import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetRectangle from "./SpreadsheetRectangle";

/**
 * A range is marked by two cell references.
 */
export default class SpreadsheetRange extends SpreadsheetRectangle{

    static fromJson(json) {
        if (!json) {
            throw new Error("Missing json");
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