import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";

export default class SpreadsheetColumnOrRowReference {

    constructor(value, kind, max) {
        if (typeof value !== "number") {
            throw new Error("Expected number value got " + value);
        }
        if (value < 0 || value >= max) {
            throw new Error("Invalid value not between 0 and " + max + " got " + value);
        }
        this.valueValue = value;

        if (!kind) {
            throw new Error("Missing kind");
        }
        if (!(kind instanceof SpreadsheetReferenceKind)) {
            throw new Error("Expected SpreadsheetReferenceKind kind got " + kind);
        }
        this.kindValue = kind;
    }

    kind() {
        return this.kindValue;
    }

    /**
     * Helper only intended to be called by sub classes.
     */
    setRelativeKind0(kind, factory) {
        if (!kind) {
            throw new Error("Missing kind");
        }
        if (!(kind instanceof SpreadsheetReferenceKind)) {
            throw new Error("Expected SpreadsheetReferenceKind kind got " + kind);
        }

        return this.kind() == kind ?
            this :
            new factory(this.value(), kind);
    }

    value() {
        return this.valueValue;
    }

    toJson() {
        return this.toString();
    }
}