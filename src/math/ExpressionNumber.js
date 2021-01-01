/**
 * Holds a java ExpressionNumber as text, no actual math operations are implemented.
 */
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "expression-number";

export default class ExpressionNumber extends SystemObject {

    static fromJson(text) {
        return new ExpressionNumber(text);
    }

    constructor(text) {
        super();
        if(!text && text !== ""){
            throw new Error("Missing text");
        }
        if(text === ""){
            throw new Error("Empty text");
        }
        if(typeof text !== "string"){
            throw new Error("Expected string got " + text);
        }
        this.textValue = text;
    }

    text() {
        return this.textValue;
    }

    typeName() {
        return TYPE_NAME;
    }

    toJson() {
        return this.text();
    }

    equals(other) {
        return this === other ||
            (other instanceof ExpressionNumber &&
                this.text() === other.text());
    }

    toString() {
        return this.text();
    }
}

SystemObject.register(TYPE_NAME, ExpressionNumber.fromJson);