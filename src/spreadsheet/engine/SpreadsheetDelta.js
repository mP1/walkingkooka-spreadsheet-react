import SpreadsheetRange from "../reference/SpreadsheetRange";
import SpreadsheetCell from "../SpreadsheetCell";

/**
 * Holds cells and window that have been updated following one or more cells being saved/updated
 */
export default class SpreadsheetDelta {

    static fromJson(json) {
        if (!json) {
            throw new Error("Missing json");
        }

        let cells = (json["cells"] || [])
            .map(c => SpreadsheetCell.fromJson(c));
        let windowJson = json["window"];

        return new SpreadsheetDelta(cells, windowJson && windowJson.split(",").map(r => SpreadsheetRange.fromJson(r)));
    }

    constructor(cells, window) {
        if (!cells) {
            throw new Error("Missing cells");
        }
        if (!Array.isArray(cells)) {
            throw new Error("Expected array cells got " + cells);
        }
        if (window && !Array.isArray(window)) {
            throw new Error("Expected array window got " + cells);
        }

        this.cellsValue = cells.slice();
        this.windowValue = (window && window.slice()) || [];
    }

    cells() {
        return this.cellsValue;
    }

    window() {
        return this.windowValue;
    }

    toJson() {
        let json = {
            cells: this.cells().map(c => c.toJson())
        };
        let window = this.window();
        if (window && window.length > 0) {
            json.window = window.map(w => w.toJson()).join(",");
        }
        return json;
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}