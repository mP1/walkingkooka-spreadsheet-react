import Color from "../../../../color/Color.js";
import {ColorPicker, createColor} from "material-ui-color";
import PropTypes from 'prop-types';
import React from 'react';
import SpreadsheetCellStyleEditHistoryHashToken from "./SpreadsheetCellStyleEditHistoryHashToken.js";
import SpreadsheetCellStylePropertyWidget from "./SpreadsheetCellStylePropertyWidget.js";
import SpreadsheetCellStyleSaveHistoryHashToken from "./SpreadsheetCellStyleSaveHistoryHashToken.js";
import SpreadsheetHistoryHash from "../../../history/SpreadsheetHistoryHash.js";

const BLACK = createColor(0);

/**
 * A color picker widget that allows viewing and editing a color value.
 */
export default class SpreadsheetCellStylePropertyColorPickerWidget extends SpreadsheetCellStylePropertyWidget {

    init() {
        this.focusElementTarget = React.createRef();
    }

    renderStyleWidget(onFocus, onBlur) {
        const {
            propertyName,
        } = this.props;

        const {
            viewportSelection: viewportSelectionToken,
            cellOrRange, // viewportSelection.selection() might be a label, $cellORange never is
            cellToValue, // A1 to cell.style().get($propertyName)
        } = this.state;

        // open the picker if editing...
        const open = viewportSelectionToken instanceof SpreadsheetCellStyleEditHistoryHashToken &&
            viewportSelectionToken.propertyName() === propertyName;

        // // must be a SpreadsheetExpressionReference
        const viewportSelection = viewportSelectionToken && viewportSelectionToken.viewportSelection();

        const onChange = (newColor) => {
            this.log(".onChange " + newColor, newColor);

            const viewportSelectionToken = new SpreadsheetCellStyleSaveHistoryHashToken(
                viewportSelection,
                propertyName,
                Color.parse("#" + newColor.hex),
            );

            this.historyPushViewportSelection(viewportSelectionToken);
        };

        // pick the first color
        let colorPropertyValue = BLACK;
        if(cellOrRange) {
            for(const cell of cellOrRange.values()) {
                const cellValue = cellToValue[cell.toString()];
                if(cellValue) {
                    colorPropertyValue = createColor(cellValue ? cellValue.toString() : "");
                    break;
                }
            }
        }

        this.log(".render " + propertyName + " = #" + colorPropertyValue.hex + " open: " + open);

        return <ColorPicker id={this.id()}
                            disableAlpha={true}
                            hideTextfield={true}
                            openAtStart={open}
                            value={colorPropertyValue}
                            onBlur={onBlur}
                            onChange={onChange}
                            onFocus={onFocus}
                            onOpen={onFocus}
        />;
    }

    focusElement() {
        return this.focusElementTarget.current; // TODO might need a better way to give focus to a style editing widget
    }
}

SpreadsheetCellStylePropertyColorPickerWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetToolbarWidget: PropTypes.object.isRequired, // PropTypes.instanceOf(SpreadsheetToolbarWidget).isRequired
    propertyName: PropTypes.string.isRequired,
    propertyValue: PropTypes.object, // could be null
}