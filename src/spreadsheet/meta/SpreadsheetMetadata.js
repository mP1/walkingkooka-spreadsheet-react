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

const CREATOR = "creator";
const CREATE_DATE_TIME = "create-date-time";
const CURRENCY_SYMBOL = "currency-symbol";
const DATE_FORMAT_PATTERN = "date-format-pattern";
const DATE_PARSE_PATTERNS = "date-parse-patterns";
const DATETIME_OFFSET = "date-time-offset";
const DATETIME_FORMAT_PATTERN = "date-time-format-pattern";
const DATETIME_PARSE_PATTERNS = "date-time-parse-patterns";
const DECIMAL_SEPARATOR = "decimal-separator";
const EXPONENT_SYMBOL = "exponent-symbol";
const EDIT_RANGE = "edit-range";
const EXPRESSION_NUMBER_KIND = "expression-number-kind";
const GROUPING_SEPARATOR = "grouping-separator";
const LOCALE = "locale";
const MODIFIED_BY = "modified-by";
const MODIFIED_DATE_TIME = "modified-date-time";
const NEGATIVE_SIGN = "negative-sign";
const NUMBER_FORMAT_PATTERN = "number-format-pattern";
const NUMBER_PARSE_PATTERNS = "number-parse-patterns";
const PERCENTAGE_SYMBOL = "percentage-symbol";
const POSITIVE_SIGN = "positive-sign";
const ROUNDING_MODE = "rounding-mode";
const PRECISION = "precision";
const TEXT_FORMAT_PATTERN = "text-format-pattern";
const TIME_FORMAT_PATTERN = "time-format-pattern";
const TIME_PARSE_PATTERNS = "time-parse-patterns";
const TWO_DIGIT_YEAR = "two-digit-year";
const WIDTH = "width";

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
                case CREATOR:
                case CREATE_DATE_TIME:
                case CURRENCY_SYMBOL:
                case DATE_FORMAT_PATTERN:
                case DATE_PARSE_PATTERNS:
                case DATETIME_OFFSET:
                case DATETIME_FORMAT_PATTERN:
                case DATETIME_PARSE_PATTERNS:
                case DECIMAL_SEPARATOR:
                case EXPONENT_SYMBOL:
                case EDIT_RANGE:
                case EXPRESSION_NUMBER_KIND:
                case GROUPING_SEPARATOR:
                case LOCALE:
                case MODIFIED_BY:
                case MODIFIED_DATE_TIME:
                case NEGATIVE_SIGN:
                case NUMBER_FORMAT_PATTERN:
                case NUMBER_PARSE_PATTERNS:
                case PERCENTAGE_SYMBOL:
                case POSITIVE_SIGN:
                case ROUNDING_MODE:
                case PRECISION:
                case TEXT_FORMAT_PATTERN:
                case TIME_FORMAT_PATTERN:
                case TIME_PARSE_PATTERNS:
                case TWO_DIGIT_YEAR:
                case WIDTH:
                    unmarshaller = null; // TODO types not yet implemented
                    break;
                default:
                    if(key.startsWith("color-")) {
                        break;
                    }
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

        let expectedClass;
        let expectedTypeOf;

        switch (property) {
            case DEFAULTS:
                expectedClass = SpreadsheetMetadata;
                break;
            case EDIT_CELL:
                expectedClass = SpreadsheetCellReference;
                break;
            case SPREADSHEET_ID:
                expectedTypeOf = "string";
                break;
            case SPREADSHEET_NAME:
                expectedClass = SpreadsheetName;
                break;
            case STYLE:
                expectedClass = TextStyle;
                break;
            case VIEWPORT_CELL:
                expectedClass = SpreadsheetCellReference;
                break;
            case VIEWPORT_COORDINATES:
                expectedClass = SpreadsheetCoordinates;
                break;
            case CREATOR:
            case CREATE_DATE_TIME:
            case CURRENCY_SYMBOL:
            case DATE_FORMAT_PATTERN:
            case DATE_PARSE_PATTERNS:
            case DATETIME_OFFSET:
            case DATETIME_FORMAT_PATTERN:
            case DATETIME_PARSE_PATTERNS:
            case DECIMAL_SEPARATOR:
            case EXPONENT_SYMBOL:
            case EDIT_RANGE:
            case EXPRESSION_NUMBER_KIND:
            case GROUPING_SEPARATOR:
            case LOCALE:
            case MODIFIED_BY:
            case MODIFIED_DATE_TIME:
            case NEGATIVE_SIGN:
            case NUMBER_FORMAT_PATTERN:
            case NUMBER_PARSE_PATTERNS:
            case PERCENTAGE_SYMBOL:
            case POSITIVE_SIGN:
            case ROUNDING_MODE:
            case PRECISION:
            case TEXT_FORMAT_PATTERN:
            case TIME_FORMAT_PATTERN:
            case TIME_PARSE_PATTERNS:
            case TWO_DIGIT_YEAR:
            case WIDTH:
                expectedClass = null; // TODO properties not yet supported
                break;
            default:
                if (property.startsWith("color-")) {
                    break;
                }
                throw new Error("Unknown property \"" + property + "\"");
        }
        if ((expectedTypeOf && typeof (value) !== expectedTypeOf)) {
            throw new Error("Expected " + expectedTypeOf + " property " + property + " with value " + value);
        }
        if ((expectedClass === Number && Number.isNaN(value)) ||
            (typeof value === "function" && !(value instanceof expectedClass))) {
            throw new Error("Expected " + expectedClass + " property " + property + " with value " + value);
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
        return this.get(SPREADSHEET_ID);
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
