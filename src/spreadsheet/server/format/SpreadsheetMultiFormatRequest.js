import Equality from "../../../Equality.js";
import Preconditions from "../../../Preconditions.js";
import SpreadsheetFormatRequest from "./SpreadsheetFormatRequest.js";
import SystemObject from "../../../SystemObject.js";

const TYPE_NAME = "spreadsheet-multi-format-request";

export default class SpreadsheetMultiFormatRequest extends SystemObject {

    static fromJson(json) {
        return new SpreadsheetMultiFormatRequest(
            SystemObject.fromJsonListWithType(json),
        );
    }

    constructor(requests) {
        super();
        Preconditions.requireArray(requests, "requests");
        requests.forEach(r => {
            if(!(r instanceof SpreadsheetFormatRequest)){
                throw new Error("Expected only SpreadsheetFormatRequest requests got " + r);
            }
        });

        this.requestsValue = requests;
    }

    requests() {
        return this.requestsValue;
    }

    toJson() {
        return this.requests()
            .map(r => r.toJsonWithType());
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetMultiFormatRequest &&
                Equality.safeEquals(this.requests(), other.requests())
            );
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetMultiFormatRequest.fromJson);