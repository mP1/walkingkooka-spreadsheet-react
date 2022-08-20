import SpreadsheetMetadata from "../meta/SpreadsheetMetadata.js";
import TextStyle from "../../text/TextStyle.js";

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
}