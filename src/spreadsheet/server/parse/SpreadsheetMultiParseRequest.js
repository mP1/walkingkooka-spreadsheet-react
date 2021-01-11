import Equality from "../../../Equality.js";
import SpreadsheetParseRequest from "./SpreadsheetParseRequest.js";
import SystemObject from "../../../SystemObject.js";

const TYPE_NAME = "spreadsheet-multi-parse-request";

export default class SpreadsheetMultiParseRequest extends SystemObject {

    static fromJson(json) {
        return new SpreadsheetMultiParseRequest(
            SystemObject.fromJsonListWithType(json),
        );
    }

    constructor(requests) {
        super();
        if(!requests){
            throw new Error("Missing requests");
        }
        if(!Array.isArray(requests)){
            throw new Error("Expected array requests got " + requests);
        }
        requests.forEach(r => {
            if(!(r instanceof SpreadsheetParseRequest)){
                throw new Error("Expected only ParseRequest requests got " + r);
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
            (other instanceof SpreadsheetMultiParseRequest &&
                Equality.safeEquals(this.requests(), other.requests())
            );
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetMultiParseRequest.fromJson);