import SpreadsheetParsePatterns from "./SpreadsheetParsePatterns.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-time-parse-patterns";

export default class SpreadsheetTimeParsePatterns extends SpreadsheetParsePatterns {

    static fromJson(pattern) {
        return new SpreadsheetTimeParsePatterns(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetTimeParsePatterns(pattern);
    }

    constructor(pattern) {
        super(pattern);
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetTimeParsePatterns &&
                this.pattern() === other.pattern())
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetTimeParsePatterns.fromJson);