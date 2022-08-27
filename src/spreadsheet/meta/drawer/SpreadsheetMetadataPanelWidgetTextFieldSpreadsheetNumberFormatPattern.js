import PropTypes from "prop-types";
import SpreadsheetNumberFormatPattern from "../../format/SpreadsheetNumberFormatPattern.js";
import SpreadsheetMetadataPanelWidgetTextField from "./SpreadsheetMetadataPanelWidgetTextField.js";
import SpreadsheetMetadataPanelWidgetValue from "./SpreadsheetMetadataPanelWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetNumberFormatPattern}.
 */
export default class SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetNumberFormatPattern extends SpreadsheetMetadataPanelWidgetTextField {

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
                value = SpreadsheetNumberFormatPattern.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetNumberFormatPattern.propTypes = SpreadsheetMetadataPanelWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetNumberFormatPattern));
