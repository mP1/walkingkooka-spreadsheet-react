import CharSequences from "../CharSequences.js";
import Equality from "../Equality.js";
import ImmutableMap from "../util/ImmutableMap.js";
import Keys from "../Keys.js";
import PropTypes from "prop-types";
import React from 'react';
import SpreadsheetCell from "./SpreadsheetCell.js";
import SpreadsheetDelta from "./engine/SpreadsheetDelta.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetFormula from "./SpreadsheetFormula.js";
import SpreadsheetLabelName from "./reference/SpreadsheetLabelName.js";
import SpreadsheetMessengerCrud from "./message/SpreadsheetMessengerCrud.js";
import TextField from '@material-ui/core/TextField';
import TextStyle from "../text/TextStyle.js";

/**
 * A widget that supports editing formula text. The widget is disabled when state.cellOrLabel is falsey.
 * An falsey value will disable the text box used to edit the formula text.
 * ENTER calls the setter, ESCAPE reloads the initial value(text).
 * <ul>
 *     <li>SpreadsheetCell cell: The cell being edited</li>
 *     <li>SpreadsheetCellOrLabelName cellOrLabel:  A reference of the formula being edited.</li>
 *     <li>SpreadsheetCellReference cellReference: The cell reference of the cell being edited.</li>
 *     <li>boolean edit: true indicates the widget is being edited, false it is disabled</li>
 *     <li>boolean giveFocus: true indicates a one time attempt to give focus to the formula TextField</li>
 *     <li>boolean reload: true indicates the formula text is being reloaded.</li>
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

        this.onSpreadsheetDeltaRemover = this.props.spreadsheetDeltaCrud.addListener(this.onSpreadsheetDelta.bind(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.onSpreadsheetDeltaRemover && this.onSpreadsheetDeltaRemover();
        delete this.onSpreadsheetDeltaRemover;
    }

    stateFromHistoryTokens(historyTokens) {
        const state = this.state || {};

        // if a cellOrLabel is present the formula text should also be editable.
        const cellOrLabel = historyTokens[SpreadsheetHistoryHash.SELECTION];
        const formula = historyTokens[SpreadsheetHistoryHash.CELL_FORMULA];
        const edit = !!cellOrLabel;
        const giveFocus = edit && formula && !state.focused && !state.giveFocus;

        var newState = {};

        if(!Equality.safeEquals(cellOrLabel, state.cellOrLabel) || edit !== state.edit || giveFocus){
            console.log("stateFromHistoryTokens: " + cellOrLabel + " newCellOrLabel: " + cellOrLabel + " old: " + state.cellOrLabel);

            newState = {
                cellOrLabel: cellOrLabel,
                edit: edit,
                giveFocus: giveFocus,
                reload: false,
            };
        }

        return newState;
    }

    historyTokensFromState(prevState) {
        const state = this.state;
        const {cellOrLabel, edit, focused, giveFocus, reload} = state;

        console.log("historyTokensFromState formula cell " + prevState.cellOrLabel + " to " + cellOrLabel + " state", state);

        const historyTokens = {};
        historyTokens[SpreadsheetHistoryHash.SELECTION] = cellOrLabel;
        historyTokens[SpreadsheetHistoryHash.CELL_FORMULA] = focused | giveFocus;

        // if not formula editing, disable textField
        const textField = this.textField.current;
        if(textField){
            textField.disabled = !edit;
        }

        // if different cell
        if(!Equality.safeEquals(cellOrLabel, prevState.cellOrLabel) || reload){
            if(edit){
                this.reloadFormulaText(cellOrLabel, giveFocus);
            }else {
                this.setState({
                    edit: false,
                    cell: null,
                    cellOrLabel: null,
                    value: null,
                    giveFocus: false,
                });
            }
        }else {
            if(edit && giveFocus){
                this.giveInputFocus();
            }
        }

        return historyTokens;
    }

    reloadFormulaText(cellOrLabel, giveFocus) {
        console.log("reloadFormulaText " + cellOrLabel + (giveFocus ? "giveFocus" : ""));

        this.props.spreadsheetDeltaCrud.get(
            cellOrLabel,
            {},
            (cellOrLabel, delta) => {
                const cell = delta.cell(cellOrLabel);
                const cellReference = cellOrLabel instanceof SpreadsheetLabelName ?
                    delta.cellReference(cellOrLabel) :
                    cellOrLabel;
                const formulaText = cell ? cell.formula().text() : "";
                console.log("loaded formulaText for " + cellOrLabel + " is " + CharSequences.quoteAndEscape(formulaText));

                this.setState({
                    cell: cell,
                    cellOrLabel: cellOrLabel,
                    cellReference: cellReference,
                    value: formulaText,
                    reload: false,
                });

                this.input.current.value =formulaText;

                giveFocus && this.giveInputFocus();
            },
            (message, error) => {
                this.setState({
                    giveFocus: false,
                    reload: false,
                });

                this.showError(message, error);
            });
    }

    giveInputFocus() {
        const input = this.input.current;
        input && setTimeout(() => {
            input.focus();
        }, 10);
    }

    render() {
        const state = this.state;
        const {edit, value} = state;

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
        this.setStateFocused("onBlur", false);
    }

    /**
     * Add the formula portion to the history hash
     */
    onFocus(e) {
        this.setStateFocused("onFocus", true);
    }

    setStateFocused(eventName, focused) {
        console.log("setStateFocused " + eventName + " focused: " + focused);

        this.setState({
            focused: focused,
            reload: focused,
            giveFocus: false,
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
        const formulaText = e.target.value;

        const props = this.props;
        const state = this.state;
        const {cellOrLabel, cellReference} = state;

        console.log("saving formula for " + cellOrLabel + " to " + CharSequences.quoteAndEscape(formulaText));

        var cell = state.cell;
        if(cell){
            const formula = cell.formula();
            cell = cell.setFormula(formula.setText(formulaText));
        }else {
            cell = new SpreadsheetCell(cellReference, new SpreadsheetFormula(formulaText), TextStyle.EMPTY);
        }

        props.spreadsheetDeltaCrud.post(
            cellOrLabel,
            new SpreadsheetDelta(
                [cell],
                [],
                ImmutableMap.EMPTY,
                ImmutableMap.EMPTY,
                []
            ),
            () => {
            },
            props.showError,
        );

        this.setState({"value": formulaText});
    }

    onChange(e) {
        this.setState({
            value: e.target.value || "",
        });
    }

    /**
     * Reload formula text whenever a cell is reloaded.
     */
    onSpreadsheetDelta(method, id, delta) {
        if("GET" === method) {
            const cellReference = this.state.cellReference;
            if(cellReference) {
                const cell = delta.referenceToCellMap().get(cellReference);
                if(cell) {
                    this.setState({
                        value: cell.formula().text() || "",
                        reload: false,
                    });
                }
            }
        }
    }
}

SpreadsheetFormulaWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetDeltaCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    showError: PropTypes.func.isRequired,
}
