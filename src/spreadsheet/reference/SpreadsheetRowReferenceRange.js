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

    static DEFAULT_ANCHOR = SpreadsheetViewportSelectionAnchor.TOP;

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

    rowOrRange() {
        const begin = this.begin();
        return begin.equals(this.end()) ?
            begin :
            this;
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

    // context menu events..............................................................................................

    onContextMenu(spreadsheetDeltaCellCrud) {
        // nop
    }

    // keyboard events..................................................................................................

    extendRangeLeft(anchor, current, viewportHome) {
        return this.rowOrRange();
    }

    extendRangeRight(anchor, current, viewportHome) {
        return this.rowOrRange();
    }
    
    /**
     * Increases/decreases the row range depending on the anchor
     */
    extendRangeUp(anchor, current, viewportHome) {
        const anchorOrDefault = anchor ? anchor : SpreadsheetRowReferenceRange.DEFAULT_ANCHOR;
        var range;

        switch(anchorOrDefault.name()) {
            case "TOP":
                range = new SpreadsheetRowReferenceRange(
                    this.begin(),
                    current.addSaturated(-1),
                );
                break;
            case "BOTTOM":
                range = new SpreadsheetRowReferenceRange(
                    current.addSaturated(-1),
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
    extendRangeDown(anchor, current, viewportHome) {
        const anchorOrDefault = anchor ? anchor : SpreadsheetRowReferenceRange.DEFAULT_ANCHOR;
        var range;

        switch(anchorOrDefault.name()) {
            case "TOP":
                range = new SpreadsheetRowReferenceRange(
                    this.begin(),
                    current.addSaturated(+1),
                );
                break;
            case "BOTTOM":
                range = new SpreadsheetRowReferenceRange(
                    current.addSaturated(+1),
                    this.end()
                );
                break;
            default:
                SpreadsheetSelection.reportInvalidAnchor(anchor);
        }

        return range.rowOrRange()
            .setAnchorConditional(anchorOrDefault);
    }

    selectionFocus(labelToReference, anchor) {
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

    toLoadCellsQueryStringParameterSelectionType() {
        return "row-range";
    }

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.ROW + "/" + this;
    }

    toDeleteUrl() {
        return "/row/" + this;
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetRowReferenceRange && this.begin().equals(other.begin()) && this.end().equals(other.end()));
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetRowReferenceRange.fromJson);