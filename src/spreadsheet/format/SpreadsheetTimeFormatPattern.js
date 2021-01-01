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

    constructor(pattern) {
        super(pattern);
    }

    typeName() {
        return SpreadsheetTimeFormatPattern.TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetTimeFormatPattern &&
                this.pattern() === other.pattern())
    }
}

SystemObject.register(SpreadsheetTimeFormatPattern.TYPE_NAME, SpreadsheetTimeFormatPattern.fromJson);