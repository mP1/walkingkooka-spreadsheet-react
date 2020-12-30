import Character from "../../Character.js";
import EmailAddress from "../../net/EmailAddress.js";
import Equality from "../../Equality.js";
import ExpressionNumberKind from "../../math/ExpressionNumberKind.js";
import LocalDateTime from "../../datetime/LocalDateTime.js";
import Locale from "../../util/Locale.js";
import SpreadsheetCoordinates from "../SpreadsheetCoordinates";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference";
import SpreadsheetName from "../SpreadsheetName";
import SpreadsheetPattern from "../format/SpreadsheetPattern.js";
import SpreadsheetRange from "../reference/SpreadsheetRange.js";
import TextStyle from "../../text/TextStyle";

// these constants should match the constants in walkingkooka-spreadsheet/walkingkooka.spreadsheet.meta.SpreadsheetMetadataPropertyName.java
const DEFAULTS = "_defaults";

/**
 * Creates a new SpreadsheetMetadata and sets or replaces the new property/value pair.
 */
function copyAndSet(properties,
                    property,
                    value) {
    const copy = Object.assign({}, properties);

    if(!(DEFAULTS === property && value.isEmpty())){
        copy[property] = value;
    }
    return new SpreadsheetMetadata(copy);
}

/**
 * Creates a new SpreadsheetMetadata removing the given property.
 */
function copyAndRemove(properties,
                       property) {
    const copy = Object.assign({}, properties);
    delete copy[property];
    return new SpreadsheetMetadata(copy);
}

/**
 * Immutable SpreadsheetMetadata, with getters and would be setters.
 */
export default class SpreadsheetMetadata {

    static CREATOR = "creator";
    static CREATE_DATE_TIME = "create-date-time";
    static CURRENCY_SYMBOL = "currency-symbol";
    static DATE_FORMAT_PATTERN = "date-format-pattern";
    static DATE_PARSE_PATTERNS = "date-parse-patterns";
    static DATETIME_OFFSET = "date-time-offset";
    static DATETIME_FORMAT_PATTERN = "date-time-format-pattern";
    static DATETIME_PARSE_PATTERNS = "date-time-parse-patterns";
    static DECIMAL_SEPARATOR = "decimal-separator";
    static EXPONENT_SYMBOL = "exponent-symbol";
    static EDIT_CELL = "edit-cell";
    static EDIT_RANGE = "edit-range";
    static EXPRESSION_NUMBER_KIND = "expression-number-kind";
    static GROUPING_SEPARATOR = "grouping-separator";
    static LOCALE = "locale";
    static MODIFIED_BY = "modified-by";
    static MODIFIED_DATE_TIME = "modified-date-time";
    static NEGATIVE_SIGN = "negative-sign";
    static NUMBER_FORMAT_PATTERN = "number-format-pattern";
    static NUMBER_PARSE_PATTERNS = "number-parse-patterns";
    static PERCENTAGE_SYMBOL = "percentage-symbol";
    static POSITIVE_SIGN = "positive-sign";
    static ROUNDING_MODE = "rounding-mode";
    static PRECISION = "precision";
    static SPREADSHEET_ID = "spreadsheet-id";
    static SPREADSHEET_NAME = "spreadsheet-name";
    static STYLE = "style";
    static TEXT_FORMAT_PATTERN = "text-format-pattern";
    static TIME_FORMAT_PATTERN = "time-format-pattern";
    static TIME_PARSE_PATTERNS = "time-parse-patterns";
    static TWO_DIGIT_YEAR = "two-digit-year";
    static VIEWPORT_CELL = "viewport-cell";
    static VIEWPORT_COORDINATES = "viewport-coordinates";
    static WIDTH = "width";

    static EMPTY = new SpreadsheetMetadata({});

    static fromJson(json) {
        if(!json){
            throw new Error("Missing json");
        }
        if(typeof json !== "object"){
            throw new Error("Expected Object json got " + json);
        }

        // check properties
        const properties = {};
        for(const [key, value] of Object.entries(json)) {
            let typed, unmarshaller;

            switch(key) {
                case SpreadsheetMetadata.CREATE_DATE_TIME:
                    unmarshaller = LocalDateTime.fromJson;
                    break;
                case SpreadsheetMetadata.CREATOR:
                    unmarshaller = EmailAddress.fromJson;
                    break;
                case SpreadsheetMetadata.CURRENCY_SYMBOL:
                    checkCurrencySymbol(value);
                    typed = value;
                    break;
                case SpreadsheetMetadata.DATE_FORMAT_PATTERN:
                case SpreadsheetMetadata.DATE_PARSE_PATTERNS:
                    unmarshaller = SpreadsheetPattern.fromJson;
                    break;
                case SpreadsheetMetadata.DATETIME_OFFSET:
                    typed = value;
                    break;
                case SpreadsheetMetadata.DATETIME_FORMAT_PATTERN:
                case SpreadsheetMetadata.DATETIME_PARSE_PATTERNS:
                    unmarshaller = SpreadsheetPattern.fromJson;
                    break;
                case DEFAULTS:
                    unmarshaller = SpreadsheetMetadata.fromJson;
                    break;
                case SpreadsheetMetadata.DECIMAL_SEPARATOR:
                    unmarshaller = Character.fromJson;
                    break;
                case SpreadsheetMetadata.EDIT_CELL:
                    unmarshaller = SpreadsheetCellReference.fromJson;
                    break;
                case SpreadsheetMetadata.EDIT_RANGE:
                    unmarshaller = SpreadsheetRange.fromJson;
                    break;
                case SpreadsheetMetadata.EXPONENT_SYMBOL:
                    unmarshaller = Character.fromJson;
                    break;
                case SpreadsheetMetadata.EXPRESSION_NUMBER_KIND:
                    unmarshaller = ExpressionNumberKind.fromJson;
                    break;
                case SpreadsheetMetadata.GROUPING_SEPARATOR:
                    unmarshaller = Character.fromJson;
                    break;
                case SpreadsheetMetadata.LOCALE:
                    unmarshaller = Locale.fromJson;
                    break;
                case SpreadsheetMetadata.MODIFIED_BY:
                    unmarshaller = EmailAddress.fromJson;
                    break;
                case SpreadsheetMetadata.MODIFIED_DATE_TIME:
                    unmarshaller = LocalDateTime.fromJson;
                    break;
                case SpreadsheetMetadata.NEGATIVE_SIGN:
                    unmarshaller = Character.fromJson;
                    break;
                case SpreadsheetMetadata.NUMBER_FORMAT_PATTERN:
                case SpreadsheetMetadata.NUMBER_PARSE_PATTERNS:
                    unmarshaller = SpreadsheetPattern.fromJson;
                    break;
                case SpreadsheetMetadata.PERCENTAGE_SYMBOL:
                case SpreadsheetMetadata.POSITIVE_SIGN:
                    unmarshaller = Character.fromJson;
                    break;
                case SpreadsheetMetadata.PRECISION:
                    checkPrecision(value);
                    typed = value;
                    break;
                case SpreadsheetMetadata.SPREADSHEET_ID:
                    unmarshaller = null;
                    break;
                case SpreadsheetMetadata.SPREADSHEET_NAME:
                    unmarshaller = SpreadsheetName.fromJson;
                    break;
                case SpreadsheetMetadata.STYLE:
                    unmarshaller = TextStyle.fromJson;
                    break;
                case SpreadsheetMetadata.VIEWPORT_CELL:
                    unmarshaller = SpreadsheetCellReference.fromJson;
                    break;
                case SpreadsheetMetadata.VIEWPORT_COORDINATES:
                    unmarshaller = SpreadsheetCoordinates.fromJson;
                    break;
                case SpreadsheetMetadata.ROUNDING_MODE:
                case SpreadsheetMetadata.TEXT_FORMAT_PATTERN:
                case SpreadsheetMetadata.TIME_FORMAT_PATTERN:
                case SpreadsheetMetadata.TIME_PARSE_PATTERNS:
                case SpreadsheetMetadata.TWO_DIGIT_YEAR:
                case SpreadsheetMetadata.WIDTH:
                    unmarshaller = null; // TODO types not yet implemented
                    break;
                default:
                    if(key.startsWith("color-")){
                        break;
                    }
                    throw new Error("Unknown property \"" + key + "\"");
            }
            properties[key] = (unmarshaller && unmarshaller(value)) ||
                typed ||
                value;
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
        if(typeof value === "undefined"){
            throw new Error("Missing \"" + property + "\" " + this);
        }
        return value;
    }

    /**
     * General purpose getter with support for checking
     */
    get(property) {
        if(!property){
            throw new Error("Missing property");
        }
        if(typeof property !== "string"){
            throw new Error("Expected string property but got " + property);
        }

        var value = this.properties[property];

        if(typeof value === "undefined"){
            const defaults = this.properties[DEFAULTS];
            if(defaults){
                value = defaults.get(property);
            }
        }

        return value;
    }

    /**
     * Would be setter that returns a new SpreadsheetMetadata if the new value is different from the previous.
     */
    set(property, value) {
        if(!property){
            throw new Error("Missing property");
        }
        if(!value && value !== 0 && value !== ""){
            throw new Error("Missing value");
        }

        let expectedClass;
        let expectedTypeOf;

        switch(property) {
            case SpreadsheetMetadata.CREATE_DATE_TIME:
                setFails(property);
                break;
            case SpreadsheetMetadata.CREATOR:
                setFails(property);
                break;
            case SpreadsheetMetadata.CURRENCY_SYMBOL:
                checkCurrencySymbol(value);
                expectedTypeOf = "string";
                break;
            case DEFAULTS:
                expectedClass = SpreadsheetMetadata;
                break;
            case SpreadsheetMetadata.DATE_FORMAT_PATTERN:
            case SpreadsheetMetadata.DATE_PARSE_PATTERNS:
                expectedClass = SpreadsheetPattern;
                break;
            case SpreadsheetMetadata.DATETIME_OFFSET:
                expectedTypeOf = "number";
                break;
            case SpreadsheetMetadata.DATETIME_FORMAT_PATTERN:
            case SpreadsheetMetadata.DATETIME_PARSE_PATTERNS:
                expectedClass = SpreadsheetPattern;
                break;
            case SpreadsheetMetadata.DECIMAL_SEPARATOR:
                expectedClass = Character;
                break;
            case SpreadsheetMetadata.EDIT_CELL:
                expectedClass = SpreadsheetCellReference;
                break;
            case SpreadsheetMetadata.EDIT_RANGE:
                expectedClass = SpreadsheetRange;
                break;
            case SpreadsheetMetadata.EXPONENT_SYMBOL:
                expectedClass = Character;
                break;
            case SpreadsheetMetadata.EXPRESSION_NUMBER_KIND:
                expectedClass = ExpressionNumberKind;
                break;
            case SpreadsheetMetadata.GROUPING_SEPARATOR:
                expectedClass = Character;
                break;
            case SpreadsheetMetadata.LOCALE:
                expectedClass = Locale;
                break;
            case SpreadsheetMetadata.MODIFIED_DATE_TIME:
                setFails(property);
                break;
            case SpreadsheetMetadata.MODIFIED_BY:
                setFails(property);
                break;
            case SpreadsheetMetadata.NEGATIVE_SIGN:
                expectedClass = Character;
                break;
            case SpreadsheetMetadata.NUMBER_FORMAT_PATTERN:
            case SpreadsheetMetadata.NUMBER_PARSE_PATTERNS:
                expectedClass = SpreadsheetPattern;
                break;
            case SpreadsheetMetadata.PERCENTAGE_SYMBOL:
            case SpreadsheetMetadata.POSITIVE_SIGN:
                expectedClass = Character;
                break;
            case SpreadsheetMetadata.PRECISION:
                checkPrecision(value);
                expectedTypeOf = "number";
                break;
            case SpreadsheetMetadata.SPREADSHEET_ID:
                setFails(property);
                break;
            case SpreadsheetMetadata.SPREADSHEET_NAME:
                expectedClass = SpreadsheetName;
                break;
            case SpreadsheetMetadata.STYLE:
                expectedClass = TextStyle;
                break;
            case SpreadsheetMetadata.VIEWPORT_CELL:
                expectedClass = SpreadsheetCellReference;
                break;
            case SpreadsheetMetadata.VIEWPORT_COORDINATES:
                expectedClass = SpreadsheetCoordinates;
                break;
            case SpreadsheetMetadata.ROUNDING_MODE:
            case SpreadsheetMetadata.TEXT_FORMAT_PATTERN:
            case SpreadsheetMetadata.TIME_FORMAT_PATTERN:
            case SpreadsheetMetadata.TIME_PARSE_PATTERNS:
            case SpreadsheetMetadata.TWO_DIGIT_YEAR:
            case SpreadsheetMetadata.WIDTH:
                expectedClass = null; // TODO properties not yet supported
                break;
            default:
                if(property.startsWith("color-")){
                    break;
                }
                throw new Error("Unknown property \"" + property + "\"");
        }
        if((expectedTypeOf && typeof (value) !== expectedTypeOf)){
            throw new Error("Expected " + expectedTypeOf + " property " + property + " got " + value);
        }
        if((expectedClass === Number && Number.isNaN(value)) ||
            (typeof expectedClass === "function" && !(value instanceof expectedClass))){
            throw new Error("Expected " + expectedClass.name + " property " + property + " got " + value);
        }

        return (Equality.safeEquals(value, this.get(property))) ?
            this :
            copyAndSet(this.properties, property, value);
    }

    /**
     * Would be remover that returns a new SpreadsheetMetadata if the removed value was already absent.
     */
    remove(property) {
        if(!property){
            throw new Error("Missing property");
        }
        if(typeof property !== "string"){
            throw new Error("Expected string property got " + property);
        }

        switch(property) {
            case SpreadsheetMetadata.EDIT_CELL:
            case SpreadsheetMetadata.EDIT_RANGE:
                break;
            case SpreadsheetMetadata.DEFAULTS:
            case SpreadsheetMetadata.CREATOR:
            case SpreadsheetMetadata.CREATE_DATE_TIME:
            case SpreadsheetMetadata.CURRENCY_SYMBOL:
            case SpreadsheetMetadata.DATE_FORMAT_PATTERN:
            case SpreadsheetMetadata.DATE_PARSE_PATTERNS:
            case SpreadsheetMetadata.DATETIME_OFFSET:
            case SpreadsheetMetadata.DATETIME_FORMAT_PATTERN:
            case SpreadsheetMetadata.DATETIME_PARSE_PATTERNS:
            case SpreadsheetMetadata.DECIMAL_SEPARATOR:
            case SpreadsheetMetadata.EXPONENT_SYMBOL:
            case SpreadsheetMetadata.EXPRESSION_NUMBER_KIND:
            case SpreadsheetMetadata.GROUPING_SEPARATOR:
            case SpreadsheetMetadata.LOCALE:
            case SpreadsheetMetadata.MODIFIED_BY:
            case SpreadsheetMetadata.MODIFIED_DATE_TIME:
            case SpreadsheetMetadata.NEGATIVE_SIGN:
            case SpreadsheetMetadata.NUMBER_FORMAT_PATTERN:
            case SpreadsheetMetadata.NUMBER_PARSE_PATTERNS:
            case SpreadsheetMetadata.PERCENTAGE_SYMBOL:
            case SpreadsheetMetadata.POSITIVE_SIGN:
            case SpreadsheetMetadata.ROUNDING_MODE:
            case SpreadsheetMetadata.PRECISION:
            case SpreadsheetMetadata.SPREADSHEET_ID:
            case SpreadsheetMetadata.SPREADSHEET_NAME:
            case SpreadsheetMetadata.STYLE:
            case SpreadsheetMetadata.TEXT_FORMAT_PATTERN:
            case SpreadsheetMetadata.TIME_FORMAT_PATTERN:
            case SpreadsheetMetadata.TIME_PARSE_PATTERNS:
            case SpreadsheetMetadata.TWO_DIGIT_YEAR:
            case SpreadsheetMetadata.VIEWPORT_CELL:
            case SpreadsheetMetadata.VIEWPORT_COORDINATES:
            case SpreadsheetMetadata.WIDTH:
                throw new Error("Property \"" + property + "\" cannot be removed, " + this);
            default:
                if(property.startsWith("color-")){
                    break;
                }
                throw new Error("Unknown property \"" + property + "\"");
        }
        return (typeof this.get(property) === "undefined") ?
            this :
            copyAndRemove(this.properties, property);
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
        if(!defaultSpreadsheetMetadata){
            throw new Error("Missing SpreadsheetMetadata");
        }
        if(!(defaultSpreadsheetMetadata instanceof SpreadsheetMetadata)){
            throw new Error("Expected SpreadsheetMetadata got " + defaultSpreadsheetMetadata);
        }
        return this.set(DEFAULTS, defaultSpreadsheetMetadata);
    }

    /**
     * Returns this metadata as a JSON object. This must be JSON.stringify for use in JSON calls
     */
    toJson() {
        const json = {};

        for(const [key, value] of Object.entries(this.properties)) {
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
    if(keys.length === Object.keys(other.properties).length){
        equals = true;

        for(const key of keys) {
            equals = Equality.safeEquals(metadata.get(key), other.get(key));
            if(!equals){
                break;
            }
        }
    }

    return equals;
}

function checkCurrencySymbol(currencySymbol) {
    if(typeof currencySymbol !== "string"){
        throw new Error("Expected string currency got " + currencySymbol);
    }
}

function checkPrecision(precision) {
    if(typeof precision !== "number"){
        throw new Error("Expected number precision got " + precision);
    }
    if(precision <= 0){
        throw new Error("Expected number precision > 0 got " + precision);
    }
}

function setFails(propertyName) {
    throw new Error("set \"" + propertyName + "\" is not allowed");
}