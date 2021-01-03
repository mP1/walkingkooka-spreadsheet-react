import SpreadsheetFormatPattern from "./SpreadsheetFormatPattern.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetTextFormatPattern extends SpreadsheetFormatPattern {

    static TYPE_NAME = "spreadsheet-text-format-pattern";

    static fromJson(pattern) {
        return new SpreadsheetTextFormatPattern(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetTextFormatPattern(pattern);
    }

    // eslint-disable-next-line no-useless-constructor
    constructor(pattern) {
        super(pattern);
    }

    typeName() {
        return SpreadsheetTextFormatPattern.TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetTextFormatPattern &&
                this.pattern() === other.pattern())
    }
}

SystemObject.register(SpreadsheetTextFormatPattern.TYPE_NAME, SpreadsheetTextFormatPattern.fromJson);