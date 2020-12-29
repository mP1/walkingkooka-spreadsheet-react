export default class Color {

    static fromJson(text) {
        return Color.parse(text);
    }

    static parse(text) {
        return new Color(text);
    }

    constructor(text) {
        if(!text){
            throw new Error("Missing text");
        }
        if(typeof text !== "string"){
            throw new Error("Expected string text got " + JSON.stringify(text));
        }
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

    equals(other) {
        return this === other ||
            (other instanceof Color &&
                this.text() === other.text())
    }

    toString() {
        return this.toJson();
    }
}