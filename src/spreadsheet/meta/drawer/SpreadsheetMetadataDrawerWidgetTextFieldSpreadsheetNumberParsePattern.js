import PropTypes from "prop-types";
import SpreadsheetNumberParsePattern from "../../format/SpreadsheetNumberParsePattern.js";
import SpreadsheetMetadataDrawerWidgetTextField from "./SpreadsheetMetadataDrawerWidgetTextField.js";
import SpreadsheetMetadataDrawerWidgetValue from "./SpreadsheetMetadataDrawerWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetNumberParsePattern}.
 */
export default class SpreadsheetMetadataDrawerWidgetTextFieldSpreadsheetNumberParsePattern extends SpreadsheetMetadataDrawerWidgetTextField {

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
                value = SpreadsheetNumberParsePattern.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetMetadataDrawerWidgetTextFieldSpreadsheetNumberParsePattern.propTypes = SpreadsheetMetadataDrawerWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetNumberParsePattern));
