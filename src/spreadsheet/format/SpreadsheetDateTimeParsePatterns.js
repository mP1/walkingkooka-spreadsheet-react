import SpreadsheetParsePatterns from "./SpreadsheetParsePatterns.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetDateTimeParsePatterns extends SpreadsheetParsePatterns {

    static TYPE_NAME = "spreadsheet-date-time-parse-patterns";

    static fromJson(pattern) {
        return new SpreadsheetDateTimeParsePatterns(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetDateTimeParsePatterns(pattern);
    }

    // eslint-disable-next-line no-useless-constructor
    constructor(pattern) {
        super(pattern);
    }

    typeName() {
        return SpreadsheetDateTimeParsePatterns.TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetDateTimeParsePatterns &&
                this.pattern() === other.pattern())
    }
}

SystemObject.register(SpreadsheetDateTimeParsePatterns.TYPE_NAME, SpreadsheetDateTimeParsePatterns.fromJson);