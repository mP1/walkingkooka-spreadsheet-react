import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";
import SpreadsheetColumnOrRowReference from "./SpreadsheetColumnOrRowReference";

export default class SpreadsheetRowReference extends SpreadsheetColumnOrRowReference {

    static MAX = 1048576;

    static fromJson(json) {
        return SpreadsheetRowReference.parse(json);
    }

    static parse(text) {
        if (!text) {
            throw new Error("Missing text");
        }
        if (typeof text !== "string") {
            throw new Error("Expected string got " + text);
        }

        let kind;
        let startIndex;

        if (text.startsWith("$")) {
            kind = SpreadsheetReferenceKind.ABSOLUTE;
            startIndex = 1;
        } else {
            kind = SpreadsheetReferenceKind.RELATIVE;
            startIndex = 0;
        }
        const value = Number(text.substring(startIndex));
        if (!value) {
            throw new Error("Missing row got " + text);
        }
        if (value > SpreadsheetRowReference.MAX) {
            throw new Error("Invalid value > " + SpreadsheetRowReference.MAX + " got " + value);
        }

        return new SpreadsheetRowReference(value, kind);
    }

    constructor(value, kind) {
        super(kind, value);
    }

    toString() {
        return this.kind().prefix() + this.value();
    }
}