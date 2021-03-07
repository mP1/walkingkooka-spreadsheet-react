import PropTypes from "prop-types";
import SpreadsheetTextFormatPattern from "../format/SpreadsheetTextFormatPattern.js";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetTextFormatPattern}.
 */
export default class SpreadsheetSettingsWidgetSpreadsheetTextFormatPattern extends SpreadsheetSettingsWidgetTextField {

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
                value = SpreadsheetTextFormatPattern.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetSettingsWidgetSpreadsheetTextFormatPattern.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetTextFormatPattern));
