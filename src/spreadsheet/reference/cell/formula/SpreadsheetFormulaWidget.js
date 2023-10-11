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
import SpreadsheetToolbarWidget from "../toolbar/SpreadsheetToolbarWidget.js";
import SpreadsheetViewportWidget from "../../viewport/SpreadsheetViewportWidget.js";
import TextField from '@mui/material/TextField';

/**
 * A widget that supports editing formula text.
 * ENTER calls the setter, ESCAPE reloads the initial value(text).
 */
export default class SpreadsheetFormulaWidget extends SpreadsheetCellWidget {

    init() {
        this.textField = React.createRef();
        this.input = React.createRef();
    }

    initialStateFromProps(props) {
        const historyHashTokens = props.history.tokens();

        return {
            viewport: historyHashTokens[SpreadsheetHistoryHash.VIEWPORT],
            window: [],
        }
    }

    /**
     * Filter only interested in cell or labels and load/edit or save formula actions.
     */
    stateFromHistoryTokens(historyTokens) {
        const viewportToken = historyTokens[SpreadsheetHistoryHashTokens.VIEWPORT];
        const state = {
            viewport: viewportToken,
            cellReference: null,
        };

        // clear cellReference which will also hide formula textbox if column | row | any range
        if(viewportToken instanceof SpreadsheetCellHistoryHashToken){
            const viewport = viewportToken.viewport();
            const selection = viewport.selection();
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
            viewport: viewportToken,
        } = state;

        let historyTokens;

        if(viewportToken instanceof SpreadsheetCellFormulaHistoryHashToken){
            historyTokens = viewportToken.spreadsheetFormulaWidgetExecute(
                this,
                prevState.viewport
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
            viewport: viewportToken,
            cellReference,
        } = this.state;

        const onBlur = (e) => {
            const newState = {
                focused: false,
            };

            const newTarget = e.relatedTarget;

            // if newTarget is viewport
            if(SpreadsheetViewportWidget.viewportContains(newTarget)){
                // do nothing let viewport update history
                this.log(".onBlur new target is viewport, will let viewport update history");
            }else {
                if(SpreadsheetToolbarWidget.toolbarContains(newTarget)) {
                    this.log(".onBlur new target is toolbar, will let toolbar update history");
                } else {
                    if(
                        !newTarget ||
                        SpreadsheetFormulaWidget.formulaContains(newTarget)
                    ){
                        this.log(".onBlur new target is outside formula & NOT viewport setting selection cell select");

                        this.historyPushViewportSelect();
                    }
                }
            }

            this.setState(newState);
        }

        const onFocus = (e) => {
            const viewportToken = this.state.viewport;
            this.log(".onFocus " + viewportToken + " " + (viewportToken && new SpreadsheetCellFormulaEditHistoryHashToken(viewportToken.viewport())), this.state);

            this.setState({
                focused: true,
                viewport: viewportToken && new SpreadsheetCellFormulaEditHistoryHashToken(viewportToken.viewport()),
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

                    this.historyPushViewport(
                        new SpreadsheetCellFormulaSaveHistoryHashToken(
                            this.state.viewport.viewport(),
                            e.target.value
                        )
                    );
                    break;
                default:
                // nothing special to do for other keys
            }
        }

        const visibility = viewportToken instanceof SpreadsheetCellHistoryHashToken && cellReference ?
            "visible" :
            "hidden";

        return (
            <TextField ref={this.textField}
                       id={SpreadsheetFormulaWidget.FORMULA_TEXT_FIELD_ID}
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
            const viewportToken = this.state.viewport;

            if(viewportToken instanceof SpreadsheetCellHistoryHashToken){
                const viewport = viewportToken.viewport();
                const selection = viewport.selection();

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
    showError: PropTypes.func.isRequired,
}
