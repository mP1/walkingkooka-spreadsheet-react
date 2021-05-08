import Preconditions from "../../Preconditions.js";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetColumnOrRowReference extends SystemObject {

    constructor(value, kind) {
        super();
        const max = this.max();

        Preconditions.requireNumber(value, "value");
        if(value < 0 || value >= max){
            throw new Error("Invalid value not between 0 and " + max + " got " + value);
        }
        this.valueValue = value;

        Preconditions.requireNonNullInstance(kind, SpreadsheetReferenceKind, "kind");
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
        Preconditions.requireNumber(delta, "delta");
        return this.setValue(this.value() + delta);
    }

    addSaturated(delta) {
        Preconditions.requireNumber(delta, "delta");
        return this.setValue(
            Math.min(
                Math.max(this.value() + delta, 0),
                this.max() -1
            )
        );
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

    equals(other) {
        return this === other || (other instanceof this.constructor && this.kind().equals(other.kind()) && this.value() === other.value());
    }
}