import Equality from "../Equality.js";
import PropTypes from "prop-types";
import React from 'react';
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import TextField from '@material-ui/core/TextField';

/**
 * A widget that supports editing formula text. The widget is disabled when state.cellOrLabel is falsey.
 * An falsey value will disable the text box used to edit the formula text.
 * ENTER calls the setter, ESCAPE reloads the initial value(text).
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

    stateFromHistoryTokens(historyTokens) {
        const state = this.state || {};

        // if a cellOrLabel is present the formula text should also be editable.
        const cellOrLabel = historyTokens[SpreadsheetHistoryHash.CELL];
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
        historyTokens[SpreadsheetHistoryHash.CELL] = cellOrLabel;
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

        this.props.getValue(
            cellOrLabel,
            (cellReference, formulaText) => {
                console.log("reloadFormulaText latest formulaText for " + cellOrLabel + "/" + cellReference + " is " + formulaText);

                this.setState({
                    cell: cellReference,
                    cellOrLabel: cellOrLabel,
                    value: formulaText,
                    reload: false,
                });

                giveFocus && this.giveInputFocus();
            },
            (e) => {
                this.setState({
                    giveFocus: false,
                    reload: false,
                });

                this.showError(e);
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
        const {cell, edit, value} = state;

        console.log("render " + (!edit ? "disabled" : "enabled") + " formula: \"" + (value || "") + "\"", state);

        return (
            <TextField ref={this.textField}
                       key={[cell, value]}
                       id={"formula-TextField"}
                       defaultValue={value}
                       disabled={!edit}
                       onBlur={this.onBlur.bind(this)}
                       onFocus={this.onFocus.bind(this)}
                       onKeyDown={this.onKeyDown.bind(this)}
                       placeholder={(cell && cell.toString()) || ""}
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
        this.updateFormulaHash("onBlur", false);
    }

    /**
     * Add the formula portion to the history hash
     */
    onFocus(e) {
        this.updateFormulaHash("onFocus", true);
    }

    updateFormulaHash(eventName, focused) {
        console.log("updateFormulaHash " + eventName + " focused: " + focused);
        const tokens = {};
        tokens[SpreadsheetHistoryHash.CELL_FORMULA] = focused;
        this.historyParseMergeAndPush(tokens);

        this.setState({
            focused: focused,
            giveFocus: false,
        })
    }

    /**
     * ESCAPE reloads the initial formula, ENTER saves the cell with the current formula text.
     */
    onKeyDown(e) {
        switch(e.key) {
            case "Escape":
                this.onEscapeKey(e);
                break;
            case "Enter":
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
        })
    }

    /**
     * ENTER saves the formula content.
     */
    onEnterKey(e) {
        const value = e.target.value;
        this.props.setValue(this.state.cell, value);
        this.setState({"value": value});
    }
}

SpreadsheetFormulaWidget.propTypes = {
    history: PropTypes.object.isRequired,
    getValue: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
}