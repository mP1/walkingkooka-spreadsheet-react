import Button from "@material-ui/core/Button";
import Character from "../../Character.js";
import Equality from "../../Equality.js";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from "prop-types";
import React from 'react';
import TextField from "@material-ui/core/TextField";

/**
 * A widget which displays a {@link Character} for view or editing. All edits immediately update the spreadsheet.
 */
export default class SpreadsheetDrawerWidgetCharacter extends React.Component {

    constructor(props) {
        super(props);

        this.id = props.id;

        const initialValue = props.value;
        this.state = {
            value: initialValue,
        }
        this.initialValue = initialValue; // ESCAPE will stop editing and reload
        this.defaultValue = props.defaultValue;

        console.log("character id=" + this.id + " value=" + this.state.value + " defaultValue=" + this.defaultValue);
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
     * Renders a text box to edit the character and a button to the right which sets the value to the default.
     */
    render() {
        const id = this.id;
        const value = this.state.value;
        const defaultValue = this.defaultValue;

        console.log("render id=" + id + " value=" + value + " defaultValue=" + defaultValue);

        return (
            <div>
                <div>
                    <List className={
                        ""
                    }
                          style={
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
                            <TextField
                                id={id + "-text"}
                                key={value}
                                style={
                                    {
                                        height: "1em",
                                        margin: 0,
                                    }
                                }
                                placeholder="Enter 1 character"
                                helperText=""
                                fullWidth
                                margin="normal"
                                disabled={false}
                                InputLabelProps={
                                    {
                                        shrink: true,
                                    }
                                }
                                defaultValue={value}
                                inputProps={
                                    {
                                        size: 1,
                                        maxLength: 1,
                                    }
                                }
                                onChange={this.onInputChange.bind(this)}
                                onKeyDown={this.onInputKeyDown.bind(this)}
                            />
                            {defaultValue &&
                            <Button id={id + "-button"}
                                    variant="contained"
                                    color="primary"
                                    onClick={this.onSetDefault.bind(this)}>
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
     * Receives changes to the input text field.
     */
    onInputChange(e) {
        const string = e.target.value;
        console.log("onInputChange " + string);

        switch(string.length) {
            case 0:
                this.setValue();
                break;
            case 1:
                this.setValue(Character.fromJson(string));
                break;
            default:
                break;
        }
    }

    onInputKeyDown(e) {
        switch(e.key) {
            case "Escape":
                this.onEscapeKey(e);
                break;
            default:
                // nothing special to do for other keys
                break;
        }
    }

    /**
     * Stop editing, this also means any edits are lost and the original value is reloaded.
     */
    onEscapeKey(e) {
        this.setValue(this.initialValue);
    }

    /**
     * Handles the setDefault button is clicked.
     */
    onSetDefault() {
        const defaultValue = this.defaultValue;
        console.log("onSetDefault " + defaultValue);
        this.setValue(defaultValue);
    }

    setValue(value) {
        console.log("setValue id=" + this.id + " value=" + value + " defaultValue=" + this.defaultValue);
        this.setState(
            {
                value: value,
            }
        );
    }
}

// value and defaultValue are not required because the SpreadsheetMetadata property may be absent.
SpreadsheetDrawerWidgetCharacter.propTypes = {
    id: PropTypes.string, // id used by cypress tests
    value: PropTypes.object, // Character: the value being displayed/edited
    defaultValue: PropTypes.object, // Character: this value is set when the default button is clicked.
    setValue: PropTypes.func, // if present editing/updates to the value are supported.
}