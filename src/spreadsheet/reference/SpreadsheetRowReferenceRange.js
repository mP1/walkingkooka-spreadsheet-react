import Preconditions from "../../Preconditions.js";
import SpreadsheetCellRange from "./SpreadsheetCellRange.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetColumnOrRowReferenceRange from "./SpreadsheetColumnOrRowReferenceRange.js";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "./SpreadsheetColumnReferenceRange.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import spreadsheetRangeParse from "./SpreadsheetRangeParser.js";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import SpreadsheetSelection from "./SpreadsheetSelection.js";
import SpreadsheetViewportSelectionAnchor from "./viewport/SpreadsheetViewportSelectionAnchor.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-row-reference-range";
/**
 * A range of rows.
 */
export default class SpreadsheetRowReferenceRange extends SpreadsheetColumnOrRowReferenceRange {

    static fromJson(json) {
        return SpreadsheetRowReferenceRange.parse(json);
    }

    static parse(text) {
        return spreadsheetRangeParse(
            text,
            SpreadsheetRowReference.parse,
            (begin, end) => new SpreadsheetRowReferenceRange(begin, end)
        );
    }

    constructor(begin, end) {
        super(
            Preconditions.requireInstance(begin, SpreadsheetRowReference, "begin"),
            Preconditions.requireInstance(end, SpreadsheetRowReference, "end")
        );
    }

    setBegin(begin) {
        return this.begin().equals(begin) ?
            this :
            new SpreadsheetRowReferenceRange(begin, this.end());
    }

    setEnd(end) {
        return this.end().equals(end) ?
            this :
            new SpreadsheetRowReferenceRange(this.begin(), end);
    }

    setColumns(columns) {
        Preconditions.requireInstance(columns, SpreadsheetColumnReferenceRange, "columns");

        const rowBegin = this.begin();
        const columnBegin = columns.begin();

        const rowEnd = this.end();
        const columnEnd = columns.end();

        return new SpreadsheetCellRange(
            columnBegin.setRow(rowBegin),
            columnEnd.setRow(rowEnd)
        );
    }
    
    rowOrRange() {
        const begin = this.begin();
        return begin.equals(this.end()) ?
            begin :
            this;
    }

    /**
     * Returns all the individual {@link SpreadsheetRowReference} in this range.
     */
    values() {
        const values = [];

        const last = this.end().value();
        for(var value = this.begin().value(); value <= last; value++ ){
            values.push(
                new SpreadsheetRowReference(
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

        return this.testRow(cellReference.row());
    }

    testColumn(columnReference) {
        Preconditions.requireInstance(columnReference, SpreadsheetColumnReference, "columnReference");

        return false;
    }

    testRow(rowReference) {
        Preconditions.requireInstance(rowReference, SpreadsheetRowReference, "rowReference");

        return this.begin().compareTo(rowReference) <= 0 &&
            this.end().compareTo(rowReference) >= 0;
    }

    testCellRange(range) {
        Preconditions.requireInstance(range, SpreadsheetCellRange, "range");

        return this.end().compareTo(range.begin().row()) >= 0 &&
            this.begin().compareTo(range.end().row()) <= 0;
    }

    historyHashPath() {
        return SpreadsheetHistoryHash.ROW + "/" + this;
    }

    toRelative() {
        return new SpreadsheetRowReferenceRange(
            this.begin().toRelative(),
            this.end().toRelative()
        );
    }

    freezePatch() {
        return {
            "frozen-rows": this.toString()
        };
    }

    unFreezePatch() {
        return {
            "frozen-rows": null
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
        return urlPaths[4] === "row" &&
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
    apiInsertBeforePostUrl(urlPaths) {
        return urlPaths[4] === "row" &&
            urlPaths[5] === this.toString() &&
            urlPaths[6] === "before";
    }

    // viewport.........................................................................................................

    viewportContextMenu(historyTokens, frozenColumns, frozenRows, isColumnHidden, isRowHidden, columnRange, rowRange, history) {
        return this.viewportContextMenuColumnOrRow(
            historyTokens,
            this.begin().addSaturated(-1),
            this.end().addSaturated(+1),
            frozenRows,
            isRowHidden,
            rowRange,
            history
        );
    }

    /**
     * Only returns true if the given clicked is a row within this range.
     */
    viewportContextMenuClick(clicked) {
        return clicked instanceof SpreadsheetRowReference && this.testRow(clicked);
    }

    viewportDeleteCellRowText() {
        return "Delete rows";
    }

    viewportHideText() {
        return "Hide";
    }

    viewportInsertAfter1Text() {
        return SpreadsheetRowReference.VIEWPORT_INSERT_AFTER_1_TEXT;
    }

    viewportInsertAfter2Text() {
        return SpreadsheetRowReference.VIEWPORT_INSERT_AFTER_2_TEXT;
    }

    viewportInsertBefore1Text() {
        return SpreadsheetRowReference.VIEWPORT_INSERT_BEFORE_1_TEXT;
    }

    viewportInsertBefore2Text() {
        return SpreadsheetRowReference.VIEWPORT_INSERT_BEFORE_2_TEXT;
    }

    viewportUnHideText() {
        return "Unhide rows " + this;
    }

    viewportFocus(labelToReference, anchor) {
        let focus;

        switch((anchor ? anchor : SpreadsheetRowReferenceRange.DEFAULT_ANCHOR).name()) {
            case "TOP":
                focus = this.end();
                break;
            case "BOTTOM":
                focus = this.begin();
                break;
            default:
                SpreadsheetSelection.reportInvalidAnchor(anchor);
        }

        return focus;
    }

    static DEFAULT_ANCHOR = SpreadsheetViewportSelectionAnchor.BOTTOM;

    anchors() {
        return [
            SpreadsheetViewportSelectionAnchor.TOP,
            SpreadsheetViewportSelectionAnchor.BOTTOM,
        ];
    }

    defaultAnchor() {
        return SpreadsheetRowReferenceRange.DEFAULT_ANCHOR;
    }

    kebabClassName() {
        return "row-range";
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

SystemObject.register(TYPE_NAME, SpreadsheetRowReferenceRange.fromJson);