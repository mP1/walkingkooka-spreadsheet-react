import SpreadsheetName from "../SpreadsheetName";

import Equality from "../../Equality.js";
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

/**
 * Creates a new SpreadsheetMetadata and sets or replaces the new property/value pair.
 */
function copyAndSet(properties,
                    property,
                    value) {
    const copy = Object.assign({}, properties);

    if (!(DEFAULTS === property && value.isEmpty())) {
        copy[property] = value;
    }
    return new SpreadsheetMetadata(copy);
}

/**
 * Immutable SpreadsheetMetadata, with getters and would be setters.
 */
export default class SpreadsheetMetadata {

    static EMPTY = new SpreadsheetMetadata({});

    static fromJson(json) {
        if (!json) {
            throw new Error("Missing json");
        }
        if (typeof json !== "object") {
            throw new Error("Expected Object json got " + json);
        }

        // check properties
        const properties = {};
        for (const [key, value] of Object.entries(json)) {
            let unmarshaller;

            switch (key) {
                case DEFAULTS:
                    unmarshaller = SpreadsheetMetadata.fromJson;
                    break;
                case EDIT_CELL:
                    unmarshaller = SpreadsheetCellReference.fromJson;
                    break;
                case SPREADSHEET_ID:
                    unmarshaller = null;
                    break;
                case SPREADSHEET_NAME:
                    unmarshaller = SpreadsheetName.fromJson;
                    break;
                case STYLE:
                    unmarshaller = TextStyle.fromJson;
                    break;
                case VIEWPORT_CELL:
                    unmarshaller = SpreadsheetCellReference.fromJson;
                    break;
                case VIEWPORT_COORDINATES:
                    unmarshaller = SpreadsheetCoordinates.fromJson;
                    break;
                default:
                    throw new Error("Unknown property \"" + key + "\"");
            }
            properties[key] = (unmarshaller && unmarshaller(value)) || value;
        }

        return new SpreadsheetMetadata(properties);
    }

    constructor(properties) {
        this.properties = properties;
    }

    /**
     * Returns true if this is empty without any values.
     */
    isEmpty() {
        return Object.keys(this.properties).length === 0;
    }

    getOrFail(property) {
        const value = this.get(property);
        if(typeof value === "undefined") {
            throw new Error("Missing \"" + property + "\" " + this);
        }
        return value;
    }

    /**
     * General purpose getter with support for checking
     */
    get(property) {
        if (!property) {
            throw new Error("Missing property");
        }
        if (typeof property !== "string") {
            throw new Error("Expected string property but got " + property);
        }

        var value = this.properties[property];

        if (typeof value === "undefined") {
            const defaults = this.properties[DEFAULTS];
            if(defaults) {
                value = defaults.get(property);
            }
        }

        return value;
    }

    /**
     * Would be setter that returns a new SpreadsheetMetadata if the new value is different from the previous.
     */
    set(property, value) {
        if (!property) {
            throw new Error("Missing property");
        }
        if (!value) {
            throw new Error("Missing value");
        }

        let type;
        switch (property) {
            case DEFAULTS:
                type = SpreadsheetMetadata;
                break;
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

        return (Equality.safeEquals(value, this.get(property))) ?
            this :
            copyAndSet(this.properties, property, value);
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
        return this.get(DEFAULTS) || SpreadsheetMetadata.EMPTY;
    }

    setDefaults(defaultSpreadsheetMetadata) {
        if (!defaultSpreadsheetMetadata) {
            throw new Error("Missing SpreadsheetMetadata");
        }
        if (!(defaultSpreadsheetMetadata instanceof SpreadsheetMetadata)) {
            throw new Error("Expected SpreadsheetMetadata got " + defaultSpreadsheetMetadata);
        }
        return this.set(DEFAULTS, defaultSpreadsheetMetadata);
    }

    editCell() {
        return this.get(EDIT_CELL);
    }

    setEditCell(cell) {
        return this.set(EDIT_CELL, cell);
    }

    spreadsheetId() {
        return this.getOrFail(SPREADSHEET_ID);
    }

    spreadsheetName() {
        return this.get(SPREADSHEET_NAME);
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
     * Returns this metadata as a JSON object. This must be JSON.stringify for use in JSON calls
     */
    toJson() {
        const json = {};

        for (const [key, value] of Object.entries(this.properties)) {
            json[key] = (value.toJson && value.toJson()) || value;
        }

        return json;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetMetadata && equals0(this, other));
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

/**
 * Tests all entries in both SpreadsheetMetadata for equality.
 */
function equals0(metadata, other) {
    var equals = false;

    const keys = Object.keys(metadata.properties);
    if (keys.length === Object.keys(other.properties).length) {
        equals = true;

        for (const key of keys) {
            equals = Equality.safeEquals(metadata.get(key), other.get(key));
            if (!equals) {
                break;
            }
        }
    }

    return equals;
}
