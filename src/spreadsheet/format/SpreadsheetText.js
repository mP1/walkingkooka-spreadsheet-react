import Color from "../../color/Color.js";

export default class SpreadsheetText {

    static fromJson(json) {
        if (!json) {
            throw new Error("Missing json");
        }
        if (typeof json !== "object") {
            throw new Error("Expected object got " + json);
        }

        const {color, text} = json;
        return new SpreadsheetText(color, text);
    }

    constructor(color, text) {
        if (typeof color !== "undefined" && !(color instanceof Color)) {
            throw new Error("Expected Color color got " + color);
        }
        if (!text) {
            throw new Error("Missing text");
        }
        if (typeof text !== "string") {
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
        if (color) {
            json.color = color.toJson();
        }

        return json;
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