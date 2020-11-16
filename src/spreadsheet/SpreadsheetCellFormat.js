/**
 * Holds a format pattern within processing of a spreadsheet cell.
 */
export default class SpreadsheetCellFormat {

    static fromJson(pattern) {
        return pattern ?
            new SpreadsheetCellFormat(pattern) :
            null;
    }

    constructor(pattern) {
        if (!pattern) {
            throw new Error("Missing pattern");
        }
        if (typeof pattern !== "string") {
            throw new Error("Expected string got " + pattern);
        }
        this.patternValue = pattern;
    }

    pattern() {
        return this.patternValue;
    }

    toJson() {
        return this.pattern();
    }

    toString() {
        return this.pattern();
    }
}