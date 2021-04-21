import SystemObject from "../SystemObject.js";

const SEPARATOR = ",";
const TYPE_NAME = "spreadsheet-expression-reference-similarities";

export default class SpreadsheetExpressionReferenceSimilarities extends SystemObject {

    static fromJson(json) {
        return SpreadsheetExpressionReferenceSimilarities.parse(json);
    }

    static parse(text) {
        if(!text){
            throw new Error("Missing text");
        }
        if(typeof text !== "string"){
            throw new Error("Expected string got " + text);
        }
        let tokens = text.split(SEPARATOR);
        if(2 !== tokens.length){
            throw new Error("Expected 2 tokens got " + text);
        }

        return new SpreadsheetExpressionReferenceSimilarities(Number(tokens[0]), Number(tokens[1]));
    }

    constructor(x, y) {
        super();

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
    }

    x() {
        return this.xValue;
    }

    y() {
        return this.yValue;
    }

    toJson() {
        return this.toString();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetExpressionReferenceSimilarities &&
                this.x() === other.x() &&
                this.y() === other.y());
    }

    toString() {
        return doubleToString(this.x()) + SEPARATOR + doubleToString(this.y());
    }
}

function doubleToString(number) {
    const toString = number.toString();
    return toString.endsWith(".0") ?
        toString.substring(0, toString.length() - 2) :
        toString;
}

SystemObject.register(TYPE_NAME, SpreadsheetExpressionReferenceSimilarities.fromJson);