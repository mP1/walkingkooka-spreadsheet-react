import PropTypes from "prop-types";
import SpreadsheetDrawerWidgetTextField from "./SpreadsheetDrawerWidgetTextField.js";
import SpreadsheetDrawerWidgetValue from "./SpreadsheetDrawerWidgetValue.js";
import SpreadsheetTimeParsePatterns from "../format/SpreadsheetTimeParsePatterns.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetTimeParsePatterns}.
 */
export default class SpreadsheetDrawerWidgetSpreadsheetTimeParsePatterns extends SpreadsheetDrawerWidgetTextField {

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
                value = SpreadsheetTimeParsePatterns.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetDrawerWidgetSpreadsheetTimeParsePatterns.propTypes = SpreadsheetDrawerWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetTimeParsePatterns));
