import PropTypes from "prop-types";
import SpreadsheetDateFormatPattern from "../format/SpreadsheetDateFormatPattern.js";
import SpreadsheetMetadataPanelWidgetTextField from "./SpreadsheetMetadataPanelWidgetTextField.js";
import SpreadsheetMetadataPanelWidgetValue from "./SpreadsheetMetadataPanelWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetDateFormatPattern}.
 */
export default class SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateFormatPattern extends SpreadsheetMetadataPanelWidgetTextField {

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
                value = SpreadsheetDateFormatPattern.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateFormatPattern.propTypes = SpreadsheetMetadataPanelWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetDateFormatPattern));
