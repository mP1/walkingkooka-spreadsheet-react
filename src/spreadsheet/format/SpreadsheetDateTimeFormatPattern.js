import SpreadsheetFormatPattern from "./SpreadsheetFormatPattern.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-datetime-format-pattern";

export default class SpreadsheetDateTimeFormatPattern extends SpreadsheetFormatPattern {

    static fromJson(pattern) {
        return new SpreadsheetDateTimeFormatPattern(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetDateTimeFormatPattern(pattern);
    }

    constructor(pattern) {
        super(pattern);
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetDateTimeFormatPattern &&
                this.pattern() === other.pattern())
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetDateTimeFormatPattern.fromJson);