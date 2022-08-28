import PropTypes from "prop-types";
import SpreadsheetMetadataDrawerWidgetTextField from "./SpreadsheetMetadataDrawerWidgetTextField.js";
import SpreadsheetMetadataDrawerWidgetValue from "./SpreadsheetMetadataDrawerWidgetValue.js";

/**
 * A widget which displays a {@link String} for editing using a TextField. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetMetadataDrawerWidgetTextFieldString extends SpreadsheetMetadataDrawerWidgetTextField {

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

SpreadsheetMetadataDrawerWidgetTextFieldString.propTypes = SpreadsheetMetadataDrawerWidgetValue.createPropTypes(
    PropTypes.string,
    {
        length: PropTypes.number.isRequired,
        maxLength: PropTypes.number.isRequired,
    }
);
