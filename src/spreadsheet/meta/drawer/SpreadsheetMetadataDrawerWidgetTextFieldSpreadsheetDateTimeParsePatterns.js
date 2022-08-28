import PropTypes from "prop-types";
import SpreadsheetDateTimeParsePatterns from "../../format/SpreadsheetDateTimeParsePatterns.js";
import SpreadsheetMetadataDrawerWidgetTextField from "./SpreadsheetMetadataDrawerWidgetTextField.js";
import SpreadsheetMetadataDrawerWidgetValue from "./SpreadsheetMetadataDrawerWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetDateTimeParsePatterns}.
 */
export default class SpreadsheetMetadataDrawerWidgetTextFieldSpreadsheetDateTimeParsePatterns extends SpreadsheetMetadataDrawerWidgetTextField {

    placeholder() {
        return "Enter pattern";
    }

    size() {
        return 20;
    }

    maxLength() {
        return 255;
    }

    stringToValue(string) {
        var value;

        switch(string.length) {
            case 0:
                value = null;
                break;
            default:
                value = SpreadsheetDateTimeParsePatterns.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetMetadataDrawerWidgetTextFieldSpreadsheetDateTimeParsePatterns.propTypes = SpreadsheetMetadataDrawerWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetDateTimeParsePatterns));
