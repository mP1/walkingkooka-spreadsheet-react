import Equality from "../../../Equality.js";
import SpreadsheetPattern from "../../format/SpreadsheetPattern.js";
import SystemObject from "../../../SystemObject.js";

const TYPE_NAME = "spreadsheet-format-request";

export default class FormatRequest extends SystemObject {

    static fromJson(json) {
        if(!json){
            throw new Error("Missing json");
        }
        if(typeof json !== "object"){
            throw new Error("Expected object got " + json);
        }

        const {value, pattern} = json;
        if(!value){
            throw new Error("Missing json.value");
        }
        if(!pattern){
            throw new Error("Missing json.pattern");
        }
        return new FormatRequest(
            SystemObject.fromJsonWithType(value),
            SystemObject.fromJsonWithType(pattern),
        );
    }

    constructor(value, pattern) {
        super();
        if(!value && (value !== "" && value !== 0)){
            throw new Error("Missing value");
        }
        if(!pattern){
            throw new Error("Missing pattern");
        }
        if(!(pattern instanceof SpreadsheetPattern)){
            throw new Error("Expected SpreadsheetPattern pattern got " + pattern);
        }
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
        return this === other ||
            (other instanceof FormatRequest &&
                Equality.safeEquals(this.value(), other.value()) &&
                Equality.safeEquals(this.pattern(), other.pattern())
            );
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, FormatRequest.fromJson);