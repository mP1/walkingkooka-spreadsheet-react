import CharSequences from "../CharSequences.js";
import Equality from "../Equality.js";
import ImmutableMap from "../util/ImmutableMap.js";
import Keys from "../Keys.js";
import PropTypes from "prop-types";
import React from 'react';
import SpreadsheetCell from "./SpreadsheetCell.js";
import SpreadsheetCellReferenceOrLabelName from "./reference/SpreadsheetCellReferenceOrLabelName.js";
import SpreadsheetDelta from "./engine/SpreadsheetDelta.js";
import SpreadsheetFormula from "./SpreadsheetFormula.js";
import SpreadsheetFormulaLoadAndEditHistoryHashToken from "./history/SpreadsheetFormulaLoadAndEditHistoryHashToken.js";
import SpreadsheetFormulaSaveHistoryHashToken from "./history/SpreadsheetFormulaSaveHistoryHashToken.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetLabelName from "./reference/SpreadsheetLabelName.js";
import SpreadsheetMessengerCrud from "./message/SpreadsheetMessengerCrud.js";
import TextField from '@material-ui/core/TextField';
import TextStyle from "../text/TextStyle.js";

/**
 * A widget that supports editing formula text.
 * ENTER calls the setter, ESCAPE reloads the initial value(text).
 * <ul>
 *     <li>SpreadsheetCell cell: The cell being edited</li>
 *     <li>SpreadsheetCellReference cellReference: The cell reference of the cell being edited.</li>
 *     <li>boolean focused: true indicates the text field has focus</li>
 * </ul>
 */
export default class SpreadsheetFormulaWidget extends SpreadsheetHistoryAwareStateWidget {

    init() {
        this.textField = React.createRef();
        this.input = React.createRef();
    }

    initialStateFromProps(props) {
        return {
            edit: false,
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.onSpreadsheetDeltaRemover = this.props.spreadsheetDeltaCellCrud.addListener(this.onSpreadsheetDelta.bind(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.onSpreadsheetDeltaRemover && this.onSpreadsheetDeltaRemover();
        delete this.onSpreadsheetDeltaRemover;
    }

    /**
     * Filter only interested in cell or labels and load/edit or save formula actions.
     */
    stateFromHistoryTokens(historyTokens) {
        console.log("historyTokens: " + SpreadsheetHistoryHash.stringify(historyTokens));

        return {
            selection: historyTokens[SpreadsheetHistoryHash.SELECTION],
            selectionAction: historyTokens[SpreadsheetHistoryHash.SELECTION_ACTION],
        }
    }

    historyTokensFromState(prevState) {
        const historyTokens = {};

        const state = this.state;
        const {selection, cellReference, focused} = state;
        var {selectionAction} = state;

        console.log("historyTokensFromState: " + selection + " " + selectionAction, state);

        if(selection instanceof SpreadsheetCellReferenceOrLabelName) {
            const load = selectionAction instanceof SpreadsheetFormulaLoadAndEditHistoryHashToken;
            const save = selectionAction instanceof SpreadsheetFormulaSaveHistoryHashToken;

            const previousSelectionAction = prevState.selectionAction;
            const previousLoad = previousSelectionAction instanceof SpreadsheetFormulaLoadAndEditHistoryHashToken;
            const previousSave = previousSelectionAction instanceof SpreadsheetFormulaSaveHistoryHashToken;

            const differentCell = !Equality.safeEquals(selection, prevState.selection);
            if(differentCell) {
                console.log("historyTokensFromState formula from " + prevState.selection + " to " + selection + " state", state);
            }

            // if load but not save OR different cell
            if((load && ((!previousLoad & !previousSave) | differentCell))) {
                this.loadFormulaText(selection);
            }

            if(save){
                this.saveFormulaText(cellReference, selection, selectionAction.formulaText());
                selectionAction = new SpreadsheetFormulaLoadAndEditHistoryHashToken();
            }

            // update UI, if not formula editing, disable textField
            const textField = this.textField.current;
            if(textField){
                textField.disabled = !(load || (previousLoad && save));

                // if textField does not have focus and not save -> load give focus.
                if(!focused && load && !previousSave) {
                    this.giveInputFocus();
                }
            }

            historyTokens[SpreadsheetHistoryHash.SELECTION] = selection;
            historyTokens[SpreadsheetHistoryHash.SELECTION_ACTION] = selectionAction;
        }

        return historyTokens;
    }

    /**
     * Loads the SpreadsheetDelta for the given cell or label.
     */
    loadFormulaText(cellOrLabel) {
        console.log("loadFormulaText " + cellOrLabel);

        this.props.spreadsheetDeltaCellCrud.get(
            cellOrLabel,
            {},
            (message, error) => {
                this.setState({
                    selection: null,
                    selectionAction: null,
                });

                this.showError(message, error);
            }
        );
    }

    /**
     * Saves the given formula text to the given cell, including the creation of new cells that were previously empty.
     * This assumes that the cell being saved has been loaded.
     */
    saveFormulaText(cellReference, selection, formulaText) {
        console.log("saving formula for " + selection + " with " + CharSequences.quoteAndEscape(formulaText));

        var cell = this.state.cell;
        if(cell){
            const formula = cell.formula();
            cell = cell.setFormula(formula.setText(formulaText));
        }else {
            cell = new SpreadsheetCell(cellReference, new SpreadsheetFormula(formulaText), TextStyle.EMPTY);
        }

        const tokens = {};
        tokens[SpreadsheetHistoryHash.SELECTION_ACTION] = new SpreadsheetFormulaLoadAndEditHistoryHashToken();
        this.historyParseMergeAndPush(tokens);

        const props = this.props;
        props.spreadsheetDeltaCellCrud.post(
            cellReference,
            new SpreadsheetDelta(
                null,
                [cell],
                [],
                [],
                ImmutableMap.EMPTY,
                ImmutableMap.EMPTY,
                null
            ),
            props.showError,
        );
    }
    
    giveInputFocus() {
        const input = this.input.current;
        input && setTimeout(() => {
            input.focus();
        }, 10);
    }

    render() {
        const state = this.state;
        const {selection, value} = state;

        const edit = selection;

        console.log("render " + (!edit ? "disabled" : "enabled") + " formula: \"" + (value || "") + "\"", state);

        return (
            <TextField ref={this.textField}
                       id={"formula-TextField"}
                       value={value}
                       disabled={!edit}
                       onBlur={this.onBlur.bind(this)}
                       onFocus={this.onFocus.bind(this)}
                       onChange={this.onChange.bind(this)}
                       onKeyDown={this.onKeyDown.bind(this)}
                       inputProps={{
                           maxLength: 8192,
                           style: {
                               minWidth: "500px",
                               padding: "2px",
                           }
                       }}
                       inputRef={this.input}
            />
        );
    }

    // KEY HANDLING.....................................................................................................

    /**
     * Remove the formula portion of history hash
     */
    onBlur(e) {
        const tokens = {};
        tokens[SpreadsheetHistoryHash.SELECTION_ACTION] = null;

        this.historyParseMergeAndPush(tokens);
    }

    /**
     * Add the formula portion to the history hash
     */
    onFocus(e) {
        const tokens = {};
        tokens[SpreadsheetHistoryHash.SELECTION_ACTION] = new SpreadsheetFormulaLoadAndEditHistoryHashToken();

        this.historyParseMergeAndPush(tokens);
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
        e.preventDefault();

        const historyTokens = {};
        historyTokens[SpreadsheetHistoryHash.SELECTION] = this.state.selection;
        historyTokens[SpreadsheetHistoryHash.SELECTION_ACTION] = new SpreadsheetFormulaSaveHistoryHashToken(e.target.value);
        this.historyParseMergeAndPush(historyTokens);
    }

    onSpreadsheetDelta(method, cellOrLabel, queryParameters, requestDelta, responseDelta) {
        switch(method) {
            case "GET":
            case "POST":
                this.onSpreadsheetDeltaLoad(cellOrLabel, responseDelta);
                break;
            default:
                break;
        }
    }

    /**
     * Check the load if it includes the cell formula being edited and updates state to match.
     */
    onSpreadsheetDeltaLoad(loadCellOrLabel, delta) {
        const state = this.state;
        const selection = state.selection;

        if(selection instanceof SpreadsheetCellReferenceOrLabelName){
            const cell = delta.cell(selection);

            const cellReference = selection instanceof SpreadsheetLabelName ?
                delta.cellReference(selection) :
                selection;
            const formulaText = cell ? cell.formula().text() : "";
            console.log("loaded formulaText for " + selection + " is " + CharSequences.quoteAndEscape(formulaText));

            this.setState({
                cell: cell,
                cellReference: cellReference,
                selection: selection,
                value: formulaText,
                reload: false,
            });

            this.input.current.value = formulaText;
        }
    }
}

SpreadsheetFormulaWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetDeltaCellCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    showError: PropTypes.func.isRequired,
}
