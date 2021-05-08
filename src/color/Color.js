import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "color";

export default class Color extends SystemObject {

    static fromJson(text) {
        return Color.parse(text);
    }

    static parse(text) {
        return new Color(text);
    }

    constructor(text) {
        super();
        Preconditions.requireText(text, "text");
        if(text.length !== 7){
            throw new Error("Expected string text #rrggbb got " + text);
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
            (other instanceof Color &&
                this.text() === other.text())
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, Color.fromJson);