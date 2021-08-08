import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetColumnOrRowReferenceRange from "./SpreadsheetColumnOrRowReferenceRange.js";
import spreadsheetRangeParse from "./SpreadsheetRangeParser.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import SystemObject from "../../SystemObject.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";


const TYPE_NAME = "spreadsheet-column-reference-range";
/**
 * A range of columns.
 */
export default class SpreadsheetColumnReferenceRange extends SpreadsheetColumnOrRowReferenceRange {

    static fromJson(json) {
        return SpreadsheetColumnReferenceRange.parse(json);
    }

    static parse(text) {
        return spreadsheetRangeParse(
            text,
            SpreadsheetColumnReference.parse,
            (begin, end) => new SpreadsheetColumnReferenceRange(begin, end)
        );
    }

    constructor(begin, end) {
        super();
        Preconditions.requireInstance(begin, SpreadsheetColumnReference, "begin");
        this.beginValue = begin;

        Preconditions.requireInstance(end, SpreadsheetColumnReference, "end");
        this.endValue = end;
    }

    begin() {
        return this.beginValue;
    }

    end() {
        return this.endValue;
    }

    /**
     * Tests if the given {@link SpreadsheetCellReference} is within this range.
     */
    testCell(cellReference) {
        Preconditions.requireInstance(cellReference, SpreadsheetCellReference, "cellReference");

        return this.testColumn(cellReference.column());
    }

    testColumn(columnReference) {
        Preconditions.requireInstance(columnReference, SpreadsheetColumnReference, "columnReference");

        return this.begin().compareTo(columnReference) <= 0 &&
            this.end().compareTo(columnReference) >= 0;
    }

    testRow(rowReference) {
        Preconditions.requireInstance(rowReference, SpreadsheetRowReference, "rowReference");

        return false;
    }

    toQueryStringParameterSelectionType() {
        return "column-range";
    }

    toSelectionHashToken() {
        return SpreadsheetHistoryHash.COLUMN + "/" + this;
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetColumnReferenceRange && this.begin().equals(other.begin()) && this.end().equals(other.end()));
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetColumnReferenceRange.fromJson);