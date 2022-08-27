import PropTypes from "prop-types";
import SpreadsheetTextFormatPattern from "../format/SpreadsheetTextFormatPattern.js";
import SpreadsheetMetadataPanelWidgetTextField from "./SpreadsheetMetadataPanelWidgetTextField.js";
import SpreadsheetMetadataPanelWidgetValue from "./SpreadsheetMetadataPanelWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetTextFormatPattern}.
 */
export default class SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetTextFormatPattern extends SpreadsheetMetadataPanelWidgetTextField {

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
                break;
            default:
                value = SpreadsheetTextFormatPattern.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetTextFormatPattern.propTypes = SpreadsheetMetadataPanelWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetTextFormatPattern));
