import SpreadsheetFormatPattern from "./SpreadsheetFormatPattern.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME="spreadsheet-text-format-pattern";

export default class SpreadsheetTextFormatPattern extends SpreadsheetFormatPattern {

    static fromJson(pattern) {
        return new SpreadsheetTextFormatPattern(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetTextFormatPattern(pattern);
    }

    constructor(pattern) {
        super(pattern);
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetTextFormatPattern &&
                this.pattern() === other.pattern())
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetTextFormatPattern.fromJson);