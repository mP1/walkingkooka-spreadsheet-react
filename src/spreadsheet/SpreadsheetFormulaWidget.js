import Equality from "../Equality.js";
import PropTypes from "prop-types";
import React from 'react';
import SpreadsheetHistoryAwareWidget from "./history/SpreadsheetHistoryAwareWidget.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import TextField from '@material-ui/core/TextField';

/**
 * A widget that supports editing formula text. The widget is disabled when state.reference is falsey.
 * An falsey value will disable the text box used to edit the formula text.
 * ENTER calls the setter, ESCAPE reloads the initial value(text).
 */
export default class SpreadsheetFormulaWidget extends SpreadsheetHistoryAwareWidget {

    init() {
        this.textField = React.createRef();
        this.input = React.createRef();
        this.state = {};
    }

    /**
     * If the formula is being edited, fetch the formula text and update the displayed text.
     */
    reloadIfEditing() {
        const state = this.state;
        if(null != state.value){
            this.reloadFormulaText(state.reference);
        }
    }

    /**
     * Attempts to update state from the given tokens.
     */
    onHistoryChange(tokens) {
        const state = this.state;

        // if a reference is present the formula text should also be editable.
        const reference = tokens[SpreadsheetHistoryHash.CELL];
        const formula = tokens[SpreadsheetHistoryHash.CELL_FORMULA];
        const edit = !!reference;
        const giveFocus = edit && formula && !state.focused && !state.giveFocus;

        if(!Equality.safeEquals(reference, state.reference) || edit != state.edit || giveFocus){
            this.setState({
                reference: reference,
                edit: edit,
                giveFocus: giveFocus,
            });
        }
    }

    /**
     * If the reference changed load the new formula text and then give focus to the textField.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        const state = this.state;
        const {reference, edit, focused, giveFocus} = state;

        console.log("componentDidUpdate formula reference " + prevState.reference + " to " + reference + " state", state);

        const tokens = {};
        tokens[SpreadsheetHistoryHash.CELL] = reference;
        tokens[SpreadsheetHistoryHash.CELL_FORMULA] = focused;
        
        // if not formula editing, disable textField
        const textField = this.textField.current;
        if(textField){
            textField.disabled = !edit;
        }

        // if different reference
        if(!Equality.safeEquals(reference, prevState.reference)){
            if(edit){
                this.reloadFormulaText(reference, giveFocus);
            }else {
                this.setState({
                    value: null,
                    giveFocus: false,
                });
            }
        } else {
            if(edit && giveFocus) {
                this.giveInputFocus();
                this.setState({
                    giveFocus: false,
                });
            }
        }

        this.parseMergeAndPush(tokens);
    }

    reloadFormulaText(reference, giveFocus) {
        console.log("reloadFormulaText " + reference);

        this.props.getValue(reference, (formulaText) => {
            console.log("reloadFormulaText latest formulaText for " + reference + " is " + formulaText);

            this.setState({
                value: formulaText,
                giveFocus: false,
            });

            giveFocus && this.giveInputFocus();
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
        const {reference, edit, value} = state;
        const setValue = this.props.setValue;

        console.log("render " + (!edit ? "disabled" : "enabled") + " formula: \"" + (value || "") + "\"", state);

        return (
            <TextField ref={this.textField}
                       key={[reference, value, setValue]}
                       id={"formula-TextField"}
                       defaultValue={value}
                       disabled={!edit}
                       fullWidth={true}
                       onBlur={this.onBlur.bind(this)}
                       onFocus={this.onFocus.bind(this)}
                       onKeyDown={this.onKeyDown.bind(this)}
                       placeholder={(reference && reference.toString()) || ""}
                       inputProps={{
                           maxLength: 8192,
                           style: {
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
    onBlur(event) {
       this.updateFormulaHash("onBlur", false);
    }

    /**
     * Add the formula portion to the history hash
     */
    onFocus(event) {
        this.updateFormulaHash("onFocus", true);
    }

    updateFormulaHash(eventName, focused) {
        console.log("updateFormulaHash " + eventName + " focused: " + focused);
        const replacement = {};
        replacement[SpreadsheetHistoryHash.CELL_FORMULA] = focused;
        SpreadsheetHistoryHash.parseMergeAndPush(this.history, replacement, this.props.showError);

        this.setState({
            focused: focused,
            giveFocus: false,
        })
    }

    /**
     * ESCAPE reloads the initial formula, ENTER saves the cell with the current formula text.
     */
    onKeyDown(event) {
        switch(event.key) {
            case "Escape":
                this.onEscapeKey(event);
                break;
            case "Enter":
                this.onEnterKey(event);
                break;
            default:
            // nothing special to do for other keys
        }
    }

    /**
     * ESCAPE reloads the formula text.
     */
    onEscapeKey(event) {
        this.setState({
            value: this.initialValue,
        })
    }

    /**
     * ENTER saves the formula content.
     */
    onEnterKey(event) {
        const value = event.target.value;
        this.props.setValue(this.state.reference, value);
        this.setState({"value": value});
    }
}

SpreadsheetFormulaWidget.propTypes = {
    history: PropTypes.object.isRequired,
    getValue: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
}