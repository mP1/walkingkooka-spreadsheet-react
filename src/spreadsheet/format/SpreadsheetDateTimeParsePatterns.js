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

    typeName() {
        return SpreadsheetDateTimeParsePatterns.TYPE_NAME;
    }
}

SystemObject.register(SpreadsheetDateTimeParsePatterns.TYPE_NAME, SpreadsheetDateTimeParsePatterns.fromJson);