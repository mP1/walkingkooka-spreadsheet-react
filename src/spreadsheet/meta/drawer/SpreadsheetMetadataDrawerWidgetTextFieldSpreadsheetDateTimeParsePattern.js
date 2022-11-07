import PropTypes from "prop-types";
import SpreadsheetDateTimeParsePattern from "../../format/SpreadsheetDateTimeParsePattern.js";
import SpreadsheetMetadataDrawerWidgetTextField from "./SpreadsheetMetadataDrawerWidgetTextField.js";
import SpreadsheetMetadataDrawerWidgetValue from "./SpreadsheetMetadataDrawerWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetDateTimeParsePattern}.
 */
export default class SpreadsheetMetadataDrawerWidgetTextFieldSpreadsheetDateTimeParsePattern extends SpreadsheetMetadataDrawerWidgetTextField {

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
                value = SpreadsheetDateTimeParsePattern.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetMetadataDrawerWidgetTextFieldSpreadsheetDateTimeParsePattern.propTypes = SpreadsheetMetadataDrawerWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetDateTimeParsePattern));
