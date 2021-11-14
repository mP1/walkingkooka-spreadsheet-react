import PropTypes from "prop-types";
import SpreadsheetDateTimeFormatPattern from "../format/SpreadsheetDateTimeFormatPattern.js";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetDateTimeFormatPattern}.
 */
export default class SpreadsheetSettingsWidgetTextFieldSpreadsheetDateTimeFormatPattern extends SpreadsheetSettingsWidgetTextField {

    // eslint-disable-next-line
    constructor(props) {
        super(props);
    }

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
                value = SpreadsheetDateTimeFormatPattern.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetSettingsWidgetTextFieldSpreadsheetDateTimeFormatPattern.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetDateTimeFormatPattern));
