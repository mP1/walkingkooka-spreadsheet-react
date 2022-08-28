import CharSequences from "../../../../CharSequences.js";
import Keys from "../../../../Keys.js";
import PropTypes from "prop-types";
import React from 'react';
import selectHistoryHashToken from "../../../history/selectHistoryHashToken.js";
import SpreadsheetCell from "../../../SpreadsheetCell.js";
import SpreadsheetCellFormulaEditHistoryHashToken from "./SpreadsheetCellFormulaEditHistoryHashToken.js";
import SpreadsheetCellFormulaHistoryHashToken from "./SpreadsheetCellFormulaHistoryHashToken.js";
import SpreadsheetCellFormulaSaveHistoryHashToken from "./SpreadsheetCellFormulaSaveHistoryHashToken.js";
import SpreadsheetCellHistoryHashToken from "../SpreadsheetCellHistoryHashToken.js";
import SpreadsheetCellReference from "../SpreadsheetCellReference.js";
import SpreadsheetCellWidget from "../SpreadsheetCellWidget.js";
import SpreadsheetExpressionReference from "../../SpreadsheetExpressionReference.js";
import SpreadsheetFormula from "./SpreadsheetFormula.js";
import SpreadsheetHistoryHash from "../../../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelName from "../../label/SpreadsheetLabelName.js";
import SpreadsheetMessengerCrud from "../../../message/SpreadsheetMessengerCrud.js";
import SpreadsheetViewportSelection from "../../viewport/SpreadsheetViewportSelection.js";
import SpreadsheetViewportWidget from "../../viewport/SpreadsheetViewportWidget.js";
import TextField from '@mui/material/TextField';
import TextStyle from "../../../../text/TextStyle.js";

/**
 * A widget that supports editing formula text.
 * ENTER calls the setter, ESCAPE reloads the initial value(text).
 */
export default class SpreadsheetFormulaWidget extends SpreadsheetCellWidget {

    static TEXT_FIELD_ID = "formula-TextField";

    init() {
        this.textField = React.createRef();
        this.input = React.createRef();
    }

    initialStateFromProps(props) {
        const historyHashTokens = props.history.tokens();

        return {
            selection: historyHashTokens[SpreadsheetHistoryHash.SELECTION],
            window: [],
        }
    }

    /**
     * Filter only interested in cell or labels and load/edit or save formula actions.
     */
    stateFromHistoryTokens(historyTokens) {
        const selection = historyTokens[SpreadsheetHistoryHashTokens.SELECTION];
        const state = {
            selection: selection,
            cellReference: null,
        };

        // clear clearReference which will also hide formula textbox if column | row | any range
        if(selection instanceof SpreadsheetCellHistoryHashToken){
            const viewportSelection = selection.viewportSelection();
            const selectionSelection = viewportSelection.selection();
            if(selectionSelection instanceof SpreadsheetCellReference){
                state.cellReference = selectionSelection;
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
            selection,
            cellReference,
            focused,
        } = state;

        const historyTokens = SpreadsheetHistoryHashTokens.emptyTokens();

        if(selection instanceof SpreadsheetCellHistoryHashToken){
            const viewportSelection = selection.viewportSelection();
            const selectionSelection = viewportSelection.selection();

            const previousSelection = prevState.selection;
            const previousSelectionSelection = previousSelection && previousSelection.viewportSelection()
                .selection();

            // user must have just clicked/tab formula textbox update history to formula edit
            if(focused){
                historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = new SpreadsheetCellFormulaEditHistoryHashToken(viewportSelection);
            }

            // always do the save and if focused change history to formula edit or clear selection.
            if(selection instanceof SpreadsheetCellFormulaSaveHistoryHashToken){
                this.saveFormulaText(
                    cellReference,
                    selection.formulaText(),
                    selectionSelection,
                    viewportSelection.anchor()
                );

                historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = focused ?
                    selectHistoryHashToken(viewportSelection) :
                    null;
            }

            // if NOT focused and history is formula edit give focus.
            if(selection instanceof SpreadsheetCellFormulaEditHistoryHashToken && !(previousSelection instanceof SpreadsheetCellFormulaHistoryHashToken)){
                this.giveFocus(this.giveFormulaFocus.bind(this));
            }

            // unconditionally if selection.selection changed load text and selection is not a save then load text
            if(!selectionSelection.equalsIgnoringKind(previousSelectionSelection) && !(selection instanceof SpreadsheetCellFormulaSaveHistoryHashToken)){
                this.loadFormulaText(selectionSelection);
            }

        }else {
            // not cell and focus has been lost therefore clear history/selection.
            if(!selection && !focused){
                historyTokens[SpreadsheetHistoryHashTokens.SELECTION] = null;
            }
        }

        return historyTokens;
    }

    /**
     * Loads the SpreadsheetDelta for the given cell or label.
     */
    loadFormulaText(cellOrLabel) {
        this.log(".loadFormulaText " + cellOrLabel);

        this.props.spreadsheetDeltaCellCrud.get(
            cellOrLabel,
            {},
            (message, error) => {
                this.setState({
                    cellReference: null,
                    selection: null,
                });

                this.showError(message, error);
            }
        );
    }

    saveFormulaText(cellReference, formulaText, selection, anchor) {
        this.log(" Saving formula for " + cellReference + " with " + CharSequences.quoteAndEscape(formulaText));

        this.patchCell(
            new SpreadsheetCell(
                cellReference,
                new SpreadsheetFormula(formulaText),
                TextStyle.EMPTY
            )
        );

        const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
        tokens[SpreadsheetHistoryHashTokens.SELECTION] = new SpreadsheetCellFormulaEditHistoryHashToken(
            new SpreadsheetViewportSelection(
                selection,
                anchor
            )
        );
        this.historyParseMergeAndPush(tokens);
    }

    giveFormulaFocus() {
        var element;
        if(this.state.selection instanceof SpreadsheetCellFormulaEditHistoryHashToken){
            // if textField does not have focus and not save -> load give focus.
            if(this.textField.current){
                this.log(" Formula not focused so giving focus to: " + this.input.current);

                element = this.input.current;
            }
        }

        return element;
    }

    render() {
        const {
            value,
            selection,
            cellReference,
        } = this.state;

        const visibility = selection instanceof SpreadsheetCellHistoryHashToken && cellReference ?
            "visible" :
            "hidden";

        return (
            <TextField ref={this.textField}
                       id={SpreadsheetFormulaWidget.TEXT_FIELD_ID}
                       defaultValue={value}
                       onBlur={this.onBlur.bind(this)}
                       onFocus={this.onFocus.bind(this)}
                       onChange={this.onChange.bind(this)}
                       onKeyDown={this.onKeyDown.bind(this)}
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

    // EVENTS..........................................................................................................

    onBlur(e) {
        const newTarget = e.relatedTarget;
        const inside = this.textField.current.contains(newTarget);
        this.log(".onBlur new target is " + (inside ? "inside" : "outside"));

        if(!inside) {
            const newState = {
                focused: false,
            };

            const viewport = document.getElementById(SpreadsheetViewportWidget.VIEWPORT_ID);
            if(!(viewport.contains(newTarget))){
               // new target not viewport better clear selection
               newState.selection = null;
            }

            this.setState(newState);
        }
    }

    onFocus(e) {
        const selection = this.state.selection;
        this.log(".onFocus " + selection + " " + (selection && new SpreadsheetCellFormulaEditHistoryHashToken(selection.viewportSelection())),  this.state);

        this.setState({
            focused: true,
            selection: selection && new SpreadsheetCellFormulaEditHistoryHashToken(selection.viewportSelection()),
        });
    }

    onChange(e) {
        this.setState({
            value: e.target.value || "",
        });
    }

    /**
     * ESCAPE reloads the initial formula, ENTER saves the cell with the current formula text.
     */
    onKeyDown(e) {
        switch(e.key) {
            case Keys.ESCAPE:
                this.onEscapeKey(e);
                break;
            case Keys.ENTER:
                this.onEnterKey(e);
                break;
            default:
            // nothing special to do for other keys
        }
    }

    /**
     * ESCAPE reloads the formula text.
     */
    onEscapeKey(e) {
        this.setState({
            value: this.initialValue,
        });
    }

    /**
     * ENTER saves the formula content.
     */
    onEnterKey(e) {
        this.log(".onEnter");

        e.preventDefault();

        const selection = this.state.selection;
        this.setState({
                selection: new SpreadsheetCellFormulaSaveHistoryHashToken(
                    selection.viewportSelection(),
                    e.target.value
                )
            });
    }

    /**
     * If the delta includes an updated formula text for the cell being edited update text.
     */
    onSpreadsheetDelta(method, cellOrLabel, url, requestDelta, responseDelta) {
        const {
            selection,
        }   = this.state;

        if(selection instanceof SpreadsheetCellHistoryHashToken){
            const viewportSelection = selection.viewportSelection();
            const selectionSelection = viewportSelection.selection();
            if(selectionSelection instanceof SpreadsheetExpressionReference){
                // check if selection was loaded.
                var formulaText = "";

                const cellReference = selectionSelection instanceof SpreadsheetLabelName ?
                    responseDelta.cellReference(selectionSelection) :
                    selectionSelection;

                const cell = responseDelta.cell(selectionSelection);

                if(cell){
                    formulaText = cell.formula().text();
                }else {
                    if(responseDelta.deletedCells().find(deleted => deleted.equals(cellReference))){
                        this.log(".onSpreadsheetDelta cell " + selectionSelection + " deleted, formula cleared");
                    }
                }

                this.input.current.value = formulaText;

                var newState = {
                    cellReference: cellReference,
                    value: formulaText,
                    window: responseDelta.window(),
                };

                this.setState(newState);
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
