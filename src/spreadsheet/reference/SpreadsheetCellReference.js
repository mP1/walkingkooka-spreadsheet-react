/**
 * Holds a cell reference. Note the reference is not validated in anyway.
 */
export default class SpreadsheetCellReference {

    static fromJson(reference) {
        return new SpreadsheetCellReference(reference);
    }

    constructor(reference) {
        if (!reference) {
            throw new Error("Missing reference");
        }
        if (typeof reference != "string") {
            throw new Error("Expected string got " + reference);
        }
        this.referenceValue = reference;
    }

    reference() {
        return this.referenceValue;
    }

    toJson() {
        return this.reference();
    }

    toString() {
        return this.reference();
    }
}