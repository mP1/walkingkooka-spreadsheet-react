/**
 * Captures the coordinates and dimensions of a rendered {@link SpreadsheetCell}. This information is useful to help the
 * UI compute the origin of the visible {@link walkingkooka.spreadsheet.reference.SpreadsheetRange}.
 * Note the width and height may be empty when the spreadsheet has no cells and therefore there is no width/height.
 */
import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetViewport from "./SpreadsheetViewport.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-cell-box";

export default class SpreadsheetCellBox extends SystemObject {

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

        return new SpreadsheetCellBox(
            SpreadsheetCellReference.fromJson(json.reference),
            Number(json.x),
            Number(json.y),
            Number(json.width),
            Number(json.height)
        );
    }

    constructor(reference, x, y, width, height) {
        super();
        Preconditions.requireInstance(reference, SpreadsheetCellReference, "reference");
        this.referenceValue = reference;

        Preconditions.requirePositiveNumber(x, "x");
        this.xValue = x;

        Preconditions.requirePositiveNumber(y, "y");
        this.yValue = y;

        Preconditions.requirePositiveNumber(width, "width");
        this.widthValue = width;

        Preconditions.requirePositiveNumber(height, "height");
        this.heightValue = height;
    }

    reference() {
        return this.referenceValue;
    }

    x() {
        return this.xValue;
    }

    y() {
        return this.yValue;
    }

    width() {
        return this.widthValue;
    }

    height() {
        return this.heightValue;
    }

    viewport() {
        return new SpreadsheetViewport(this.reference(), this.width(), this.height());
    }

    toJson() {
        return {
            "reference": this.reference().toJson(),
            "x": this.x(),
            "y": this.y(),
            "width": this.width(),
            "height": this.height()
        };
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetCellBox &&
                this.reference().equals(other.reference()) &&
                this.x() === other.x() &&
                this.y() === other.y() &&
                this.width() === other.width() &&
                this.height() === other.height());
    }

    toString() {
        return this.reference() + " " + doubleToString(this.x()) + "," + doubleToString(this.y()) + " " + doubleToString(this.width()) + "x" + doubleToString(this.height());
    }
}

function doubleToString(number) {
    const toString = number.toString();
    return toString.endsWith(".0") ?
        toString.substring(0, toString.length() - 2) :
        toString;
}

SystemObject.register(TYPE_NAME, SpreadsheetCellBox.fromJson);