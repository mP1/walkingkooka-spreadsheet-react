import PropTypes from "prop-types";
import SpreadsheetMetadataPanelWidgetTextField from "./SpreadsheetMetadataPanelWidgetTextField.js";
import SpreadsheetMetadataPanelWidgetValue from "./SpreadsheetMetadataPanelWidgetValue.js";

/**
 * A widget which displays a number for editing using a TextField. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetMetadataPanelWidgetTextFieldNumber extends SpreadsheetMetadataPanelWidgetTextField {

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

SpreadsheetMetadataPanelWidgetTextFieldNumber.propTypes = SpreadsheetMetadataPanelWidgetValue.createPropTypes(
    PropTypes.number,
    {
        length: PropTypes.number.isRequired,
        maxLength: PropTypes.number.isRequired,
    }
);
