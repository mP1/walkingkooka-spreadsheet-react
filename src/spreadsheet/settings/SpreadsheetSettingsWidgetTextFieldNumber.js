import PropTypes from "prop-types";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget which displays a number for editing using a TextField. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetSettingsWidgetTextFieldNumber extends SpreadsheetSettingsWidgetTextField {

    placeholder() {
        return;
    }

    size() {
        return 1;
    }

    maxLength() {
        return this.props.maxLength;
    }

    type() {
        return "number";
    }

    stringToValue(text) {
        return parseInt(text, 10);
    }
}

SpreadsheetSettingsWidgetTextFieldNumber.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(
    PropTypes.number,
    {
        length: PropTypes.number.isRequired,
        maxLength: PropTypes.number.isRequired,
    }
);
