import SpreadsheetColumnOrRowReference from "./SpreadsheetColumnOrRowReference";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";

export default class SpreadsheetRowReference extends SpreadsheetColumnOrRowReference {

    static MAX = 1048576;

    static fromJson(json) {
        return SpreadsheetRowReference.parse(json);
    }

    static parse(text) {
        if(!text){
            throw new Error("Missing text");
        }
        if(typeof text !== "string"){
            throw new Error("Expected string got " + text);
        }

        let kind;
        let startIndex;

        if(text.startsWith("$")){
            kind = SpreadsheetReferenceKind.ABSOLUTE;
            startIndex = 1;
        }else {
            kind = SpreadsheetReferenceKind.RELATIVE;
            startIndex = 0;
        }
        const value = Number(text.substring(startIndex));
        if(!value){
            throw new Error("Missing row got " + text);
        }
        if(value > SpreadsheetRowReference.MAX){
            throw new Error("Invalid value > " + SpreadsheetRowReference.MAX + " got " + value);
        }

        return new SpreadsheetRowReference(value - 1, kind);
    }

    // eslint-disable-next-line no-useless-constructor
    constructor(value, kind) {
        super(value, kind);
    }

    max() {
        return SpreadsheetRowReference.MAX;
    }

    toString() {
        return this.kind().prefix() + (1 + this.value());
    }
}