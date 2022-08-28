import Color from "../../../color/Color.js";
import PropTypes from "prop-types";
import SpreadsheetNotification from "../../notification/SpreadsheetNotification.js";
import SpreadsheetMetadataDrawerWidgetTextField from "./SpreadsheetMetadataDrawerWidgetTextField.js";
import SpreadsheetMetadataDrawerWidgetValue from "./SpreadsheetMetadataDrawerWidgetValue.js";

/**
 * A widget that displays a TextField and creates a Color from any entered text.
 */
export default class SpreadsheetMetadataDrawerWidgetTextFieldColor extends SpreadsheetMetadataDrawerWidgetTextField {

    placeholder() {
        return "#rrggbb";
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

    stringToValue(string) {
        return (!!string ? Color.parse(string) : null);
    }

    onError(text, errorMessage) {
        this.props.notificationShow(SpreadsheetNotification.error("Invalid color \"" + text + "\""));
    }
}

SpreadsheetMetadataDrawerWidgetTextFieldColor.propTypes = SpreadsheetMetadataDrawerWidgetValue.createPropTypes(
    PropTypes.instanceOf(Color),
    {
        notificationShow: PropTypes.func.isRequired
    }
);
