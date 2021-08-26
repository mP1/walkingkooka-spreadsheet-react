import Equality from "../../Equality.js";
import ImmutableMap from "../../util/ImmutableMap";
import Preconditions from "../../Preconditions.js";
import SpreadsheetCell from "../SpreadsheetCell";
import SpreadsheetCellRange from "../reference/SpreadsheetCellRange.js";
import SpreadsheetCellReferenceOrLabelName from "../reference/SpreadsheetCellReferenceOrLabelName.js";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference";
import SpreadsheetLabelMapping from "../reference/SpreadsheetLabelMapping.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetRowReference from "../reference/SpreadsheetRowReference";
import SystemObject from "../../SystemObject.js";

/**
 * A function used by fromJson to verify number column widths and row heights
 */
const NUMBER = (value) => {
    Preconditions.requireNumber(value, "value");
    return value;
}

const TYPE_NAME = "spreadsheet-delta";

/**
 * Holds cells and window that have been updated following one or more cells being saved/updated
 */
export default class SpreadsheetDelta extends SystemObject {

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

        let cells = [];
        for(const referenceToValues of Object.entries(json.cells || {})) {
            let reference = {};
            reference[referenceToValues[0]] = referenceToValues[1];

            cells.push(SpreadsheetCell.fromJson(reference));
        }

        const labels = json.labels ?
            json.labels.map(m => {
                return SpreadsheetLabelMapping.fromJson(m)
            }) :
            [];

        const columnWidths = ImmutableMap.fromJson(json.columnWidths || {}, SpreadsheetColumnReference.fromJson, NUMBER);
        const rowHeights = ImmutableMap.fromJson(json.rowHeights || {}, SpreadsheetRowReference.fromJson, NUMBER);
        const windowJson = json["window"];

        return new SpreadsheetDelta(
            cells,
            labels,
            columnWidths,
            rowHeights,
            (windowJson && SpreadsheetCellRange.fromJson(windowJson))
        );
    }

    constructor(cells, labels, columnWidths, rowHeights, window) {
        super();
        Preconditions.requireArray(cells, "cells");
        Preconditions.requireArray(labels, "labels");
        Preconditions.requireInstance(columnWidths, ImmutableMap, "columnWidths");
        Preconditions.requireInstance(rowHeights, ImmutableMap, "rowHeights");
        Preconditions.optionalInstance(window, SpreadsheetCellRange, "window");

        this.cellsValue = cells.slice();
        this.labelsValue = labels.slice();
        this.columnWidthsValue = columnWidths;
        this.rowHeightsValue = rowHeights;
        this.windowValue = window;
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

        return cellReference && this.referenceToCellMap().get(cellReference);
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
    referenceToCellMap() {
        const referenceToCell = new Map();

        this.cells().forEach(c => {
            referenceToCell.set(c.reference().toString(), c);
        });

        return new ImmutableMap(referenceToCell);
    }

    labels() {
        return this.labelsValue.slice();
    }

    labelToReference() {
        const map = new Map();

        this.labels().forEach(m => {
            map.set(m.label().toString(), m.reference());
        });

        return new ImmutableMap(map);
    }

    cellToLabels() {
        const cellToLabels = new Map();

        this.labels()
            .forEach(m => {
                const key = m.reference().toString();
                var labels = cellToLabels.get(key);
                if(null == labels){
                    labels = [];
                    cellToLabels.set(key, labels);
                }
                labels.push(m.label());
            });

        return new ImmutableMap(cellToLabels);
    }

    columnWidths() {
        return this.columnWidthsValue;
    }

    rowHeights() {
        return this.rowHeightsValue;
    }

    window() {
        return this.windowValue;
    }

    /**
     * <pre>
     * {
     *   "cells": {
     *     "A1": {
     *       "formula": {
     *         "text": "1"
     *       }
     *     },
     *     "B2": {
     *       "formula": {
     *         "text": "2"
     *        }
     *     }
     *    },
     *    "columnWidths": {
     *      "A": 150
     *    },
     *    "rowHeights": {
     *      "1": 75
     *    },
     *    "window": "B2:Z99"
     * }
     * </pre>
     */
    toJson() {
        let json = {};

        const cellsArray = this.cells();
        if(cellsArray.length > 0){
            json.cells = Object.assign({}, ...cellsArray.map(c => c.toJson()));
        }

        const labels = this.labels();
        if(labels.length > 0){
            json.labels = labels.map(l => l.toJson());
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
        if(window){
            json.window = window.toJson();
        }
        return json;
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetDelta &&
                Equality.safeEquals(this.cells(), other.cells()) &&
                Equality.safeEquals(this.labels(), other.labels()) &&
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