import PropTypes from "prop-types";
import SpreadsheetDateParsePatterns from "../format/SpreadsheetDateParsePatterns.js";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetDateParsePatterns}.
 */
export default class SpreadsheetSettingsWidgetSpreadsheetDateParsePatterns extends SpreadsheetSettingsWidgetTextField {

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
                value = SpreadsheetDateParsePatterns.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetSettingsWidgetSpreadsheetDateParsePatterns.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetDateParsePatterns));
