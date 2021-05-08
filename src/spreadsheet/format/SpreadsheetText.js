import Color from "../../color/Color.js";
import Preconditions from "../../Preconditions.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-text";

export default class SpreadsheetText extends SystemObject {

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

        const {color, text} = json;
        return new SpreadsheetText(color ? Color.fromJson(color) : color,
            text);
    }

    constructor(color, text) {
        super();
        Preconditions.requireInstanceOrNull(color, Color, "color");
        Preconditions.requireText(text, "text");
        this.colorValue = color;
        this.textValue = text;
    }

    color() {
        return this.colorValue;
    }

    text() {
        return this.textValue;
    }

    toJson() {
        const json = {
            text: this.text(),
        }

        const color = this.color();
        if(color){
            json.color = color.toJson();
        }

        return json;
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetText &&
                this.color() === other.color() &&
                this.text() === other.text())
    }

    toString() {
        return this.toJson();
    }
}

SpreadsheetText.register(TYPE_NAME, SpreadsheetText.fromJson);