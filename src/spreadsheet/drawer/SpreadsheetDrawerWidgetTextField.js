import React from 'react';
import SpreadsheetDrawerWidgetValue from "./SpreadsheetDrawerWidgetValue.js";
import TextField from "@material-ui/core/TextField";

/**
 * A widget which displays a value for editing using a TextField. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetDrawerWidgetTextField extends SpreadsheetDrawerWidgetValue {

    constructor(props) {
        super(props);
    }

    renderInput(id, value) {
        const placeholder = this.placeholder();
        const maxLength = this.maxLength();

        return <TextField
            id={id + "-text"}
            key={value}
            style={
                {
                    height: "1em",
                    margin: 0,
                }
            }
            placeholder={placeholder}
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
                    size: maxLength,
                    maxLength: maxLength,
                }
            }
            onChange={this.onInputChange.bind(this)}
            onKeyDown={this.onInputKeyDown.bind(this)}
        />
    }

    placeholder() {
        throw new Error("Not yet implemented: placeholder");
    }

    maxLength() {
        throw new Error("Not yet implemented: maxLength");
    }

    /**
     * Receives changes to the input text field.
     */
    onInputChange(e) {
        const string = e.target.value;
        console.log("onInputChange " + string);

        this.setValue(this.createValue(string));
    }

    /**
     * Takes the given string which may be empty and creates a value.
     */
    createValue(string) {
        throw new Error("Not yet implemented: createValue");
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