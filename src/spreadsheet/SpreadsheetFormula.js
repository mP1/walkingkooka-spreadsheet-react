import SpreadsheetError, {fromJson as SpreadsheetErrorFromJson} from "./SpreadsheetError";

export function fromJson(json) {
    if(!json) {
        throw new Error("Json missing");
    }

    const {text, value, error} = json;
    return new SpreadsheetFormula(text, value, SpreadsheetErrorFromJson(error));
}

/**
 * Represents a formula.
 */
export default class SpreadsheetFormula {

    constructor(text, value, error) {
        if (!text) {
            throw new Error("Text missing");
        }
        if (typeof text != "string") {
            throw new Error("Expected string got " + text);
        }
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