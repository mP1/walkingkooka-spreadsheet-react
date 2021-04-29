import CharSequences from "../../CharSequences.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetExpressionReference from "./SpreadsheetExpressionReference.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-range";
/**
 * A range is marked by two cell references.
 */
export default class SpreadsheetRange extends SpreadsheetExpressionReference {

    static fromJson(json) {
        return SpreadsheetRange.parse(json);
    }

    static parse(text) {
        if(!text){
            throw new Error("Missing text");
        }
        if(typeof text !== "string"){
            throw new Error("Expected string got " + text);
        }

        var range;
        const tokens = text.split(":");
        switch(tokens.length) {
            case 1:
                const cell = SpreadsheetCellReference.fromJson(tokens[0]);
                range = new SpreadsheetRange(cell, cell);
                break;
            case 2:
                const beginText = tokens[0];
                if(!beginText) {
                    throw new Error("Missing begin");
                }
                const beginCell = SpreadsheetCellReference.fromJson(beginText);
                const endText = tokens[1];
                if(!endText) {
                    throw new Error("Missing end");
                }

                let endCell;
                try {
                    endCell = SpreadsheetCellReference.fromJson(endText);
                } catch(e) {
                    // ("Invalid character " + CharSequences.quoteAndEscape(Character.fromJson(c)) + " at " + pos);
                    const message = e.message;
                    if(message.startsWith("Invalid character ")){
                        const at = message.indexOf(" at ");
                        debugger;
                        const pos = parseInt(message.substring(at + 4));
                        throw new Error(message.substring(0, at + 4) + (1 + pos + text.indexOf(":")));
                    }else {
                        throw e;
                    }
                }

                range = new SpreadsheetRange(
                    beginCell,
                    endCell);
                break;
            default:
                throw new Error("Expected 1 or 2 tokens got " + CharSequences.quoteAndEscape(text));
        }

        return range;
    }

    constructor(begin, end) {
        super();
        if(!begin){
            throw new Error("Missing begin");
        }
        if(!(begin instanceof SpreadsheetCellReference)){
            throw new Error("Expected SpreadsheetCellReference begin got " + begin);
        }
        this.beginValue = begin;

        if(!end){
            throw new Error("Missing end");
        }
        if(!(end instanceof SpreadsheetCellReference)){
            throw new Error("Expected SpreadsheetCellReference end got " + end);
        }
        this.endValue = end;
    }

    begin() {
        return this.beginValue;
    }

    end() {
        return this.endValue;
    }

    toJson() {
        const begin = this.begin();
        const end = this.end();
        return begin.equals(end) ?
            begin.toJson() :
            begin.toJson() + ":" + end.toJson();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetRange && this.begin().equals(other.begin()) && this.end().equals(other.end()));
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetRange.fromJson);