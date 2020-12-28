/**
 * Holds a java LocalDateTime date/time in json form.
 * This assumes various services are used to format this value.
 */
export default class LocalDateTime {

    static fromJson(text) {
        return new LocalDateTime(text);
    }

    constructor(text) {
        if (!text && text !== "") {
            throw new Error("Missing text");
        }
        if (text === "") {
            throw new Error("Empty text");
        }
        if (typeof text !== "string") {
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

    equals(other) {
        return this === other ||
            (other instanceof LocalDateTime &&
                this.text() === other.text());
    }

    toString() {
        return this.text();
    }
}