import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "font-size";

/**
 * Holds a font-size
 */
export default class FontSize extends SystemObject {

    static parseHistoryHashToken(value) {
        return value && FontSize.fromJson(Number.parseFloat(value));
    }

    static fromJson(value) {
        Preconditions.requireNumber(value, "value");
        if(value <= 0) {
            throw new Error("Expected number > 0 got " + value);
        }
        return new FontSize(value);
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
        return other instanceof FontSize &&
            this.value() === other.value();
    }

    toString() {
        return this.value();
    }
}

SystemObject.register(TYPE_NAME, FontSize.fromJson);