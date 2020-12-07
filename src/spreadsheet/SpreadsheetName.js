/**
 * Holds a spreadsheet name, no validation is performed on the text
 */
export default class SpreadsheetName {

    static fromJson(value) {
        return SpreadsheetName.parse(value);
    }

    static parse(text) {
        return new SpreadsheetName(text);
    }

    constructor(value) {
        if (!value) {
            throw new Error("Missing value");
        }
        if (typeof value !== "string") {
            throw new Error("Expected string got " + value);
        }
        this.valueValue = value;
    }

    value() {
        return this.valueValue;
    }

    toJson() {
        return this.value();
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetName && this.value() == other.value());
    }

    toString() {
        return this.value();
    }
}