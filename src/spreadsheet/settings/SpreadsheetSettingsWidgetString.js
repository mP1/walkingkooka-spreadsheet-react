import PropTypes from "prop-types";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget which displays a {@link String} for editing using a TextField. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetSettingsWidgetString extends SpreadsheetSettingsWidgetTextField {

    // eslint-disable-next-line
    constructor(props) {
        super(props);
    }

    placeholder() {
        return;
    }

    size() {
        return this.props.length;
    }

    maxLength() {
        return this.props.maxLength;
    }

    createValue(string) {
        return string === "" ? undefined : string;
    }
}

SpreadsheetSettingsWidgetString.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(
    PropTypes.string,
    {
        length: PropTypes.number.isRequired,
        maxLength: PropTypes.number.isRequired,
    }
);
