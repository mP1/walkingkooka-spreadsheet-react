import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";

export default class SpreadsheetColumnOrRowReference {

    constructor(kind, value) {
        if (!kind) {
            throw new Error("Missing reference");
        }
        if (!kind instanceof SpreadsheetReferenceKind) {
            throw new Error("Expected SpreadsheetReferenceKind kind got " + kind);
        }
        this.kindValue = kind;

        if (!value) {
            throw new Error("Missing value");
        }
        if (typeof value !== "number") {
            throw new Error("Expected number value got " + value);
        }
        this.valueValue = value;
    }

    kind() {
        return this.kindValue;
    }

    value() {
        return this.valueValue;
    }

    toJson() {
        return this.toString();
    }
}