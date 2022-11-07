import SpreadsheetParsePattern from "./SpreadsheetParsePattern.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetNumberParsePattern extends SpreadsheetParsePattern {

    static TYPE_NAME = "spreadsheet-number-parse-pattern";

    static fromJson(pattern) {
        return new SpreadsheetNumberParsePattern(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetNumberParsePattern(pattern);
    }

    typeName() {
        return SpreadsheetNumberParsePattern.TYPE_NAME;
    }
}

SystemObject.register(SpreadsheetNumberParsePattern.TYPE_NAME, SpreadsheetNumberParsePattern.fromJson);