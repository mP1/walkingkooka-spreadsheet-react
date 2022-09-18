import Keys from "../../../../Keys.js";
import PropTypes from "prop-types";
import React from 'react';
import SpreadsheetCellFormulaEditHistoryHashToken from "./SpreadsheetCellFormulaEditHistoryHashToken.js";
import SpreadsheetCellFormulaHistoryHashToken from "./SpreadsheetCellFormulaHistoryHashToken.js";
import SpreadsheetCellFormulaSaveHistoryHashToken from "./SpreadsheetCellFormulaSaveHistoryHashToken.js";
import SpreadsheetCellHistoryHashToken from "../SpreadsheetCellHistoryHashToken.js";
import SpreadsheetCellReference from "../SpreadsheetCellReference.js";
import SpreadsheetCellWidget from "../SpreadsheetCellWidget.js";
import SpreadsheetExpressionReference from "../../SpreadsheetExpressionReference.js";
import SpreadsheetHistoryHash from "../../../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelName from "../../label/SpreadsheetLabelName.js";
import SpreadsheetMessengerCrud from "../../../message/SpreadsheetMessengerCrud.js";
import SpreadsheetToolbarWidget from "../SpreadsheetToolbarWidget.js";
import SpreadsheetViewportWidget from "../../viewport/SpreadsheetViewportWidget.js";
import TextField from '@mui/material/TextField';

/**
 * A widget that supports editing formula text.
 * ENTER calls the setter, ESCAPE reloads the initial value(text).
 */
export default class SpreadsheetFormulaWidget extends SpreadsheetCellWidget {

    static TEXT_FIELD_ID = "formula-TextField";

    /**
     * Returns true if the given element is a child of the root of this widget.
     */
    static contains(element) {
        return document.getElementById(SpreadsheetFormulaWidget.TEXT_FIELD_ID)
            .contains(element);
    }

    init() {
        this.textField = React.createRef();
        this.input = React.createRef();
    }

    initialStateFromProps(props) {
        const historyHashTokens = props.history.tokens();

        return {
            viewportSelection: historyHashTokens[SpreadsheetHistoryHash.VIEWPORT_SELECTION],
            window: [],
        }
    }

    /**
     * Filter only interested in cell or labels and load/edit or save formula actions.
     */
    stateFromHistoryTokens(historyTokens) {
        const viewportSelectionToken = historyTokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION];
        const state = {
            viewportSelection: viewportSelectionToken,
            cellReference: null,
        };

        // clear cellReference which will also hide formula textbox if column | row | any range
        if(viewportSelectionToken instanceof SpreadsheetCellHistoryHashToken){
            const viewportSelection = viewportSelectionToken.viewportSelection();
            const selection = viewportSelection.selection();
            if(selection instanceof SpreadsheetCellReference){
                state.cellReference = selection;
            }
        }else {
            // not a selection there clear focus.
            if(this.focused){
                state.focused = false;
            }
        }

        return state;
    }

    historyTokensFromState(prevState) {
        const state = this.state;
        const {
            viewportSelection: viewportSelectionToken,
        } = state;

        let historyTokens;

        if(viewportSelectionToken instanceof SpreadsheetCellFormulaHistoryHashToken){
            historyTokens = viewportSelectionToken.spreadsheetFormulaWidgetExecute(
                this,
                prevState.viewportSelection
            );
        }

        return historyTokens;
    }

    isFocused() {
        return this.state.focused;
    }

    giveFormulaTextBoxFocus() {
        this.giveFocus(
            () => {
                this.log(" giving focus to Formula textbox");
                return this.input.current;
            }
        );
    }

    /**
     * Loads the SpreadsheetDelta for the given cell or label.
     */
    loadFormulaText(cellOrLabel) {
        this.log(".loadFormulaText " + cellOrLabel);

        this.loadCell(cellOrLabel);
    }

    render() {
        const {
            value,
            viewportSelection: viewportSelectionToken,
            cellReference,
        } = this.state;

        const onBlur = (e) => {
            const newState = {
                focused: false,
            };

            const newTarget = e.relatedTarget;

            // if newTarget is viewport
            if(SpreadsheetViewportWidget.contains(newTarget)){
                // do nothing let viewport update history
                this.log(".onBlur new target is viewport, will let viewport update history");
            }else {
                if(SpreadsheetToolbarWidget.contains(newTarget)) {
                    this.log(".onBlur new target is toolbar, will let toolbar update history");
                } else {
                    if(
                        !newTarget ||
                        SpreadsheetFormulaWidget.contains(newTarget)
                    ){
                        this.log(".onBlur new target is outside formula & NOT viewport setting selection cell select");

                        this.historyPushViewportSelectionSelect();
                    }
                }
            }

            this.setState(newState);
        }

        const onFocus = (e) => {
            const viewportSelectionToken = this.state.viewportSelection;
            this.log(".onFocus " + viewportSelectionToken + " " + (viewportSelectionToken && new SpreadsheetCellFormulaEditHistoryHashToken(viewportSelectionToken.viewportSelection())), this.state);

            this.setState({
                focused: true,
                viewportSelection: viewportSelectionToken && new SpreadsheetCellFormulaEditHistoryHashToken(viewportSelectionToken.viewportSelection()),
            });
        }

        const onChange = (e) => {
            this.setState({
                value: e.target.value || "",
            });
        }

        /**
         * ESCAPE reloads the initial formula, ENTER saves the cell with the current formula text.
         */
        const onKeyDown = (e) => {
            switch(e.key) {
                case Keys.ESCAPE:
                    this.setState({
                        value: this.initialValue,
                    });
                    break;
                case Keys.ENTER:
                    this.log(".onEnter");

                    e.preventDefault();

                    this.historyPushViewportSelection(
                        new SpreadsheetCellFormulaSaveHistoryHashToken(
                            this.state.viewportSelection.viewportSelection(),
                            e.target.value
                        )
                    );
                    break;
                default:
                // nothing special to do for other keys
            }
        }

        const visibility = viewportSelectionToken instanceof SpreadsheetCellHistoryHashToken && cellReference ?
            "visible" :
            "hidden";

        return (
            <TextField ref={this.textField}
                       id={SpreadsheetFormulaWidget.TEXT_FIELD_ID}
                       defaultValue={value}
                       onBlur={onBlur}
                       onChange={onChange}
                       onFocus={onFocus}
                       onKeyDown={onKeyDown}
                       inputProps={{
                           maxLength: 8192,
                           style: {
                               width: "100%",
                               padding: "2px",
                           }
                       }}
                       inputRef={this.input}
                       style={{
                           flexGrow: 1,
                           visibility: visibility,
                       }}
            />
        );
    }

    /**
     * If the delta includes an updated formula text for the cell being edited update text.
     */
    onSpreadsheetDelta(method, cellOrLabel, url, requestDelta, responseDelta) {
        if(responseDelta) {
            const viewportSelectionToken = this.state.viewportSelection;

            if(viewportSelectionToken instanceof SpreadsheetCellHistoryHashToken){
                const viewportSelection = viewportSelectionToken.viewportSelection();
                const selection = viewportSelection.selection();

                if(selection instanceof SpreadsheetExpressionReference){
                    const cellReference = selection instanceof SpreadsheetLabelName ?
                        responseDelta.cellReference(selection) :
                        selection;

                    const cell = responseDelta.cell(selection);

                    var formulaText = "";
                    if(cell){
                        formulaText = cell.formula().text();
                    }else {
                        if(responseDelta.deletedCells().find(deleted => deleted.equals(cellReference))){
                            this.log(".onSpreadsheetDelta cell " + selection + " deleted, formula cleared");
                        }
                    }

                    this.input.current.value = formulaText;

                    this.setState({
                        cellReference: cellReference,
                        value: formulaText,
                        window: responseDelta.window(),
                    });
                }
            }
        }
    }
}

SpreadsheetFormulaWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetDeltaCellCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    spreadsheetViewportWidget: PropTypes.object, // Ref with SpreadsheetViewportWidget
    showError: PropTypes.func.isRequired,
}
