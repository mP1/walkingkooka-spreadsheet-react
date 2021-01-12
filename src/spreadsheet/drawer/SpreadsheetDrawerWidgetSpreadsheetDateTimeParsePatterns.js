import PropTypes from "prop-types";
import SpreadsheetDateTimeParsePatterns from "../format/SpreadsheetDateTimeParsePatterns.js";
import SpreadsheetDrawerWidgetTextField from "./SpreadsheetDrawerWidgetTextField.js";
import SpreadsheetDrawerWidgetValue from "./SpreadsheetDrawerWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetDateTimeParsePatterns}.
 */
export default class SpreadsheetDrawerWidgetSpreadsheetDateTimeParsePatterns extends SpreadsheetDrawerWidgetTextField {

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
                value = SpreadsheetDateTimeParsePatterns.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetDrawerWidgetSpreadsheetDateTimeParsePatterns.propTypes = SpreadsheetDrawerWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetDateTimeParsePatterns));
