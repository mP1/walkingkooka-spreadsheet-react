import Button from "@material-ui/core/Button";
import Equality from "../../Equality.js";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from "prop-types";
import React from 'react';

/**
 * A base class that calls a renderInput method during a render adding a button to set the default value to the right.
 */
export default class SpreadsheetDrawerWidgetValue extends React.Component {

    // value and defaultValue are not required because the SpreadsheetMetadata property may be absent.
    static createPropTypes(value) {
        return {
            id: PropTypes.string, // id used by cypress tests
            value: value, // Character: the value being displayed/edited
            defaultValue: value, // Character: this value is set when the default button is clicked.
            setValue: PropTypes.func, // if present editing/updates to the value are supported.
        };
    }

    constructor(props) {
        super(props);

        this.id = props.id;

        const initialValue = props.value;
        this.state = {
            value: initialValue,
        }
        this.initialValue = initialValue; // ESCAPE will reload the default.
        this.defaultValue = props.defaultValue;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const state = this.state;
        console.log("componentDidUpdate", this.id, "prevState", prevState, "state", state);

        const value = state.value;
        if(!Equality.safeEquals(prevState.value, value)){
            this.props.setValue(value);
        }
    }

    /**
     * Renders the only child to the left of a button which when clicked will set the default value.
     */
    render() {
        const id = this.id;
        const value = this.state.value;
        const defaultValue = this.defaultValue;

        console.log("render id=" + id + " value=" + value + " defaultValue=" + defaultValue);

        return (
            <div>
                <div>
                    <List style={
                        {
                            padding: 0,
                        }
                    }>
                        <ListItem
                            disableGutters={true}
                            style={
                                {
                                    padding: 0,
                                }
                            }
                        >
                            {this.renderInput(id, value)}
                            {
                                defaultValue &&
                                <Button id={id + "-button"}
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={this.onSetDefaultValue.bind(this)}>
                                    {defaultValue.toString()}
                                </Button>
                            }
                        </ListItem>
                    </List>
                </div>
            </div>
        );
    }

    /**
     * Rather than accept a child widget this "abstract" method is called during a render with its id and value.
     */
    renderInput(id, value) {
        throw new Error("renderInput not overridden");
    }

    /**
     * Handles the setDefault button is clicked.
     */
    onSetDefaultValue() {
        const defaultValue = this.defaultValue;
        console.log("onSetDefault " + defaultValue);
        this.setValue(defaultValue);
    }

    /**
     * Accepts the value and updates the state. It is assumed the value is already a value type and not String.
     */
    setValue(value) {
        console.log("setValue id=" + this.id + " value=" + value + " defaultValue=" + this.defaultValue);

        this.setState(
            {
                value: value,
            }
        );
    }
}