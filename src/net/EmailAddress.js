import SystemObject from "../SystemObject.js";

const TYPE_NAME = "email-address";
/**
 * Holds a java EmailAddress in json form.
 * This assumes various services are used to validate/format this value.
 */
export default class EmailAddress extends SystemObject {

    static fromJson(text) {
        return new EmailAddress(text);
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

    toJson() {
        return this.text();
    }

    typeName() {
        return TYPE_NAME;
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

SystemObject.register(TYPE_NAME, EmailAddress.fromJson);