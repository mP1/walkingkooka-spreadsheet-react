/**
 * Holds a cell reference. Note the reference is not validated in anyway.
 */
import SpreadsheetColumnReference from "./SpreadsheetColumnReference";
import SpreadsheetRowReference from "./SpreadsheetRowReference";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";

function checkColumn(column) {
    if (!column) {
        throw new Error("Missing column");
    }
    if (!(column instanceof SpreadsheetColumnReference)) {
        throw new Error("Expected SpreadsheetColumnReference column got " + column);
    }
}

function checkRow(row) {
    if (!row) {
        throw new Error("Missing row");
    }
    if (!(row instanceof SpreadsheetRowReference)) {
        throw new Error("Expected SpreadsheetRowReference row got " + row);
    }
}

export default class SpreadsheetCellReference {

    static fromJson(json) {
        return SpreadsheetCellReference.parse(json);
    }

    static parse(text) {
        if (!text) {
            throw new Error("Missing text");
        }
        if (typeof text !== "string") {
            throw new Error("Expected string got " + text);
        }

        for (var i = 1; i < text.length; i++) {
            switch (text.charAt(i)) {
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

    setRow(row) {
        checkRow(row);

        return this.row() === row ?
            this :
            new SpreadsheetCellReference(this.column(), row);
    }

    row() {
        return this.rowValue;
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

    toString() {
        return this.column().toString() + this.row();
    }
}