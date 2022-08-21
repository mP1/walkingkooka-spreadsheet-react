import Preconditions from "../../Preconditions.js";
import SpreadsheetMetadata from "../meta/SpreadsheetMetadata.js";
import TextStyle from "../../text/TextStyle.js";
import SpreadsheetColumnReferenceRange from "../reference/SpreadsheetColumnReferenceRange.js";
import SpreadsheetRowReferenceRange from "../reference/SpreadsheetRowReferenceRange.js";
import SpreadsheetNumberParsePatterns from "../format/SpreadsheetNumberParsePatterns.js";
import SpreadsheetNumberFormatPattern from "../format/SpreadsheetNumberFormatPattern.js";
import ExpressionNumberKind from "../../math/ExpressionNumberKind.js";
import SpreadsheetTextFormatPattern from "../format/SpreadsheetTextFormatPattern.js";
import SpreadsheetTimeFormatPattern from "../format/SpreadsheetTimeFormatPattern.js";
import SpreadsheetTimeParsePatterns from "../format/SpreadsheetTimeParsePatterns.js";
import SpreadsheetDateTimeParsePatterns from "../format/SpreadsheetDateTimeParsePatterns.js";
import SpreadsheetDateTimeFormatPattern from "../format/SpreadsheetDateTimeFormatPattern.js";
import SpreadsheetDateFormatPattern from "../format/SpreadsheetDateFormatPattern.js";
import SpreadsheetDateParsePatterns from "../format/SpreadsheetDateParsePatterns.js";
import RoundingMode from "../../math/RoundingMode.js";

/**
 * Helpers required by SpreadsheetSettingsWidget and SpreadsheetHistoryHash extracted to avoid cycles between classes.
 */
export default class SpreadsheetSettingsWidgetHistoryHashTokens {

    // these tokens are optional and only one may appear after SETTINGS
    static METADATA = "metadata";
    static TEXT = "text";
    static NUMBER = "number";
    static DATE_TIME = "date-time";
    static STYLE = "style";

    static accordions() {
        return [
            SpreadsheetSettingsWidgetHistoryHashTokens.METADATA,
            SpreadsheetSettingsWidgetHistoryHashTokens.TEXT,
            SpreadsheetSettingsWidgetHistoryHashTokens.NUMBER,
            SpreadsheetSettingsWidgetHistoryHashTokens.DATE_TIME,
            SpreadsheetSettingsWidgetHistoryHashTokens.STYLE
        ];
    }

    /**
     * Tests if the given token is a settings property
     */
    static isProperty(token) {
        return Boolean(SpreadsheetSettingsWidgetHistoryHashTokens.parentAccordion(token));
    }

    static isToken(token) {
        return SpreadsheetSettingsWidgetHistoryHashTokens.accordions()
                .indexOf(token) > -1 ||
            SpreadsheetSettingsWidgetHistoryHashTokens.isProperty(token);
    }
    
    /**
     * Returns the settings accordion name for the given property or null if not found.
     */
    static parentAccordion(property) {
        var parentAccordion;

        do {
            if(SpreadsheetSettingsWidgetHistoryHashTokens.metadataRows().includes(property)){
                parentAccordion = SpreadsheetSettingsWidgetHistoryHashTokens.METADATA;
                break;
            }
            if(SpreadsheetSettingsWidgetHistoryHashTokens.spreadsheetTextRows().includes(property)){
                parentAccordion = SpreadsheetSettingsWidgetHistoryHashTokens.TEXT;
                break;
            }
            if(SpreadsheetSettingsWidgetHistoryHashTokens.spreadsheetDateTimeRows().includes(property)){
                parentAccordion = SpreadsheetSettingsWidgetHistoryHashTokens.DATE_TIME;
                break;
            }
            if(SpreadsheetSettingsWidgetHistoryHashTokens.spreadsheetNumberRows().includes(property)){
                parentAccordion = SpreadsheetSettingsWidgetHistoryHashTokens.NUMBER;
                break;
            }
            if(SpreadsheetSettingsWidgetHistoryHashTokens.spreadsheetStyleRows().includes(property)){
                parentAccordion = SpreadsheetSettingsWidgetHistoryHashTokens.STYLE;
                break;
            }
        } while(false);

        return parentAccordion;
    }

    static metadataRows() {
        return [
            SpreadsheetMetadata.SPREADSHEET_ID,
            SpreadsheetMetadata.CREATOR,
            SpreadsheetMetadata.CREATE_DATE_TIME,
            SpreadsheetMetadata.MODIFIED_BY,
            SpreadsheetMetadata.MODIFIED_DATE_TIME,
        ];
    }

    static spreadsheetTextRows() {
        return [
            TextStyle.COLOR,
            //TextStyle.DIRECTION,
            //TextStyle.FONT_FAMILY,
            //TextStyle.FONT_SIZE,
            //TextStyle.FONT_STYLE,
            //TextStyle.FONT_VARIANT,
            //TextStyle.FONT_WEIGHT,
            TextStyle.TEXT_ALIGN,
            TextStyle.HYPHENS,
            //TextStyle.LINE_HEIGHT,
            TextStyle.VERTICAL_ALIGN,
            //TextStyle.WORD_SPACING,
            TextStyle.WORD_BREAK,
            TextStyle.WORD_WRAP,
            //
            SpreadsheetMetadata.LOCALE,
            SpreadsheetMetadata.TEXT_FORMAT_PATTERN,
            SpreadsheetMetadata.CELL_CHARACTER_WIDTH,
        ];
    }

    static spreadsheetDateTimeRows() {
        return [
            SpreadsheetMetadata.DATETIME_OFFSET,
            SpreadsheetMetadata.DEFAULT_YEAR,
            SpreadsheetMetadata.TWO_DIGIT_YEAR,
            SpreadsheetMetadata.DATE_FORMAT_PATTERN,
            SpreadsheetMetadata.DATE_PARSE_PATTERNS,
            SpreadsheetMetadata.DATETIME_FORMAT_PATTERN,
            SpreadsheetMetadata.DATETIME_PARSE_PATTERNS,
            SpreadsheetMetadata.TIME_FORMAT_PATTERN,
            SpreadsheetMetadata.TIME_PARSE_PATTERNS
        ];
    }

    static spreadsheetNumberRows() {
        return [
            SpreadsheetMetadata.EXPRESSION_NUMBER_KIND,
            SpreadsheetMetadata.PRECISION,
            SpreadsheetMetadata.ROUNDING_MODE,
            SpreadsheetMetadata.CURRENCY_SYMBOL,
            SpreadsheetMetadata.DECIMAL_SEPARATOR,
            SpreadsheetMetadata.EXPONENT_SYMBOL,
            SpreadsheetMetadata.GROUPING_SEPARATOR,
            SpreadsheetMetadata.NEGATIVE_SIGN,
            SpreadsheetMetadata.PERCENTAGE_SYMBOL,
            SpreadsheetMetadata.POSITIVE_SIGN,
            SpreadsheetMetadata.NUMBER_FORMAT_PATTERN,
            SpreadsheetMetadata.NUMBER_PARSE_PATTERNS,
            SpreadsheetMetadata.VALUE_SEPARATOR,
        ];
    }

    static spreadsheetStyleRows() {
        return [
            TextStyle.BACKGROUND_COLOR,
            //
            TextStyle.WIDTH,
            TextStyle.HEIGHT,
            //
            TextStyle.BORDER_LEFT_COLOR,
            TextStyle.BORDER_LEFT_STYLE,
            TextStyle.BORDER_LEFT_WIDTH,
            //
            TextStyle.BORDER_TOP_COLOR,
            TextStyle.BORDER_TOP_STYLE,
            TextStyle.BORDER_TOP_WIDTH,
            //
            TextStyle.BORDER_RIGHT_COLOR,
            TextStyle.BORDER_RIGHT_STYLE,
            TextStyle.BORDER_RIGHT_WIDTH,
            //
            TextStyle.BORDER_BOTTOM_COLOR,
            TextStyle.BORDER_BOTTOM_STYLE,
            TextStyle.BORDER_BOTTOM_WIDTH,
            //
            TextStyle.PADDING_LEFT,
            TextStyle.PADDING_TOP,
            TextStyle.PADDING_RIGHT,
            TextStyle.PADDING_BOTTOM,
        ];
    }

    /**
     * Translates a style property value from a string (probably sourced from a history hash token) into its
     * matching json type like a null, string or number.
     */
    static parseHistoryHashToken(propertyName, token) {
        Preconditions.optionalText(token, "token");

        return SpreadsheetSettingsWidgetHistoryHashTokens.parseHistoryHashToken0(
            propertyName,
            token && decodeURIComponent(token)
        );
    }

    static parseHistoryHashToken0(propertyName, token) {
        let value = null;

        if(null != token){
            switch(propertyName) {
                case SpreadsheetMetadata.CELL_CHARACTER_WIDTH :
                    value = Number(token);
                    break;
                //case SpreadsheetMetadata.CREATOR :
                //case SpreadsheetMetadata.CREATE_DATE_TIME :
                case SpreadsheetMetadata.CURRENCY_SYMBOL :
                    value = token;
                    break;
                case SpreadsheetMetadata.DATE_FORMAT_PATTERN :
                    value = new SpreadsheetDateFormatPattern(token);
                    break;
                case SpreadsheetMetadata.DATE_PARSE_PATTERNS :
                    value = new SpreadsheetDateParsePatterns(token);
                    break;
                case SpreadsheetMetadata.DATETIME_FORMAT_PATTERN :
                    value = new SpreadsheetDateTimeFormatPattern(token);
                    break;
                case SpreadsheetMetadata.DATETIME_OFFSET :
                    value = Number(token);
                    break;
                case SpreadsheetMetadata.DATETIME_PARSE_PATTERNS :
                    value = new SpreadsheetDateTimeParsePatterns(token);
                    break;
                case SpreadsheetMetadata.DECIMAL_SEPARATOR :
                    value = token;
                    break;
                case SpreadsheetMetadata.DEFAULT_YEAR :
                    value = Number(token);
                    break;
                case SpreadsheetMetadata.EXPONENT_SYMBOL :
                    value = token;
                    break;
                case SpreadsheetMetadata.EXPRESSION_NUMBER_KIND :
                    value = ExpressionNumberKind.fromJson(token);
                    break;
                case SpreadsheetMetadata.FROZEN_COLUMNS:
                    value = new SpreadsheetColumnReferenceRange.parse(token);
                    break;
                case SpreadsheetMetadata.FROZEN_ROWS:
                    value = new SpreadsheetRowReferenceRange.parse(token);
                    break;
                case SpreadsheetMetadata.GROUPING_SEPARATOR :
                //case SpreadsheetMetadata.LOCALE :
                //case SpreadsheetMetadata.MODIFIED_BY :
                //case SpreadsheetMetadata.MODIFIED_DATE_TIME :
                case SpreadsheetMetadata.NEGATIVE_SIGN :
                    value = token;
                    break;
                case SpreadsheetMetadata.NUMBER_FORMAT_PATTERN :
                    value = new SpreadsheetNumberFormatPattern(token);
                    break;
                case SpreadsheetMetadata.NUMBER_PARSE_PATTERNS :
                    value = new SpreadsheetNumberParsePatterns(token);
                    break;
                case SpreadsheetMetadata.PERCENTAGE_SYMBOL :
                    value = token;
                    break;
                case SpreadsheetMetadata.PRECISION :
                    value = Number(token);
                    break;
                case SpreadsheetMetadata.POSITIVE_SIGN :
                    value = token;
                    break;
                case SpreadsheetMetadata.ROUNDING_MODE :
                    value = RoundingMode.fromJson(token);
                    break;
                //case SpreadsheetMetadata.SPREADSHEET_NAME :
                case SpreadsheetMetadata.TEXT_FORMAT_PATTERN :
                    value = new SpreadsheetTextFormatPattern(token);
                    break;
                case SpreadsheetMetadata.TIME_FORMAT_PATTERN :
                    value = new SpreadsheetTimeFormatPattern(token);
                    break;
                case SpreadsheetMetadata.TIME_PARSE_PATTERNS :
                    value = new SpreadsheetTimeParsePatterns(token);
                    break;
                case SpreadsheetMetadata.TWO_DIGIT_YEAR :
                    value = Number(token);
                    break;
                case SpreadsheetMetadata.VALUE_SEPARATOR :
                    value = token;
                    break;
                //case SpreadsheetMetadata.SELECTION :
                //case SpreadsheetMetadata.SPREADSHEET_ID :
                //case SpreadsheetMetadata.STYLE :
                //case SpreadsheetMetadata.VIEWPORT_CELL :
                    throw new Error("Invalid property " + propertyName);
                default:
                    value = TextStyle.parseHistoryHashToken(propertyName, token);
                    break;
            }
        }

        return value;
    }
}