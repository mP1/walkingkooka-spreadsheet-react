import Equality from "../../../Equality.js";
import Preconditions from "../../../Preconditions.js";
import SystemObject from "../../../SystemObject.js";

const TYPE_NAME = "spreadsheet-multi-format-response";

export default class SpreadsheetMultiFormatResponse extends SystemObject {

    static fromJson(json) {
        return new SpreadsheetMultiFormatResponse(
            SystemObject.fromJsonListWithType(json),
        );
    }

    constructor(responses) {
        super();
        Preconditions.requireArray(responses, "responses");

        this.responsesValue = responses;
    }

    responses() {
        return this.responsesValue;
    }

    toJson() {
        return this.responses()
            .map(r => SystemObject.toJsonWithType(r));
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return other instanceof SpreadsheetMultiFormatResponse &&
                Equality.safeEquals(this.responses(), other.responses());
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetMultiFormatResponse.fromJson);