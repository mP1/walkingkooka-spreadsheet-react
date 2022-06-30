import Preconditions from "../../../Preconditions.js";
import SystemObject from "../../../SystemObject.js";

export default class SpreadsheetLocaleDefaultDateTimeFormat extends SystemObject {

    static TYPE_NAME = "spreadsheet-locale-default-date-time-format";

    static INSTANCE = new SpreadsheetLocaleDefaultDateTimeFormat();

    static fromJson(json) {
        Preconditions.requireNonNull(json, "json");
        if(1 !== json){
            throw new Error("Expected number 1 got " + json);
        }
        return SpreadsheetLocaleDefaultDateTimeFormat.INSTANCE;
    }

    toJson() {
        return 1;
    }

    typeName() {
        return SpreadsheetLocaleDefaultDateTimeFormat.TYPE_NAME;
    }

    toString() {
        return "SpreadsheetLocaleDefaultDateTimeFormat";
    }
}

SystemObject.register(SpreadsheetLocaleDefaultDateTimeFormat.TYPE_NAME, SpreadsheetLocaleDefaultDateTimeFormat.fromJson);