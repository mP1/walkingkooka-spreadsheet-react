export function fromJson(message) {
    return message ?
        new SpreadsheetError(message) :
        null;
}

/**
 * Holds an error within processing of a spreadsheet cell.
 */
export default class SpreadsheetError {

    constructor(message) {
        if (!message) {
            throw new Error("message missing");
        }
        if (typeof message != "string") {
            throw new Error("Expected string got " + message);
        }
        this.messageValue = message;
    }

    message() {
        return this.messageValue;
    }

    toJson() {
        return this.message();
    }

    toString() {
        return this.message();
    }
}