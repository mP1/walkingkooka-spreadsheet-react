import Equality from "../../Equality.js";
import React from 'react';
import Slider from "@material-ui/core/Slider";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";
import PropTypes from "prop-types";
import SystemEnum from "../../SystemEnum.js";

/**
 * Shows the enum values of an SystemEnum as a slider.
 * Note the marks and values for the slider will have the first slot reserved for the "Default" value. Clicking
 * default will result in setValue being called with null.
 */
export default class SpreadsheetSettingsWidgetSlider extends SpreadsheetSettingsWidgetValue {

    constructor(props) {
        super(props);

        const values = props.values;
        const marks = [];

        const defaultValue = props.defaultValue;
        const defaultValueOffset = defaultValue ? 1 : 0;
        this.defaultValueOffset = defaultValueOffset;

        if(defaultValue) {
            marks.push({
                label: "Default",
                value: 0,
            });
        }

        props.values.forEach((v, i) => {
            marks.push({
                label: v.nameCapitalCase(),
                value: i + defaultValueOffset,
            });
        });
        this.values = values;
        this.marks = marks;
        this.style = props.style;
    }

    renderInput(id, value) {
        const {defaultValueOffset, marks} = this;
        const sliderId = id + "-Slider";
        const sliderValue = this.props.values.findIndex((e) => Equality.safeEquals(e, value)) + defaultValueOffset;

        return <Slider id={sliderId}
                       key={sliderId}
                       defaultValue={0}
                       min={0}
                       max={marks.length - 1}
                       marks={marks}
                       value={sliderValue}
                       onChange={this.onChange.bind(this)}
                       style={this.style}
        />;
    }

    onChange(e, newValue) {
        this.setValue(
            newValue > 0 ?
                this.values[newValue - this.defaultValueOffset] :
                null
        );
    }

    /**
     * Handles the setDefault button being clicked, clearing the value, which lets the default be used and also clears the TextField.
     */
    onSetDefaultValue() {
        this.setValue(null);
    }
}

SpreadsheetSettingsWidgetSlider.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(
    PropTypes.instanceOf(SystemEnum),
    {
        style: PropTypes.object.isRequired,
        values: PropTypes.array.isRequired,
    }
);