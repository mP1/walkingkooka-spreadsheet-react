/**
 * Holds an error within processing of a spreadsheet cell.
 */
import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";
import SpreadsheetErrorKind from "./SpreadsheetErrorKind.js";

const TYPE_NAME = "spreadsheet-error";

export default class SpreadsheetError extends SystemObject {

    static fromJson(json) {
        Preconditions.requireNonNull(json, "json");

        return new SpreadsheetError(
            SpreadsheetErrorKind.fromJson(json.kind),
            json.message
        );
    }

    constructor(kind, message) {
        super();
        Preconditions.requireInstance(kind, SpreadsheetErrorKind, "kind");
        Preconditions.requireNonEmptyText(message, "message");

        this.kindValue = kind;
        this.messageValue = message;
    }

    kind() {
        return this.kindValue;
    }

    message() {
        return this.messageValue;
    }

    toJson() {
        return {
            "kind": this.kind().toString(),
            "message": this.message(),
        }
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return other instanceof SpreadsheetError &&
            this.message() === other.message();
    }

    toString() {
        return this.kind + " " + this.message();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetError.fromJson);