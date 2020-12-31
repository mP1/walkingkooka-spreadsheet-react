/**
 * Holds a java Character expecting a string of length 1.
 */
import SystemObject from "./SystemObject.js";

const TYPE_NAME = "character";

export default class Character extends SystemObject {

    static fromJson(text) {
        return new Character(text);
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
        const length = text.length;
        if(length !== 1){
            throw new Error("Expected string with length=1 got " + length + " \"" + text + "\"");
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
            (other instanceof Character &&
                this.text() === other.text());
    }

    toString() {
        return this.text();
    }
}

SystemObject.register(TYPE_NAME, Character.fromJson);