/**
 * Holds a cell reference. Note the reference is not validated in anyway.
 */
import SpreadsheetColumnReference from "./SpreadsheetColumnReference";
import SpreadsheetExpressionReference from "./SpreadsheetExpressionReference.js";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";
import SpreadsheetRowReference from "./SpreadsheetRowReference";
import SystemObject from "../../SystemObject.js";

function checkColumn(column) {
    if(!column){
        throw new Error("Missing column");
    }
    if(!(column instanceof SpreadsheetColumnReference)){
        throw new Error("Expected SpreadsheetColumnReference column got " + column);
    }
}

function checkRow(row) {
    if(!row){
        throw new Error("Missing row");
    }
    if(!(row instanceof SpreadsheetRowReference)){
        throw new Error("Expected SpreadsheetRowReference row got " + row);
    }
}

const TYPE_NAME = "spreadsheet-cell-reference";

// modes used by isCellReferenceText
const MODE_COLUMN_FIRST = 0;
const MODE_COLUMN = MODE_COLUMN_FIRST + 1;
const MODE_ROW_FIRST = MODE_COLUMN + 1;
const MODE_ROW = MODE_ROW_FIRST + 1;
const MODE_FAIL = MODE_ROW + 1;

// SpreadsheetColumnReferenceParser.java RADIX
const RADIX = 26;

function valueFromDigit(c) {
    const digit = c.toUpperCase().charCodeAt(0) - 65;
    return digit >= 0 && digit < RADIX ? digit + 1 : -1;
}

export default class SpreadsheetCellReference extends SpreadsheetExpressionReference {

    /**
     * Tests if the text is a valid cell reference. This may be used to test text that can contain either a
     * cell reference or label.
     */
    // basically copied from SpreadsheetExpressionReference.java#isCellReferenceText
    static isCellReferenceText(text) {
        if(null == text){
            throw new Error("Missing text");
        }
        if(typeof text !== "string"){
            throw new Error("Expected string got " + text);
        }

        var mode = MODE_COLUMN_FIRST; // -1 too long or contains invalid char
        var columnLength = 0;
        var column = 0;
        var row = 0;

        // AB11 max row, max column
        const length = text.length;
        for(var i = 0; i < length; i++) {
            const c = text.charAt(i);

            if(MODE_COLUMN_FIRST === mode){
                mode = MODE_COLUMN;
                if("$" === c){
                    continue;
                }
                // fall-thru might be column letter
            }

            // try and consume column letters
            if(MODE_COLUMN === mode){
                const digit = valueFromDigit(c);

                if(-1 !== digit){
                    column = column * SpreadsheetColumnReference.RADIX + digit;
                    if(column >= SpreadsheetColumnReference.MAX){
                        mode = MODE_FAIL;
                        break; // column is too big cant be a cell reference.
                    }
                    columnLength++;
                    continue;
                }
                if(0 === columnLength){
                    mode = MODE_FAIL;
                    break;
                }
                mode = MODE_ROW_FIRST;
            }

            if(MODE_ROW_FIRST === mode){
                mode = MODE_ROW;
                if("$" === c){
                    continue;
                }
                // fall-thru might be row letter
            }


            if(MODE_ROW === mode){
                const digit = parseInt(c, SpreadsheetRowReference.RADIX);
                if(digit >= 0){
                    row = SpreadsheetRowReference.RADIX * row + digit;
                    if(row >= SpreadsheetRowReference.MAX){
                        mode = MODE_FAIL;
                        break; // row is too big cant be a cell reference.
                    }
                    continue;
                }
                mode = MODE_FAIL;
                break;
            }
        }

        // ran out of characters still checking row must be a valid cell reference.
        return MODE_ROW === mode;
    }

    static fromJson(json) {
        return SpreadsheetCellReference.parse(json);
    }

    static parse(text) {
        if(!text){
            throw new Error("Missing text");
        }
        if(typeof text !== "string"){
            throw new Error("Expected string got " + text);
        }

        for(var i = 1; i < text.length; i++) {
            switch(text.charAt(i)) {
                case '$':
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
                    return new SpreadsheetCellReference(
                        SpreadsheetColumnReference.parse(text.substring(0, i)),
                        SpreadsheetRowReference.parse(text.substring(i))
                    );
                default:
                    continue;
            }
        }

        throw new Error("Missing row got " + text);
    }

    constructor(column, row) {
        super();
        checkColumn(column);
        checkRow(row);

        this.columnValue = column;
        this.rowValue = row;
    }

    setColumn(column) {
        checkColumn(column);

        return this.column() === column ?
            this :
            new SpreadsheetCellReference(column, this.row());
    }

    column() {
        return this.columnValue;
    }

    addColumn(delta) {
        return this.setColumn(this.column().add(delta));
    }

    addColumnSaturated(delta) {
        return this.setColumn(this.column().addSaturated(delta));
    }

    setRow(row) {
        checkRow(row);

        return this.row() === row ?
            this :
            new SpreadsheetCellReference(this.column(), row);
    }

    row() {
        return this.rowValue;
    }

    addRow(delta) {
        return this.setRow(this.row().add(delta));
    }

    addRowSaturated(delta) {
        return this.setRow(this.row().addSaturated(delta));
    }

    toRelative() {
        return this.setColumn(this.column()
            .setKind(SpreadsheetReferenceKind.RELATIVE))
            .setRow(this.row()
                .setKind(SpreadsheetReferenceKind.RELATIVE));
    }

    toJson() {
        return this.toString();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetCellReference && this.column().equals(other.column()) && this.row().equals(other.row()));
    }

    toString() {
        return this.column().toString() + this.row();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetCellReference.fromJson);