/**
 * A pixel rectangle marks a region with one or more cells.
 */
import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetRectangle from "./SpreadsheetRectangle";
import SystemObject from "../../SystemObject.js";

const SEPARATOR = ":";
const TYPE_NAME = "spreadsheet-viewport";

export default class SpreadsheetViewport extends SpreadsheetRectangle {

    static fromJson(json) {
        return SpreadsheetViewport.parse(json);
    }

    static parse(text) {
        Preconditions.requireText(text, "text");

        let tokens = text.split(SEPARATOR);
        if(3 !== tokens.length){
            throw new Error("Expected 3 tokens got " + text);
        }

        return new SpreadsheetViewport(
            SpreadsheetCellReference.parse(tokens[0]),
            Number(tokens[1]),
            Number(tokens[2])
        );
    }

    constructor(reference, width, height) {
        super();

        Preconditions.requireNonNullInstance(reference, SpreadsheetCellReference, "reference");
        this.referenceValue = reference.toRelative();

        Preconditions.requireNumber(width, "width");
        if(width <= 0){
            throw new Error("Expected width > 0 got " + width);
        }
        this.widthValue = width;

        Preconditions.requireNumber(height, "height");
        if(height <= 0){
            throw new Error("Expected height > 0 got " + height);
        }
        this.heightValue = height;
    }

    reference() {
        return this.referenceValue;
    }

    width() {
        return this.widthValue;
    }

    height() {
        return this.heightValue;
    }

    toJson() {
        return this.reference() + SEPARATOR + this.width() + SEPARATOR + this.height();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetViewport &&
                this.reference().equals(other.reference()) &&
                this.width() === other.width() &&
                this.height() === other.height());
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetViewport.fromJson);