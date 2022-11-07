import PropTypes from "prop-types";
import SpreadsheetDateParsePattern from "../../format/SpreadsheetDateParsePattern.js";
import SpreadsheetMetadataDrawerWidgetTextField from "./SpreadsheetMetadataDrawerWidgetTextField.js";
import SpreadsheetMetadataDrawerWidgetValue from "./SpreadsheetMetadataDrawerWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetDateParsePattern}.
 */
export default class SpreadsheetMetadataDrawerWidgetTextFieldSpreadsheetDateParsePattern extends SpreadsheetMetadataDrawerWidgetTextField {

    placeholder() {
        return "Enter pattern";
    }

    size() {
        return 20;
    }

    maxLength() {
        return 255;
    }

    stringToValue(string) {
        var value;

        switch(string.length) {
            case 0:
                value = null;
                break;
            default:
                value = SpreadsheetDateParsePattern.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetMetadataDrawerWidgetTextFieldSpreadsheetDateParsePattern.propTypes = SpreadsheetMetadataDrawerWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetDateParsePattern));
