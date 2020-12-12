import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from "prop-types";

/**
 * A widget that supports editing formula text. The widget is disabled when state.reference is falsey.
 * An falsey value will disable the text box used to edit the formula text.
 * ENTER calls the setter, ESCAPE reloads the initial value(text).
 */
export default class SpreadsheetFormulaWidget extends React.Component {

    constructor(props) {
        super(props);

        const initialValue = props.value;
        const reference = props.reference;

        this.state = {
            value: initialValue,
            reference: reference,
        };
        this.initialValue = initialValue;
        this.setValue = props.setValue;
        this.textField = React.createRef();
        this.input = React.createRef();
    }

    focus() {
        giveFocus(this.input.current, "giving focus");
    }

    render() {
        const state = this.state;
        const {reference, value} = state;
        const setValue = this.setValue;

        console.log("render " + (reference ? reference : "disabled") + " formula: \"" + (value || "") + "\"");

        // disable if setValue is unavailable
        return (
            <TextField ref={this.textField}
                       key={[reference, value, setValue]}
                       id={"formula-text"}
                       defaultValue={value}
                       disabled={!reference}
                       fullWidth={true}
                       onKeyDown={this.onKeyDown.bind(this)}
                       placeholder={(reference && reference.toString()) || ""}
                       inputProps={{
                           style: {
                               padding: "2px",
                           }
                       }}
                       inputRef={this.input}
            />
        );
    }

    /**
     * If the reference changed give focus to the textField.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        const widget = this.input.current;
        const reference = this.state.reference;
        const previous = prevState.reference;

        if (reference && !reference.equals(previous)) {
            giveFocus(widget, "formula getting focus, reference changed from " + previous + " to " + reference);
        }
    }

    // KEY HANDLING.....................................................................................................

    /**
     * ESCAPE reloads the initial formula, ENTER saves the cell with the current formula text.
     */
    onKeyDown(event) {
        switch (event.key) {
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
        this.setValue(value);
        this.setState({"value": value});
    }
}

SpreadsheetFormulaWidget.propTypes = {
    value: PropTypes.string.isRequired,
    setValue: PropTypes.func, // missing indicates disabled
}

function giveFocus(widget, message) {
    if (widget) {
        setTimeout(() => {
            console.log(message);
            widget.focus()
        }, 10);
    }
}