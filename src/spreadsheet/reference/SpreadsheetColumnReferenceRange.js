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

    static DEFAULT_ANCHOR = SpreadsheetViewportSelectionAnchor.LEFT;

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

    columnOrRange() {
        const begin = this.begin();
        return begin.equals(this.end()) ?
            begin :
            this;
    }

    checkAnchor(anchor) {
        SpreadsheetSelection.checkAnyAnchor(
            anchor,
            [
                SpreadsheetViewportSelectionAnchor.LEFT,
                SpreadsheetViewportSelectionAnchor.RIGHT,
            ]
        );
    }

    /**
     * Increases/decreases the column range depending on the anchor
     */
    extendRangeLeft(anchor, current, viewportHome) {
        const anchorOrDefault = anchor ? anchor : SpreadsheetColumnReferenceRange.DEFAULT_ANCHOR;
        var range;

        switch(anchorOrDefault.name()) {
            case "LEFT":
                range = new SpreadsheetColumnReferenceRange(
                    this.begin(),
                    current.addSaturated(-1),
                );
                break;
            case "RIGHT":
                range = new SpreadsheetColumnReferenceRange(
                    current.addSaturated(-1),
                    this.end()
                );
                break;
            default:
                throw new Error("Invalid anchor=" + anchor);
        }

        return range.columnOrRange()
            .setAnchorConditional(anchorOrDefault);
    }

    /**
     * Increases/decreases the column range depending on the anchor
     */
    extendRangeRight(anchor, current, viewportHome) {
        const anchorOrDefault = anchor ? anchor : SpreadsheetColumnReferenceRange.DEFAULT_ANCHOR;
        var range;

        switch(anchorOrDefault.name()) {
            case "LEFT":
                range = new SpreadsheetColumnReferenceRange(
                    this.begin(),
                    current.addSaturated(+1),
                );
                break;
            case "RIGHT":
                range = new SpreadsheetColumnReferenceRange(
                    current.addSaturated(+1),
                    this.end()
                );
                break;
            default:
                throw new Error("Invalid anchor=" + anchor);
        }

        return range.columnOrRange()
            .setAnchorConditional(anchorOrDefault);
    }

    extendRangeUp(anchor, current, viewportHome) {
        return this.columnOrRange();
    }

    extendRangeDown(anchor, current, viewportHome) {
        return this.columnOrRange();
    }

    selectionFocus(labelToReference, anchor) {
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