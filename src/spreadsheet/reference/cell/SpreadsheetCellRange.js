import Preconditions from "../../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "../columnrow/SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "../columnrow/SpreadsheetColumnReferenceRange.js";
import SpreadsheetExpressionReference from "../SpreadsheetExpressionReference.js";
import spreadsheetRangeParse from "../SpreadsheetRangeParser.js";
import SpreadsheetRowReference from "../columnrow/SpreadsheetRowReference.js";
import SpreadsheetRowReferenceRange from "../columnrow/SpreadsheetRowReferenceRange.js";
import SpreadsheetSelection from "../SpreadsheetSelection.js";
import SpreadsheetViewportAnchor from "../viewport/SpreadsheetViewportAnchor.js";
import SystemObject from "../../../SystemObject.js";

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

    setBegin(begin) {
        return this.begin().equals(begin) ?
            this :
            new SpreadsheetCellRange(begin, this.end());
    }

    end() {
        return this.endValue;
    }

    setEnd(end) {
        return this.end().equals(end) ?
            this :
            new SpreadsheetCellRange(this.begin(), end);
    }

    cellOrRange() {
        const begin = this.begin();
        return begin.equals(this.end()) ?
            begin :
            this;
    }

    columnOrRange() {
        return this.columnRange()
            .columnOrRange();
    }

    columnRange() {
        return new SpreadsheetColumnReferenceRange(
            this.begin().column(),
            this.end().column()
        );
    }

    rowRange() {
        return new SpreadsheetRowReferenceRange(
            this.begin().row(),
            this.end().row()
        );
    }

    rowOrRange() {
        return this.rowRange().rowOrRange();
    }

    width() {
        return this.end().column().value() - this.begin().column().value() + 1;
    }

    height() {
        return this.end().row().value() - this.begin().row().value() + 1;
    }

    /**
     * Returns all the cells in this range, going left to right, top to bottom.
     */
    values() {
        const keys = [];

        this.rowRange()
            .values()
            .forEach(r => {
                this.columnRange()
                    .values()
                    .forEach(c => {
                        keys.push(
                            c.setRow(r)
                        )
                    });
            });

        return keys;
    }

    canFreeze() {
        return this.begin().canFreeze();
    }

    cellMapKeys(labels) {
       return this.values()
           .map(v => v.toMapKey());
    }

    freezePatch() {
        return {
            "frozen-columns": this.columnOrRange().toString(),
            "frozen-rows": this.rowOrRange().toString()
        };
    }

    unFreezePatch() {
        return {
            "frozen-columns": null,
            "frozen-rows": null
        };
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

    testCellRange(range) {
        Preconditions.requireInstance(range, SpreadsheetCellRange, "range");

        return this.columnRange().testCellRange(range) &&
            this.rowRange().testCellRange(range);
    }

    toRelative() {
        return new SpreadsheetCellRange(
            this.begin().toRelative(),
            this.end().toRelative()
        );
    }

    // viewport.........................................................................................................

    viewportContextMenu(historyTokens, frozenColumns, frozenRows, isColumnHidden, isRowHidden, columnRange, rowRange, history) {
        const fc = frozenColumns();
        const fr = frozenRows();

        return this.viewportContextMenuCell(
            this,
            fc && fr && fc.setRows(fr),
            historyTokens,
            history
        );
    }

    /**
     * Only returns true if the given clicked is a cell and within this range.
     */
    viewportContextMenuClick(clicked) {
        return clicked instanceof SpreadsheetCellReference && this.testCell(clicked);
    }

    viewportDeleteCellText() {
        return "Delete cells";
    }

    viewportFocus(labelToReference, anchor) {
        let focus;

        switch((anchor ? anchor : SpreadsheetCellRange.DEFAULT_ANCHOR).name()) {
            case "LEFT":
            case "TOP":
            case "TOP_LEFT":
                focus = this.end();
                break;
            case "RIGHT":
            case "TOP_RIGHT":
                focus = this.begin()
                    .setRow(
                        this.end().row()
                    );
                break;
            case "BOTTOM":
            case "BOTTOM_LEFT":
                focus = this.end()
                    .setRow(
                        this.begin().row()
                    );
                break;
            case "BOTTOM_RIGHT":
                focus = this.begin();
                break;
            default:
                SpreadsheetSelection.reportInvalidCharacter(anchor);
        }

        return focus;
    }

    viewportId() {
        return this.begin().viewportId();
    }

    static DEFAULT_ANCHOR = SpreadsheetViewportAnchor.BOTTOM_RIGHT;

    setAnchorConditional(anchor) {
        return this.setAnchor(anchor);
    }

    anchors() {
        return [
            SpreadsheetViewportAnchor.TOP_LEFT,
            SpreadsheetViewportAnchor.TOP_RIGHT,
            SpreadsheetViewportAnchor.BOTTOM_LEFT,
            SpreadsheetViewportAnchor.BOTTOM_RIGHT,
        ];
    }

    defaultAnchor() {
        return SpreadsheetCellRange.DEFAULT_ANCHOR;
    }

    kebabClassName() {
        return "cell-range";
    }

    // json............................................................................................................

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
        return super.equals(other) &&
            this.begin().equals(other.begin()) &&
            this.end().equals(other.end());
    }

    equalsIgnoringKind(other) {
        return super.equals(other) &&
            this.begin().equalsIgnoringKind(other.begin()) &&
            this.end().equalsIgnoringKind(other.end());
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetCellRange.fromJson);