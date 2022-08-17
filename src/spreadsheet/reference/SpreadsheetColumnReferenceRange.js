import Preconditions from "../../Preconditions.js";
import SpreadsheetCellRange from "./SpreadsheetCellRange.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetColumnOrRowReferenceRange from "./SpreadsheetColumnOrRowReferenceRange.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import spreadsheetRangeParse from "./SpreadsheetRangeParser.js";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import SpreadsheetRowReferenceRange from "./SpreadsheetRowReferenceRange.js";
import SpreadsheetViewportSelectionAnchor from "./viewport/SpreadsheetViewportSelectionAnchor.js";
import SystemObject from "../../SystemObject.js";


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
        super(
            Preconditions.requireInstance(begin, SpreadsheetColumnReference, "begin"),
            Preconditions.requireInstance(end, SpreadsheetColumnReference, "end")
        );
    }

    setBegin(begin) {
        return this.begin().equals(begin) ?
            this :
            new SpreadsheetColumnReferenceRange(begin, this.end());
    }

    setEnd(end) {
        return this.end().equals(end) ?
            this :
            new SpreadsheetColumnReferenceRange(this.begin(), end);
    }

    setRows(rows) {
        Preconditions.requireInstance(rows, SpreadsheetRowReferenceRange, "rows");

        const columnBegin = this.begin();
        const rowBegin = rows.begin();

        const columnEnd = this.end();
        const rowEnd = rows.end();

        return new SpreadsheetCellRange(
            columnBegin.setRow(rowBegin),
            columnEnd.setRow(rowEnd)
        );
    }

    columnOrRange() {
        const begin = this.begin();
        return begin.equals(this.end()) ?
            begin :
            this;
    }

    /**
     * Returns all the individual {@link SpreadsheetColumnReference} in this range.
     */
    values() {
        const values = [];

        const last = this.end().value();
        for(var value = this.begin().value(); value <= last; value++) {
            values.push(
                new SpreadsheetColumnReference(
                    value,
                    SpreadsheetReferenceKind.RELATIVE
                )
            );
        }

        return values;
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

    testCellRange(range) {
        Preconditions.requireInstance(range, SpreadsheetCellRange, "range");

        return this.end().compareTo(range.begin().column()) >= 0 &&
            this.begin().compareTo(range.end().column()) <= 0;
    }

    historyHashPath() {
        return SpreadsheetHistoryHash.COLUMN + "/" + this;
    }

    toRelative() {
        return new SpreadsheetColumnReferenceRange(
            this.begin().toRelative(),
            this.end().toRelative()
        );
    }

    freezePatch() {
        return {
            "frozen-columns": this.toString()
        };
    }

    unFreezePatch() {
        return {
            "frozen-columns": null
        };
    }

    // 0 = ""
    // 1 == api
    // 2 == spreadsheet
    // 3 == $spreadsheet-id
    // 4 == column == Selection
    // 5 == $selection
    // 6 == after === insert-action.toUrl
    isInsertAfterPostUrl(urlPaths) {
        return urlPaths[4] === "column" &&
            urlPaths[5] === this.toString() &&
            urlPaths[6] === "after";
    }
    
    // 0 = ""
    // 1 == api
    // 2 == spreadsheet
    // 3 == $spreadsheet-id
    // 4 == column == Selection
    // 5 == $selection
    // 6 == before == insert-action.toUrl
    isApiInsertBeforePostUrl(urlPaths) {
        return urlPaths[4] === "column" &&
            urlPaths[5] === this.toString() &&
            urlPaths[6] === "before";
    }

    // viewport.........................................................................................................

    viewportContextMenu(historyTokens, frozenColumns, frozenRows, isColumnHidden, isRowHidden, columnRange, rowRange, history) {
        return this.viewportContextMenuColumnOrRow(
            historyTokens,
            this.begin().addSaturated(-1),
            this.end().addSaturated(+1),
            frozenColumns,
            isColumnHidden,
            columnRange,
            history
        );
    }

    /**
     * Only returns true if the given clicked is a column within this range.
     */
    viewportContextMenuClick(clicked) {
        return clicked instanceof SpreadsheetColumnReference && this.testColumn(clicked);
    }

    viewportDeleteCellColumnText() {
        return "Delete columns";
    }

    viewportHideText() {
        return "Hide";
    }

    viewportInsertAfter1Text() {
        return SpreadsheetColumnReference.VIEWPORT_INSERT_AFTER_1_TEXT;
    }

    viewportInsertAfter2Text() {
        return SpreadsheetColumnReference.VIEWPORT_INSERT_AFTER_2_TEXT;
    }

    viewportInsertBefore1Text() {
        return SpreadsheetColumnReference.VIEWPORT_INSERT_BEFORE_1_TEXT;
    }

    viewportInsertBefore2Text() {
        return SpreadsheetColumnReference.VIEWPORT_INSERT_BEFORE_2_TEXT;
    }

    viewportUnHideText() {
        return "Unhide columns " + this;
    }

    viewportFocus(labelToReference, anchor) {
        let focus;

        switch((anchor ? anchor : SpreadsheetColumnReferenceRange.DEFAULT_ANCHOR).name()) {
            case "LEFT":
                focus = this.end();
                break;
            case "RIGHT":
                focus = this.begin();
                break;
            default:
                break;
        }

        return focus;
    }

    static DEFAULT_ANCHOR = SpreadsheetViewportSelectionAnchor.RIGHT;

    anchors() {
        return [
            SpreadsheetViewportSelectionAnchor.LEFT,
            SpreadsheetViewportSelectionAnchor.RIGHT,
        ];
    }

    defaultAnchor() {
        return SpreadsheetColumnOrRowReferenceRange.DEFAULT_ANCHOR;
    }

    kebabClassName() {
        return "column-range";
    }

    // JSON............................................................................................................

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

SystemObject.register(TYPE_NAME, SpreadsheetColumnReferenceRange.fromJson);