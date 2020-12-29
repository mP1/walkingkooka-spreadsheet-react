/**
 * Holds an error within processing of a spreadsheet cell.
 */
export default class SpreadsheetError {

    static fromJson(message) {
        return message && new SpreadsheetError(message);
    }

    constructor(message) {
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

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetError &&
                this.message() === other.message());
    }

    toString() {
        return this.message();
    }
}