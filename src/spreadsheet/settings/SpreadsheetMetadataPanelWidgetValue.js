import Button from "@mui/material/Button";
import Equality from "../../Equality.js";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import PropTypes from "prop-types";
import React from 'react';
import SpreadsheetHistoryAwareStateWidget from "../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetMetadata from "../meta/SpreadsheetMetadata.js";
import SpreadsheetMessengerCrud from "../message/SpreadsheetMessengerCrud.js";
import SpreadsheetSettingsSelectHistoryHashToken from "./SpreadsheetSettingsSelectHistoryHashToken.js";
import SpreadsheetSettingsSaveHistoryHashToken from "./SpreadsheetSettingsSaveHistoryHashToken.js";
import Tooltip from '@mui/material/Tooltip';

/**
 * A base class that calls a renderInput method during a render adding a button to set the default value to the right.
 */
export default class SpreadsheetMetadataPanelWidgetValue extends SpreadsheetHistoryAwareStateWidget {

    // value and defaultValue are not required because the SpreadsheetMetadata property may be absent.
    static createPropTypes(valueType, extraProps) {
        return Object.assign(
            {
                id: PropTypes.string, // id used by cypress tests
                property: PropTypes.string, // The property being viewed or edited.
                defaultValueFormatter: PropTypes.func.isRequired, // Used to convert the default value if one is present into text
                defaultButtonTooltip: PropTypes.bool.isRequired, // when true a tooltip will appear over the default button.
                getValue: PropTypes.func.isRequired, //returns the property value as from SpreadsheetMetadata
                setValue: PropTypes.func.isRequired, //accepts the property value and creates the json for a PATCH api call.
                history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
                spreadsheetMetadataCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud).isRequired, // required to listen to metadata loads.
            },
            extraProps
        );
    }

    init() {
    }

    initialStateFromProps(props) {
        const historyHashTokens = props.history.tokens();
        const settings = historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS];

        return {
            spreadsheetId: historyHashTokens[SpreadsheetHistoryHash.SPREADSHEET_ID],
            settings: settings,
            focused: false, // when true this widget has focus
            spreadsheetMetadata: null,
            value: null,
            savedValue: null, // The last saved value.
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.onSpreadsheetMetadataRemover = this.props.spreadsheetMetadataCrud.addListener(this.onSpreadsheetMetadata.bind(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.onSpreadsheetMetadataRemover && this.onSpreadsheetMetadataRemover();
        delete this.onSpreadsheetMetadataRemover;
    }

    stateFromHistoryTokens(historyHashTokens) {
        const settings = historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS];

        return {
            spreadsheetId: historyHashTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID],
            settings: settings,
        };
    }

    /**
     * If this widget is focused set the token settings item which will update
     */
    historyTokensFromState(prevState) {
        const historyTokens = SpreadsheetHistoryHashTokens.emptyTokens();
        const {state, props} = this;

        // if property value editor blur, possibly save value and clear items.
        const newFocused = state.focused;
        const property = props.property;

        if(newFocused){
            if(newFocused !== prevState.focused){
                historyTokens[SpreadsheetHistoryHashTokens.SETTINGS] = new SpreadsheetSettingsSelectHistoryHashToken(property);
            }

            const value = state.value;
            if(!Equality.safeEquals(prevState.value, value)){
                const savedEquals = Equality.safeEquals(state.savedValue, value);

                if(!savedEquals){
                    this.props.setValue(value);
                }
            }
        }else {
            const settings = state.settings;
            if(settings && settings.item() === property && state.focused !== property){
                this.focus();
            }
        }

        return historyTokens;
    }

    focus() {
        throw new Error("Sub classes must override focus");
    }

    /**
     * Renders the only child to the left of a button which when clicked will set the default value.
     */
    render() {
        const {id, property} = this.props;

        const state = this.state;
        const {value, defaultValue} = state;

        const ref = React.createRef();

        const onFocus = (e) => {
            if(!state.focused){
                this.log(".onFocus: e.target:", e.target);

                this.setState({
                    focused: true,
                    settings: new SpreadsheetSettingsSelectHistoryHashToken(
                        property
                    ),
                });
            }
        };

        const onBlur = (e) => {
            // new focus belongs does not belong to property
            if(ref.current && !ref.current.contains(e.relatedTarget)){
                this.log(
                    ".onBlur: state", this.state,
                    "e.target:", e.target,
                    "e.relatedTarget", e.relatedTarget
                );

                const value = state.value;
                if(!Equality.safeEquals(value, state.savedValue)){
                    const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
                    tokens[SpreadsheetHistoryHashTokens.SETTINGS] = new SpreadsheetSettingsSaveHistoryHashToken(
                        property,
                        null == value ? null : "" + value
                    );
                    this.log(" push " + property + "=" + value + " last saved: " + state.savedValue, tokens, JSON.stringify(tokens));

                    this.historyParseMergeAndPush(tokens);
                }

                this.setState({
                    focused: false,
                    settings: SpreadsheetSettingsSelectHistoryHashToken.NOTHING,
                });
            }
        };

        return (
            <List style={
                {
                    padding: 0,
                }
            }><ListItem ref={ref}
                        id={property + "-ListItem"}
                        disableGutters={true}
                        style={
                            {
                                padding: 0,
                            }
                        }
                        onFocus={(e) => onFocus(e)}
                        onBlur={(e) => onBlur(e)}
            >{
                [
                    this.renderValue(id, value, defaultValue),
                    this.renderDefaultButton(defaultValue),
                ]
            }</ListItem>
            </List>
        );
    }

    /**
     * Rather than accept a child widget this "abstract" method is called during a render with its id and value.
     * The defaultValue parameter is useful for choices such as whether a slider should include a default choice.
     */
    renderValue(id, value, defaultValue) {
        throw new Error("renderValue not overridden");
    }

    /**
     * Renders the default button. A link will appear that will update the history hash when clicked.
     */
    renderDefaultButton(value) {
        const props = this.props;
        const id = props.id + "-default-Button";
        const defaultButtonTooltip = props.defaultButtonTooltip;
        const text = null != value && props.defaultValueFormatter(value);

        // default button removes any assigned value
        const historyHashTokens = props.history.tokens();
        historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS] = new SpreadsheetSettingsSaveHistoryHashToken(
            props.property,
            null
        );
        const url = "#" + SpreadsheetHistoryHash.stringify(historyHashTokens);

        const button = <Button id={id}
                               key={id}
                               variant="contained"
                               color="primary"
                               size="small"
                               href={url}
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
        >{
            defaultButtonTooltip ? "Default" : text
        }</Button>;

        return defaultButtonTooltip ?
            <Tooltip key={id + "-Tooltip"} title={text}>{button}</Tooltip> :
            button;
    }

    /**
     * Updates the value and default value whenever a new SpreadsheetMetadata is loaded.
     */
    onSpreadsheetMetadata(method, id, url, requestMetadata, responseMetadata) {
        const {getValue} = this.props;

        const value = getValue(responseMetadata);
        const defaultValue = getValue(responseMetadata.getIgnoringDefaults(SpreadsheetMetadata.DEFAULTS));

        this.log(".onSpreadsheetMetadata got value: " + value + " default=" + defaultValue, responseMetadata);

        this.setState({
            value: value,
            value2: value,
            savedValue: value,
            defaultValue: defaultValue,
        });
    }

    log(...params) {
        console.log(this.prefix() + "." + this.props.property + params[0], params.shift());
    }
}