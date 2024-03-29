import SpreadsheetFormatPattern from "./SpreadsheetFormatPattern.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetDateTimeFormatPattern extends SpreadsheetFormatPattern {

    static TYPE_NAME = "spreadsheet-date-time-format-pattern";

    static fromJson(pattern) {
        return new SpreadsheetDateTimeFormatPattern(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetDateTimeFormatPattern(pattern);
    }

    typeName() {
        return SpreadsheetDateTimeFormatPattern.TYPE_NAME;
    }
}

SystemObject.register(SpreadsheetDateTimeFormatPattern.TYPE_NAME, SpreadsheetDateTimeFormatPattern.fromJson);