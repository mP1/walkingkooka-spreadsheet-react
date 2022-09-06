import PropTypes from 'prop-types';
import React from 'react';
import SpreadsheetCellStylePropertyWidget from "./SpreadsheetCellStylePropertyWidget.js";
import SpreadsheetHistoryHash from "../../../history/SpreadsheetHistoryHash.js";
import ToggleButton from "@mui/material/ToggleButton";

/**
 * A button that holds and displays the style for a cell/cell-range with support for updating the property when clicked.
 */
export default class SpreadsheetCellStylePropertyToggleButtonGroupWidget extends SpreadsheetCellStylePropertyWidget {

    // $selected figure out how to select a ToggleButton
    render0(enabled, selected, linkUrl, clicked) {
        return <ToggleButton id={this.id()}
                             disabled={!enabled}
                             color="primary"
                             size="small"
                             style={{textTransform: "none"}}
                             href={linkUrl}
                             onChange={clicked}
                             selected={selected}
                             value={this.props.propertyValue}
        >{this.props.label}</ToggleButton>
    }
}

SpreadsheetCellStylePropertyToggleButtonGroupWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    label: PropTypes.string.isRequired,
    propertyName: PropTypes.string.isRequired,
    propertyValues: PropTypes.object, // might be null
}