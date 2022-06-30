import SpreadsheetFormatPattern from "./SpreadsheetFormatPattern.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetDateFormatPattern extends SpreadsheetFormatPattern {

    static TYPE_NAME = "spreadsheet-date-format-pattern";

    static fromJson(pattern) {
        return new SpreadsheetDateFormatPattern(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetDateFormatPattern(pattern);
    }

    typeName() {
        return SpreadsheetDateFormatPattern.TYPE_NAME;
    }
}

SystemObject.register(SpreadsheetDateFormatPattern.TYPE_NAME, SpreadsheetDateFormatPattern.fromJson);