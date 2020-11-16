import SpreadsheetName from "../SpreadsheetName";

import TextStyle from "../../text/TextStyle";
import SpreadsheetCoordinates from "../SpreadsheetCoordinates";

// these constants should match the constants in walkingkooka-spreadsheet/walkingkooka.spreadsheet.meta.SpreadsheetMetadataPropertyName.java
const DEFAULTS = "_defaults";
const SPREADSHEET_NAME = "spreadsheet-name";
const STYLE = "style";
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
     * General purpose getter
     */
    get(property) {
        let json = this.json;
        var value;

        do {
            value = json[property];
            if (value) {
                break;
            }
            json = json[DEFAULTS];
        } while (json);

        return value;
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
            case SPREADSHEET_NAME:
                type = SpreadsheetName;
                break;
            case STYLE:
                type = TextStyle;
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

    spreadsheetId() {
        const id = this.get("spreadsheet-id");
        if (!id) {
            throw new Error("Missing \"spreadsheet-id\" " + this);
        }
        return id;
    }

    spreadsheetName() {
        return SpreadsheetName.fromJson(this.json[SPREADSHEET_NAME]);
    }

    setSpreadsheetName(name) {
        return this.set(SPREADSHEET_NAME, name);
    }

    style() {
        const style = this.get(STYLE);
        return style && TextStyle.fromJson(style);
    }

    setStyle(style) {
        return this.set(STYLE, style);
    }

    viewportCoordinates() {
        const coords = this.get(VIEWPORT_COORDINATES);
        return coords && SpreadsheetCoordinates.fromJson(coords);
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