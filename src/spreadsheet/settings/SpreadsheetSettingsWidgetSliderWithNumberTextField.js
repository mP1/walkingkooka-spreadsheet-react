import PropTypes from "prop-types";
import React from 'react';
import Slider from "@material-ui/core/Slider";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";
import TextField from "@material-ui/core/TextField";
import Keys from "../../Keys.js";

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

        this.textFieldRef = React.createRef();
        this.sliderRef = React.createRef();
    }

    onStateValueChange(value) {
        this.setSliderAndTextField(value);
    }

    renderInput(id, value) {
        const {min, max, marks, step} = this;

        const sliderId = id + "-Slider";
        const numberTextFieldId = id + "-NumberTextField";

        return [
            <TextField id={numberTextFieldId}
                       key={numberTextFieldId}
                       ref={this.textFieldRef}
                       style={
                           {
                               marginRight: "4px",
                               width: "100px",
                           }
                       }
                       margin="none"
                       disabled={false}
                       InputLabelProps={
                           {
                               shrink: true,
                               tabIndex: 0,
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
            />,
            <Slider id={sliderId}
                    key={[sliderId, value]} // key requires value to force re-rendering.
                    ref={this.sliderRef}
                    defaultValue={this.defaultValueIndex}
                    min={min}
                    max={max}
                    step={step}
                    marks={marks}
                    value={value ? value : 0}
                    onChange={this.onChangeSlider.bind(this)}
                    style={this.style}/>,
        ];
    }

    onChangeSlider(e, newValue) {
        this.onChange(newValue);
    }

    onChangeTextField(e) {
        this.onChange(parseInt(e.target.value, 10));
    }

    onChange(value) {
        console.log("onChange " + value);
        this.setValue(isNaN(value) ? null : value);
        this.setSliderAndTextField(value);
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
     * Useful event handler for TextFields, the current value of the text field is converted into a value and then
     * setValue called.
     */
    onKeyDown(e) {
        switch(e.key) {
            case Keys.ESCAPE:
                this.onSetDefaultValue();
                break;
            case Keys.ENTER:
                this.setValue(this.createValue(e.target.value));
                break;
            default:
                // nothing special to do for other keys
                break;
        }
    }

    createValue(text) {
        return text === "" ? null : parseInt(text, 10);
    }

    /**
     * Handles the setDefault button being clicked, clearing the value, which lets the default be used and also clears the TextField.
     */
    onSetDefaultValue() {
        console.log("onSetDefaultValue");
        this.setValue(this.defaultValue);
    }

    setSliderAndTextField(value) {
        const textField = this.textFieldRef.current;
        if(textField){
            textField.value = null !== value ? value : "";
            this.sliderRef.current.value = value;
        }
    }
}

SpreadsheetSettingsWidgetSliderWithNumberTextField.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(
    PropTypes.number,
    {
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        marks: PropTypes.array.isRequired,
        step: PropTypes.number, // null is acceptable
    }
);
