import SpreadsheetParsePattern from "./SpreadsheetParsePattern.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetDateTimeParsePattern extends SpreadsheetParsePattern {

    static TYPE_NAME = "spreadsheet-date-time-parse-pattern";

    static fromJson(pattern) {
        return new SpreadsheetDateTimeParsePattern(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetDateTimeParsePattern(pattern);
    }

    typeName() {
        return SpreadsheetDateTimeParsePattern.TYPE_NAME;
    }
}

SystemObject.register(SpreadsheetDateTimeParsePattern.TYPE_NAME, SpreadsheetDateTimeParsePattern.fromJson);