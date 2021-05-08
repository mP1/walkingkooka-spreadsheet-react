/**
 * Holds a java LocalTime time in json form.
 * This assumes various services are used to parse/format/perform computations using this value.
 */
import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "local-time";

export default class LocalTime extends SystemObject {

    static fromJson(text) {
        return new LocalTime(text);
    }

    constructor(text) {
        super();
        Preconditions.requireNonEmptyText(text, "text");
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
            (other instanceof LocalTime &&
                this.text() === other.text());
    }

    toString() {
        return this.text();
    }
}

SystemObject.register(TYPE_NAME, LocalTime.fromJson);