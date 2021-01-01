import Color from "../../color/Color.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-text";

export default class SpreadsheetText extends SystemObject {

    static fromJson(json) {
        if(!json){
            throw new Error("Missing json");
        }
        if(typeof json !== "object"){
            throw new Error("Expected object got " + json);
        }

        const {color, text} = json;
        return new SpreadsheetText(color ? Color.fromJson(color) : color,
            text);
    }

    constructor(color, text) {
        super();
        if(typeof color !== "undefined" && !(color instanceof Color)){
            throw new Error("Expected Color color got " + color);
        }
        if(!text && text !== ""){
            throw new Error("Missing text");
        }
        if(typeof text !== "string"){
            throw new Error("Expected string text got " + text);
        }
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