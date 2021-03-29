import Color from "../../color/Color.js";
import PropTypes from "prop-types";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget that displays a TextField and creates a Color from any entered text.
 */
export default class SpreadsheetSettingsWidgetColor extends SpreadsheetSettingsWidgetTextField {

    // eslint-disable-next-line
    constructor(props) {
        super(props);
        this.setError = props.setError;
    }

    placeholder() {
        return;
    }

    size() {
        return 7;
    }

    maxLength() {
        return 7;
    }

    createValue(string) {
        return (!!string ? Color.parse(string) : null);
    }

    onError(text, errorMessage) {
        this.setError("Invalid color \"" + text + "\"");
    }
}

SpreadsheetSettingsWidgetColor.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(
    PropTypes.string,
    {
        setError: PropTypes.func.isRequired
    }
);
