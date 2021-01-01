import Equality from "../../../Equality.js";
import FormatRequest from "./FormatRequest.js";
import SystemObject from "../../../SystemObject.js";

const TYPE_NAME = "spreadsheet-multi-format-request";

export default class MultiFormatRequest extends SystemObject {

    static fromJson(json) {
        return new MultiFormatRequest(
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
            if(!r instanceof FormatRequest){
                throw new Error("Expected only FormatRequest requests got " + r);
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
            (other instanceof MultiFormatRequest &&
                Equality.safeEquals(this.requests(), other.requests())
            );
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, MultiFormatRequest.fromJson);