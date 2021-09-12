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

    rowOrRange() {
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

    // context menu events..............................................................................................

    buildContextMenuItems(historyTokens) {
        // nop
    }

    toLoadCellsQueryStringParameterSelectionType() {
        return "row-range";
    }

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.ROW + "/" + this;
    }

    toDeleteUrl() {
        return "/row/" + this;
    }

    // viewport.........................................................................................................

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

    viewportLeft(current) {
        return this;
    }

    viewportRight(current) {
        return this;
    }

    viewportUp(current) {
        return current.viewportUp();
    }

    viewportDown(current) {
        return current.viewportDown();
    }

    static DEFAULT_ANCHOR = SpreadsheetViewportSelectionAnchor.TOP;

    viewportLeftExtend(anchor, current, viewportHome) {
        return this.rowOrRange();
    }

    viewportRightExtend(anchor, current, viewportHome) {
        return this.rowOrRange();
    }

    /**
     * Increases/decreases the row range depending on the anchor
     */
    viewportUpExtend(anchor, current, viewportHome) {
        const anchorOrDefault = anchor ? anchor : SpreadsheetRowReferenceRange.DEFAULT_ANCHOR;
        var range;

        switch(anchorOrDefault.name()) {
            case "TOP":
                range = new SpreadsheetRowReferenceRange(
                    this.begin(),
                    current.viewportUp(),
                );
                break;
            case "BOTTOM":
                range = new SpreadsheetRowReferenceRange(
                    current.viewportUp(),
                    this.end()
                );
                break;
            default:
                SpreadsheetSelection.reportInvalidAnchor(anchor);
        }

        return range.rowOrRange()
            .setAnchorConditional(anchorOrDefault);
    }

    /**
     * Increases/decreases the row range depending on the anchor
     */
    viewportDownExtend(anchor, current, viewportHome) {
        const anchorOrDefault = anchor ? anchor : SpreadsheetRowReferenceRange.DEFAULT_ANCHOR;
        var range;

        switch(anchorOrDefault.name()) {
            case "TOP":
                range = new SpreadsheetRowReferenceRange(
                    this.begin(),
                    current.viewportDown(),
                );
                break;
            case "BOTTOM":
                range = new SpreadsheetRowReferenceRange(
                    current.viewportDown(),
                    this.end()
                );
                break;
            default:
                SpreadsheetSelection.reportInvalidAnchor(anchor);
        }

        return range.rowOrRange()
            .setAnchorConditional(anchorOrDefault);
    }

    checkAnchor(anchor) {
        SpreadsheetSelection.checkAnyAnchor(
            anchor,
            [
                SpreadsheetViewportSelectionAnchor.TOP,
                SpreadsheetViewportSelectionAnchor.BOTTOM,
            ]
        );
    }

    // JSON............................................................................................................

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetRowReferenceRange && this.begin().equals(other.begin()) && this.end().equals(other.end()));
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetRowReferenceRange.fromJson);