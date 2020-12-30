import SystemObject from "../SystemObject.js";

const TYPE_NAME = "spreadsheet-cell-format";

/**
 * Holds a format pattern within processing of a spreadsheet cell.
 */
export default class SpreadsheetCellFormat extends SystemObject {

    static fromJson(pattern) {
        return pattern ?
            new SpreadsheetCellFormat(pattern) :
            null;
    }

    constructor(pattern) {
        super();
        if(!pattern){
            throw new Error("Missing pattern");
        }
        if(typeof pattern !== "string"){
            throw new Error("Expected string got " + pattern);
        }
        this.patternValue = pattern;
    }

    pattern() {
        return this.patternValue;
    }

    toJson() {
        return this.pattern();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetCellFormat &&
                this.pattern() === other.pattern());
    }

    toString() {
        return this.pattern();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetCellFormat.fromJson);