import PropTypes from "prop-types";
import SpreadsheetDateFormatPattern from "../format/SpreadsheetDateFormatPattern.js";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetDateFormatPattern}.
 */
export default class SpreadsheetSettingsWidgetSpreadsheetDateFormatPattern extends SpreadsheetSettingsWidgetTextField {

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
                value = SpreadsheetDateFormatPattern.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetSettingsWidgetSpreadsheetDateFormatPattern.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetDateFormatPattern));
