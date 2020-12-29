import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";
import React from 'react';
import TextField from '@material-ui/core/TextField';

/**
 * A component that is initially a button and when clicked turns into a TextField with the value ready to edit.
 * When ENTER is pressed the setValue handler is invoked with the new text value.
 * When either ENTER or ESC are pressed the component returns to be disabled and only viewable.
 */
export default class SpreadsheetButtonTextField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            edit: props.edit,
            value: props.value
        };
        this.id = props.id;
        this.setValue = props.setValue;
        this.setEdit = props.setEdit;

        this.textField = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', (event) => this.handleClickOutside(event));
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', (event) => this.handleClickOutside(event));
    }

    edit(mode) {
        this.setState({
            edit: mode,
        })
    }

    /**
     * Abort editing if the user clicked outside
     */
    handleClickOutside(event) {
        const widget = this.textField.current;
        if (widget && !widget.contains(event.target)) {
            event.preventDefault();
            this.setEdit(false);
        }
    }

    render() {
        return this.state.edit ?
            this.renderEditTextField() :
            this.renderButtonClickToEdit();
    }

    // VIEW ............................................................................................................

    handleButtonClick(event) {
        this.setEdit(true);
    }

    // material design UI buttons are text-transform: uppercased.
    renderButtonClickToEdit() {
        return (<Button
            id={this.id}
            className={this.props.className}
            onClick={() => this.handleButtonClick()}
            style={{textTransform: "none"}}
        >{this.state.value}</Button>);
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
        event.preventDefault();
        this.setEdit(false);
    }

    // update the value and fire an event with the updated value
    handleEnterKey(event) {
        const value = event.target.value;
        this.setValue(value);
        this.setState({"value": value});
    }

    renderEditTextField() {
        return (<TextField ref={this.textField}
                           id={this.id}
                           className={this.props.className}
                           fullWidth={true}
                           margin={"none"}
                           onKeyDown={(event) => this.handleKeyDown(event)}
                           defaultValue={this.state.value}
                           autoFocus/>);
    }
}

SpreadsheetButtonTextField.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
    setEdit: PropTypes.func.isRequired,
}