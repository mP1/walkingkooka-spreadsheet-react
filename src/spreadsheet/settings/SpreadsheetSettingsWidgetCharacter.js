import Character from "../../Character.js";
import PropTypes from "prop-types";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget which displays a {@link Character} for editing using a TextField. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetSettingsWidgetCharacter extends SpreadsheetSettingsWidgetTextField {

    // eslint-disable-next-line
    constructor(props) {
        super(props);
    }

    placeholder() {
        return "Enter 1 character";
    }

    maxLength() {
        return 1;
    }

    createValue(string) {
        var value;

        switch(string.length) {
            case 0:
                break;
            default:
                value = Character.fromJson(string);
                break;
        }
        return value;
    }
}

SpreadsheetSettingsWidgetCharacter.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(PropTypes.instanceOf(Character));
