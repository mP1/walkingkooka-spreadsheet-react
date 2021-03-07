import Equality from "../Equality.js";
import PropTypes from "prop-types";
import React from 'react';
import TextField from '@material-ui/core/TextField';
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";

/**
 * A widget that supports editing formula text. The widget is disabled when state.reference is falsey.
 * An falsey value will disable the text box used to edit the formula text.
 * ENTER calls the setter, ESCAPE reloads the initial value(text).
 */
export default class SpreadsheetFormulaWidget extends React.Component {

    constructor(props) {
        super(props);

        this.history = props.history;
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

    componentDidMount() {
        this.historyUnlisten = this.history.listen(this.onHistoryChange.bind(this));
    }

    componentWillUnmount() {
        this.historyUnlisten();
    }

    /**
     * If the reference changed load the new formula text and then give focus to the textField.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        const state = this.state
        const reference = state.reference;

        console.log("componentDidUpdate formula reference " + prevState.reference + " to " + reference + " state", state);

        if(!Equality.safeEquals(reference, prevState.reference)){
            if(state.edit){
                this.reloadFormulaText(reference);
            }else {
                this.setState({
                    value: null,
                    giveFocus: false,
                })
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

    /**
     * Updates the state from the history hash
     */
    onHistoryChange(location) {
        const pathname = location.pathname;
        console.log("onHistoryChange from " + pathname + " to " + this.history.location.pathname);

        this.setState(this.loadHistoryHash(pathname));
    }

    /**
     * Loads the state cell, edit flag from the history hash.
     */
    loadHistoryHash(pathname) {
        const tokens = SpreadsheetHistoryHash.parse(pathname);

        return {
            reference: tokens[SpreadsheetHistoryHash.CELL],
            edit: tokens[SpreadsheetHistoryHash.CELL_FORMULA],
        };
    }

    render() {
        const state = this.state;
        const {reference, value} = state;
        const setValue = this.setValue;

        console.log("render " + (null == value ? "disabled" : "enabled") + " formula: \"" + (value || "") + "\"");
        return (
            <TextField ref={this.textField}
                       key={[reference, value, setValue]}
                       id={"formula-TextField"}
                       defaultValue={value}
                       disabled={null == value}
                       fullWidth={true}
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