import PropTypes from "prop-types";
import SpreadsheetMetadataPanelWidgetTextField from "./SpreadsheetMetadataPanelWidgetTextField.js";
import SpreadsheetMetadataPanelWidgetValue from "./SpreadsheetMetadataPanelWidgetValue.js";
import SpreadsheetTimeParsePatterns from "../../format/SpreadsheetTimeParsePatterns.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetTimeParsePatterns}.
 */
export default class SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetTimeParsePatterns extends SpreadsheetMetadataPanelWidgetTextField {

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

SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetTimeParsePatterns.propTypes = SpreadsheetMetadataPanelWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetTimeParsePatterns));
