import PropTypes from "prop-types";
import React from 'react';
import Slider from "@material-ui/core/Slider";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";
import TextField from "@material-ui/core/TextField";

/**
 * Shows a slider with min/max along with a text box which accepts only numbers
 */
export default class SpreadsheetSettingsWidgetSliderWithNumberTextField extends SpreadsheetSettingsWidgetValue {

    constructor(props) {
        super(props);

        this.style = props.style;

        this.min = props.min;
        this.max = props.max;
        this.marks = props.marks;
        this.step = props.step;
    }

    renderInput(id, value) {
        const {min, max, marks, step} = this;

        const sliderId = id + "-Slider";
        const numberTextFieldId = id + "-NumberTextField";

        return [
            <Slider id={sliderId}
                    key={sliderId}
                    defaultValue={this.defaultValueIndex}
                    min={min}
                    max={max}
                    step={step}
                    marks={marks}
                    value={value}
                    onChange={this.onChangeSlider.bind(this)}
                    style={this.style}/>,
            <TextField id={numberTextFieldId}
                       key={numberTextFieldId}
                       style={
                           {
                               marginRight: "4px",
                           }
                       }
                       fullWidth
                       margin="none"
                       disabled={false}
                       InputLabelProps={
                           {
                               shrink: true,
                           }
                       }
                       value={value}
                       inputProps={
                           {
                               min: min,
                               max: max,
                               type: "number",
                               maxLength: 5,
                           }
                       }
                       onChange={this.onChangeTextField.bind(this)}
                       onBlur={this.onBlur.bind(this)}
                       onKeyDown={this.onKeyDown.bind(this)}
            />
        ];
    }

    onChangeSlider(e, newValue) {
        this.onChange(newValue);
    }

    onChangeTextField(e) {
        this.onChange(parseInt(e.target.value));
    }

    onChange(value) {
        console.log("onChange " + value);
        this.setValue(value);
    }

    /**
     * When the TextField is blurred update the SpreadsheetMetadata.
     */
    onBlur(e) {
        const string = e.target.value;
        console.log("onBlur " + string);

        this.setValue(parseInt(string));
    }

    /**
     * Handles the setDefault button being clicked, clearing the value, which lets the default be used and also clears the TextField.
     */
    onSetDefaultValue() {
        console.log("onSetDefaultValue");
        this.setValue(this.defaultValue);
    }
}

SpreadsheetSettingsWidgetSliderWithNumberTextField.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(
    PropTypes.number,
    {
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        marks: PropTypes.array.isRequired,
        step: PropTypes.object, // null is acceptable
    }
);
