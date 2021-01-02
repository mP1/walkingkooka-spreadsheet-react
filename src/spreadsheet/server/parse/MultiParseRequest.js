import Equality from "../../../Equality.js";
import ParseRequest from "./ParseRequest.js";
import SystemObject from "../../../SystemObject.js";

const TYPE_NAME = "spreadsheet-multi-parse-request";

export default class MultiParseRequest extends SystemObject {

    static fromJson(json) {
        return new MultiParseRequest(
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
            if(!(r instanceof ParseRequest)){
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
            (other instanceof MultiParseRequest &&
                Equality.safeEquals(this.requests(), other.requests())
            );
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, MultiParseRequest.fromJson);