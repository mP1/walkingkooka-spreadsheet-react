import PropTypes from "prop-types";
import SpreadsheetMetadataDrawerWidgetTextField from "./SpreadsheetMetadataDrawerWidgetTextField.js";
import SpreadsheetMetadataDrawerWidgetValue from "./SpreadsheetMetadataDrawerWidgetValue.js";
import SpreadsheetTimeParsePatterns from "../../format/SpreadsheetTimeParsePatterns.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetTimeParsePatterns}.
 */
export default class SpreadsheetMetadataDrawerWidgetTextFieldSpreadsheetTimeParsePatterns extends SpreadsheetMetadataDrawerWidgetTextField {

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
                value = SpreadsheetTimeParsePatterns.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetMetadataDrawerWidgetTextFieldSpreadsheetTimeParsePatterns.propTypes = SpreadsheetMetadataDrawerWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetTimeParsePatterns));
