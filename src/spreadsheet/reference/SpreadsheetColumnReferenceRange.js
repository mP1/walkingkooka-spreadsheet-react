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

    apiLoadCellsQueryStringParameterSelectionType() {
        return "column-range";
    }

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.COLUMN + "/" + this;
    }

    apiClearUrl() {
        return "/column/" + this + "/clear";
    }

    apiDeleteUrl() {
        return "/column/" + this;
    }

    apiInsertAfterUrl(count) {
        return "/column/" + this + "/after?count=" + count;
    }

    apiInsertBeforeUrl(count) {
        return "/column/" + this + "/before?count=" + count;
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
    apiInsertBeforePostUrl(urlPaths) {
        return urlPaths[4] === "column" &&
            urlPaths[5] === this.toString() &&
            urlPaths[6] === "before";
    }

    // viewport.........................................................................................................

    /**
     * Only returns true if the given clicked is a column within this range.
     */
    viewportContextMenuClick(clicked) {
        return clicked instanceof SpreadsheetColumnReference && this.testColumn(clicked);
    }

    viewportDeleteCellColumnText() {
        return "Delete columns";
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

    viewportLeft(home) {
        return home.viewportLeft();
    }

    viewportRight(home) {
        return home.viewportRight();
    }

    viewportUp(home) {
        return this;
    }

    viewportDown(home) {
        return this;
    }

    static DEFAULT_ANCHOR = SpreadsheetViewportSelectionAnchor.LEFT;

    /**
     * Increases/decreases the column range depending on the anchor
     */
    viewportLeftExtend(anchor, current, home) {
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
    viewportRightExtend(anchor, current, home) {
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

    viewportUpExtend(anchor, current, home) {
        return this.columnOrRange();
    }

    viewportDownExtend(anchor, current, home) {
        return this.columnOrRange();
    }

    anchors() {
        return [
            SpreadsheetViewportSelectionAnchor.LEFT,
            SpreadsheetViewportSelectionAnchor.RIGHT,
        ];
    }

    defaultAnchor() {
        return SpreadsheetColumnOrRowReferenceRange.DEFAULT_ANCHOR;
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