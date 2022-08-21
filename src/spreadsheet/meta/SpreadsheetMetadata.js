import Character from "../../Character.js";
import EmailAddress from "../../net/EmailAddress.js";
import Equality from "../../Equality.js";
import ExpressionNumberKind from "../../math/ExpressionNumberKind.js";
import LocalDate from "../../datetime/LocalDate.js";
import LocalDateTime from "../../datetime/LocalDateTime.js";
import LocalTime from "../../datetime/LocalTime.js";
import Locale from "../../util/Locale.js";
import Preconditions from "../../Preconditions.js";
import RoundingMode from "../../math/RoundingMode.js";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference";
import SpreadsheetColumnReferenceRange from "../reference/SpreadsheetColumnReferenceRange.js";
import SpreadsheetName from "../name/SpreadsheetName.js";
import SpreadsheetDateFormatPattern from "../format/SpreadsheetDateFormatPattern.js";
import SpreadsheetDateParsePatterns from "../format/SpreadsheetDateParsePatterns.js";
import SpreadsheetDateTimeFormatPattern from "../format/SpreadsheetDateTimeFormatPattern.js";
import SpreadsheetDateTimeParsePatterns from "../format/SpreadsheetDateTimeParsePatterns.js";
import SpreadsheetNumberFormatPattern from "../format/SpreadsheetNumberFormatPattern.js";
import SpreadsheetNumberParsePatterns from "../format/SpreadsheetNumberParsePatterns.js";
import SpreadsheetRowReferenceRange from "../reference/SpreadsheetRowReferenceRange.js";
import SpreadsheetTextFormatPattern from "../format/SpreadsheetTextFormatPattern.js";
import SpreadsheetTimeFormatPattern from "../format/SpreadsheetTimeFormatPattern.js";
import SpreadsheetTimeParsePatterns from "../format/SpreadsheetTimeParsePatterns.js";
import SpreadsheetViewportSelection from "../reference/viewport/SpreadsheetViewportSelection.js";
import SystemObject from "../../SystemObject.js";
import TextStyle from "../../text/TextStyle";

/**
 * Verifies the given property name is a known property.
 */
function checkPropertyName(propertyName) {
    Preconditions.requireText(propertyName, "propertyName");

    switch(propertyName) {
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
        case SpreadsheetMetadata.EXPONENT_SYMBOL:
        case SpreadsheetMetadata.EXPRESSION_NUMBER_KIND:
        case SpreadsheetMetadata.FROZEN_COLUMNS:
        case SpreadsheetMetadata.FROZEN_ROWS:
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
        case SpreadsheetMetadata.SELECTION:
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
            if(propertyName.startsWith("color-")){
                break;
            }
            throw new Error("Unknown propertyName \"" + propertyName + "\"");
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
    static EXPRESSION_NUMBER_KIND = "expression-number-kind";
    static FROZEN_COLUMNS = "frozen-columns";
    static FROZEN_ROWS = "frozen-rows";
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
    static SELECTION = "selection";
    static SPREADSHEET_ID = "spreadsheet-id";
    static SPREADSHEET_NAME = "spreadsheet-name";
    static STYLE = "style";
    static TEXT_FORMAT_PATTERN = "text-format-pattern";
    static TIME_FORMAT_PATTERN = "time-format-pattern";
    static TIME_PARSE_PATTERNS = "time-parse-patterns";
    static TWO_DIGIT_YEAR = "two-digit-year";
    static VALUE_SEPARATOR = "value-separator";
    static VIEWPORT_CELL = "viewport-cell";

    /**
     * Returns all property names.
     */
    static properties() {
        return [
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
            SpreadsheetMetadata.EXPRESSION_NUMBER_KIND,
            SpreadsheetMetadata.FROZEN_COLUMNS,
            SpreadsheetMetadata.FROZEN_ROWS,
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
            SpreadsheetMetadata.SELECTION,
            SpreadsheetMetadata.SPREADSHEET_ID,
            SpreadsheetMetadata.SPREADSHEET_NAME,
            SpreadsheetMetadata.STYLE,
            SpreadsheetMetadata.TEXT_FORMAT_PATTERN,
            SpreadsheetMetadata.TIME_FORMAT_PATTERN,
            SpreadsheetMetadata.TIME_PARSE_PATTERNS,
            SpreadsheetMetadata.TWO_DIGIT_YEAR,
            SpreadsheetMetadata.VALUE_SEPARATOR,
            SpreadsheetMetadata.VIEWPORT_CELL,
        ];
    }
    
    /**
     * Tests if the property name is a valid property.
     */
    static isProperty(property) {
        let is;

        switch(property) {
            case SpreadsheetMetadata.CELL_CHARACTER_WIDTH :
            case SpreadsheetMetadata.CREATOR :
            case SpreadsheetMetadata.CREATE_DATE_TIME :
            case SpreadsheetMetadata.CURRENCY_SYMBOL :
            case SpreadsheetMetadata.DATE_FORMAT_PATTERN :
            case SpreadsheetMetadata.DATE_PARSE_PATTERNS :
            case SpreadsheetMetadata.DATETIME_OFFSET :
            case SpreadsheetMetadata.DATETIME_FORMAT_PATTERN :
            case SpreadsheetMetadata.DATETIME_PARSE_PATTERNS :
            case SpreadsheetMetadata.DECIMAL_SEPARATOR :
            case SpreadsheetMetadata.DEFAULTS :
            case SpreadsheetMetadata.DEFAULT_YEAR :
            case SpreadsheetMetadata.EXPONENT_SYMBOL :
            case SpreadsheetMetadata.EXPRESSION_NUMBER_KIND :
            case SpreadsheetMetadata.FROZEN_COLUMNS :
            case SpreadsheetMetadata.FROZEN_ROWS :
            case SpreadsheetMetadata.GROUPING_SEPARATOR :
            case SpreadsheetMetadata.LOCALE :
            case SpreadsheetMetadata.MODIFIED_BY :
            case SpreadsheetMetadata.MODIFIED_DATE_TIME :
            case SpreadsheetMetadata.NEGATIVE_SIGN :
            case SpreadsheetMetadata.NUMBER_FORMAT_PATTERN :
            case SpreadsheetMetadata.NUMBER_PARSE_PATTERNS :
            case SpreadsheetMetadata.PERCENTAGE_SYMBOL :
            case SpreadsheetMetadata.POSITIVE_SIGN :
            case SpreadsheetMetadata.PRECISION :
            case SpreadsheetMetadata.ROUNDING_MODE :
            case SpreadsheetMetadata.SELECTION :
            case SpreadsheetMetadata.SPREADSHEET_ID :
            case SpreadsheetMetadata.SPREADSHEET_NAME :
            case SpreadsheetMetadata.STYLE :
            case SpreadsheetMetadata.TEXT_FORMAT_PATTERN :
            case SpreadsheetMetadata.TIME_FORMAT_PATTERN :
            case SpreadsheetMetadata.TIME_PARSE_PATTERNS :
            case SpreadsheetMetadata.TWO_DIGIT_YEAR :
            case SpreadsheetMetadata.VALUE_SEPARATOR :
            case SpreadsheetMetadata.VIEWPORT_CELL :
                is = true;
                break;
            default:
                is = false;
                break;
        }

        return is;
    }

    static EMPTY = new SpreadsheetMetadata({});

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

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
                case SpreadsheetMetadata.EXPONENT_SYMBOL:
                    unmarshaller = Character.fromJson;
                    break;
                case SpreadsheetMetadata.EXPRESSION_NUMBER_KIND:
                    unmarshaller = ExpressionNumberKind.fromJson;
                    break;
                case SpreadsheetMetadata.FROZEN_COLUMNS:
                    unmarshaller = SpreadsheetColumnReferenceRange.fromJson;
                    break;
                case SpreadsheetMetadata.FROZEN_ROWS:
                    unmarshaller = SpreadsheetRowReferenceRange.fromJson;
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
                case SpreadsheetMetadata.ROUNDING_MODE:
                    unmarshaller = RoundingMode.fromJson;
                    break;
                case SpreadsheetMetadata.SELECTION:
                    unmarshaller = SpreadsheetViewportSelection.fromJson;
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

    getIgnoringDefaultsOrFail(propertyName) {
        const value = this.getIgnoringDefaults(propertyName);
        if(typeof value === "undefined"){
            throw new Error("Missing \"" + propertyName + "\" " + this);
        }
        return value;
    }

    /**
     * General purpose getter which unlike the java version of this class ignores the defaults if the property is missing.
     */
    getIgnoringDefaults(propertyName) {
        checkPropertyName(propertyName);
        const value = this.properties[propertyName];
        return null == value ? null : value;
    }

    get(propertyName) {
        var value = this.getIgnoringDefaults(propertyName);
        if(null == value){
            const defaults = this.properties._defaults;
            value = defaults && defaults.getIgnoringDefaults(propertyName);
        }
        return null == value ? null : value;
    }

    /**
     * Tests the value and if its null removes the property otherwise performs a set.
     */
    setOrRemove(propertyName, value) {
        return null == value ?
            this.remove(propertyName) :
            this.set(propertyName, value);
    }

    /**
     * Would be setter that returns a new SpreadsheetMetadata if the new value is different from the previous.
     */
    set(propertyName, value) {
        checkPropertyName(propertyName);
        if(null == value){
            throw new Error("Property \"" + propertyName + "\" missing value");
        }

        let expectedClass;
        let expectedTypeOf;

        switch(propertyName) {
            case SpreadsheetMetadata.CELL_CHARACTER_WIDTH:
                checkCellCharacterWidth(value);
                expectedTypeOf = "number";
                break;
            case SpreadsheetMetadata.CREATE_DATE_TIME:
                setFails(propertyName);
                break;
            case SpreadsheetMetadata.CREATOR:
                setFails(propertyName);
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
            case SpreadsheetMetadata.EXPONENT_SYMBOL:
                expectedClass = Character;
                break;
            case SpreadsheetMetadata.EXPRESSION_NUMBER_KIND:
                expectedClass = ExpressionNumberKind;
                break;
            case SpreadsheetMetadata.FROZEN_COLUMNS:
                checkFrozenColumns(value);
                expectedClass = SpreadsheetColumnReferenceRange;
                break;
            case SpreadsheetMetadata.FROZEN_ROWS:
                checkFrozenRows(value);
                expectedClass = SpreadsheetRowReferenceRange;
                break;
            case SpreadsheetMetadata.GROUPING_SEPARATOR:
                checkCharacter(value);
                break;
            case SpreadsheetMetadata.LOCALE:
                expectedClass = Locale;
                break;
            case SpreadsheetMetadata.MODIFIED_DATE_TIME:
                setFails(propertyName);
                break;
            case SpreadsheetMetadata.MODIFIED_BY:
                setFails(propertyName);
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
            case SpreadsheetMetadata.SELECTION:
                expectedClass = SpreadsheetViewportSelection;
                break;
            case SpreadsheetMetadata.SPREADSHEET_ID:
                setFails(propertyName);
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
            default:
                if(propertyName.startsWith("color-")){
                    break;
                }
                throw new Error("Unknown property \"" + propertyName + "\"");
        }
        if((expectedTypeOf && typeof (value) !== expectedTypeOf)){
            throw new Error("Expected " + expectedTypeOf + " property " + propertyName + " got " + value);
        }
        if((expectedClass === Number && Number.isNaN(value)) ||
            (typeof expectedClass === "function" && !(value instanceof expectedClass))){
            throw new Error("Expected " + expectedClass.name + " property " + propertyName + " got " + value);
        }

        return this.set0(propertyName, value);
    }

    // set and helpers copied from SpreadsheetMetadata.java

    set0(propertyName, value) {
        var result;

        if(Equality.safeEquals(value, this.get(propertyName))){
            result = this.setSameValue(propertyName, value);
        }else {
            result = this.setDifferentValue(propertyName, value);
        }

        return result;
    }

    setSameValue(propertyName, value) {
        var result = this;

        const properties = this.properties;

        // save value anyway if previousValue was from defaults.
        if(!properties.hasOwnProperty(propertyName)){
            const copy = Object.assign(
                {},
                properties
            );
            copy[propertyName] = value;

            result = new SpreadsheetMetadata(copy);
        }

        return result;
    }

    setDifferentValue(propertyName, value) {
        const previousValue = this.get(propertyName);

        // property is different or new
        const swapIfDuplicateValue = this.swapIfDuplicateValue(propertyName);

        const copy = Object.assign({}, this.properties);
        copy[propertyName] = value;

        const groupOrValue = isGroupingSeparatorOrValueSeparator(propertyName);

        if(swapIfDuplicateValue){
            for(var i = 0; i < SWAPPABLE_PROPERTY_NAMES.length; i++) {
                const duplicate = SWAPPABLE_PROPERTY_NAMES[i];
                if(propertyName === duplicate){
                    continue;
                }
                const duplicateIsGroupingOrValue = isGroupingSeparatorOrValueSeparator(duplicate);
                if(groupOrValue && duplicateIsGroupingOrValue){
                    continue;
                }

                const duplicateValue = this.get(duplicate);
                if(null != duplicateValue){
                    if(Equality.safeEquals(value, duplicateValue)){
                        if(null == previousValue){
                            if(!duplicateIsGroupingOrValue){
                                reportDuplicateProperty(propertyName, value, duplicate);
                            }
                        }else {
                            copy[duplicate] = previousValue;
                        }
                    }
                }
            }
        }

        // update and possibly swap of character properties
        return new SpreadsheetMetadata(copy);
    }

    swapIfDuplicateValue(propertyName) {
        return SWAPPABLE_PROPERTY_NAMES.includes(propertyName);
    }
    /**
     * Would be remover that returns a new SpreadsheetMetadata if the removed value was already absent.
     */
    remove(propertyName) {
        checkPropertyName(propertyName);

        switch(propertyName) {
            case SpreadsheetMetadata.CELL_CHARACTER_WIDTH:
            case SpreadsheetMetadata.CURRENCY_SYMBOL:
            case SpreadsheetMetadata.DATE_FORMAT_PATTERN:
            case SpreadsheetMetadata.DATE_PARSE_PATTERNS:
            case SpreadsheetMetadata.DATETIME_FORMAT_PATTERN:
            case SpreadsheetMetadata.DATETIME_PARSE_PATTERNS:
            case SpreadsheetMetadata.DECIMAL_SEPARATOR:
            case SpreadsheetMetadata.DEFAULT_YEAR:
            case SpreadsheetMetadata.EXPONENT_SYMBOL:
            case SpreadsheetMetadata.EXPRESSION_NUMBER_KIND:
            case SpreadsheetMetadata.FROZEN_COLUMNS:
            case SpreadsheetMetadata.FROZEN_ROWS:
            case SpreadsheetMetadata.GROUPING_SEPARATOR:
            case SpreadsheetMetadata.NEGATIVE_SIGN:
            case SpreadsheetMetadata.NUMBER_FORMAT_PATTERN:
            case SpreadsheetMetadata.NUMBER_PARSE_PATTERNS:
            case SpreadsheetMetadata.PERCENTAGE_SYMBOL:
            case SpreadsheetMetadata.POSITIVE_SIGN:
            case SpreadsheetMetadata.ROUNDING_MODE:
            case SpreadsheetMetadata.PRECISION:
            case SpreadsheetMetadata.SELECTION:
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
                throw new Error("Property \"" + propertyName + "\" cannot be removed, " + this);
            default:
                if(propertyName.startsWith("color-")){
                    break;
                }
                throw new Error("Unknown property \"" + propertyName + "\"");
        }
        return (typeof this.getIgnoringDefaults(propertyName) === "undefined") ?
            this :
            copyAndRemove(this.properties, propertyName);
    }

    /**
     * Returns a {@link TextStyle} that merges the current and default style.
     */
    effectiveStyle() {
        var style = this.getIgnoringDefaults(SpreadsheetMetadata.STYLE);
        if(!style){
            style = TextStyle.EMPTY;
        }
        const defaultMetadata = this.getIgnoringDefaults(SpreadsheetMetadata.DEFAULTS);
        if(defaultMetadata){
            const defaultStyle = defaultMetadata.getIgnoringDefaults(SpreadsheetMetadata.STYLE) || TextStyle.EMPTY;
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
            let valueJson;

            switch(key) {
                case SpreadsheetMetadata.SELECTION:
                    valueJson = value.toJson();
                    break;
                default:
                    valueJson = (value.toJson && value.toJson()) || value;
                    break;
            }
            json[key] = valueJson;
        }

        return json;
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return equals0(this, other, PROPERTY_NAMES);
    }

    /**
     * Returns true if any of the #VIEWPORT_SHOULD_LOAD_CELLS_PROPERTY_NAMES properties are different.
     */
    viewportShouldLoadCells(other) {
        return !equals0(this, other, VIEWPORT_SHOULD_LOAD_CELLS_PROPERTY_NAMES);
    }

    /**
     * When true, the viewport widget should save its local copy of metadata, which will have updated selection and viewport-cell.
     */
    viewportShouldSaveMetadata(other) {
        return !equals0(this, other, VIEWPORT_SHOULD_SAVE_METADATA_PROPERTY_NAMES);
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

/**
 * An array of all properties.
 */
const PROPERTY_NAMES = [
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
    SpreadsheetMetadata.EXPRESSION_NUMBER_KIND,
    SpreadsheetMetadata.FROZEN_COLUMNS,
    SpreadsheetMetadata.FROZEN_ROWS,
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
    SpreadsheetMetadata.SELECTION,
    SpreadsheetMetadata.SPREADSHEET_ID,
    SpreadsheetMetadata.SPREADSHEET_NAME,
    SpreadsheetMetadata.STYLE,
    SpreadsheetMetadata.TEXT_FORMAT_PATTERN,
    SpreadsheetMetadata.TIME_FORMAT_PATTERN,
    SpreadsheetMetadata.TIME_PARSE_PATTERNS,
    SpreadsheetMetadata.TWO_DIGIT_YEAR,
    SpreadsheetMetadata.VALUE_SEPARATOR,
    SpreadsheetMetadata.VIEWPORT_CELL,
];

/**
 * Used when comparing two metadata ignoring a few properties that are unimportant when deciding if a viewport cells should be reloaded.
 */
const VIEWPORT_SHOULD_LOAD_CELLS_PROPERTY_NAMES = PROPERTY_NAMES.filter(p => {
    var keep;

    switch(p) {
        case SpreadsheetMetadata.CREATOR:
        case SpreadsheetMetadata.CREATE_DATE_TIME:
        case SpreadsheetMetadata.MODIFIED_BY:
        case SpreadsheetMetadata.MODIFIED_DATE_TIME:
        case SpreadsheetMetadata.SELECTION:
        case SpreadsheetMetadata.SPREADSHEET_NAME:
            keep = false;
            break;
        default:
            keep = true;
    }
    return keep;
});

/**
 * Used when comparing two metadata ignoring a few properties that are unimportant when deciding if a viewport cells should be reloaded.
 */
const VIEWPORT_SHOULD_SAVE_METADATA_PROPERTY_NAMES = [
    SpreadsheetMetadata.SELECTION,
    SpreadsheetMetadata.VIEWPORT_CELL,
];

function equals0(self, other, required) {
    return self === other || (other instanceof SpreadsheetMetadata && equals1(self, other, required));
}

/**
 * Tests the required entries in both SpreadsheetMetadata for equality.
 */
function equals1(metadata, other, required) {
    const properties = metadata.properties;
    const otherProperties = other.properties;

    var equals = true;

    for(const property of required) {
        equals = Equality.safeEquals(properties[property], otherProperties[property]);
        if(!equals){
            break;
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
    Preconditions.requireText(currencySymbol, "currencySymbol");
}

function checkFrozenColumns(range) {
    Preconditions.requireInstance(range, SpreadsheetColumnReferenceRange, "frozenColumn");
    if(range.begin().value() !== 0){
        throw new Error("Frozen column begin must be column A: " + range);
    }
}

function checkFrozenRows(range) {
    Preconditions.requireInstance(range, SpreadsheetRowReferenceRange, "frozenRow");
    if(range.begin().value() !== 0){
        throw new Error("Frozen row begin must be row 1: " + range);
    }
}

function checkPrecision(precision) {
    Preconditions.requireNumber(precision, "precision");
    if(!(precision >= 0)){
        throw new Error("Expected number precision >= 0 got " + precision);
    }
}

function checkTwoDigitYear(twoDigitYear) {
    Preconditions.requireNumber(twoDigitYear, "twoDigitYear");
    if(twoDigitYear < 0 || twoDigitYear > 99){
        throw new Error("Expected number twoDigitYear >= 0 and <= 99 got " + twoDigitYear);
    }
}

function checkCellCharacterWidth(width) {
    Preconditions.requireNumber(width, "cell-character-width");
    if(width <= 0){
        throw new Error("Expected number width > 0 got " + width);
    }
}

function setFails(propertyName) {
    throw new Error("set \"" + propertyName + "\" is not allowed");
}

function reportDuplicateProperty(property, value, original) {
    throw new Error("Cannot set " + property + "=" + value + " duplicate of " + original);
}

function isGroupingSeparatorOrValueSeparator(propertyName) {
    return SpreadsheetMetadata.GROUPING_SEPARATOR === propertyName || SpreadsheetMetadata.VALUE_SEPARATOR === propertyName;
}

const SWAPPABLE_PROPERTY_NAMES = [
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
LocalDate.prototype; // lgtm
// eslint-disable-next-line no-unused-expressions
LocalDateTime.prototype; // lgtm
// eslint-disable-next-line no-unused-expressions
LocalTime.prototype; // lgtm