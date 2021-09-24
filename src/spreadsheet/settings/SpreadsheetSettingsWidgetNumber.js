import PropTypes from "prop-types";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget which displays a number for editing using a TextField. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetSettingsWidgetNumber extends SpreadsheetSettingsWidgetTextField {

    // eslint-disable-next-line
    constructor(props) {
        super(props);
    }

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

    createValue(text) {
        return parseInt(text, 10);
    }
}

SpreadsheetSettingsWidgetNumber.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(
    PropTypes.string,
    {
        length: PropTypes.number.isRequired,
        maxLength: PropTypes.number.isRequired,
    }
);
