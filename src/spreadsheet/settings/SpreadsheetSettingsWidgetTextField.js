import React from 'react';
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";
import TextField from "@material-ui/core/TextField";

/**
 * A widget which displays a value for editing using a TextField. Edits are immediately applies upon blur.
 */
export default class SpreadsheetSettingsWidgetTextField extends SpreadsheetSettingsWidgetValue {

    constructor(props) {
        super(props);
        this.inputField = React.createRef();
    }

    renderInput(id, value) {
        const textFieldId = id + "-TextField";
        const placeholder = this.placeholder();
        const maxLength = this.maxLength();

        return <TextField inputRef={this.inputField}
                          id={textFieldId}
                          key={textFieldId}
                          style={
                              {
                                  marginRight: "4px",
                              }
                          }
                          placeholder={placeholder}
                          fullWidth
                          margin="none"
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

    /**
     * Handles the setDefault button being clicked, clearing the value, which lets the default be used and also clears the TextField.
     */
    onSetDefaultValue() {
        console.log("onSetDefaultValue");
        this.setValue();
        this.inputField.current.value = "";
    }
}