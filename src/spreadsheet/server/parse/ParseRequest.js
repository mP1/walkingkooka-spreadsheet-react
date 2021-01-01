import SystemObject from "../../../SystemObject.js";

export default class ParserRequest extends SystemObject {

    static TYPE_NAME = "spreadsheet-parse-request";

    static fromJson(json) {
        if(!json){
            throw new Error("Missing json");
        }
        if(typeof json !== "object"){
            throw new Error("Expected object got " + json);
        }

        const {text, parser} = json;
        return new ParserRequest(text, parser);
    }

    constructor(text, parser) {
        super();
        if(null == text || text === ""){
            throw new Error("Missing text");
        }
        if(typeof text !== "string"){
            throw new Error("Expected string text got " + text);
        }
        if(null == parser || parser === ""){
            throw new Error("Missing parser");
        }
        if(typeof parser !== "string"){
            throw new Error("Expected string parser got " + parser);
        }
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
        return ParserRequest.TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof ParserRequest &&
                this.text() === other.text() &&
                this.parser() === other.parser()
            );
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(ParserRequest.TYPE_NAME, ParserRequest.fromJson);