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

    maxLength() {
        return 5;
    }

    createValue(string) {
        return string === "" ? undefined : string;
    }
}

SpreadsheetSettingsWidgetString.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(PropTypes.string);
