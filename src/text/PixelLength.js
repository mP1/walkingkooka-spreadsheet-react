import Length from "./Length";
import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "pixel-length";

/**
 * Holds a pixel length value.
 */
export default class PixelLength extends Length {

    static fromJson(json) {
        return PixelLength.parse(json);
    }

    static parse(text) {
        Preconditions.requireText(text, "text");
        if(!(text.endsWith("px"))){
            throw new Error("Expected string ending with \"px\" got " + text);
        }

        const value = Number(text.substring(0, text.length - 2));
        if(Number.isNaN(value)){
            throw new Error("Expected number \"px\" got " + text);
        }
        return new PixelLength(value);
    }

    constructor(value) {
        super();
        this.valueValue = value;
    }

    value() {
        return this.valueValue;
    }

    pixelValue() {
        return this.value();
    }

    typeName() {
        return TYPE_NAME;
    }

    toCssValue() {
        const value = this.value();
        return 0 === value ?
            "0" :
            value + "px";
    }

    equals(other) {
        return this === other ||
            (other instanceof PixelLength &&
                this.value() === other.value());
    }

    toString() {
        return this.value() + "px";
    }
}

SystemObject.register(TYPE_NAME, PixelLength.fromJson);