import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";
import SpreadsheetColumnOrRowReference from "./SpreadsheetColumnOrRowReference";

const RADIX = 26;
const A = 65;

export default class SpreadsheetColumnReference extends SpreadsheetColumnOrRowReference {

    static MAX = 16384;

    static fromJson(json) {
        return SpreadsheetColumnReference.parse(json);
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

        var value = 0;
        for (var i = startIndex; i < text.length; i++) {
            var c = text.charAt(i);
            if (c < 'A' || c > 'Z') {
                throw new Error("Expected letter between 'A' to 'Z' at " + i + " got " + text);
            }
            value = value * RADIX + text.charCodeAt(i) - A + 1;
        }
        if (value > SpreadsheetColumnReference.MAX) {
            throw new Error("Invalid value > " + SpreadsheetColumnReference.MAX + " got " + value);
        }

        return new SpreadsheetColumnReference(value -1, kind);
    }

    constructor(value, kind) {
        super(value, kind, SpreadsheetColumnReference.MAX);
    }

    toString() {
        return this.kind().prefix() + toString0(this.value());
    }
}

function toString0(value) {
    let s = "";

    const v = Math.floor(value / RADIX);
    if (v > 0) {
        s = s + toString0(v - 1);
    }
    return s + String.fromCharCode(value % RADIX + A);
}