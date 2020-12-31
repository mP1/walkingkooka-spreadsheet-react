/**
 * Holds a java Locale in json form.
 * This assumes various services are used to validate/format this value.
 * No methods are available to extract the individual components within the locale.
 * TODO split on underscore, basic character validation etc
 */
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "locale";

export default class Locale extends SystemObject {

    static fromJson(text) {
        return new Locale(text);
    }

    constructor(text) {
        super();
        if(!text && text !== ""){
            throw new Error("Missing text");
        }
        if(typeof text !== "string"){
            throw new Error("Expected string got " + text);
        }
        this.textValue = text;
    }

    text() {
        return this.textValue;
    }

    toJson() {
        return this.text();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof Locale &&
                this.text() === other.text());
    }

    toString() {
        return this.text();
    }
}

SystemObject.register(TYPE_NAME, Locale.fromJson);