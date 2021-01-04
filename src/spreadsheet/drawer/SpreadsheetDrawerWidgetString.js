import PropTypes from "prop-types";
import SpreadsheetDrawerWidgetTextField from "./SpreadsheetDrawerWidgetTextField.js";
import SpreadsheetDrawerWidgetValue from "./SpreadsheetDrawerWidgetValue.js";

/**
 * A widget which displays a {@link String} for editing using a TextField. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetDrawerWidgetString extends SpreadsheetDrawerWidgetTextField {

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

SpreadsheetDrawerWidgetString.propTypes = SpreadsheetDrawerWidgetValue.createPropTypes(PropTypes.string);
