/**
 * Holds a java Locale in json form.
 * This assumes various services are used to validate/format this value.
 * No methods are available to extract the individual components within the locale.
 * TODO split on underscore, basic character validation etc
 */
import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "locale";

export default class Locale extends SystemObject {

    static fromJson(text) {
        return new Locale(text);
    }

    constructor(text) {
        super();
        Preconditions.requireText(text, "text");
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