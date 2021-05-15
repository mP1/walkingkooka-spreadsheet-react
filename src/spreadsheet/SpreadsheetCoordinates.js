import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";

const SEPARATOR = ",";
const TYPE_NAME = "spreadsheet-coordinates";

/**
 * Absolute coordinates used to position or locate the top left corner of a cell within an entire spreadsheet.
 */
export default class SpreadsheetCoordinates extends SystemObject {

    static fromJson(json) {
        return SpreadsheetCoordinates.parse(json);
    }

    static parse(text) {
        Preconditions.requireNonEmptyText(text, "text");
        let tokens = text.split(SEPARATOR);
        if(2 !== tokens.length){
            throw new Error("Expected 2 tokens got " + text);
        }

        return new SpreadsheetCoordinates(Number(tokens[0]), Number(tokens[1]));
    }

    constructor(x, y) {
        super();

        Preconditions.requirePositiveNumber(x, "x");
        this.xValue = x;

        Preconditions.requirePositiveNumber(y, "y");
        this.yValue = y;
    }

    x() {
        return this.xValue;
    }

    y() {
        return this.yValue;
    }

    toJson() {
        return this.toString();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetCoordinates &&
                this.x() === other.x() &&
                this.y() === other.y());
    }

    toString() {
        return doubleToString(this.x()) + SEPARATOR + doubleToString(this.y());
    }
}

function doubleToString(number) {
    const toString = number.toString();
    return toString.endsWith(".0") ?
        toString.substring(0, toString.length() - 2) :
        toString;
}

SystemObject.register(TYPE_NAME, SpreadsheetCoordinates.fromJson);