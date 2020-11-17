export default class SpreadsheetReferenceKind {

    static ABSOLUTE = new SpreadsheetReferenceKind("ABSOLUTE");
    static RELATIVE = new SpreadsheetReferenceKind("RELATIVE");

    static of(text) {
        if (!text) {
            throw new Error("Missing text");
        }

        switch (text) {
            case "ABSOLUTE":
                return SpreadsheetReferenceKind.ABSOLUTE;
            case "RELATIVE":
                return SpreadsheetReferenceKind.RELATIVE;
            default:
                throw new Error("Unknown text: " + text);
        }
    }

    constructor(name) {
        this.name = name;
    }

    toJson() {
        return this.name;
    }

    toString() {
        return this.name;
    }
}