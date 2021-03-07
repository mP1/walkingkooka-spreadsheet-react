import SpreadsheetParsePatterns from "./SpreadsheetParsePatterns.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetNumberParsePatterns extends SpreadsheetParsePatterns {

    static TYPE_NAME = "spreadsheet-number-parse-patterns";

    static fromJson(pattern) {
        return new SpreadsheetNumberParsePatterns(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetNumberParsePatterns(pattern);
    }

    // eslint-disable-next-line
    constructor(pattern) {
        super(pattern);
    }

    typeName() {
        return SpreadsheetNumberParsePatterns.TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetNumberParsePatterns &&
                this.pattern() === other.pattern())
    }
}

SystemObject.register(SpreadsheetNumberParsePatterns.TYPE_NAME, SpreadsheetNumberParsePatterns.fromJson);