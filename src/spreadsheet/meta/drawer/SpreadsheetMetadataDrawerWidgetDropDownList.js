import PropTypes from "prop-types";
import React from 'react';
import Select from '@mui/material/Select';
import SpreadsheetMetadataDrawerWidgetValue from "./SpreadsheetMetadataDrawerWidgetValue.js";
import SystemEnum from "../../../SystemEnum.js";

/**
 * Shows the enum values using a drop down list. This is preferred because over slider when there are too many values,
 * which would not fit on a slider.
 */
export default class SpreadsheetMetadataDrawerWidgetDropDownList extends SpreadsheetMetadataDrawerWidgetValue {

    constructor(props) {
        super(props);

        this.selectRef = React.createRef();
    }

    focus() {
        this.giveFocus(
            () => this.selectRef.current
        );
    }

    renderValue(id, value) {
        const dropDownListId = id + "-DropDownList";

        const {props, state} = this;

        const setOpen = (open) => {
            this.setState({
                open: open,
            });
        };

        const onChange = (e) => {
            const value = e.target.value;

            this.setState({
                value: this.props.values.find(v => v.toString() === value)
            });
        };

        return <Select id={dropDownListId}
                       key={dropDownListId}
                       native={true}
                       fullWidth={true}
                       open={Boolean(state.open)}
                       onClose={() => setOpen(false)}
                       onOpen={() => setOpen(true)}
                       value={value || ""}
                       onChange={onChange}
                       inputProps={{
                           style: {
                               paddingTop: "8px",
                               paddingBottom: "8px",
                           }
                       }}
        >
            {
                state.defaultValue ? <option aria-label="" value=""/> : undefined
            }
            {
                props.values.map(v => <option key={v.nameCapitalCase()} value={v}>{v.nameCapitalCase()}</option>)
            }
        </Select>;
    }
}

SpreadsheetMetadataDrawerWidgetDropDownList.propTypes = Object.assign(
    SpreadsheetMetadataDrawerWidgetValue.createPropTypes(PropTypes.instanceOf(SystemEnum)),
    {
        values: PropTypes.array.isRequired,
    }
);