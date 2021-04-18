import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-label-name";
const MAX_LENGTH = 255;

export default class SpreadsheetLabelName extends SystemObject {

    static fromJson(json) {
        return SpreadsheetLabelName.parse(json);
    }

    static parse(text) {
        if(!text){
            throw new Error("Missing text");
        }
        if(typeof text !== "string"){
            throw new Error("Expected string got " + text);
        }
        const length = text.length;
        if(length > MAX_LENGTH){
            throw new Error("Invalid label length " + length + " > " + MAX_LENGTH);
        }

        Next:
            for(var i = 0; i < length; i++) {
                const c = text.charAt(i);

                if(c >= 'A' && c <= 'Z'){
                    continue;
                }
                if(c >= 'a' && c <= 'z'){
                    continue;
                }
                if(i > 0){
                    switch(c) {
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                        case '_':
                            continue Next;
                        default:
                            break;
                    }
                }
                throw new Error("Invalid character " + c + " at " + i);
            }

        return new SpreadsheetLabelName(text);
    }

    constructor(text) {
        super();
        this.textValue = text;
    }

    value() {
        return this.textValue;
    }

    toJson() {
        return this.toString();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetLabelName && this.value() === other.value());
    }

    toString() {
        return this.value();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetLabelName.fromJson);