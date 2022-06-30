import SpreadsheetFormatPattern from "./SpreadsheetFormatPattern.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetTimeFormatPattern extends SpreadsheetFormatPattern {

    static TYPE_NAME = "spreadsheet-time-format-pattern";

    static fromJson(pattern) {
        return new SpreadsheetTimeFormatPattern(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetTimeFormatPattern(pattern);
    }

    typeName() {
        return SpreadsheetTimeFormatPattern.TYPE_NAME;
    }
}

SystemObject.register(SpreadsheetTimeFormatPattern.TYPE_NAME, SpreadsheetTimeFormatPattern.fromJson);