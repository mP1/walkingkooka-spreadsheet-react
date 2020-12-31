import SpreadsheetParsePatterns from "./SpreadsheetParsePatterns.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-datetime-parse-patterns";

export default class SpreadsheetDateTimeParsePatterns extends SpreadsheetParsePatterns {

    static fromJson(pattern) {
        return new SpreadsheetDateTimeParsePatterns(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetDateTimeParsePatterns(pattern);
    }

    constructor(pattern) {
        super(pattern);
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetDateTimeParsePatterns &&
                this.pattern() === other.pattern())
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetDateTimeParsePatterns.fromJson);