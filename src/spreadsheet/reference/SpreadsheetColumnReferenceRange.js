import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetColumnOrRowReferenceRange from "./SpreadsheetColumnOrRowReferenceRange.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import spreadsheetRangeParse from "./SpreadsheetRangeParser.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import SpreadsheetSelection from "./SpreadsheetSelection.js";
import SpreadsheetViewportSelectionAnchor from "./SpreadsheetViewportSelectionAnchor.js";
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

    columnOrRange() {
        const begin = this.begin();
        return begin.equals(this.end()) ?
            begin :
            this;
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

    // context menu events..............................................................................................

    buildContextMenuItems(historyTokens){
        // nop
    }

    toLoadCellsQueryStringParameterSelectionType() {
        return "column-range";
    }

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.COLUMN + "/" + this;
    }

    toDeleteUrl() {
        return "/column/" + this;
    }

    // viewport.........................................................................................................

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

    viewportLeft(current) {
        return current.viewportLeft();
    }

    viewportRight(current) {
        return current.viewportRight();
    }

    viewportUp(start) {
        return this;
    }

    viewportDown(start) {
        return this;
    }

    static DEFAULT_ANCHOR = SpreadsheetViewportSelectionAnchor.LEFT;

    /**
     * Increases/decreases the column range depending on the anchor
     */
    viewportLeftExtend(anchor, current, viewportHome) {
        const anchorOrDefault = anchor ? anchor : SpreadsheetColumnReferenceRange.DEFAULT_ANCHOR;
        var range;

        switch(anchorOrDefault.name()) {
            case "LEFT":
                range = new SpreadsheetColumnReferenceRange(
                    this.begin(),
                    current.viewportLeft(),
                );
                break;
            case "RIGHT":
                range = new SpreadsheetColumnReferenceRange(
                    current.viewportLeft(),
                    this.end()
                );
                break;
            default:
                SpreadsheetSelection.reportInvalidAnchor(anchor);
        }

        return range.columnOrRange()
            .setAnchorConditional(anchorOrDefault);
    }

    /**
     * Increases/decreases the column range depending on the anchor
     */
    viewportRightExtend(anchor, current, viewportHome) {
        const anchorOrDefault = anchor ? anchor : SpreadsheetColumnReferenceRange.DEFAULT_ANCHOR;
        var range;

        switch(anchorOrDefault.name()) {
            case "LEFT":
                range = new SpreadsheetColumnReferenceRange(
                    this.begin(),
                    current.viewportRight(),
                );
                break;
            case "RIGHT":
                range = new SpreadsheetColumnReferenceRange(
                    current.viewportRight(),
                    this.end()
                );
                break;
            default:
                SpreadsheetSelection.reportInvalidAnchor(anchor);
        }

        return range.columnOrRange()
            .setAnchorConditional(anchorOrDefault);
    }

    viewportUpExtend(anchor, current, viewportHome) {
        return this.columnOrRange();
    }

    viewportDownExtend(anchor, current, viewportHome) {
        return this.columnOrRange();
    }

    anchors() {
        return [
            SpreadsheetViewportSelectionAnchor.LEFT,
            SpreadsheetViewportSelectionAnchor.RIGHT,
        ];
    }

    // JSON............................................................................................................

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetColumnReferenceRange && this.begin().equals(other.begin()) && this.end().equals(other.end()));
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetColumnReferenceRange.fromJson);