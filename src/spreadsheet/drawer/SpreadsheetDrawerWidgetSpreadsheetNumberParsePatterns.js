import PropTypes from "prop-types";
import SpreadsheetNumberParsePatterns from "../format/SpreadsheetNumberParsePatterns.js";
import SpreadsheetDrawerWidgetTextField from "./SpreadsheetDrawerWidgetTextField.js";
import SpreadsheetDrawerWidgetValue from "./SpreadsheetDrawerWidgetValue.js";

/**
 * A widget which accepts a String and creates an unvalidated {@link SpreadsheetNumberParsePatterns}.
 */
export default class SpreadsheetDrawerWidgetSpreadsheetNumberParsePatterns extends SpreadsheetDrawerWidgetTextField {

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
                value = SpreadsheetNumberParsePatterns.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetDrawerWidgetSpreadsheetNumberParsePatterns.propTypes = SpreadsheetDrawerWidgetValue.createPropTypes(PropTypes.instanceOf(SpreadsheetNumberParsePatterns));
