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

    constructor(props) {
        super(props);

        this.getValue = props.getValue;
        this.setValue = props.setValue;

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
     * If the reference changed load the new formula text and then give focus to the textField.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        const state = this.state;
        const reference = state.reference;

        console.log("componentDidUpdate formula reference " + prevState.reference + " to " + reference + " state", state);

        const textField = this.textField.current;
        if(textField) {
            textField.disabled = !state.edit;
        }

        if(!Equality.safeEquals(reference, prevState.reference)){
            if(state.edit){
                this.reloadFormulaText(reference);

                const tokens = SpreadsheetHistoryHash.parse(this.history.location.pathname);
                if(!state.focused && tokens[SpreadsheetHistoryHash.CELL_FORMULA]){
                    this.giveInputFocus();
                }
            }else {
                this.setState({
                    value: null,
                });
            }
        }
    }

    reloadFormulaText(reference) {
        console.log("reloadFormulaText " + reference);

        this.getValue(reference, (formulaText) => {
            console.log("reloadFormulaText latest formulaText for " + reference + " is " + formulaText);

            this.setState({
                value: formulaText,
            });
        });
    }

    onHistoryChange(tokens) {
        const state = this.state;
        const sameCell = Equality.safeEquals(state.reference, tokens.reference);
        const newEdit = tokens.edit && !state.edit;
        if(sameCell){
            if(newEdit){
                //different cell selected clear formula from being selected.
                const replacements = {};
                replacements[SpreadsheetHistoryHash.CELL_FORMULA] = false;
                SpreadsheetHistoryHash.parseMergeAndPush(this.history, replacements);
            }
        }

        if(tokens[SpreadsheetHistoryHash.CELL_FORMULA] && !state.focused) {
            this.giveInputFocus();
        }

        // if a reference is present the formula text should also be editable.
        const reference = tokens[SpreadsheetHistoryHash.CELL];
        const edit = !!reference;
        this.setState({
            reference: reference,
            edit: edit,
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
        const setValue = this.setValue;

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
        const replacement = {};
        replacement[SpreadsheetHistoryHash.CELL_FORMULA] = focused;
        SpreadsheetHistoryHash.parseMergeAndPush(this.history, replacement);

        this.setState({
            focused: focused,
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
        this.setValue(this.state.reference, value);
        this.setState({"value": value});
    }
}

SpreadsheetFormulaWidget.propTypes = {
    history: PropTypes.object.isRequired,
    getValue: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
}