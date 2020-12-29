/**
 * Holds a java EmailAddress in json form.
 * This assumes various services are used to validate/format this value.
 */
export default class EmailAddress {

    static fromJson(text) {
        return new EmailAddress(text);
    }

    constructor(text) {
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

    toJson() {
        return this.text();
    }

    equals(other) {
        return this === other ||
            (other instanceof EmailAddress &&
                this.text() === other.text());
    }

    toString() {
        return this.text();
    }
}