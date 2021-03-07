import PropTypes from "prop-types";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";
import SpreadsheetTimeParsePatterns from "../format/SpreadsheetTimeParsePatterns.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetTimeParsePatterns}.
 */
export default class SpreadsheetSettingsWidgetSpreadsheetTimeParsePatterns extends SpreadsheetSettingsWidgetTextField {

    // eslint-disable-next-line
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
                value = SpreadsheetTimeParsePatterns.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetSettingsWidgetSpreadsheetTimeParsePatterns.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetTimeParsePatterns));
