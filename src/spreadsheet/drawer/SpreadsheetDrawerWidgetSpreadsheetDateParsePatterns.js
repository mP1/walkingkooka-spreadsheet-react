import PropTypes from "prop-types";
import SpreadsheetDateParsePatterns from "../format/SpreadsheetDateParsePatterns.js";
import SpreadsheetDrawerWidgetTextField from "./SpreadsheetDrawerWidgetTextField.js";
import SpreadsheetDrawerWidgetValue from "./SpreadsheetDrawerWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetDateParsePatterns}.
 */
export default class SpreadsheetDrawerWidgetSpreadsheetDateParsePatterns extends SpreadsheetDrawerWidgetTextField {

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
                value = SpreadsheetDateParsePatterns.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetDrawerWidgetSpreadsheetDateParsePatterns.propTypes = SpreadsheetDrawerWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetDateParsePatterns));
