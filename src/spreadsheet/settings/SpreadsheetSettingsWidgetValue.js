import Button from "@material-ui/core/Button";
import Equality from "../../Equality.js";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from "prop-types";
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

/**
 * A base class that calls a renderInput method during a render adding a button to set the default value to the right.
 */
export default class SpreadsheetSettingsWidgetValue extends React.Component {

    // value and defaultValue are not required because the SpreadsheetMetadata property may be absent.
    static createPropTypes(valueType, extraProps) {
        return Object.assign(
            {
                id: PropTypes.string, // id used by cypress tests
                value: valueType, // The value being displayed/edited
                showDefaultButton: PropTypes.bool.isRequired, // false means the default button will not be shown
                defaultValue: valueType, // This value is set when the default button is clicked.
                defaultValueFormatter: PropTypes.func.isRequired, // Used to convert the default value if one is present into text
                setValue: PropTypes.func.isRequired, // if present editing/updates to the value are supported.
                defaultButtonTooltip: PropTypes.bool.isRequired, // when true a tooltip will appear over the default button.
            },
            extraProps
        );
    }

    constructor(props) {
        super(props);

        this.id = props.id;

        this.state = {
            value: props.value,
        }
        this.defaultValue = props.defaultValue;
        this.defaultValueFormatter= props.defaultValueFormatter;
        this.defaultButtonTooltip = props.defaultButtonTooltip;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !Equality.safeEquals(this.state, nextState);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const state = this.state;
        console.log("componentDidUpdate", this.id, "prevState", prevState, "state", state);

        const value = state.value;
        if(!Equality.safeEquals(prevState.value, value)){
            this.props.setValue(value);
            this.onStateValueChange(value);
        }
    }

    onStateValueChange(value) {
        throw new Error("onStateValueChange not implemented");
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
                            {
                                [
                                    this.renderInput(id, value),
                                    this.renderDefaultButton(id + "-default-Button", defaultValue), // hide if theres no default button
                                ]
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

    renderDefaultButton(id, value) {
        const defaultButtonTooltip = this.defaultButtonTooltip;
        const text = null != value && this.defaultValueFormatter(value);

        const button = <Button id={id}
                               key={id}
                               variant="contained"
                               color="primary"
                               size="small"
                               onClick={this.onSetDefaultValue.bind(this)}
                               style={
                                   {
                                       maxWidth: "64px",
                                       overflowX: "hidden",
                                       overflowY: "hidden",
                                       textOverflow: "ellipsis",
                                       textTransform: "none",
                                       visibility: null == value ? "hidden" : null,
                                       whiteSpace: "nowrap",
                                   }
                               }
        >
            {defaultButtonTooltip ? "Default" : text}
        </Button>;

        return defaultButtonTooltip ?
            <Tooltip key={id + "-Tooltip"} title={text}>{button}</Tooltip> :
            button;
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