/**
 * Holds a cell reference. Note the reference is not validated in anyway.
 */
import CharSequences from "../../../CharSequences.js";
import Preconditions from "../../../Preconditions.js";
import SpreadsheetCell from "../../SpreadsheetCell.js";
import SpreadsheetCellRange from "./SpreadsheetCellRange.js";
import SpreadsheetColumnReference from "../columnrow/SpreadsheetColumnReference.js";
import SpreadsheetExpressionReference from "../SpreadsheetExpressionReference.js";
import SpreadsheetFormula from "./formula/SpreadsheetFormula.js";
import SpreadsheetReferenceKind from "../SpreadsheetReferenceKind.js";
import SpreadsheetRowReference from "../columnrow/SpreadsheetRowReference.js";
import SpreadsheetSelection from "../SpreadsheetSelection.js";
import SpreadsheetViewportRectangle from "../viewport/SpreadsheetViewportRectangle.js";
import SpreadsheetViewportAnchor from "../viewport/SpreadsheetViewportAnchor.js";
import SystemObject from "../../../SystemObject.js";
import TextStyle from "../../../text/TextStyle.js";
import Text from "../../../text/Text.js";

const TYPE_NAME = "spreadsheet-cell-reference";

// modes used by isCellReferenceText
const MODE_COLUMN_FIRST = 0;
const MODE_COLUMN = MODE_COLUMN_FIRST + 1;
const MODE_ROW_FIRST = MODE_COLUMN + 1;
const MODE_ROW = MODE_ROW_FIRST + 1;
const MODE_FAIL = MODE_ROW + 1;

// SpreadsheetColumnReferenceParser.java RADIX
const RADIX = 26;

function valueFromDigit(c) {
    const digit = c.toUpperCase().charCodeAt(0) - 65;
    return digit >= 0 && digit < RADIX ? digit + 1 : -1;
}

// basically copied from SpreadsheetExpressionReference.java#isCellReferenceText
function isCellReferenceText0(text, reporter) {
    Preconditions.requireText(text, "text");

    var mode = MODE_COLUMN_FIRST; // -1 too long or contains invalid char
    var columnLength = 0;
    var column = 0;
    var row = 0;

    // AB11 max row, max column
    const length = text.length;
    for(var i = 0; i < length; i++) {
        const c = text.charAt(i);

        if(MODE_COLUMN_FIRST === mode){
            mode = MODE_COLUMN;
            if("$" === c){
                continue;
            }
            // fall-thru might be column letter
        }

        // try and consume column letters
        if(MODE_COLUMN === mode){
            const digit = valueFromDigit(c);

            if(-1 !== digit){
                column = column * SpreadsheetColumnReference.RADIX + digit;
                if(column > SpreadsheetColumnReference.MAX){
                    mode = reporter(c, i);
                    break; // column is too big cant be a cell reference.
                }
                columnLength++;
                continue;
            }
            if(0 === columnLength){
                mode = reporter(c, i);
                break;
            }
            mode = MODE_ROW_FIRST;
        }

        if(MODE_ROW_FIRST === mode){
            mode = MODE_ROW;
            if("$" === c){
                continue;
            }
            // fall-thru might be row letter
        }

        if(MODE_ROW === mode){
            const digit = parseInt(c, SpreadsheetRowReference.RADIX);
            if(digit >= 0){
                row = SpreadsheetRowReference.RADIX * row + digit;
                if(row >= SpreadsheetRowReference.MAX){
                    mode = reporter(c, i);
                    break; // row is too big cant be a cell reference.
                }
                continue;
            }
            mode = reporter(c, i);
            break;
        }
    }

    // ran out of characters still checking row must be a valid cell reference.
    return MODE_ROW === mode;
}

export default class SpreadsheetCellReference extends SpreadsheetExpressionReference {

    /**
     * Tests if the text is a valid cell reference. This may be used to test text that can contain either a
     * cell reference or label.
     */
    static isCellReferenceText(text) {
        return isCellReferenceText0(
            text,
            () => MODE_FAIL
        );
    }

    static fromJson(json) {
        return SpreadsheetCellReference.parse(json);
    }

    static parse(text) {
        Preconditions.requireNonEmptyText(text, "text");
        isCellReferenceText0(text, SpreadsheetSelection.reportInvalidCharacter);

        for(var i = 1; i < text.length; i++) {
            switch(text.charAt(i)) {
                case '$':
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    return new SpreadsheetCellReference(
                        SpreadsheetColumnReference.parse(text.substring(0, i)),
                        SpreadsheetRowReference.parse(text.substring(i))
                    );
                default:
                    continue;
            }
        }

        throw new Error("Missing row got " + CharSequences.quoteAndEscape(text));
    }

    constructor(column, row) {
        super();
        Preconditions.requireInstance(column, SpreadsheetColumnReference, "column");
        Preconditions.requireInstance(row, SpreadsheetRowReference, "row");

        this.columnValue = column;
        this.rowValue = row;
    }

    setColumn(column) {
        Preconditions.requireInstance(column, SpreadsheetColumnReference, "column");

        return this.column() === column ?
            this :
            new SpreadsheetCellReference(column, this.row());
    }

    column() {
        return this.columnValue;
    }

    addColumn(delta) {
        return this.setColumn(this.column().add(delta));
    }

    addColumnSaturated(delta) {
        return this.setColumn(this.column().addSaturated(delta));
    }

    setRow(row) {
        Preconditions.requireInstance(row, SpreadsheetRowReference, "row");

        return this.row() === row ?
            this :
            new SpreadsheetCellReference(this.column(), row);
    }

    row() {
        return this.rowValue;
    }

    addRow(delta) {
        return this.setRow(this.row().add(delta));
    }

    addRowSaturated(delta) {
        return this.setRow(this.row().addSaturated(delta));
    }

    columnOrRange() {
        return this.column();
    }

    rowOrRange() {
        return this.row();
    }

    values() {
        return [
            this
        ];
    }

    canFreeze() {
        return this.column().canFreeze() &&
            this.row().canFreeze();
    }

    cellOrRange() {
        return this;
    }

    freezePatch() {
        return {
            "frozen-columns": this.column().toString(),
            "frozen-rows": this.row().toString()
        };
    }

    unFreezePatch() {
        return {
            "frozen-columns": null,
            "frozen-rows": null
        };
    }

    cellMapKeys(labels) {
        return [
            this.toMapKey()
        ];
    }

    testCell(cellReference) {
        return this.column().testCell(cellReference) &&
            this.row().testCell(cellReference);
    }

    testColumn(columnReference) {
        return this.column().testColumn(columnReference);
    }

    testRow(rowReference) {
        return this.row().testRow(rowReference);
    }

    testCellRange(range) {
        Preconditions.requireInstance(range, SpreadsheetCellRange, "range");

        return range.testCell(this);
    }

    toRelative() {
        return this.setColumn(this.column()
            .setKind(SpreadsheetReferenceKind.RELATIVE))
            .setRow(this.row()
                .setKind(SpreadsheetReferenceKind.RELATIVE));
    }

    /**
     * Factory that creates an empty {@link SpreadsheetCell} with no formula, style or formatted text.
     */
    emptyCell() {
        return new SpreadsheetCell(
            this,
            SpreadsheetFormula.EMPTY,
            TextStyle.EMPTY,
            undefined,
            Text.EMPTY
        );
    }

    viewport(width, height) {
        return new SpreadsheetViewportRectangle(this, width, height);
    }

    viewportId() {
        return "viewport-cell-" + this.toString().toUpperCase();
    }

    viewportTooltipId() {
        return this.viewportId() + "-Tooltip";
    }

    viewportContextMenu(historyTokens, frozenColumns, frozenRows, isColumnHidden, isRowHidden, columnRange, rowRange, history) {
        const fc = frozenColumns();
        const fr = frozenRows();

        return this.viewportContextMenuCell(
            new SpreadsheetCellRange(this, this), // asRange
            fc && fr && fc.setRows(fr),
            historyTokens,
            history
        );
    }

    /**
     * Only returns true if the given clicked is a cell and m
     */
    viewportContextMenuClick(clicked) {
        return this.equals(clicked);
    }

    viewportDeleteCellText() {
        return "Delete cell";
    }

    viewportFocus(labelToReference, anchor) {
        return this;
    }

    setAnchorConditional(anchor) {
        return this.setAnchor(); // ignore anchor
    }

    anchors() {
        return [
            SpreadsheetViewportAnchor.NONE,
        ];
    }

    defaultAnchor() {
        return SpreadsheetViewportAnchor.NONE;
    }

    kebabClassName() {
        return "cell";
    }

    // json............................................................................................................

    toJson() {
        return this.column()
                .toJson() +
            this.row()
                .toJson();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return super.equals(other) &&
            this.column().equals(other.column()) &&
            this.row().equals(other.row());
    }

    equalsIgnoringKind(other) {
        return super.equals(other) &&
            this.column().equalsIgnoringKind(other.column()) &&
            this.row().equalsIgnoringKind(other.row());
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetCellReference.fromJson);