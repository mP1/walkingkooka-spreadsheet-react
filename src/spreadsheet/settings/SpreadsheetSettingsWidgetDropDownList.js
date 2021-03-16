import PropTypes from "prop-types";
import React from 'react';
import Select from '@material-ui/core/Select';
import SpreadsheetSettingsWidgetValue from "./SpreadsheetSettingsWidgetValue.js";
import SystemEnum from "../../SystemEnum.js";

/**
 * Shows the enum values using a drop down list. This is preferred because over slider because of too many options.
 */
export default class SpreadsheetSettingsWidgetDropDownList extends SpreadsheetSettingsWidgetValue {

    constructor(props) {
        super(props);

        this.values = props.values;

        this.state = {
            open: false,
            value: props.value,
        }
    }

    renderInput(id, value) {
        const dropDownListId = id + "-DropDownList";

        return <Select id={dropDownListId}
                       key={dropDownListId}
                       native={true}
                       fullWidth={true}
                       open={this.state.open}
                       onClose={this.onClose.bind(this)}
                       onOpen={this.onOpen.bind(this)}
                       value={this.state.value}
                       onChange={this.onChange.bind(this)}>
            {
                this.defaultValue ? <option aria-label="" value=""/> : undefined
            }
            {
                this.values.map(v => <option key={v.nameCapitalCase()} value={v}>{v.nameCapitalCase()}</option>)
            }
        </Select>;
    }

    onOpen() {
        this.setOpen(true);
    }

    onClose() {
        this.setOpen(false);
    }

    setOpen(open) {
        this.setState(
            {
                open: open,
            }
        )
    }

    onChange(e) {
        const value = e.target.value;
        this.setValue(this.values.find(v => v.toString() === value));
    }

    /**
     * Handles the setDefault button being clicked, clearing the value, which lets the default be used and also clears the TextField.
     */
    onSetDefaultValue() {
        console.log("onSetDefaultValue");
        this.setValue(this.defaultValue);
    }
}

SpreadsheetSettingsWidgetDropDownList.propTypes = Object.assign(
    SpreadsheetSettingsWidgetValue.createPropTypes(PropTypes.instanceOf(SystemEnum)),
    {
        values: PropTypes.arrayOf(SystemEnum),
    }
);

SpreadsheetSettingsWidgetDropDownList.propTypes = SpreadsheetSettingsWidgetValue.createPropTypes(
    PropTypes.instanceOf(SystemEnum),
    {
        values: PropTypes.array.isRequired,
    }
);