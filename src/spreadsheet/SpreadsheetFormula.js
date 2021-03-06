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

        const {text, value, error} = json;
        return new SpreadsheetFormula(
            text,
            null != value ? SystemObject.fromJsonWithType(value) : value,
            null != error ? SpreadsheetError.fromJson(error) : error
        );
    }

    constructor(text, value, error) {
        super();
        checkText(text);
        if(error){
            if(null != value){
                throw new Error("Expected either value or error but got both " + value + " " + error);
            }
            if(!(error instanceof SpreadsheetError)){
                throw new Error("Expected SpreadsheetError got " + error);
            }
        }
        this.textValue = text;
        this.valueValue = value;
        this.spreadsheetError = error;
    }

    text() {
        return this.textValue;
    }

    setText(text) {
        checkText(text);

        return this.text() === text ?
            this :
            new SpreadsheetFormula(text, this.value(), this.error());
    }

    value() {
        return this.valueValue;
    }

    error() {
        return this.spreadsheetError;
    }

    toJson() {
        let json = {
            text: this.textValue
        };

        let value = this.value();
        if(null != value){
            json.value = SystemObject.toJsonWithType(value);
        }

        let error = this.error();
        if(error){
            json.error = error.toJson();
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
        Equality.safeEquals(formula.value(), other.value()) &&
        Equality.safeEquals(formula.error(), other.error());
}

function checkText(text) {
    Preconditions.requireText(text, "text");
    const length = text.length;
    if(length >= 8192){
        throw new Error("Invalid text length " + length + " >= 8192");
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetFormula.fromJson);