import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "./SpreadsheetColumnReferenceRange.js";
import SpreadsheetExpressionReference from "./SpreadsheetExpressionReference.js";
import spreadsheetRangeParse from "./SpreadsheetRangeParser.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import SpreadsheetRowReferenceRange from "./SpreadsheetRowReferenceRange.js";
import SpreadsheetSelection from "./SpreadsheetSelection.js";
import SpreadsheetViewportSelectionAnchor from "./SpreadsheetViewportSelectionAnchor.js";
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
        return new SpreadsheetColumnReferenceRange(
            this.begin().column(),
            this.end().column()
        ).columnOrRange();
    }

    rowOrRange() {
        return new SpreadsheetRowReferenceRange(
            this.begin().row(),
            this.end().row()
        ).rowOrRange();
    }

    width() {
        return this.end().column().value() - this.begin().column().value() + 1;
    }

    height() {
        return this.end().row().value() - this.begin().row().value() + 1;
    }

    isCellScalarOrRange() {
        return true;
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

    apiLoadCellsQueryStringParameterSelectionType() {
        return "cell-range";
    }

    // viewport.........................................................................................................

    /**
     * Only returns true if the given clicked is a cell and within this range.
     */
    viewportContextMenuClick(clicked) {
        return clicked instanceof SpreadsheetCellReference && this.testCell(clicked);
    }

    viewportDeleteCellText() {
        return "Delete cells";
    }

    viewportEnter(giveFormulaFocus) {
        // nop TODO later perhaps popup menu
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

    viewportLeft(home) {
        return home.viewportLeft();
    }

    viewportRight(home) {
        return home.viewportRight();
    }

    viewportUp(home) {
        return home.viewportUp();
    }

    viewportDown(home) {
        return home.viewportDown();
    }

    static DEFAULT_ANCHOR = SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT;

    viewportLeftExtend(anchor, current, home) {
        var begin;
        var newAnchor;

        switch((anchor ? anchor : SpreadsheetCellRange.DEFAULT_ANCHOR).name()) {
            case "TOP_RIGHT":
                begin = true;
                newAnchor = SpreadsheetViewportSelectionAnchor.TOP_RIGHT;
                break;
            case "TOP_LEFT":
                newAnchor = SpreadsheetViewportSelectionAnchor.TOP_LEFT;
                break;
            case "BOTTOM_RIGHT":
                begin = true;
                newAnchor = SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT;
                break;
            case "BOTTOM_LEFT":
                newAnchor = SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT;
                break;
            default:
                SpreadsheetSelection.reportInvalidAnchor(anchor);
        }

        var result;
        if(begin){
            result = this.setBegin(
                this.begin()
                    .setColumn(
                        current.viewportLeft(home)
                            .column()
                    )
            );
        }else {
            result = this.setEnd(
                this.end()
                    .setColumn(
                        current.viewportLeft(home)
                            .column()
                    )
            );
        }

        if(this.width() === 1 && result.width() === 2){
            switch(newAnchor.name()) {
                case "TOP_LEFT":
                    newAnchor = SpreadsheetViewportSelectionAnchor.TOP_RIGHT;
                    break;
                case "BOTTOM_LEFT":
                    newAnchor = SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT;
                    break;
                default:
                    break;
            }
        }

        return result.setAnchorConditional(newAnchor);
    }

    viewportRightExtend(anchor, current, home) {
        var begin;
        var newAnchor;

        switch((anchor ? anchor : SpreadsheetCellRange.DEFAULT_ANCHOR).name()) {
            case "TOP_RIGHT":
                begin = true;
                newAnchor = SpreadsheetViewportSelectionAnchor.TOP_RIGHT;
                break;
            case "TOP_LEFT":
                newAnchor = SpreadsheetViewportSelectionAnchor.TOP_LEFT;
                break;
            case "BOTTOM_RIGHT":
                begin = true;
                newAnchor = SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT;
                break;
            case "BOTTOM_LEFT":
                newAnchor = SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT;
                break;
            default:
                SpreadsheetSelection.reportInvalidAnchor(anchor);
        }

        var result;
        if(begin){
            result = this.setBegin(
                this.begin()
                    .setColumn(
                        current.viewportRight(home)
                            .column()
                    )
            );
        }else {
            result = this.setEnd(
                this.end()
                    .setColumn(
                        current.viewportRight(home)
                            .column()
                    )
            );
        }

        if(this.width() === 1 && result.width() === 2){
            switch(newAnchor.name()) {
                case "TOP_RIGHT":
                    newAnchor = SpreadsheetViewportSelectionAnchor.TOP_LEFT;
                    break;
                case "BOTTOM_RIGHT":
                    newAnchor = SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT;
                    break;
                default:
                    break;
            }
        }

        return result.setAnchorConditional(newAnchor);
    }

    viewportUpExtend(anchor, current, home) {
        var begin;
        var newAnchor;

        switch((anchor ? anchor : SpreadsheetCellRange.DEFAULT_ANCHOR).name()) {
            case "TOP_RIGHT":
                newAnchor = SpreadsheetViewportSelectionAnchor.TOP_RIGHT;
                break;
            case "TOP_LEFT":
                newAnchor = SpreadsheetViewportSelectionAnchor.TOP_LEFT;
                break;
            case "BOTTOM_RIGHT":
                begin = true;
                newAnchor = SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT;
                break;
            case "BOTTOM_LEFT":
                begin = true;
                newAnchor = SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT;
                break;
            default:
                SpreadsheetSelection.reportInvalidAnchor(anchor);
        }

        var result;
        if(begin){
            result = this.setBegin(
                this.begin()
                    .setRow(
                        current.viewportUp(home)
                            .row()
                    )
            );
        }else {
            result = this.setEnd(
                this.end()
                    .setRow(
                        current.viewportUp(home)
                            .row()
                    )
            );
        }

        if(this.height() === 1 && result.height() === 2){
            switch(newAnchor.name()) {
                case "TOP_LEFT":
                    newAnchor = SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT;
                    break;
                case "TOP_RIGHT":
                    newAnchor = SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT;
                    break;
                default:
                    break;
            }
        }

        return result.setAnchorConditional(newAnchor);
    }

    viewportDownExtend(anchor, current, home) {
        var begin;
        var newAnchor;

        switch((anchor ? anchor : SpreadsheetCellRange.DEFAULT_ANCHOR).name()) {
            case "TOP_RIGHT":
                newAnchor = SpreadsheetViewportSelectionAnchor.TOP_RIGHT;
                break;
            case "TOP_LEFT":
                newAnchor = SpreadsheetViewportSelectionAnchor.TOP_LEFT;
                break;
            case "BOTTOM_RIGHT":
                begin = true;
                newAnchor = SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT;
                break;
            case "BOTTOM_LEFT":
                begin = true;
                newAnchor = SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT;
                break;
            default:
                SpreadsheetSelection.reportInvalidAnchor(anchor);
        }

        var result;
        if(begin){
            result = this.setBegin(
                this.begin()
                    .setRow(
                        current.viewportDown(home)
                            .row()
                    )
            );
        }else {
            result = this.setEnd(
                this.end()
                    .setRow(
                        current.viewportDown(home)
                            .row()
                    )
            );
        }

        if(this.height() === 1 && result.height() === 2){
            switch(newAnchor.name()) {
                case "BOTTOM_LEFT":
                    newAnchor = SpreadsheetViewportSelectionAnchor.TOP_LEFT;
                    break;
                case "BOTTOM_RIGHT":
                    newAnchor = SpreadsheetViewportSelectionAnchor.TOP_RIGHT;
                    break;
                default:
                    break;
            }
        }

        return result.setAnchorConditional(newAnchor);
    }

    setAnchorConditional(anchor) {
        return this.setAnchor(anchor);
    }

    anchors() {
        return [
            SpreadsheetViewportSelectionAnchor.TOP_LEFT,
            SpreadsheetViewportSelectionAnchor.TOP_RIGHT,
            SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT,
            SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT,
        ];
    }

    defaultAnchor() {
        return SpreadsheetCellRange.DEFAULT_ANCHOR;
    }

    apiClearUrl() {
        return "/cell/" + this + "/clear";
    }

    apiDeleteUrl() {
        return "/cell/" + this;
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
        return this === other || (other instanceof SpreadsheetCellRange && this.begin().equals(other.begin()) && this.end().equals(other.end()));
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetCellRange.fromJson);