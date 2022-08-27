import PropTypes from "prop-types";
import SpreadsheetDateTimeFormatPattern from "../format/SpreadsheetDateTimeFormatPattern.js";
import SpreadsheetMetadataPanelWidgetTextField from "./SpreadsheetMetadataPanelWidgetTextField.js";
import SpreadsheetMetadataPanelWidgetValue from "./SpreadsheetMetadataPanelWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetDateTimeFormatPattern}.
 */
export default class SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateTimeFormatPattern extends SpreadsheetMetadataPanelWidgetTextField {

    // eslint-disable-next-line
    constructor(props) {
        super(props);
    }

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
                value = SpreadsheetDateTimeFormatPattern.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetMetadataPanelWidgetTextFieldSpreadsheetDateTimeFormatPattern.propTypes = SpreadsheetMetadataPanelWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetDateTimeFormatPattern));
