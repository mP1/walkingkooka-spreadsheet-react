/**
 * Holds an error within processing of a spreadsheet cell.
 */
import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "spreadsheet-error";

export default class SpreadsheetError extends SystemObject {

    static fromJson(message) {
        return new SpreadsheetError(message);
    }

    constructor(message) {
        super();
        Preconditions.requireNonEmptyText(message, "message");
        this.messageValue = message;
    }

    message() {
        return this.messageValue;
    }

    toJson() {
        return this.message();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetError &&
                this.message() === other.message());
    }

    toString() {
        return this.message();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetError.fromJson);