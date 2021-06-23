/**
 * A pixel rectangle marks a region with one or more cells.
 */
import Preconditions from "../Preconditions.js";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SystemObject from "../SystemObject.js";

const SEPARATOR = ":";
const TYPE_NAME = "spreadsheet-viewport";

export default class SpreadsheetViewport extends SystemObject {

    static fromJson(json) {
        return SpreadsheetViewport.parse(json);
    }

    static parse(text) {
        Preconditions.requireText(text, "text");

        let tokens = text.split(SEPARATOR);
        if(5 !== tokens.length){
            throw new Error("Expected 5 tokens got " + text);
        }

        return new SpreadsheetViewport(
            SpreadsheetCellReference.parse(tokens[0]),
            Number(tokens[1]),
            Number(tokens[2]),
            Number(tokens[3]),
            Number(tokens[4])
        );
    }

    constructor(reference, xOffset, yOffset, width, height) {
        super();
        Preconditions.requireInstance(reference, SpreadsheetCellReference, "reference");
        this.referenceValue = reference;

        Preconditions.requireNumber(xOffset, "xOffset");
        this.xOffsetValue = xOffset;

        Preconditions.requireNumber(yOffset, "yOffset");
        this.yOffsetValue = yOffset;

        Preconditions.requirePositiveNumber(width, "width");
        this.widthValue = width;

        Preconditions.requirePositiveNumber(height, "height");
        this.heightValue = height;
    }

    reference() {
        return this.referenceValue;
    }

    xOffset() {
        return this.xOffsetValue;
    }

    yOffset() {
        return this.yOffsetValue;
    }

    width() {
        return this.widthValue;
    }

    height() {
        return this.heightValue;
    }

    /**
     * Returns a query parameters map that will be used to load all the cells for the viewport widget.
     */
    toQueryStringParameters() {
        return {
            home: this.reference(),
            xOffset: this.xOffset(),
            yOffset: this.yOffset(),
            width: this.width(),
            height: this.height(),
        };
    }

    toJson() {
        return this.reference() + SEPARATOR + this.xOffset() + SEPARATOR + this.yOffset() + SEPARATOR + this.width() + SEPARATOR + this.height();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetViewport &&
                this.reference().equals(other.reference()) &&
                this.xOffset() === other.xOffset() &&
                this.yOffset() === other.yOffset() &&
                this.width() === other.width() &&
                this.height() === other.height());
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetViewport.fromJson);