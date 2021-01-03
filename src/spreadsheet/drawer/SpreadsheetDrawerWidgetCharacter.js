import Character from "../../Character.js";
import React from 'react';
import TextField from "@material-ui/core/TextField";
import SpreadsheetDrawerWidgetValue from "./SpreadsheetDrawerWidgetValue.js";

/**
 * A widget which displays a {@link Character} for editing using a TextField. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetDrawerWidgetCharacter extends SpreadsheetDrawerWidgetValue {

    constructor(props) {
        super(props);
    }


    renderInput(id, value) {
        return <TextField
            id={id + "-text"}
            key={value}
            style={
                {
                    height: "1em",
                    margin: 0,
                }
            }
            placeholder="Enter 1 character"
            helperText=""
            fullWidth
            margin="normal"
            disabled={false}
            InputLabelProps={
                {
                    shrink: true,
                }
            }
            defaultValue={value}
            inputProps={
                {
                    size: 1,
                    maxLength: 1,
                }
            }
            onChange={this.onInputChange.bind(this)}
            onKeyDown={this.onInputKeyDown.bind(this)}
        />
    }

    /**
     * Receives changes to the input text field.
     */
    onInputChange(e) {
        const string = e.target.value;
        console.log("onInputChange " + string);

        switch(string.length) {
            case 0:
                this.setValue();
                break;
            case 1:
                this.setValue(Character.fromJson(string));
                break;
            default:
                break;
        }
    }

    onInputKeyDown(e) {
        switch(e.key) {
            case "Escape":
                this.onSetDefaultValue();
                break;
            default:
                // nothing special to do for other keys
                break;
        }
    }
}

SpreadsheetDrawerWidgetCharacter.propTypes = SpreadsheetDrawerWidgetValue.propTypes;