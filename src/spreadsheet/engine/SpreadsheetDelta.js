import SpreadsheetCell from "../SpreadsheetCell";
import SpreadsheetRange from "../reference/SpreadsheetRange";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference";
import SpreadsheetRowReference from "../reference/SpreadsheetRowReference";
import ImmutableMap from "../../util/ImmutableMap";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference";

/**
 * A function used by fromJson to verify number column widths and row heights
 * @param value
 * @returns {number}
 * @constructor
 */
const NUMBER = (value) => {
    if(typeof value !== 'number') {
        throw new Error("Expected number value got " + value);
    }
    return value;
}

/**
 * Holds cells and window that have been updated following one or more cells being saved/updated
 */
export default class SpreadsheetDelta {

    static fromJson(json) {
        if (!json) {
            throw new Error("Missing json");
        }

        let cells = [];
        for (const referenceToValues of Object.entries(json.cells || {})) {
            let reference = {};
            reference[referenceToValues[0]] = referenceToValues[1];

            cells.push(SpreadsheetCell.fromJson(reference));
        }

        const maxColumnWidths = ImmutableMap.fromJson(json.maxColumnWidths || {}, SpreadsheetColumnReference.fromJson, NUMBER);
        const maxRowHeights = ImmutableMap.fromJson(json.maxRowHeights || {}, SpreadsheetRowReference.fromJson, NUMBER);
        const windowJson = json["window"];

        return new SpreadsheetDelta(cells,
            maxColumnWidths,
            maxRowHeights,
            (windowJson && windowJson.split(",").map(r => SpreadsheetRange.fromJson(r))) || []);
    }

    constructor(cells, maxColumnWidths, maxRowHeights, window) {
        if (!cells) {
            throw new Error("Missing cells");
        }
        if (!Array.isArray(cells)) {
            throw new Error("Expected array cells got " + cells);
        }

        if (!maxColumnWidths) {
            throw new Error("Missing maxColumnWidths");
        }
        if (!(maxColumnWidths instanceof ImmutableMap)) {
            throw new Error("Expected ImmutableMap maxColumnWidths got " + maxColumnWidths);
        }

        if (!maxRowHeights) {
            throw new Error("Missing maxRowHeights");
        }
        if (!(maxRowHeights instanceof ImmutableMap)) {
            throw new Error("Expected ImmutableMap maxRowHeights got " + maxRowHeights);
        }

        if (!window) {
            throw new Error("Missing window");
        }
        if (!Array.isArray(window)) {
            throw new Error("Expected array window got " + window);
        }

        this.cellsValue = cells.slice();
        this.maxColumnWidthsValue = maxColumnWidths;
        this.maxRowHeightsValue = maxRowHeights;
        this.windowValue = window.slice();
    }

    cells() {
        return this.cellsValue.slice();
    }

    maxColumnWidths() {
        return this.maxColumnWidthsValue;
    }

    maxRowHeights() {
        return this.maxRowHeightsValue;
    }

    window() {
        return this.windowValue.slice();
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
     *    "maxColumnWidths": {
     *      "A": 150
     *    },
     *    "maxRowHeights": {
     *      "1": 75
     *    },
     *    "window": "B9:300:50"
     * }
     * </pre>
     */
    toJson() {
        let json = {};

        const cellsArray = this.cells();
        if (cellsArray.length > 0) {
            json.cells = Object.assign({}, ...cellsArray.map(c => c.toJson()));
        }

        const maxColumnWidths = this.maxColumnWidths();
        if (maxColumnWidths.size() > 0) {
            json.maxColumnWidths = maxColumnWidths.toJson();
        }

        const maxRowHeights = this.maxRowHeights();
        if (maxRowHeights.size() > 0) {
            json.maxRowHeights = maxRowHeights.toJson();
        }

        const window = this.window();
        if (window.length > 0) {
            json.window = window.map(w => w.toJson()).join(",");
        }
        return json;
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}