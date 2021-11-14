import Keys from "../../Keys.js";
import React from 'react';
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";
import TextField from "@material-ui/core/TextField";

/**
 * A widget which displays a value for editing using a TextField. Edits are delayed and only saved when ENTER is
 * entered or a blur event.
 */
export default class SpreadsheetSettingsWidgetTextField extends SpreadsheetSettingsWidgetValue {

    constructor(props) {
        super(props);
        this.inputField = React.createRef();
    }

    focus() {
        this.giveFocus(this.inputField.current);
    }

    renderValue(id, value) {
        const textFieldId = id + "-TextField";
        const placeholder = this.placeholder();
        const size = this.size();
        const maxLength = this.maxLength();
        const type = this.type();

        const onBlur = (e) => {
            const string = e.target.value;
            const value = this.stringToValue(string);

            try {
                this.setState({
                    value: value,
                    value2: value,
                });
            } catch(e) {
                this.onError(string, e);
            }
        }

        const onChange = (e) => {
            this.setState({
                value2: e.target.value,
            });
        };

        const onKeyDown = (e) => {
            switch(e.key) {
                case Keys.ESCAPE:
                    this.setState({
                        value2: this.state.savedValue,
                    });
                    break;
                case Keys.ENTER:
                    const value = this.stringToValue(e.target.value);

                    this.setState({
                        value: value,
                        value2: value,
                    });
                    break;
                default:
                    // nothing special to do for other keys
                    break;
            }
        };

        return <TextField id={textFieldId}
                          key={textFieldId}
                          inputRef={this.inputField}
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
                          value={this.state.value2 || ""}
                          inputProps={
                              {
                                  size: size,
                                  maxLength: maxLength,
                                  type: type,
                              }
                          }
                          onBlur={onBlur}
                          onChange={onChange}
                          onKeyDown={onKeyDown}
        />
    }

    placeholder() {
        throw new Error("Not yet implemented: placeholder");
    }

    size() {
        throw new Error("Not yet implemented: size");
    }

    maxLength() {
        throw new Error("Not yet implemented: maxLength");
    }

    /**
     * This becomes the type=value of the INPUT field.
     */
    type() {
        return "text";
    }

    /**
     * Takes the given string which may be empty and creates a value.
     */
    stringToValue(string) {
        throw new Error("Not yet implemented: stringToValue");
    }
}