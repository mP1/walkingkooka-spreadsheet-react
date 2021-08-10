import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "./SpreadsheetColumnReferenceRange.js";
import SpreadsheetExpressionReference from "./SpreadsheetExpressionReference.js";
import spreadsheetRangeParse from "./SpreadsheetRangeParser.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import SpreadsheetRowReferenceRange from "./SpreadsheetRowReferenceRange.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-cell-range";
/**
 * A range is marked by two cell references. Note the begin cell reference will always hold the lesser column and row
 * and the end cell reference will always hold the greater column and row.
 */
export default class SpreadsheetCellRange extends SpreadsheetExpressionReference {

    static fromJson(json) {
        return SpreadsheetCellRange.parse(json);
    }

    static parse(text) {
        return spreadsheetRangeParse(
            text,
            SpreadsheetCellReference.parse,
            (begin, end) => new SpreadsheetCellRange(begin, end)
        );
    }

    constructor(begin, end) {
        super();
        Preconditions.requireInstance(begin, SpreadsheetCellReference, "begin");
        Preconditions.requireInstance(end, SpreadsheetCellReference, "end");

        const columnRange = new SpreadsheetColumnReferenceRange(begin.column(), end.column());
        const rowRange = new SpreadsheetRowReferenceRange(begin.row(), end.row());

        this.beginValue = columnRange.begin().setRow(rowRange.begin());
        this.endValue = columnRange.end().setRow(rowRange.end());
    }

    begin() {
        return this.beginValue;
    }

    end() {
        return this.endValue;
    }

    cellOrRange() {
        const begin = this.begin();
        return begin.equals(this.end()) ?
            begin :
            this;
    }

    extendRangeLeft() {
        const b = this.begin();

        return new SpreadsheetCellRange(
            b.setColumn(b.column().addSaturated(-1)),
            this.end()
        ).cellOrRange();
    }

    extendRangeRight() {
        const e = this.end();

        return new SpreadsheetCellRange(
            this.begin(),
            e.setColumn(e.column().addSaturated(+1)),
        ).cellOrRange();
    }

    extendRangeUp() {
        const b = this.begin();

        return new SpreadsheetCellRange(
            b.setRow(b.row().addSaturated(-1)),
            this.end()
        ).cellOrRange();
    }

    extendRangeDown() {
        const e = this.end();

        return new SpreadsheetCellRange(
            this.begin(),
            e.setRow(e.row().addSaturated(+1)),
        ).cellOrRange();
    }

    /**
     * Tests if the given {@link SpreadsheetCellReference} is within this range.
     */
    testCell(cellReference) {
        Preconditions.requireInstance(cellReference, SpreadsheetCellReference, "cellReference");

        return this.testColumn(cellReference.column()) &&
            this.testRow(cellReference.row());
    }

    testColumn(columnReference) {
        Preconditions.requireInstance(columnReference, SpreadsheetColumnReference, "columnReference");

        const begin = this.begin();
        const end = this.end();

        return columnReference.compareTo(begin.column()) >= 0 &&
            columnReference.compareTo(end.column()) <= 0;
    }

    testRow(rowReference) {
        Preconditions.requireInstance(rowReference, SpreadsheetRowReference, "rowReference");

        const begin = this.begin();
        const end = this.end();

        return rowReference.compareTo(begin.row()) >= 0 &&
            rowReference.compareTo(end.row()) <= 0;
    }
    
    toJson() {
        const begin = this.begin();
        const end = this.end();
        return begin.equals(end) ?
            begin.toJson() :
            begin.toJson() + ":" + end.toJson();
    }

    toQueryStringParameterSelectionType() {
        return "cell-range";
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetCellRange && this.begin().equals(other.begin()) && this.end().equals(other.end()));
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetCellRange.fromJson);