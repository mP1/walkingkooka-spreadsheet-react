import PropTypes from "prop-types";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget which displays a {@link String} for editing using a TextField. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetSettingsWidgetTextFieldString extends SpreadsheetSettingsWidgetTextField {

    placeholder() {
        return;
    }

    size() {
        return this.props.length;
    }

    maxLength() {
        return this.props.maxLength;
    }

    type() {
        return "text";
    }

    stringToValue(string) {
        return string === "" ? undefined : string;
    }
}

SpreadsheetSettingsWidgetTextFieldString.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(
    PropTypes.string,
    {
        length: PropTypes.number.isRequired,
        maxLength: PropTypes.number.isRequired,
    }
);
