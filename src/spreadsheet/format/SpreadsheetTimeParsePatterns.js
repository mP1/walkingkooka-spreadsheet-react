import SpreadsheetParsePatterns from "./SpreadsheetParsePatterns.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetTimeParsePatterns extends SpreadsheetParsePatterns {

    static TYPE_NAME = "spreadsheet-time-parse-patterns";

    static fromJson(pattern) {
        return new SpreadsheetTimeParsePatterns(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetTimeParsePatterns(pattern);
    }

    // eslint-disable-next-line
    constructor(pattern) {
        super(pattern);
    }

    typeName() {
        return SpreadsheetTimeParsePatterns.TYPE_NAME;
    }
}

SystemObject.register(SpreadsheetTimeParsePatterns.TYPE_NAME, SpreadsheetTimeParsePatterns.fromJson);