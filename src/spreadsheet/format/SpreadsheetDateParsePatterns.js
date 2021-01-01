import SpreadsheetParsePatterns from "./SpreadsheetParsePatterns.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetDateParsePatterns extends SpreadsheetParsePatterns {

    static TYPE_NAME = "spreadsheet-date-parse-patterns";

    static fromJson(pattern) {
        return new SpreadsheetDateParsePatterns(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetDateParsePatterns(pattern);
    }

    constructor(pattern) {
        super(pattern);
    }

    typeName() {
        return SpreadsheetDateParsePatterns.TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetDateParsePatterns &&
                this.pattern() === other.pattern())
    }
}

SystemObject.register(SpreadsheetDateParsePatterns.TYPE_NAME, SpreadsheetDateParsePatterns.fromJson);