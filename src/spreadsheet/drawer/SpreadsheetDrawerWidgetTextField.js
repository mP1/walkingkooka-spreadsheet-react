import React from 'react';
import SpreadsheetDrawerWidgetValue from "./SpreadsheetDrawerWidgetValue.js";
import TextField from "@material-ui/core/TextField";

/**
 * A widget which displays a value for editing using a TextField. Edits are immediately applies upon blur.
 */
export default class SpreadsheetDrawerWidgetTextField extends SpreadsheetDrawerWidgetValue {

    constructor(props) {
        super(props);
        this.inputField = React.createRef();
    }

    renderInput(id, value) {
        const placeholder = this.placeholder();
        const maxLength = this.maxLength();

        return <TextField inputRef={this.inputField}
                          id={id + "-text"}
                          key={id}
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
                          onBlur={this.onBlur.bind(this)}
                          onKeyDown={this.onKeyDown.bind(this)}
        />
    }

    placeholder() {
        throw new Error("Not yet implemented: placeholder");
    }

    maxLength() {
        throw new Error("Not yet implemented: maxLength");
    }

    /**
     * When the TextField is blurred update the SpreadsheetMetadata.
     */
    onBlur(e) {
        const string = e.target.value;
        console.log("onBlur " + string);

        this.setValue(this.createValue(string));
    }

    /**
     * Takes the given string which may be empty and creates a value.
     */
    createValue(string) {
        throw new Error("Not yet implemented: createValue");
    }

    onKeyDown(e) {
        switch(e.key) {
            case "Escape":
                this.onSetDefaultValue();
                break;
            case "Enter":
                this.setValue(this.state.value);
                break;
            default:
                // nothing special to do for other keys
                break;
        }
    }

    /**
     * Handles the setDefault button being clicked, clearing the value, which lets the default be used and also clears the TextField.
     */
    onSetDefaultValue() {
        console.log("onSetDefaultValue");
        this.setValue();
        this.inputField.current.value = "";
    }
}