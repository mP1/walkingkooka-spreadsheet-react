import Preconditions from "../../../Preconditions.js";
import SystemObject from "../../../SystemObject.js";

export default class SpreadsheetParseRequest extends SystemObject {

    static TYPE_NAME = "spreadsheet-parse-request";

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

        const {text, parser} = json;
        return new SpreadsheetParseRequest(text, parser);
    }

    constructor(text, parser) {
        super();
        Preconditions.requireNonEmptyText(text, "text");
        Preconditions.requireNonEmptyText(parser, "parser");

        this.textValue = text;
        this.parserValue = parser;
    }

    text() {
        return this.textValue;
    }

    parser() {
        return this.parserValue;
    }

    toJson() {
        return {
            text: this.text(),
            parser: this.parser(),
        };
    }

    typeName() {
        return SpreadsheetParseRequest.TYPE_NAME;
    }

    equals(other) {
        return other instanceof SpreadsheetParseRequest &&
            this.text() === other.text() &&
            this.parser() === other.parser();
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(SpreadsheetParseRequest.TYPE_NAME, SpreadsheetParseRequest.fromJson);