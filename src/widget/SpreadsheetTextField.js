import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropTypes from "prop-types";

/**
 * A component that is initially a button and when clicked turns into a TextField with the value ready to edit.
 * When ENTER is pressed the onValueChange handler is invoked. When either ENTER or ESC are pressed the component returns
 * to be disabled and only viewable.
 */
// TODO stop Button capitalizing spreadsheet name
// TODO make button & textfields have the same padding/margin etc
export default class SpreadsheetTextField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            value: props.value
        };
        this.setValue = props.setValue;

        this.ref = React.createRef();

        console.log("SpreadsheetTextField ctor: " + this.props.value);
    }

    componentDidMount() {
        document.addEventListener('mousedown', (event) => this.handleClickOutside(event));
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', (event) => this.handleClickOutside(event));
    }

    /**
     * Abort editing if the user clicked outside
     */
    handleClickOutside(event) {
        if (this.ref && this.ref.current && !this.ref.current.contains(event.target)) {
            this.stopEditing(event);
        }
    }

    render() {
        return this.state.edit ?
            this.renderEditTextField() :
            this.renderButtonClickToEdit();
    }

    // VIEW ............................................................................................................

    handleButtonClick(event) {
        this.setState({edit: true});
    }

    renderButtonClickToEdit() {
        return (<Button onClick={() => this.handleButtonClick()}>{this.state.value}</Button>);
    }

    // EDIT ............................................................................................................

    handleKeyDown(event) {
        switch (event.key) {
            case "Escape":
                this.handleEscapeKey(event);
                break;
            case "Enter":
                this.handleEnterKey(event);
                break;
            default:
            // ignore other keys
        }
    }

    // ignore any value in the TextField and display the button with the original value
    handleEscapeKey(event) {
        this.stopEditing(event);
    }

    // update the value and fire an event with the updated value
    handleEnterKey(event) {
        this.stopEditing(event);
        this.setValue(event.target.value);
    }

    stopEditing(event) {
        event.preventDefault();
        this.setState({edit: false});
    }

    renderEditTextField() {
        return (<TextField
            ref={this.ref}
            fullWidth={true}
            onKeyDown={(event) => this.handleKeyDown(event)}
            defaultValue={this.state.value}
            autoFocus/>);
    }
}

SpreadsheetTextField.propTypes = {
    value: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
}