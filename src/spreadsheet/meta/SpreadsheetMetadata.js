import SpreadsheetName from "../SpreadsheetName";

import TextStyle from "../../text/TextStyle";
import SpreadsheetCoordinates from "../SpreadsheetCoordinates";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference";

// these constants should match the constants in walkingkooka-spreadsheet/walkingkooka.spreadsheet.meta.SpreadsheetMetadataPropertyName.java
const DEFAULTS = "_defaults";
const EDIT_CELL = "edit-cell";
const SPREADSHEET_ID = "spreadsheet-id";
const SPREADSHEET_NAME = "spreadsheet-name";
const STYLE = "style";
const VIEWPORT_CELL = "viewport-cell";
const VIEWPORT_COORDINATES = "viewport-coordinates";

function createEmpty() {
    const empty = new SpreadsheetMetadata({});
    empty.defaultSpreadsheetMetadata = empty;
    return empty;
}

/**
 * Makes a new defensive copy using the provided json and replaces the existing defaults.
 */
function createWithDefaults(json, defaultSpreadsheetMetadata) {
    const copy = new SpreadsheetMetadata(json);

    if (defaultSpreadsheetMetadata.json) {
        copy.json[DEFAULTS] = defaultSpreadsheetMetadata.toJson();
    }
    copy.defaultSpreadsheetMetadata = defaultSpreadsheetMetadata;
    return copy;
}

/**
 * Creates a new SpreadsheetMetadata and sets or replaces the new property/value pair.
 */
function copyAndSet(json, property, value) {
    const copy = new SpreadsheetMetadata(json);
    copy.json[property] = value.toJson ?
        value.toJson() :
        value;
    return copy;
}

/**
 * Immutable SpreadsheetMetadata, with getters and would be setters.
 */
export default class SpreadsheetMetadata {

    static EMPTY = createEmpty();

    constructor(json) {
        this.json = Object.assign({}, json) || {} // defensive copy
    }

    /**
     * Returns true if this is empty without any values.
     */
    isEmpty() {
        return Object.keys(this.json).length === 0;
    }

    getOrFail(property, factory) {
        const value = this.get(property, factory);
        if(!value) {
            throw new Error("Missing \"" + property + "\" " + this);
        }
        return value;
    }

    /**
     * General purpose getter
     */
    get(property, factory) {
        let json = this.json;
        var value;

        do {
            value = json[property];
            if (value) {
                break;
            }
            json = json[DEFAULTS];
        } while (json);

        return value && factory ?
            factory(value) :
            value;
    }

    // TODO introduce value validation.
    set(property, value) {
        if (!property) {
            throw new Error("Missing property");
        }
        if (!value) {
            throw new Error("Missing value");
        }

        let type;
        switch (property) {
            case EDIT_CELL:
                type = SpreadsheetCellReference;
                break;
            case SPREADSHEET_NAME:
                type = SpreadsheetName;
                break;
            case STYLE:
                type = TextStyle;
                break;
            case VIEWPORT_CELL:
                type = SpreadsheetCellReference;
                break;
            case VIEWPORT_COORDINATES:
                type = SpreadsheetCoordinates;
                break;
            default:
                throw new Error("Unknown property \"" + property + "\"");
        }
        if ((type === Number && Number.isNaN(value)) ||
            (typeof value === "function" && !(value instanceof type))) {
            throw new Error("Expected " + type + " property " + property + " with value " + value);
        }

        return value === this.get(property) ?
            this :
            copyAndSet(this.json, property, value);
    }

    /**
     * Returns the SpreadsheetMetadata which will supply defaults.
     * <pre>
     * {
     *   "create-date-time": "2000-01-02T12:58:59",
     *   "creator": "user@example.com",
     *   "_defaults": {
     *     "currency-symbol": "$AUD",
     *     "locale": "en"
     *   }
     * }
     </pre>
     */
    defaults() {
        if (!this.defaultSpreadsheetMetadata) {
            let defaultsJson = this.json[DEFAULTS];
            this.defaultSpreadsheetMetadata = (defaultsJson && new SpreadsheetMetadata(defaultsJson)) || SpreadsheetMetadata.EMPTY;
        }

        return this.defaultSpreadsheetMetadata;
    }

    setDefaults(defaultSpreadsheetMetadata) {
        if (!defaultSpreadsheetMetadata) {
            throw new Error("Missing SpreadsheetMetadata");
        }
        if (!(defaultSpreadsheetMetadata instanceof SpreadsheetMetadata)) {
            throw new Error("Expected SpreadsheetMetadata got " + defaultSpreadsheetMetadata);
        }
        return this.defaults() === defaultSpreadsheetMetadata ?
            this :
            createWithDefaults(this.json, defaultSpreadsheetMetadata);
    }

    editCell() {
        return this.get(EDIT_CELL, SpreadsheetCellReference.fromJson);
    }

    setEditCell(cell) {
        return this.set(EDIT_CELL, cell);
    }

    spreadsheetId() {
        return this.getOrFail(SPREADSHEET_ID);
    }

    spreadsheetName() {
        return this.get(SPREADSHEET_NAME, SpreadsheetName.fromJson);
    }

    setSpreadsheetName(name) {
        return this.set(SPREADSHEET_NAME, name);
    }

    style() {
        return this.get(STYLE, TextStyle.fromJson);
    }

    setStyle(style) {
        return this.set(STYLE, style);
    }

    viewportCell() {
        return this.get(VIEWPORT_CELL, SpreadsheetCellReference.fromJson);
    }

    setViewportCell(cell) {
        return this.set(VIEWPORT_CELL, cell);
    }
    
    viewportCoordinates() {
        return this.get(VIEWPORT_COORDINATES, SpreadsheetCoordinates.fromJson);
    }

    setViewportCoordinates(coords) {
        return this.set(VIEWPORT_COORDINATES, coords);
    }
    
    /**
     * Returns an Object representing this instance. Useful when posting to a server. Should probably never be necessary
     * but is available.
     */
    toObject() {
        return Object.assign({}, this.json);
    }

    /**
     * Returns this metadata as a JSON object. This must be JSON.stringify for use in JSON calls
     */
    toJson() {
        return Object.assign({}, this.json);
    }

    toString() {
        return JSON.stringify(this.json);
    }
}