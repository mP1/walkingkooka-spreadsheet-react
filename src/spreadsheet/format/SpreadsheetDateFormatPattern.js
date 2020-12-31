import SpreadsheetFormatPattern from "./SpreadsheetFormatPattern.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-date-format-pattern";

export default class SpreadsheetDateFormatPattern extends SpreadsheetFormatPattern {

    static fromJson(pattern) {
        return new SpreadsheetDateFormatPattern(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetDateFormatPattern(pattern);
    }

    constructor(pattern) {
        super(pattern);
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetDateFormatPattern &&
                this.pattern() === other.pattern())
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetDateFormatPattern.fromJson);