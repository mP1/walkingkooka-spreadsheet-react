import PropTypes from "prop-types";
import SpreadsheetMetadataDrawerWidgetTextField from "./SpreadsheetMetadataDrawerWidgetTextField.js";
import SpreadsheetMetadataDrawerWidgetValue from "./SpreadsheetMetadataDrawerWidgetValue.js";
import SpreadsheetTimeParsePattern from "../../format/SpreadsheetTimeParsePattern.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetTimeParsePattern}.
 */
export default class SpreadsheetMetadataDrawerWidgetTextFieldSpreadsheetTimeParsePattern extends SpreadsheetMetadataDrawerWidgetTextField {

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
                value = SpreadsheetTimeParsePattern.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetMetadataDrawerWidgetTextFieldSpreadsheetTimeParsePattern.propTypes = SpreadsheetMetadataDrawerWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetTimeParsePattern));
