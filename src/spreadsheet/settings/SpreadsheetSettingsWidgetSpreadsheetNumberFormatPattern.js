import PropTypes from "prop-types";
import SpreadsheetNumberFormatPattern from "../format/SpreadsheetNumberFormatPattern.js";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetNumberFormatPattern}.
 */
export default class SpreadsheetSettingsWidgetSpreadsheetNumberFormatPattern extends SpreadsheetSettingsWidgetTextField {

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
                value = SpreadsheetNumberFormatPattern.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetSettingsWidgetSpreadsheetNumberFormatPattern.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetNumberFormatPattern));
