import PropTypes from "prop-types";
import SpreadsheetDateParsePatterns from "../format/SpreadsheetDateParsePatterns.js";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetDateParsePatterns}.
 */
export default class SpreadsheetSettingsWidgetTextFieldSpreadsheetDateParsePatterns extends SpreadsheetSettingsWidgetTextField {

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
                value = SpreadsheetDateParsePatterns.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetSettingsWidgetTextFieldSpreadsheetDateParsePatterns.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetDateParsePatterns));
