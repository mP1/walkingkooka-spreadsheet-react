import PropTypes from "prop-types";
import SpreadsheetDateTimeParsePatterns from "../format/SpreadsheetDateTimeParsePatterns.js";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetDateTimeParsePatterns}.
 */
export default class SpreadsheetSettingsWidgetSpreadsheetDateTimeParsePatterns extends SpreadsheetSettingsWidgetTextField {

    constructor(props) {
        super(props);
    }

    placeholder() {
        return "Enter pattern";
    }

    maxLength() {
        return 255;
    }

    createValue(string) {
        var value;

        switch(string.length) {
            case 0:
                break;
            default:
                value = SpreadsheetDateTimeParsePatterns.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetSettingsWidgetSpreadsheetDateTimeParsePatterns.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetDateTimeParsePatterns));
