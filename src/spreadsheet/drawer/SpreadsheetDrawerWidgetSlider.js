import React from 'react';
import Slider from "@material-ui/core/Slider";
import SpreadsheetDrawerWidgetValue from "./SpreadsheetDrawerWidgetValue.js";
import PropTypes from "prop-types";
import SystemEnum from "../../SystemEnum.js";

/**
 * Shows the enum values of RoundingMode as a slider.
 */
export default class SpreadsheetDrawerWidgetSlider extends SpreadsheetDrawerWidgetValue {

    constructor(props) {
        super(props);

        const values = props.values;
        const marks = [];

        values.forEach((v, i) =>  {
            marks.push({
                label: v.label(),
                value: i,
            });
        });
        this.values = values;
        this.marks = marks;

        // convert defaultValue to an index.
        const defaultValue = props.defaultValue;
        this.defaultValueIndex =  null != defaultValue ?
            values.indexOf(defaultValue) :
            defaultValue;
        this.style = props.style;
    }

    renderInput(id, value) {
        const {marks} = this;
        const sliderId = id + "-slider";

        return <Slider id={sliderId}
                       key={sliderId}
                       defaultValue={this.defaultValueIndex}
                       min={0}
                       max={marks.length - 1}
                       marks={marks}
                       value={this.value}
                       onChange={this.onChange.bind(this)}
                       style={this.style}
        />;
    }

    onChange(e, newValue) {
        this.setValue(this.values[newValue]);
    }

    /**
     * Handles the setDefault button being clicked, clearing the value, which lets the default be used and also clears the TextField.
     */
    onSetDefaultValue() {
        console.log("onSetDefaultValue");
        this.setValue(this.defaultValue);
    }
}

SpreadsheetDrawerWidgetSlider.propTypes = SpreadsheetDrawerWidgetValue.createPropTypes(PropTypes.instanceOf(SystemEnum));