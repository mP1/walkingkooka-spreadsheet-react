import PropTypes from "prop-types";
import SpreadsheetTextFormatPattern from "../format/SpreadsheetTextFormatPattern.js";
import SpreadsheetDrawerWidgetTextField from "./SpreadsheetDrawerWidgetTextField.js";
import SpreadsheetDrawerWidgetValue from "./SpreadsheetDrawerWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetTextFormatPattern}.
 */
export default class SpreadsheetDrawerWidgetSpreadsheetTextFormatPattern extends SpreadsheetDrawerWidgetTextField {

    constructor(props) {
        super(props);
    }

    placeholder() {
        return "Enter pattern";
    }

    maxLength() {
        return 255;
    }

    createValue(string) {
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

SpreadsheetDrawerWidgetSpreadsheetTextFormatPattern.propTypes = SpreadsheetDrawerWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetTextFormatPattern));
