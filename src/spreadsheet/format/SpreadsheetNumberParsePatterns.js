import SpreadsheetParsePatterns from "./SpreadsheetParsePatterns.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetNumberParsePatterns extends SpreadsheetParsePatterns {

    static TYPE_NAME = "spreadsheet-number-parse-patterns";

    static fromJson(pattern) {
        return new SpreadsheetNumberParsePatterns(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetNumberParsePatterns(pattern);
    }

    typeName() {
        return SpreadsheetNumberParsePatterns.TYPE_NAME;
    }
}

SystemObject.register(SpreadsheetNumberParsePatterns.TYPE_NAME, SpreadsheetNumberParsePatterns.fromJson);