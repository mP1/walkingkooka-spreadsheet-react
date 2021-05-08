import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "font-weight";

/**
 * Holds a font-weight
 */
export default class FontWeight extends SystemObject {

    static fromJson(value) {
        Preconditions.requireNumber(value, "value");
        if(value <= 0) {
            throw new Error("Expected number > 0 got " + value);
        }
        return new FontWeight(value);
    }

    constructor(value) {
        super();
        this.valueValue = value;
    }

    value() {
        return this.valueValue;
    }

    toJson() {
        return this.value();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof FontWeight &&
                this.value() === other.value());
    }

    toString() {
        return this.value();
    }
}

SystemObject.register(TYPE_NAME, FontWeight.fromJson);