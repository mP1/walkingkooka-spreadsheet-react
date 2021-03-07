import SystemObject from "../../../SystemObject.js";

export default class SpreadsheetLocaleDefaultDateTimeFormat extends SystemObject {

    static TYPE_NAME = "spreadsheet-locale-default-date-time-format";

    static INSTANCE = new SpreadsheetLocaleDefaultDateTimeFormat();

    static fromJson(json) {
        if(!json){
            throw new Error("Missing json");
        }
        if(1 !== json){
            throw new Error("Expected number 1 got " + json);
        }
        return SpreadsheetLocaleDefaultDateTimeFormat.INSTANCE;
    }

    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super();
    }

    equals(other) {
        return this === other;
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