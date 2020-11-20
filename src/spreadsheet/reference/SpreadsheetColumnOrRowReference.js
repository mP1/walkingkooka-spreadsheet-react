import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";

export default class SpreadsheetColumnOrRowReference {

    constructor(value, kind) {
        const max = this.max();

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
     * Would be setter that returns a {@link SpreadsheetColumnOrRowReference} of the same type with the given {@link SpreadsheetReferenceKind}.
     */
    setKind(kind) {
        return this.kind() === kind ?
            this :
            new this.constructor(this.value(), kind);
    }

    add(delta) {
        if (typeof delta !== "number") {
            throw new Error("Expected number delta got " + delta);
        }
        return this.setValue(this.value() + delta);
    }

    value() {
        return this.valueValue;
    }

    setValue(value) {
        return this.value() === value ?
            this :
            new this.constructor(value, this.kind());
    }

    toJson() {
        return this.toString();
    }
}