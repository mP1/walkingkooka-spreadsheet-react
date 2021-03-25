import Character from "../../Character.js";
import EmailAddress from "../../net/EmailAddress.js";
import Equality from "../../Equality.js";
import ExpressionNumberKind from "../../math/ExpressionNumberKind.js";
import LocalDate from "../../datetime/LocalDate.js";
import LocalDateTime from "../../datetime/LocalDateTime.js";
import LocalTime from "../../datetime/LocalTime.js";
import Locale from "../../util/Locale.js";
import RoundingMode from "../../math/RoundingMode.js";
import SpreadsheetCoordinates from "../SpreadsheetCoordinates";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference";
import SpreadsheetName from "../SpreadsheetName";
import SpreadsheetDateFormatPattern from "../format/SpreadsheetDateFormatPattern.js";
import SpreadsheetDateParsePatterns from "../format/SpreadsheetDateParsePatterns.js";
import SpreadsheetDateTimeFormatPattern from "../format/SpreadsheetDateTimeFormatPattern.js";
import SpreadsheetDateTimeParsePatterns from "../format/SpreadsheetDateTimeParsePatterns.js";
import SpreadsheetNumberFormatPattern from "../format/SpreadsheetNumberFormatPattern.js";
import SpreadsheetNumberParsePatterns from "../format/SpreadsheetNumberParsePatterns.js";
import SpreadsheetRange from "../reference/SpreadsheetRange.js";
import SpreadsheetTextFormatPattern from "../format/SpreadsheetTextFormatPattern.js";
import SpreadsheetTimeFormatPattern from "../format/SpreadsheetTimeFormatPattern.js";
import SpreadsheetTimeParsePatterns from "../format/SpreadsheetTimeParsePatterns.js";
import SystemObject from "../../SystemObject.js";
import TextStyle from "../../text/TextStyle";

/**
 * Verifies the given property is a known property.
 */
function checkProperty(property) {
    if(!property){
        throw new Error("Missing property");
    }
    if(typeof property !== "string"){
        throw new Error("Expected string property got " + property);
    }

    switch(property) {
        case SpreadsheetMetadata.CELL_CHARACTER_WIDTH:
        case SpreadsheetMetadata.CREATE_DATE_TIME:
        case SpreadsheetMetadata.CREATOR:
        case SpreadsheetMetadata.CURRENCY_SYMBOL:
        case SpreadsheetMetadata.DATE_FORMAT_PATTERN:
        case SpreadsheetMetadata.DATE_PARSE_PATTERNS:
        case SpreadsheetMetadata.DATETIME_OFFSET:
        case SpreadsheetMetadata.DATETIME_FORMAT_PATTERN:
        case SpreadsheetMetadata.DATETIME_PARSE_PATTERNS:
        case SpreadsheetMetadata.DEFAULTS:
        case SpreadsheetMetadata.DECIMAL_SEPARATOR:
        case SpreadsheetMetadata.DEFAULT_YEAR:
        case SpreadsheetMetadata.EDIT_CELL:
        case SpreadsheetMetadata.EDIT_RANGE:
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
        case SpreadsheetMetadata.PRECISION:
        case SpreadsheetMetadata.SPREADSHEET_ID:
        case SpreadsheetMetadata.ROUNDING_MODE:
        case SpreadsheetMetadata.SPREADSHEET_NAME:
        case SpreadsheetMetadata.STYLE:
        case SpreadsheetMetadata.TEXT_FORMAT_PATTERN:
        case SpreadsheetMetadata.TIME_FORMAT_PATTERN:
        case SpreadsheetMetadata.TIME_PARSE_PATTERNS:
        case SpreadsheetMetadata.TWO_DIGIT_YEAR:
        case SpreadsheetMetadata.VALUE_SEPARATOR:
        case SpreadsheetMetadata.VIEWPORT_CELL:
        case SpreadsheetMetadata.VIEWPORT_COORDINATES:
            break;
        default:
            if(property.startsWith("color-")){
                break;
            }
            throw new Error("Unknown property \"" + property + "\"");
    }
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

const TYPE_NAME = "spreadsheet-metadata";

/**
 * Immutable SpreadsheetMetadata, with getters and would be setters. Note that getting properties ignores any defaults.
 */
export default class SpreadsheetMetadata extends SystemObject {

    static CELL_CHARACTER_WIDTH = "cell-character-width";
    static CREATOR = "creator";
    static CREATE_DATE_TIME = "create-date-time";
    static CURRENCY_SYMBOL = "currency-symbol";
    static DATE_FORMAT_PATTERN = "date-format-pattern";
    static DATE_PARSE_PATTERNS = "date-parse-patterns";
    static DATETIME_OFFSET = "date-time-offset";
    static DATETIME_FORMAT_PATTERN = "date-time-format-pattern";
    static DATETIME_PARSE_PATTERNS = "date-time-parse-patterns";
    static DECIMAL_SEPARATOR = "decimal-separator";
    static DEFAULTS = "_defaults";
    static DEFAULT_YEAR = "default-year";
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
    static VALUE_SEPARATOR = "value-separator";
    static VIEWPORT_CELL = "viewport-cell";
    static VIEWPORT_COORDINATES = "viewport-coordinates";

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
                case SpreadsheetMetadata.CELL_CHARACTER_WIDTH:
                    checkCellCharacterWidth(value);
                    typed = value;
                    break;
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
                    unmarshaller = SpreadsheetDateFormatPattern.fromJson;
                    break;
                case SpreadsheetMetadata.DATE_PARSE_PATTERNS:
                    unmarshaller = SpreadsheetDateParsePatterns.fromJson;
                    break;
                case SpreadsheetMetadata.DATETIME_OFFSET:
                    typed = value;
                    break;
                case SpreadsheetMetadata.DATETIME_FORMAT_PATTERN:
                    unmarshaller = SpreadsheetDateTimeFormatPattern.fromJson;
                    break;
                case SpreadsheetMetadata.DATETIME_PARSE_PATTERNS:
                    unmarshaller = SpreadsheetDateTimeParsePatterns.fromJson;
                    break;
                case SpreadsheetMetadata.DEFAULTS:
                    unmarshaller = SpreadsheetMetadata.fromJson;
                    break;
                case SpreadsheetMetadata.DECIMAL_SEPARATOR:
                    unmarshaller = Character.fromJson;
                    break;
                case SpreadsheetMetadata.DEFAULT_YEAR:
                    typed = value;
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
                    unmarshaller = SpreadsheetNumberFormatPattern.fromJson;
                    break;
                case SpreadsheetMetadata.NUMBER_PARSE_PATTERNS:
                    unmarshaller = SpreadsheetNumberParsePatterns.fromJson;
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
                case SpreadsheetMetadata.ROUNDING_MODE:
                    unmarshaller = RoundingMode.fromJson;
                    break;
                case SpreadsheetMetadata.SPREADSHEET_NAME:
                    unmarshaller = SpreadsheetName.fromJson;
                    break;
                case SpreadsheetMetadata.STYLE:
                    unmarshaller = TextStyle.fromJson;
                    break;
                case SpreadsheetMetadata.TEXT_FORMAT_PATTERN:
                    unmarshaller = SpreadsheetTextFormatPattern.fromJson;
                    break;
                case SpreadsheetMetadata.TIME_FORMAT_PATTERN:
                    unmarshaller = SpreadsheetTimeFormatPattern.fromJson;
                    break;
                case SpreadsheetMetadata.TIME_PARSE_PATTERNS:
                    unmarshaller = SpreadsheetTimeParsePatterns.fromJson;
                    break;
                case SpreadsheetMetadata.TWO_DIGIT_YEAR:
                    checkTwoDigitYear(value);
                    typed = value;
                    break;
                case SpreadsheetMetadata.VALUE_SEPARATOR:
                    unmarshaller = Character.fromJson;
                    break;
                case SpreadsheetMetadata.VIEWPORT_CELL:
                    unmarshaller = SpreadsheetCellReference.fromJson;
                    break;
                case SpreadsheetMetadata.VIEWPORT_COORDINATES:
                    unmarshaller = SpreadsheetCoordinates.fromJson;
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
        super();
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
     * General purpose getter which unlike the java version of this class ignores the defaults if the property is missing.
     */
    get(property) {
        checkProperty(property);
        return this.properties[property];
    }

    /**
     * Would be setter that returns a new SpreadsheetMetadata if the new value is different from the previous.
     */
    set(property, value) {
        checkProperty(property);
        if(null == value){
            throw new Error("Property \"" + property + "\" missing value");
        }

        let expectedClass;
        let expectedTypeOf;

        switch(property) {
            case SpreadsheetMetadata.CELL_CHARACTER_WIDTH:
                checkCellCharacterWidth(value);
                expectedTypeOf = "number";
                break;
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
            case SpreadsheetMetadata.DEFAULTS:
                expectedClass = SpreadsheetMetadata;
                break;
            case SpreadsheetMetadata.DATE_FORMAT_PATTERN:
                expectedClass = SpreadsheetDateFormatPattern;
                break;
            case SpreadsheetMetadata.DATE_PARSE_PATTERNS:
                expectedClass = SpreadsheetDateParsePatterns;
                break;
            case SpreadsheetMetadata.DATETIME_OFFSET:
                expectedTypeOf = "number";
                break;
            case SpreadsheetMetadata.DATETIME_FORMAT_PATTERN:
                expectedClass = SpreadsheetDateTimeFormatPattern;
                break;
            case SpreadsheetMetadata.DATETIME_PARSE_PATTERNS:
                expectedClass = SpreadsheetDateTimeParsePatterns;
                break;
            case SpreadsheetMetadata.DECIMAL_SEPARATOR:
                checkCharacter(value);
                break;
            case SpreadsheetMetadata.DEFAULT_YEAR:
                expectedTypeOf = "number";
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
                checkCharacter(value);
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
                checkCharacter(value);
                break;
            case SpreadsheetMetadata.NUMBER_FORMAT_PATTERN:
                expectedClass = SpreadsheetNumberFormatPattern;
                break;
            case SpreadsheetMetadata.NUMBER_PARSE_PATTERNS:
                expectedClass = SpreadsheetNumberParsePatterns;
                break;
            case SpreadsheetMetadata.PERCENTAGE_SYMBOL:
            case SpreadsheetMetadata.POSITIVE_SIGN:
                checkCharacter(value);
                break;
            case SpreadsheetMetadata.PRECISION:
                checkPrecision(value);
                expectedTypeOf = "number";
                break;
            case SpreadsheetMetadata.ROUNDING_MODE:
                expectedClass = RoundingMode;
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
            case SpreadsheetMetadata.TEXT_FORMAT_PATTERN:
                expectedClass = SpreadsheetTextFormatPattern;
                break;
            case SpreadsheetMetadata.TIME_FORMAT_PATTERN:
                expectedClass = SpreadsheetTimeFormatPattern;
                break;
            case SpreadsheetMetadata.TIME_PARSE_PATTERNS:
                expectedClass = SpreadsheetTimeParsePatterns;
                break;
            case SpreadsheetMetadata.TWO_DIGIT_YEAR:
                checkTwoDigitYear(value);
                expectedTypeOf = "number";
                break;
            case SpreadsheetMetadata.VALUE_SEPARATOR:
                checkCharacter(value);
                break;
            case SpreadsheetMetadata.VIEWPORT_CELL:
                expectedClass = SpreadsheetCellReference;
                break;
            case SpreadsheetMetadata.VIEWPORT_COORDINATES:
                expectedClass = SpreadsheetCoordinates;
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
        checkProperty(property);

        switch(property) {
            case SpreadsheetMetadata.CELL_CHARACTER_WIDTH:
            case SpreadsheetMetadata.CURRENCY_SYMBOL:
            case SpreadsheetMetadata.DATE_FORMAT_PATTERN:
            case SpreadsheetMetadata.DATE_PARSE_PATTERNS:
            case SpreadsheetMetadata.DATETIME_FORMAT_PATTERN:
            case SpreadsheetMetadata.DATETIME_PARSE_PATTERNS:
            case SpreadsheetMetadata.DECIMAL_SEPARATOR:
            case SpreadsheetMetadata.DEFAULT_YEAR:
            case SpreadsheetMetadata.EDIT_CELL:
            case SpreadsheetMetadata.EDIT_RANGE:
            case SpreadsheetMetadata.EXPONENT_SYMBOL:
            case SpreadsheetMetadata.EXPRESSION_NUMBER_KIND:
            case SpreadsheetMetadata.GROUPING_SEPARATOR:
            case SpreadsheetMetadata.NEGATIVE_SIGN:
            case SpreadsheetMetadata.NUMBER_FORMAT_PATTERN:
            case SpreadsheetMetadata.NUMBER_PARSE_PATTERNS:
            case SpreadsheetMetadata.PERCENTAGE_SYMBOL:
            case SpreadsheetMetadata.POSITIVE_SIGN:
            case SpreadsheetMetadata.ROUNDING_MODE:
            case SpreadsheetMetadata.PRECISION:
            case SpreadsheetMetadata.TEXT_FORMAT_PATTERN:
            case SpreadsheetMetadata.TIME_FORMAT_PATTERN:
            case SpreadsheetMetadata.TIME_PARSE_PATTERNS:
            case SpreadsheetMetadata.TWO_DIGIT_YEAR:
            case SpreadsheetMetadata.VALUE_SEPARATOR:
                break;
            case SpreadsheetMetadata.CREATOR:
            case SpreadsheetMetadata.CREATE_DATE_TIME:
            case SpreadsheetMetadata.DATETIME_OFFSET:
            case SpreadsheetMetadata.DEFAULTS:
            case SpreadsheetMetadata.LOCALE:
            case SpreadsheetMetadata.MODIFIED_BY:
            case SpreadsheetMetadata.MODIFIED_DATE_TIME:
            case SpreadsheetMetadata.SPREADSHEET_ID:
            case SpreadsheetMetadata.SPREADSHEET_NAME:
            case SpreadsheetMetadata.STYLE:
            case SpreadsheetMetadata.VIEWPORT_CELL:
            case SpreadsheetMetadata.VIEWPORT_COORDINATES:
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
     * Returns a {@link TextStyle} that merges the current and default style.
     */
    effectiveStyle() {
        var style = this.get(SpreadsheetMetadata.STYLE);
        if(!style){
            style = TextStyle.EMPTY;
        }
        const defaultMetadata = this.get(SpreadsheetMetadata.DEFAULTS);
        if(defaultMetadata){
            const defaultStyle = defaultMetadata.get(SpreadsheetMetadata.STYLE) || TextStyle.EMPTY;
            style = defaultStyle.merge(style);
        }
        return style;
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

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return equals0(this, other, PROPERTIES);
    }

    equalsMost(other) {
        return equals0(this, other, MOST_PROPERTIES);
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

/**
 * An array of all properties.
 */
const PROPERTIES = [
    SpreadsheetMetadata.CELL_CHARACTER_WIDTH,
    SpreadsheetMetadata.CREATOR,
    SpreadsheetMetadata.CREATE_DATE_TIME,
    SpreadsheetMetadata.CURRENCY_SYMBOL,
    SpreadsheetMetadata.DATE_FORMAT_PATTERN,
    SpreadsheetMetadata.DATE_PARSE_PATTERNS,
    SpreadsheetMetadata.DATETIME_OFFSET,
    SpreadsheetMetadata.DATETIME_FORMAT_PATTERN,
    SpreadsheetMetadata.DATETIME_PARSE_PATTERNS,
    SpreadsheetMetadata.DECIMAL_SEPARATOR,
    SpreadsheetMetadata.DEFAULTS,
    SpreadsheetMetadata.DEFAULT_YEAR,
    SpreadsheetMetadata.EXPONENT_SYMBOL,
    SpreadsheetMetadata.EDIT_CELL,
    SpreadsheetMetadata.EDIT_RANGE,
    SpreadsheetMetadata.EXPRESSION_NUMBER_KIND,
    SpreadsheetMetadata.GROUPING_SEPARATOR,
    SpreadsheetMetadata.LOCALE,
    SpreadsheetMetadata.MODIFIED_BY,
    SpreadsheetMetadata.MODIFIED_DATE_TIME,
    SpreadsheetMetadata.NEGATIVE_SIGN,
    SpreadsheetMetadata.NUMBER_FORMAT_PATTERN,
    SpreadsheetMetadata.NUMBER_PARSE_PATTERNS,
    SpreadsheetMetadata.PERCENTAGE_SYMBOL,
    SpreadsheetMetadata.POSITIVE_SIGN,
    SpreadsheetMetadata.ROUNDING_MODE,
    SpreadsheetMetadata.PRECISION,
    SpreadsheetMetadata.SPREADSHEET_ID,
    SpreadsheetMetadata.SPREADSHEET_NAME,
    SpreadsheetMetadata.STYLE,
    SpreadsheetMetadata.TEXT_FORMAT_PATTERN,
    SpreadsheetMetadata.TIME_FORMAT_PATTERN,
    SpreadsheetMetadata.TIME_PARSE_PATTERNS,
    SpreadsheetMetadata.TWO_DIGIT_YEAR,
    SpreadsheetMetadata.VALUE_SEPARATOR,
    SpreadsheetMetadata.VIEWPORT_CELL,
    SpreadsheetMetadata.VIEWPORT_COORDINATES,
];

/**
 * Used when comparing two metadata ignoring a few properties that are unimportant when deciding if a viewport cells should be reloaded.
 */
const MOST_PROPERTIES = PROPERTIES.filter(p => {
    var keep;
    switch(p) {
        case SpreadsheetMetadata.CREATOR:
        case SpreadsheetMetadata.CREATE_DATE_TIME:
        case SpreadsheetMetadata.MODIFIED_BY:
        case SpreadsheetMetadata.MODIFIED_DATE_TIME:
        case SpreadsheetMetadata.SPREADSHEET_ID:
        case SpreadsheetMetadata.SPREADSHEET_NAME:
            keep = false;
            break;
        default:
            keep = true;
    }
    return keep;
});

function equals0(self, other, required) {
    return self === other || (other instanceof SpreadsheetMetadata && equals1(self, other, required));
}

/**
 * Tests the required entries in both SpreadsheetMetadata for equality.
 */
function equals1(metadata, other, required) {
    var equals = false;

    const properties = metadata.properties;
    const otherProperties = other.properties;

    // if required === IGNORED_PROPERTIES must test all individual properties...
    if(required === MOST_PROPERTIES || Object.keys(properties).length === Object.keys(otherProperties).length){
        equals = true;

        for(const property of required) {
            equals = Equality.safeEquals(properties[property], otherProperties[property]);
            if(!equals){
                break;
            }
        }
    }

    return equals;
}

function checkCharacter(character) {
    if(!(character instanceof Character) || "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~".indexOf(character.text()) === -1){
        throw new Error("Expected symbol got " + character);
    }
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
    if(precision < 0){
        throw new Error("Expected number precision >= 0 got " + precision);
    }
}

function checkTwoDigitYear(twoDigitYear) {
    if(typeof twoDigitYear !== "number"){
        throw new Error("Expected number twoDigitYear got " + twoDigitYear);
    }
    if(twoDigitYear < 0 || twoDigitYear > 99){
        throw new Error("Expected number twoDigitYear >= 0 and <= 99 got " + twoDigitYear);
    }
}

function checkCellCharacterWidth(width) {
    if(typeof width !== "number"){
        throw new Error("Expected number width got " + width);
    }
    if(width <= 0){
        throw new Error("Expected number width > 0 got " + width);
    }
}

function setFails(propertyName) {
    throw new Error("set \"" + propertyName + "\" is not allowed");
}

/**
 * Creates a new SpreadsheetMetadata and sets or replaces the new property/value pair.
 */
function copyAndSet(properties,
                    property,
                    value) {
    const copy = Object.assign({}, properties);

    switch(property) {
        case SpreadsheetMetadata.DECIMAL_SEPARATOR:
        case SpreadsheetMetadata.GROUPING_SEPARATOR:
        case SpreadsheetMetadata.NEGATIVE_SIGN:
        case SpreadsheetMetadata.PERCENTAGE_SYMBOL:
        case SpreadsheetMetadata.POSITIVE_SIGN:
        case SpreadsheetMetadata.VALUE_SEPARATOR:
            const previous = properties[property];

            // try and find another property with the same value
            for(const i in SWAPPABLE_PROPERTIES) {
                const possible = SWAPPABLE_PROPERTIES[i];
                if(property === possible){
                    continue;
                }
                // found another property with $value, swap is necessary
                if(value.equals(copy[possible])){
                    if(!previous){
                        if(!(isGroupingSeparatorOrValueSeparator(property) && isGroupingSeparatorOrValueSeparator(possible))){
                            throw new Error("Cannot set " + property + "=" + value + " duplicate of " + possible);
                        }
                    }else {
                        copy[possible] = previous;
                    }
                }
            }
            break;
        default:
            break;
    }

    copy[property] = value;

    return new SpreadsheetMetadata(copy);
}

function isGroupingSeparatorOrValueSeparator(property) {
    return SpreadsheetMetadata.GROUPING_SEPARATOR === property || SpreadsheetMetadata.VALUE_SEPARATOR === property;
}

const SWAPPABLE_PROPERTIES = [
    SpreadsheetMetadata.DECIMAL_SEPARATOR,
    SpreadsheetMetadata.GROUPING_SEPARATOR,
    SpreadsheetMetadata.NEGATIVE_SIGN,
    SpreadsheetMetadata.PERCENTAGE_SYMBOL,
    SpreadsheetMetadata.POSITIVE_SIGN,
    SpreadsheetMetadata.VALUE_SEPARATOR,
];

// json.................................................................................................................

SystemObject.register(TYPE_NAME, SpreadsheetMetadata.fromJson);

// force each class to call SystemObject.register
// eslint-disable-next-line no-unused-expressions
LocalDate.prototype;
// eslint-disable-next-line no-unused-expressions
LocalDateTime.prototype;
// eslint-disable-next-line no-unused-expressions
LocalTime.prototype;