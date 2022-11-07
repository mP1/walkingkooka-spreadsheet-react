import SpreadsheetParsePattern from "./SpreadsheetParsePattern.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetDateParsePattern extends SpreadsheetParsePattern {

    static TYPE_NAME = "spreadsheet-date-parse-pattern";

    static fromJson(pattern) {
        return new SpreadsheetDateParsePattern(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetDateParsePattern(pattern);
    }

    typeName() {
        return SpreadsheetDateParsePattern.TYPE_NAME;
    }
}

SystemObject.register(SpreadsheetDateParsePattern.TYPE_NAME, SpreadsheetDateParsePattern.fromJson);