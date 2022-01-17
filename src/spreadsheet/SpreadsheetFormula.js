import Equality from "../Equality.js";
import Preconditions from "../Preconditions.js";
import SpreadsheetError from "./SpreadsheetError";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "spreadsheet-formula";
/**
 * Represents a formula.
 */
export default class SpreadsheetFormula extends SystemObject {

    /**
     * A {@link SpreadsheetFormula} with empty text, no value and no error.
     */
    static EMPTY = new SpreadsheetFormula("");

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

        const {text, value} = json;
        return new SpreadsheetFormula(
            text,
            null != value ? SystemObject.fromJsonWithType(value) : value
        );
    }

    constructor(text, value) {
        super();
        checkText(text);
        this.textValue = text;
        this.valueValue = value;
    }

    text() {
        return this.textValue;
    }

    setText(text) {
        checkText(text);

        return this.text() === text ?
            this :
            new SpreadsheetFormula(text, this.value());
    }

    value() {
        return this.valueValue;
    }

    error() {
        const value = this.value();
        return value instanceof SpreadsheetError && value;
    }

    toJson() {
        let json = {
            text: this.text()
        };

        let value = this.value();
        if(null != value){
            json.value = SystemObject.toJsonWithType(value);
        }

        return json;
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetFormula &&
                equals0(this, other));
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

function equals0(formula, other) {
    return formula.text() === other.text() &&
        Equality.safeEquals(formula.value(), other.value());
}

function checkText(text) {
    Preconditions.requireText(text, "text");
    const length = text.length;
    if(length >= 8192){
        throw new Error("Invalid text length " + length + " >= 8192");
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetFormula.fromJson);