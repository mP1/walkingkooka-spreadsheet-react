/**
 * Holds a java LocalTime time in json form.
 * This assumes various services are used to parse/format/perform computations using this value.
 */
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "local-time";

export default class LocalTime extends SystemObject {

    static fromJson(text) {
        return new LocalTime(text);
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
            (other instanceof LocalTime &&
                this.text() === other.text());
    }

    toString() {
        return this.text();
    }
}

SystemObject.register(TYPE_NAME, LocalTime.fromJson);