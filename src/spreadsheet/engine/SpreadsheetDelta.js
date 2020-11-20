import SpreadsheetCell from "../SpreadsheetCell";
import SpreadsheetRange from "../reference/SpreadsheetRange";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference";
import SpreadsheetRowReference from "../reference/SpreadsheetRowReference";

/**
 * Transforms the object into a Map using the keyFactory to convert the strings to keys.
 */
function buildMap(json, keyFactory) {
    var map = new Map();

    if (json) {
        for (const [key, value] of Object.entries(json)) {
            map.set(keyFactory(key), value);
        }
    }

    return map;
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

        const maxColumnWidths = buildMap(json.maxColumnWidths, SpreadsheetColumnReference.fromJson);
        const maxRowHeights = buildMap(json.maxRowHeights, SpreadsheetRowReference.fromJson);
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
        if (!(maxColumnWidths instanceof Map)) {
            throw new Error("Expected object maxColumnWidths got " + maxColumnWidths);
        }

        if (!maxRowHeights) {
            throw new Error("Missing maxRowHeights");
        }
        if (!(maxRowHeights instanceof Map)) {
            throw new Error("Expected object maxRowHeights got " + maxRowHeights);
        }

        if (!window) {
            throw new Error("Missing window");
        }
        if (!Array.isArray(window)) {
            throw new Error("Expected array window got " + window);
        }

        this.cellsValue = cells.slice();
        this.maxColumnWidthsValue = new Map(maxColumnWidths);
        this.maxRowHeightsValue = new Map(maxRowHeights);
        this.windowValue = window.slice();
    }

    cells() {
        return this.cellsValue.slice();
    }

    maxColumnWidths() {
        return new Map(this.maxColumnWidthsValue);
    }

    maxRowHeights() {
        return new Map(this.maxRowHeightsValue);
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
        if (maxColumnWidths.size > 0) {
            json.maxColumnWidths = mapToJson(maxColumnWidths);
        }

        const maxRowHeights = this.maxRowHeights();
        if (maxRowHeights.size > 0) {
            json.maxRowHeights = mapToJson(maxRowHeights);
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

function mapToJson(map) {
    let json = {};
    for (let [key, value] of map.entries()) {
        json[key.toString()] = value;
    }
    return json;
}