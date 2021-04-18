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

export default class SpreadsheetCellReference extends SpreadsheetExpressionReference {

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