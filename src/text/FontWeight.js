import SystemObject from "../SystemObject.js";

const TYPE_NAME = "font-weight";

/**
 * Holds a font-weight
 */
export default class FontWeight extends SystemObject {

    static fromJson(value) {
        if(!value){
            throw new Error("Missing value");
        }
        if(typeof value !== "number"){
            throw new Error("Expected number got " + value);
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