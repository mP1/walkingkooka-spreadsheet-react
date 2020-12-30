import Equality from "../../Equality.js";
import ImmutableMap from "../../util/ImmutableMap";
import SpreadsheetCell from "../SpreadsheetCell";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference";
import SpreadsheetRange from "../reference/SpreadsheetRange";
import SpreadsheetRowReference from "../reference/SpreadsheetRowReference";
import SystemObject from "../../SystemObject.js";

/**
 * A function used by fromJson to verify number column widths and row heights
 */
const NUMBER = (value) => {
    if(typeof value !== 'number'){
        throw new Error("Expected number value got " + value);
    }
    return value;
}

const TYPE_NAME = "spreadsheet-delta";

/**
 * Holds cells and window that have been updated following one or more cells being saved/updated
 */
export default class SpreadsheetDelta extends SystemObject {

    static fromJson(json) {
        if(!json){
            throw new Error("Missing json");
        }

        let cells = [];
        for(const referenceToValues of Object.entries(json.cells || {})) {
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
        super();
        if(!cells){
            throw new Error("Missing cells");
        }
        if(!Array.isArray(cells)){
            throw new Error("Expected array cells got " + cells);
        }

        if(!maxColumnWidths){
            throw new Error("Missing maxColumnWidths");
        }
        if(!(maxColumnWidths instanceof ImmutableMap)){
            throw new Error("Expected ImmutableMap maxColumnWidths got " + maxColumnWidths);
        }

        if(!maxRowHeights){
            throw new Error("Missing maxRowHeights");
        }
        if(!(maxRowHeights instanceof ImmutableMap)){
            throw new Error("Expected ImmutableMap maxRowHeights got " + maxRowHeights);
        }

        if(!window){
            throw new Error("Missing window");
        }
        if(!Array.isArray(window)){
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
        if(cellsArray.length > 0){
            json.cells = Object.assign({}, ...cellsArray.map(c => c.toJson()));
        }

        const maxColumnWidths = this.maxColumnWidths();
        if(maxColumnWidths.size() > 0){
            json.maxColumnWidths = maxColumnWidths.toJson();
        }

        const maxRowHeights = this.maxRowHeights();
        if(maxRowHeights.size() > 0){
            json.maxRowHeights = maxRowHeights.toJson();
        }

        const window = this.window();
        if(window.length > 0){
            json.window = window.map(w => w.toJson()).join(",");
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
                this.maxColumnWidths().equals(other.maxColumnWidths()) &&
                this.maxRowHeights().equals(other.maxRowHeights()) &&
                Equality.safeEquals(this.window(), other.window())
            );
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetDelta.fromJson);