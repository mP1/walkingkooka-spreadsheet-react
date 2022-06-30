import Equality from "../../../Equality.js";
import Preconditions from "../../../Preconditions.js";
import SystemObject from "../../../SystemObject.js";

const TYPE_NAME = "spreadsheet-format-request";

export default class SpreadsheetFormatRequest extends SystemObject {

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

        const {value, pattern} = json;
        if(!value){
            throw new Error("Missing json.value");
        }
        if(!pattern){
            throw new Error("Missing json.pattern");
        }
        return new SpreadsheetFormatRequest(
            SystemObject.fromJsonWithType(value),
            SystemObject.fromJsonWithType(pattern),
        );
    }

    constructor(value, pattern) {
        super();
        Preconditions.requireNonNull(value, "value");
        Preconditions.requireNonNull(pattern, "pattern");
        this.valueValue = value;
        this.patternValue = pattern;
    }

    value() {
        return this.valueValue;
    }

    pattern() {
        return this.patternValue;
    }

    toJson() {
        return {
            value: SystemObject.toJsonWithType(this.value()),
            pattern: this.pattern().toJsonWithType(),
        };
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return other instanceof SpreadsheetFormatRequest &&
                Equality.safeEquals(this.value(), other.value()) &&
                Equality.safeEquals(this.pattern(), other.pattern());
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetFormatRequest.fromJson);