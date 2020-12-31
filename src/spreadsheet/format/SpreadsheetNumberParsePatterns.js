import SpreadsheetParsePatterns from "./SpreadsheetParsePatterns.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-number-parse-patterns";

export default class SpreadsheetNumberParsePatterns extends SpreadsheetParsePatterns {

    static fromJson(pattern) {
        return new SpreadsheetNumberParsePatterns(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetNumberParsePatterns(pattern);
    }

    constructor(pattern) {
        super(pattern);
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetNumberParsePatterns &&
                this.pattern() === other.pattern())
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetNumberParsePatterns.fromJson);