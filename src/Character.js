/**
 * Holds a java Character expecting a string of length 1.
 */
export default class Character {

    static fromJson(text) {
        return new Character(text);
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
        const length = text.length;
        if(length !== 1){
            throw new Error("Expected string with length " + length + " got \"" + text + "\"");
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
            (other instanceof Character &&
                this.text() === other.text());
    }

    toString() {
        return this.text();
    }
}