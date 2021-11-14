import Button from "@material-ui/core/Button";
import Equality from "../../Equality.js";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from "prop-types";
import React from 'react';
import SpreadsheetHistoryAwareStateWidget from "../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import Tooltip from '@material-ui/core/Tooltip';
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetMetadata from "../meta/SpreadsheetMetadata.js";
import SpreadsheetSettingsSaveHistoryHashToken from "../history/SpreadsheetSettingsSaveHistoryHashToken.js";
import SpreadsheetMessengerCrud from "../message/SpreadsheetMessengerCrud.js";

/**
 * A base class that calls a renderInput method during a render adding a button to set the default value to the right.
 */
export default class SpreadsheetSettingsWidgetValue extends SpreadsheetHistoryAwareStateWidget {

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

    // historyParseMergeAndPush(tokens) {
    //     if(tokens[SpreadsheetHistoryHashTokens.TX_ID] && Object.keys(tokens).length == 1) {
    //         return;
    //     }
    //     if(Object.keys(tokens).length == 0) {
    //         return;
    //     }
    //     console.log("@" + this.props.property+ " history push: " + JSON.stringify(tokens), tokens, "state", this.state);
    //     return super.historyParseMergeAndPush(tokens);
    // }

    init() {
    }

    initialStateFromProps(props) {
        const historyHashTokens = props.history.tokens();

        return {
            spreadsheetId: historyHashTokens[SpreadsheetHistoryHash.SPREADSHEET_ID],
            settings: historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS],
            settingsItem: historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS_ITEM],
            settingsAction: historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS_ACTION],
            focused: false, // when true this widget has focus
            spreadsheetMetadata: null,
            value: null,
            savedValue: null, // The last saved value.
        };
    }

    componentDidMount() {
        console.log("@" + this.props.property + " mount: " + this.props.property);
        super.componentDidMount();

        this.onSpreadsheetMetadataRemover = this.props.spreadsheetMetadataCrud.addListener(this.onSpreadsheetMetadata.bind(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.onSpreadsheetMetadataRemover && this.onSpreadsheetMetadataRemover();
        delete this.onSpreadsheetMetadataRemover;

        console.log("@" + this.props.property + " unmount: " + this.props.property);
    }

    stateFromHistoryTokens(historyHashTokens) {
        return {
            spreadsheetId: historyHashTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID],
            settings: historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS],
            settingsItem: historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS_ITEM],
            settingsAction: historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS_ACTION],
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

        console.log("@" + this.props.property + "$$$.historyTokensFromState component did update " + typeof (prevState.value) + " " + prevState.value + " TO " + typeof (state.value) + " " + state.value + " same ? " + (!Equality.safeEquals(prevState.value, state.value) + " Equality.safeEquals(0, 0): " + Equality.safeEquals(0, 0)) + " prevState: " + JSON.stringify(prevState) + " to state: " + JSON.stringify(this.state));

//        console.log("@@@!" + property + ".focus: newFocused: " + newFocused + " settingsItem: " + state.settingsItem + " prev.settingsItem: " + prevState.settingsItem + " give focus ===" + (state.settingsItem === property && property !== prevState.settingsItem) + " state:", this.state );

        if(newFocused){
            if(newFocused !== prevState.focused){
                historyTokens[SpreadsheetHistoryHashTokens.SETTINGS] = true;
                historyTokens[SpreadsheetHistoryHashTokens.SETTINGS_ITEM] = property;
                historyTokens[SpreadsheetHistoryHashTokens.SETTINGS_ACTION] = state.settingsAction;
            }

            const value = state.value;
            if(!Equality.safeEquals(prevState.value, value)){
                const savedEquals = Equality.safeEquals(state.savedValue, value);

                console.log("@" + property + "$ state change VALUE CHANGE from " + prevState.value + " to " + value + " state.savedValue: " + savedEquals + " save different " + (savedEquals ? " SAME" : " DIFF"));

                if(!savedEquals){
                    this.props.setValue(value);
                }
            }
        }else {
            if(state.settingsItem === property && state.focused !== property){
                console.log("@@@" + property + "$ give focus to !!!!");
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
                console.log("@" + property + "!.onFocus: e.target:", e.target);

                this.setState({
                    focused: true,
                    settings: true,
                    settingsItem: property,
                    settingsAction: null,
                });
            }
        };

        const onBlur = (e) => {
            // new focus belongs does not belong to property
            if(ref.current && !ref.current.contains(e.relatedTarget)){
                console.log("@" + property + "!.onBlur: state", this.state,
                    "e.target:", e.target,
                    "e.relatedTarget", e.relatedTarget, "!!OUTSIDE", (ref.current && !ref.current.contains(e.relatedTarget)));


                const value = state.value;
                if(!Equality.safeEquals(value, state.savedValue)){
                    const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
                    tokens[SpreadsheetHistoryHashTokens.SETTINGS_ITEM] = property;
                    tokens[SpreadsheetHistoryHashTokens.SETTINGS_ACTION] = new SpreadsheetSettingsSaveHistoryHashToken(null == value ? null : "" + value);
                    console.log("@" + property + ".save " + property + "=" + value + " last saved: " + state.savedValue, tokens, JSON.stringify(tokens));

                    this.historyParseMergeAndPush(tokens);
                }

                this.setState({
                    focused: false,
                    settingsItem: null,
                    settingsAction: null,
                });
            }
        };

        console.log("@" + this.props.property + " render value=" + value, value);
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
        throw new Error("renderInput not overridden");
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
        historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS_ITEM] = props.property;
        historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS_ACTION] = new SpreadsheetSettingsSaveHistoryHashToken();
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
        const getValue = this.props.getValue;

        const value = getValue(responseMetadata);
        const defaultValue = getValue(responseMetadata.getIgnoringDefaults(SpreadsheetMetadata.DEFAULTS));

        console.log("@" + this.props.property + "$.onSpreadsheetMetadata got value: " + value + " default=" + defaultValue + " " + JSON.stringify(responseMetadata));

        this.setState({
            value: value,
            value2: value,
            savedValue: value,
            defaultValue: defaultValue,
        });
    }
}