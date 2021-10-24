import SpreadsheetMetadata from "../meta/SpreadsheetMetadata.js";
import TextStyle from "../../text/TextStyle.js";

/**
 * Helpers required by SpreadsheetSettingsWidget and SpreadsheetHistoryHash extracted to avoid cycles between classes.
 */
export default class SpreadsheetSettingsWidgetItems {

    // these tokens are optional and only one may appear after SETTINGS
    static METADATA = "metadata";
    static TEXT = "text";
    static NUMBER = "number";
    static DATE_TIME = "date-time";
    static STYLE = "style";

    static items() {
        return [
            SpreadsheetSettingsWidgetItems.METADATA,
            SpreadsheetSettingsWidgetItems.TEXT,
            SpreadsheetSettingsWidgetItems.NUMBER,
            SpreadsheetSettingsWidgetItems.DATE_TIME,
            SpreadsheetSettingsWidgetItems.STYLE
        ];
    }

    /**
     * Returns the settings accordion name for the given property or null if not found.
     */
    static parentAccordion(property) {
        var parentAccordion;

        for(; ;) {
            if(SpreadsheetSettingsWidgetItems.metadataRows().includes(property)){
                parentAccordion = SpreadsheetSettingsWidgetItems.METADATA;
                break;
            }
            if(SpreadsheetSettingsWidgetItems.spreadsheetTextRows().includes(property)){
                parentAccordion = SpreadsheetSettingsWidgetItems.TEXT;
                break;
            }
            if(SpreadsheetSettingsWidgetItems.spreadsheetDateTimeRows().includes(property)){
                parentAccordion = SpreadsheetSettingsWidgetItems.DATE_TIME;
                break;
            }
            if(SpreadsheetSettingsWidgetItems.spreadsheetNumberRows().includes(property)){
                parentAccordion = SpreadsheetSettingsWidgetItems.NUMBER;
                break;
            }
            if(SpreadsheetSettingsWidgetItems.spreadsheetStyleRows().includes(property)){
                parentAccordion = SpreadsheetSettingsWidgetItems.STYLE;
                break;
            }
            break;
        }

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