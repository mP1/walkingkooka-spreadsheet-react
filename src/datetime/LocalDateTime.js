/**
 * Holds a java LocalDateTime date/time in json form.
 * This assumes various services are used to format this value.
 */
import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "local-date-time";

export default class LocalDateTime extends SystemObject {

    static fromJson(text) {
        return new LocalDateTime(text);
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
        return other instanceof LocalDateTime &&
            this.text() === other.text();
    }

    toString() {
        return this.text();
    }
}

SystemObject.register(TYPE_NAME, LocalDateTime.fromJson);