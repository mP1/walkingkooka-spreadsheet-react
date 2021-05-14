/**
 * Captures the coordinates and dimensions of a rendered {@link SpreadsheetCell}.
 * This is used to locate the origin of the viewportCoordinates and the dimensions of the cell there.
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

        if(typeof (x) !== "number"){
            throw new Error("Expected number x got " + x);
        }
        if(x < 0){
            throw new Error("Expected x >= 0 got " + x);
        }
        this.xValue = x;

        if(typeof (y) !== "number"){
            throw new Error("Expected number y got " + y);
        }
        if(y < 0){
            throw new Error("Expected y >= 0 got " + y);
        }
        this.yValue = y;

        if(typeof (width) !== "number"){
            throw new Error("Expected number width got " + width);
        }
        if(width < 0){
            throw new Error("Expected width >= 0 got " + width);
        }
        this.widthValue = width;

        if(typeof (height) !== "number"){
            throw new Error("Expected number height got " + height);
        }
        if(height < 0){
            throw new Error("Expected height >= 0 got " + height);
        }
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