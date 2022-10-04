/**
 * Holds an error within processing of a spreadsheet cell.
 */
import Equality from "../Equality.js";
import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";
import SpreadsheetErrorKind from "./SpreadsheetErrorKind.js";

const TYPE_NAME = "spreadsheet-error";

export default class SpreadsheetError extends SystemObject {

    static fromJson(json) {
        Preconditions.requireNonNull(json, "json");

        const value = json.value;

        return new SpreadsheetError(
            SpreadsheetErrorKind.fromJson(json.kind),
            json.message,
            null != value ? SystemObject.fromJsonWithType(json.value) : value,
        );
    }

    constructor(kind, message, value) {
        super();
        Preconditions.requireInstance(kind, SpreadsheetErrorKind, "kind");
        Preconditions.requireNonEmptyText(message, "message");

        this.kindValue = kind;
        this.messageValue = message;
        this.valueValue = value;
    }

    kind() {
        return this.kindValue;
    }

    message() {
        return this.messageValue;
    }

    value() {
        return this.valueValue;
    }

    toJson() {
        const json = {
            "kind": this.kind().toString(),
            "message": this.message(),
        };

        const value = this.value();
        if(null != value){
            json.value = SystemObject.toJsonWithType(value);
        }

        return json;
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return other instanceof SpreadsheetError &&
            this.message() === other.message() &&
            Equality.safeEquals(this.value(), other.value());
    }

    toString() {
        return this.kind + " " + this.message() + " " + this.value();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetError.fromJson);