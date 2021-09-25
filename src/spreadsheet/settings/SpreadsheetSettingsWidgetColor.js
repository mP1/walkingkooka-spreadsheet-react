import Color from "../../color/Color.js";
import PropTypes from "prop-types";
import SpreadsheetNotification from "../notification/SpreadsheetNotification.js";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget that displays a TextField and creates a Color from any entered text.
 */
export default class SpreadsheetSettingsWidgetColor extends SpreadsheetSettingsWidgetTextField {

    // eslint-disable-next-line
    constructor(props) {
        super(props);
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

    type() {
        return "text";
    }

    createValue(string) {
        return (!!string ? Color.parse(string) : null);
    }

    onError(text, errorMessage) {
        this.props.notificationShow(SpreadsheetNotification.error("Invalid color \"" + text + "\""));
    }
}

SpreadsheetSettingsWidgetColor.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(
    PropTypes.instanceOf(Color),
    {
        notificationShow: PropTypes.func.isRequired
    }
);
