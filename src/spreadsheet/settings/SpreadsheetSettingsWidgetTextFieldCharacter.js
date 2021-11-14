import Character from "../../Character.js";
import PropTypes from "prop-types";
import SpreadsheetSettingsWidgetTextField from "./SpreadsheetSettingsWidgetTextField.js";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";

/**
 * A widget which displays a {@link Character} for editing using a TextField. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetSettingsWidgetTextFieldCharacter extends SpreadsheetSettingsWidgetTextField {

    placeholder() {
        return "Enter 1 character";
    }

    size() {
        return 1;
    }

    maxLength() {
        return 1;
    }

    type() {
        return "text";
    }

    stringToValue(string) {
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

SpreadsheetSettingsWidgetTextFieldCharacter.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(PropTypes.instanceOf(Character));
