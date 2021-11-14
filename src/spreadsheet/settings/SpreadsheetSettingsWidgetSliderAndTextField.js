import Keys from "../../Keys.js";
import PropTypes from "prop-types";
import React from 'react';
import Slider from "@material-ui/core/Slider";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";
import TextField from "@material-ui/core/TextField";

/**
 * Shows a slider that allows editing of a number including min/max support and translation to a similar number value
 * such as Length.
 */
export default class SpreadsheetSettingsWidgetSliderAndTextField extends SpreadsheetSettingsWidgetValue {

    constructor(props) {
        super(props);

        this.textFieldRef = React.createRef();
    }

    focus() {
        this.giveFocus(this.textFieldRef.current);
    }

    renderValue(id, value) {
        const sliderId = id + "-Slider";
        const numberTextFieldId = id + "-NumberTextField";

        const props = this.props;
        const {valueToNumber, min, max, marks, step, style} = props;

        const numericValue = valueToNumber(value);

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
                       value={numericValue != null ? String(numericValue) : ""}
                       inputProps={
                           {
                               min: min,
                               max: max,
                               type: "number",
                               maxLength: 2,
                           }
                       }
                       onChange={(e) => {
                           const value = e.target.value;
                           this.onChangeNumber("" === value ? null : parseInt(value, 10));
                       }}
                       onKeyDown={this.onKeyDown.bind(this)}
            />,
            <Slider id={sliderId}
                    key={[sliderId, value]} // key requires value to force re-rendering.
                    min={min}
                    max={max}
                    step={step}
                    marks={marks}
                    value={numericValue}
                    onChange={(e, newValue) => this.onChangeNumber(newValue)}
                    style={style}/>,
        ];
    }

    onChangeNumber(number) {
        const props = this.props;
        const value = props.numberToValue(number);

        console.log(this.prefix() + ".onChangeNumber " + props.property + " number=" + number + ", value=" + value);
        this.setState({
            value: value,
        });
    }

    /**
     * Watches out for ESCAPE and reloads the last saved value.
     */
    onKeyDown(e) {
        switch(e.key) {
            case Keys.ESCAPE:
                this.setState({
                    value: this.state.savedValue,
                });
                break;
            default:
                break;
        }
    }
}

SpreadsheetSettingsWidgetSliderAndTextField.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(
    PropTypes.number,
    {
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        marks: PropTypes.array.isRequired,
        step: PropTypes.number, // null is acceptable
        numberToValue: PropTypes.func.isRequired, // happens before a save Metadata
        valueToNumber: PropTypes.func.isRequired, // converts a value to a number.
    }
);
