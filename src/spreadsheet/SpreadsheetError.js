/**
 * Holds an error within processing of a spreadsheet cell.
 */
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "spreadsheet-error";

export default class SpreadsheetError extends SystemObject {

    static fromJson(message) {
        return message && new SpreadsheetError(message);
    }

    constructor(message) {
        super();
        if(!message){
            throw new Error("Missing message");
        }
        if(typeof message !== "string"){
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