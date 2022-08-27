import PropTypes from "prop-types";
import SpreadsheetDateTimeParsePatterns from "../../format/SpreadsheetDateTimeParsePatterns.js";
import SpreadsheetMetadataPanelWidgetTextField from "./SpreadsheetMetadataPanelWidgetTextField.js";
import SpreadsheetMetadataPanelWidgetValue from "./SpreadsheetMetadataPanelWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetDateTimeParsePatterns}.
 */
export default class SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateTimeParsePatterns extends SpreadsheetMetadataPanelWidgetTextField {

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

SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateTimeParsePatterns.propTypes = SpreadsheetMetadataPanelWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetDateTimeParsePatterns));
