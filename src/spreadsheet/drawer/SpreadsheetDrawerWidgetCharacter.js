import Character from "../../Character.js";
import PropTypes from "prop-types";
import React from 'react';
import SpreadsheetDrawerWidgetTextField from "./SpreadsheetDrawerWidgetTextField.js";
import SpreadsheetDrawerWidgetValue from "./SpreadsheetDrawerWidgetValue.js";

/**
 * A widget which displays a {@link Character} for editing using a TextField. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetDrawerWidgetCharacter extends SpreadsheetDrawerWidgetTextField {

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

SpreadsheetDrawerWidgetCharacter.propTypes = SpreadsheetDrawerWidgetValue.createPropTypes(PropTypes.instanceOf(Character));
