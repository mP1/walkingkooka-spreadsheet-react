import PropTypes from "prop-types";
import SpreadsheetMetadataDrawerWidgetTextField from "./SpreadsheetMetadataDrawerWidgetTextField.js";
import SpreadsheetMetadataDrawerWidgetValue from "./SpreadsheetMetadataDrawerWidgetValue.js";

/**
 * A widget which displays a number for editing using a TextField. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetMetadataDrawerWidgetTextFieldNumber extends SpreadsheetMetadataDrawerWidgetTextField {

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

SpreadsheetMetadataDrawerWidgetTextFieldNumber.propTypes = SpreadsheetMetadataDrawerWidgetValue.createPropTypes(
    PropTypes.number,
    {
        length: PropTypes.number.isRequired,
        maxLength: PropTypes.number.isRequired,
    }
);
