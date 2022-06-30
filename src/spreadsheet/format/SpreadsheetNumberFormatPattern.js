import SpreadsheetFormatPattern from "./SpreadsheetFormatPattern.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetNumberFormatPattern extends SpreadsheetFormatPattern {

    static TYPE_NAME = "spreadsheet-number-format-pattern";

    static fromJson(pattern) {
        return new SpreadsheetNumberFormatPattern(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetNumberFormatPattern(pattern);
    }

    typeName() {
        return SpreadsheetNumberFormatPattern.TYPE_NAME;
    }
}

SystemObject.register(SpreadsheetNumberFormatPattern.TYPE_NAME, SpreadsheetNumberFormatPattern.fromJson);