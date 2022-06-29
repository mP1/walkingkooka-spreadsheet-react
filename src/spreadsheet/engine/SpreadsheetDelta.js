import CharSequences from "../../CharSequences.js";
import Equality from "../../Equality.js";
import ImmutableMap from "../../util/ImmutableMap";
import Preconditions from "../../Preconditions.js";
import SpreadsheetCell from "../SpreadsheetCell";
import SpreadsheetCellRange from "../reference/SpreadsheetCellRange.js";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference.js";
import SpreadsheetCellReferenceOrLabelName from "../reference/SpreadsheetCellReferenceOrLabelName.js";
import SpreadsheetColumn from "../reference/SpreadsheetColumn.js";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference";
import SpreadsheetLabelMapping from "../reference/SpreadsheetLabelMapping.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetRow from "../reference/SpreadsheetRow.js";
import SpreadsheetRowReference from "../reference/SpreadsheetRowReference";
import SpreadsheetViewportSelection from "../reference/SpreadsheetViewportSelection.js";
import SystemObject from "../../SystemObject.js";

/**
 * A function used by fromJson to verify number column widths and row heights
 */
const NUMBER = (value) => {
    Preconditions.requireNumber(value, "value");
    return value;
}

const TYPE_NAME = "spreadsheet-delta";

function unmarshallCsv(csv, selectionParser) {
    return csv ?
        csv.split(",").map(s => selectionParser(s)) :
        [];
}

function unmarshallHash(hash, elementUnmarshaller) {
    let unmarshalled = [];

    for(const referenceAndValue of Object.entries(hash || {})) {
        let reference = {};
        reference[referenceAndValue[0]] = referenceAndValue[1];

        unmarshalled.push(elementUnmarshaller(reference));
    }

    return unmarshalled;
}

function marshallArray(array) {
    return Object.assign({}, ...array.map(e => e.toJson()));
}

/**
 * Holds cells and window that have been updated following one or more cells being saved/updated
 */
export default class SpreadsheetDelta extends SystemObject {

    /**
     * The last {@link SpreadsheetCellRange} will be the viewport range. If a frozen column or row is present
     * they will occupy the beginning slots.
     */
    static viewportRange(window) {
        return window[window.length -1];
    }

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

        const selection = json.selection && SpreadsheetViewportSelection.fromJson(json.selection);

        const cells = unmarshallHash(
            json.cells || {},
            SpreadsheetCell.fromJson
        );

        const columns = unmarshallHash(
            json.columns || {},
            SpreadsheetColumn.fromJson
        );

        const labels = json.labels ?
            json.labels.map(m => {
                return SpreadsheetLabelMapping.fromJson(m)
            }) :
            [];

        const rows = unmarshallHash(
            json.rows || {},
            SpreadsheetRow.fromJson
        );

        const deletedCells = unmarshallCsv(json.deletedCells, SpreadsheetCellReference.fromJson);
        const deletedColumns = unmarshallCsv(json.deletedColumns, SpreadsheetColumnReference.fromJson);
        const deletedRows = unmarshallCsv(json.deletedRows, SpreadsheetRowReference.fromJson);

        const columnWidths = ImmutableMap.fromJson(json.columnWidths || {}, SpreadsheetColumnReference.fromJson, NUMBER);
        const rowHeights = ImmutableMap.fromJson(json.rowHeights || {}, SpreadsheetRowReference.fromJson, NUMBER);
        const window = unmarshallCsv(json.window, SpreadsheetCellRange.fromJson);

        return new SpreadsheetDelta(
            selection,
            cells,
            columns,
            labels,
            rows,
            deletedCells,
            deletedColumns,
            deletedRows,
            columnWidths,
            rowHeights,
            window
        );
    }

    static EMPTY = SpreadsheetDelta.fromJson({});

    constructor(selection, cells, columns, labels, rows, deletedCells, deletedColumns, deletedRows, columnWidths, rowHeights, window) {
        super();
        Preconditions.optionalInstance(selection, SpreadsheetViewportSelection, "selection");
        Preconditions.requireArray(cells, "cells");
        Preconditions.requireArray(columns, "columns");
        Preconditions.requireArray(labels, "labels");
        Preconditions.requireArray(rows, "rows");

        Preconditions.requireArray(deletedCells, "deletedCells");
        Preconditions.requireArray(deletedColumns, "deletedColumns");
        Preconditions.requireArray(deletedRows, "deletedRows");

        Preconditions.requireInstance(columnWidths, ImmutableMap, "columnWidths");
        Preconditions.requireInstance(rowHeights, ImmutableMap, "rowHeights");
        Preconditions.requireArray(window, "window");

        this.selectionValue = selection;

        this.cellsValue = cells.slice();
        this.columnsValue = columns.slice();
        this.labelsValue = labels.slice();
        this.rowsValue = rows.slice();

        this.deletedCellsValue = deletedCells.slice();
        this.deletedColumnsValue = deletedColumns.slice();
        this.deletedRowsValue = deletedRows.slice();

        this.columnWidthsValue = columnWidths;
        this.rowHeightsValue = rowHeights;
        this.windowValue = window.slice();
    }

    selection() {
        return this.selectionValue;
    }

    cells() {
        return this.cellsValue.slice();
    }

    /**
     * Returns the {@link SpreadsheetCell} that matches the given cell or label.
     */
    cell(cellOrLabel) {
        Preconditions.requireInstance(cellOrLabel, SpreadsheetCellReferenceOrLabelName, "cellOrLabel");

        const cellReference = cellOrLabel instanceof SpreadsheetLabelName ?
            this.cellReference(cellOrLabel) :
            cellOrLabel;

        return cellReference && this.cellReferenceToCells().get(cellReference);
    }

    /**
     * Returns the {@link SpreadsheetCellReference} for the given {@link SpreadsheetLabelName}.
     */
    cellReference(label) {
        Preconditions.requireInstance(label, SpreadsheetLabelName, "label");

        const mapping = this.labels()
            .find(m => m.label().equals(label));
        return mapping &&
            mapping.reference();
    }

    /**
     * Returns an {@link ImmutableMap} where the {@link SpreadsheetCellReference} is the key and the cell the value.
     */
    cellReferenceToCells() {
        const referenceToCell = new Map();

        this.cells().forEach(c => {
            referenceToCell.set(
                c.reference().toMapKey(),
                c
            );
        });

        return new ImmutableMap(referenceToCell);
    }

    columns() {
        return this.columnsValue.slice();
    }

    /**
     * Gets the {@link SpreadsheetColumn} at the given {@link SpreadsheetColumnReference}.
     */
    column(columnReference) {
        Preconditions.requireInstance(columnReference, SpreadsheetColumnReference, "column");

        return this.columnReferenceToColumns()
            .get(
            columnReference
        );
    }

    columnReferenceToColumns() {
        if(!this.columnReferenceToColumnsMap) {
            const map = new Map();

            this.columns().forEach(c => {
                map.set(
                    c.reference().toMapKey(),
                    c
                );
            });

            this.columnReferenceToColumnsMap = new ImmutableMap(map);
        }

        return this.columnReferenceToColumnsMap;
    }

    labels() {
        return this.labelsValue.slice();
    }

    labelToReferences() {
        const map = new Map();

        this.labels().forEach(m => {
            map.set(
                m.label().toMapKey(),
                m.reference()
            );
        });

        return new ImmutableMap(map);
    }

    cellReferenceToLabels() {
        const labels = this.labels();
        const cellReferenceToLabels = new Map();

        labels.forEach(
            m => {
                m.reference()
                    .cellMapKeys(labels)
                    .forEach(key => {
                        var l = cellReferenceToLabels.get(key);
                        if(l == null){
                            l = [];
                            cellReferenceToLabels.set(key, l);
                        }
                        l.push(m.label());
                        l.sort((left, right) => {
                            return left.compareTo(right)
                        });
                    });
            });

        return new ImmutableMap(cellReferenceToLabels);
    }

    rows() {
        return this.rowsValue.slice();
    }

    /**
     * Gets the {@link SpreadsheetRow} at the given {@link SpreadsheetRowReference}.
     */
    row(rowReference) {
        Preconditions.requireInstance(rowReference, SpreadsheetRowReference, "row");

        return this.rowReferenceToRows()
            .get(
                rowReference
            );
    }

    rowReferenceToRows() {
        if(!this.rowReferenceToRowsMap) {
            const map = new Map();

            this.rows().forEach(r => {
                map.set(
                    r.reference().toMapKey(),
                    r
                );
            });

            this.rowReferenceToRowsMap = new ImmutableMap(map);
        }

        return this.rowReferenceToRowsMap;
    }

    deletedCells() {
        return this.deletedCellsValue.slice();
    }

    deletedColumns() {
        return this.deletedColumnsValue.slice();
    }

    deletedRows() {
        return this.deletedRowsValue.slice();
    }
    
    columnWidths() {
        return this.columnWidthsValue;
    }

    rowHeights() {
        return this.rowHeightsValue;
    }

    window() {
        return this.windowValue.slice();
    }

    toJson() {
        let json = {};

        const selection = this.selection();
        if(selection) {
            json.selection = selection.toJson();
        }

        const cells = this.cells();
        if(cells.length > 0){
            json.cells = marshallArray(cells);
        }

        const columns = this.columns();
        if(columns.length > 0){
            json.columns = marshallArray(columns);
        }

        const labels = this.labels();
        if(labels.length > 0){
            json.labels = labels.map(l => l.toJson());
        }

        const rows = this.rows();
        if(rows.length > 0){
            json.rows = marshallArray(rows);
        }

        const deletedCells = this.deletedCells();
        if(deletedCells.length > 0){
            json.deletedCells = CharSequences.csv(deletedCells);
        }

        const deletedColumns = this.deletedColumns();
        if(deletedColumns.length > 0){
            json.deletedColumns = CharSequences.csv(deletedColumns);
        }

        const deletedRows = this.deletedRows();
        if(deletedRows.length > 0){
            json.deletedRows = CharSequences.csv(deletedRows);
        }

        const columnWidths = this.columnWidths();
        if(columnWidths.size() > 0){
            json.columnWidths = columnWidths.toJson();
        }

        const rowHeights = this.rowHeights();
        if(rowHeights.size() > 0){
            json.rowHeights = rowHeights.toJson();
        }

        const window = this.window();
        if(window.length > 0){
            json.window = CharSequences.csv(window);
        }
        return json;
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetDelta &&
                Equality.safeEquals(this.selection(), other.selection()) &&
                Equality.safeEquals(this.cells(), other.cells()) &&
                Equality.safeEquals(this.columns(), other.columns()) &&
                Equality.safeEquals(this.labels(), other.labels()) &&
                Equality.safeEquals(this.rows(), other.rows()) &&
                Equality.safeEquals(this.deletedCells(), other.deletedCells()) &&
                Equality.safeEquals(this.deletedColumns(), other.deletedColumns()) &&
                Equality.safeEquals(this.deletedRows(), other.deletedRows()) &&
                this.columnWidths().equals(other.columnWidths()) &&
                this.rowHeights().equals(other.rowHeights()) &&
                Equality.safeEquals(this.window(), other.window())
            );
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetDelta.fromJson);