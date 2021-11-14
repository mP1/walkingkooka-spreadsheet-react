import Equality from "../../Equality.js";
import PropTypes from "prop-types";
import React from 'react';
import Slider from "@material-ui/core/Slider";
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";
import SystemEnum from "../../SystemEnum.js";

/**
 * Shows the enum values of an SystemEnum as a slider, and inserts an extra mark called Default if a default value is also present in the metadata.
 */
export default class SpreadsheetSettingsWidgetSlider extends SpreadsheetSettingsWidgetValue {

    constructor(props) {
        super(props);

        this.sliderRef = React.createRef();
    }

    focus() {
        // slider.focus doesnt work, give focus to the thumb
        this.giveFocus(this.sliderRef.current.querySelector("[role=slider]"));
    }

    renderValue(id, value, defaultValue) {
        const {props} = this;

        const includeDefaultValue = null != defaultValue;
        const valueOffset = includeDefaultValue ? 1 : 0;

        const marks = [];

        if(includeDefaultValue){
            marks.push({
                label: "Default",
                value: 0,
            })
        }

        const values = props.values;
        values.forEach((v, i) => {
            marks.push({
                label: v.nameCapitalCase(),
                value: i + valueOffset,
            });
        });

        const sliderId = id + "-Slider";
        const sliderValue = valueOffset + values.findIndex((e) => Equality.safeEquals(e, value));

        const onChange = (e, newValue) => {
            this.setState({
                value: includeDefaultValue ?
                    newValue == 0 ? null : values[newValue - valueOffset] :
                    this.values[newValue]
            });
        }

        return <Slider id={sliderId}
                       key={sliderId}
                       ref={this.sliderRef}
                       min={0}
                       max={marks.length - valueOffset}
                       marks={marks}
                       value={sliderValue}
                       onChange={onChange}
                       style={props.style}
        />;
    }
}

SpreadsheetSettingsWidgetSlider.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(
    PropTypes.instanceOf(SystemEnum),
    {
        style: PropTypes.object.isRequired,
        values: PropTypes.array.isRequired,
    }
);