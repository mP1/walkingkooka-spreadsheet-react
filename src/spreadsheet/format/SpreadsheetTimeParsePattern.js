import SpreadsheetParsePattern from "./SpreadsheetParsePattern.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetTimeParsePattern extends SpreadsheetParsePattern {

    static TYPE_NAME = "spreadsheet-time-parse-pattern";

    static fromJson(pattern) {
        return new SpreadsheetTimeParsePattern(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetTimeParsePattern(pattern);
    }

    typeName() {
        return SpreadsheetTimeParsePattern.TYPE_NAME;
    }
}

SystemObject.register(SpreadsheetTimeParsePattern.TYPE_NAME, SpreadsheetTimeParsePattern.fromJson);