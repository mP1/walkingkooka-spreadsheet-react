import SpreadsheetError from "./SpreadsheetError";

/**
 * Represents a formula.
 */
export default class SpreadsheetFormula {

    static fromJson(json) {
        if(!json) {
            throw new Error("Missing json");
        }

        const {text, value, error} = json;
        return new SpreadsheetFormula(text, value, SpreadsheetError.fromJson(error));
    }

    constructor(text, value, error) {
        checkText(text);
        if (error) {
            if (value) {
                throw new Error("Expected either value or error but got both " + value + " " + error);
            }
            if (!(error instanceof SpreadsheetError)) {
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

        let value = this.valueValue;
        if (value) {
            json.value = value;
        }

        let error = this.spreadsheetError;
        if (error) {
            json.error = error.toJson();
        }

        return json;
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

function checkText(text) {
    if (!text && "" !== text) {
        throw new Error("Missing text");
    }
    if (typeof text !== "string") {
        throw new Error("Expected string text got " + text);
    }
}