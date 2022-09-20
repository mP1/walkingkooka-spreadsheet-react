import ButtonGroup from "@mui/material/ButtonGroup";
import Equality from "../../../../Equality.js";
import PropTypes from 'prop-types';
import React from 'react';
import SpreadsheetCellStylePropertyWidget from "./SpreadsheetCellStylePropertyWidget.js";
import SpreadsheetCellStyleSaveHistoryHashToken from "./SpreadsheetCellStyleSaveHistoryHashToken.js";
import SpreadsheetHistoryHash from "../../../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";
import ToggleButton from "@mui/material/ToggleButton";

/**
 * A ButtonGroup with a few extra smarts like updating the history hash depending on whether it has focus or is blurred.
 */
export default class SpreadsheetCellStylePropertyButtonGroupWidget extends SpreadsheetCellStylePropertyWidget {

    init() {
        this.focusElementTarget = React.createRef();
    }

    renderStyleWidget(onFocus, onBlur) {
        const {
            labels,
            propertyName,
            values,
        } = this.props;

        const {
            spreadsheetId,
            spreadsheetName,
            viewportSelection: viewportSelectionToken,
            cellOrRange, // viewportSelection.selection() might be a label, $cellORange never is
            cellToValue, // A1 to cell.style().get($propertyName)
        } = this.state;

        // must be a SpreadsheetExpressionReference
        const viewportSelection = viewportSelectionToken && viewportSelectionToken.viewportSelection();

        const buttons = [];
        var i = 0;

        for(const value of values) {
            const viewportSelectionToken = new SpreadsheetCellStyleSaveHistoryHashToken(
                viewportSelection,
                propertyName,
                value,
            );

            const tokens = SpreadsheetHistoryHash.emptyTokens();
            tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = spreadsheetId;
            tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = spreadsheetName;
            tokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION] = viewportSelectionToken;

            const linkUrl = "#" + SpreadsheetHistoryHash.stringify(tokens);

            const onClick = () => {
                this.log(".onClick " + linkUrl);
                this.historyPushViewportSelection(viewportSelectionToken);
            };

            var selected = false;
            if(cellOrRange) {
                for(const cell of cellOrRange.values()) {
                    const cellValue = cellToValue[cell.toString()];
                    if(cellValue) {
                        if(Equality.safeEquals(
                            value,
                            cellValue
                        )) {
                            selected = true;
                            break;
                        }
                    }
                }
            }

            this.log(".render " + propertyName +" selected=" + selected + " linkUrl=" + linkUrl);

            const id = SpreadsheetCellStylePropertyWidget.computeId(propertyName, value);

            buttons.push(
                <ToggleButton key={id}
                              ref={0 === i ? this.focusElementTarget : null}
                              id={id}
                              color="primary"
                              size="small"
                              style={{textTransform: "none"}}
                              href={linkUrl}
                              onChange={onClick}
                              selected={selected}
                              value={this.props.propertyValue || null}
                              tabIndex={0}
                >{labels[i]}</ToggleButton>
            );

            i++;
        }

        return <ButtonGroup id={this.id()}
                            variant="contained"
                            aria-label="outlined primary button group"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            tabIndex={0}
        >{buttons}</ButtonGroup>;
    }

    focusElement() {
        return this.focusElementTarget.current;
    }
}

SpreadsheetCellStylePropertyButtonGroupWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetToolbarWidget: PropTypes.object.isRequired, // PropTypes.instanceOf(SpreadsheetToolbarWidget).isRequired
    propertyName: PropTypes.string.isRequired,
    propertyValue: PropTypes.object, // could be null
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    values: PropTypes.arrayOf(PropTypes.object).isRequired,
}