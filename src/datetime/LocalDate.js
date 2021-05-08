/**
 * Holds a java LocalDate date in json form.
 * This assumes various services are used to parse/format/perform computations using this value.
 */
import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "local-date";

export default class LocalDate extends SystemObject {

    static fromJson(text) {
        return new LocalDate(text);
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
            (other instanceof LocalDate &&
                this.text() === other.text());
    }

    toString() {
        return this.text();
    }
}

SystemObject.register(TYPE_NAME, LocalDate.fromJson);