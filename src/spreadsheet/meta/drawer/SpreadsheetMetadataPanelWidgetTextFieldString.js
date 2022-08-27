import PropTypes from "prop-types";
import SpreadsheetMetadataPanelWidgetTextField from "./SpreadsheetMetadataPanelWidgetTextField.js";
import SpreadsheetMetadataPanelWidgetValue from "./SpreadsheetMetadataPanelWidgetValue.js";

/**
 * A widget which displays a {@link String} for editing using a TextField. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetMetadataPanelWidgetTextFieldString extends SpreadsheetMetadataPanelWidgetTextField {

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

SpreadsheetMetadataPanelWidgetTextFieldString.propTypes = SpreadsheetMetadataPanelWidgetValue.createPropTypes(
    PropTypes.string,
    {
        length: PropTypes.number.isRequired,
        maxLength: PropTypes.number.isRequired,
    }
);
