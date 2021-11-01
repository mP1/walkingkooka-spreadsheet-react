import Button from '@material-ui/core/Button';
import Equality from "../../Equality.js";
import Keys from "../../Keys.js";
import PropTypes from 'prop-types';
import React from 'react';
import spreadsheetCellRangeCellReferenceOrLabelParse from "./SpreadsheetCellRangeCellReferenceOrLabelParse.js";
import SpreadsheetDialog from "../../widget/SpreadsheetDialog.js";
import SpreadsheetHistoryAwareStateWidget from "../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelMapping from "./SpreadsheetLabelMapping.js";
import SpreadsheetLabelMappingDeleteHistoryHashToken from "../history/SpreadsheetLabelMappingDeleteHistoryHashToken.js";
import SpreadsheetLabelMappingSaveHistoryHashToken from "../history/SpreadsheetLabelMappingSaveHistoryHashToken.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import SpreadsheetMessengerCrud from "../message/SpreadsheetMessengerCrud.js";
import SpreadsheetNotification from "../notification/SpreadsheetNotification.js";
import TextField from '@material-ui/core/TextField';

/**
 * A dialog with some text fields to enter the label and reference and buttons to save, delete, cancel the edit.
 */
export default class SpreadsheetLabelMappingWidget extends SpreadsheetHistoryAwareStateWidget {

    static ID_PREFIX = "label-mapping";

    static DELETE_BUTTON_ID = SpreadsheetLabelMappingWidget.ID_PREFIX + "-delete-Button";

    static DIALOG_ID = SpreadsheetLabelMappingWidget.ID_PREFIX + "-Dialog";

    static DIALOG_CLOSE_BUTTON_ID = SpreadsheetLabelMappingWidget.DIALOG_ID + "-close-Button";

    static DIALOG_TITLE_ID = SpreadsheetLabelMappingWidget.DIALOG_ID + "-title";

    static LABEL_TEXT_FIELD_ID = SpreadsheetLabelMappingWidget.ID_PREFIX + "-label-TextField";

    static LABEL_TEXT_FIELD_HELPER_TEXT_ID = SpreadsheetLabelMappingWidget.LABEL_TEXT_FIELD_ID + "-helper-text";

    static REFERENCE_TEXT_FIELD_ID = SpreadsheetLabelMappingWidget.ID_PREFIX + "-reference-TextField";

    static REFERENCE_TEXT_FIELD_HELPER_TEXT_ID = SpreadsheetLabelMappingWidget.REFERENCE_TEXT_FIELD_ID + "-helper-text";

    static SAVE_BUTTON_ID = SpreadsheetLabelMappingWidget.ID_PREFIX + "-save-Button";

    initialStateFromProps(props) {
        return {};
    }

    init() {
        this.label = React.createRef();
        this.reference = React.createRef();
    }

    // component lifecycle..............................................................................................

    componentDidMount() {
        super.componentDidMount();

        const props = this.props;
        this.spreadsheetLabelCrudRemover = props.spreadsheetLabelCrud.addListener(this.onLabelMapping.bind(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.spreadsheetLabelCrudRemover && this.spreadsheetLabelCrudRemover();
        delete this.spreadsheetLabelCrudRemover;
    }

    // state / history.................................................................................................

    stateFromHistoryTokens(tokens) {
        return {
            spreadsheetId: tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID],
            label: tokens[SpreadsheetHistoryHashTokens.LABEL],
            labelAction: tokens[SpreadsheetHistoryHashTokens.LABEL_ACTION],
        };
    }

    /**
     * Updates the label within the history hash.
     */
    historyTokensFromState(prevState) {
        const {label, labelAction} = this.state;

        if(null != label){
            const previousLabel = prevState.label;
            const previousLabelAction = prevState.labelAction;

            if(!Equality.safeEquals(previousLabel, label) || !Equality.safeEquals(previousLabelAction, labelAction)){
                if(!labelAction){
                    this.props.spreadsheetLabelCrud.get(
                        label,
                        {},
                        this.onLabelMappingLoadFailure.bind(this)
                    );
                }else {
                    labelAction.labelMappingWidget(this);
                }
            }
        }

        return {};
    }

    saveLabelMapping(newLabel, reference) {
        console.log("saveLabelMapping: " + newLabel + " " + reference);
        const oldLabel = this.state.label;

        const props = this.props;

        props.spreadsheetLabelCrud.post(
            oldLabel,
            new SpreadsheetLabelMapping(newLabel, reference),
            props.showError
        );
    }

    deleteLabelMapping() {
        const {state, props} = this;
        const label = state.label;

        console.log("deleteLabelMapping: " + label);

        props.spreadsheetLabelCrud.delete(
            label,
            props.showError
        );
    }

    // render ..........................................................................................................

    render() {
        return this.state.label ?
            this.renderDialog() :
            null;
    }

    renderDialog() {
        const state = this.state;
        const {label, newLabel, labelHelper, reference, referenceHelper} = state;

        const tokens = this.props.history.tokens();

        var labelSave;

        if(newLabel && reference){
            tokens[SpreadsheetHistoryHashTokens.LABEL_ACTION] = new SpreadsheetLabelMappingSaveHistoryHashToken(newLabel, reference);
            labelSave = "#" + SpreadsheetHistoryHash.stringify(tokens);
        }

        tokens[SpreadsheetHistoryHashTokens.LABEL_ACTION] = new SpreadsheetLabelMappingDeleteHistoryHashToken();
        const labelDelete = "#" + SpreadsheetHistoryHash.stringify(tokens);

        console.log("render: ", "label:" + label, "newLabel:" + newLabel + ", labelHelper:" + labelHelper, ", reference:" + reference, "referenceHelper" + referenceHelper, "saveButton", labelSave, "labelDelete", labelDelete);

        return <SpreadsheetDialog id={SpreadsheetLabelMappingWidget.DIALOG_ID}
                                  key={"label-mapping"}
                                  open={true}
                                  onClose={this.close.bind(this)}
        >
            <span id={SpreadsheetLabelMappingWidget.DIALOG_TITLE_ID}>{"Label: " + label}</span>
            <span>
                <TextField key={"label"}
                           inputRef={this.label}
                           id={SpreadsheetLabelMappingWidget.LABEL_TEXT_FIELD_ID}
                           margin="dense"
                           label="Label"
                           type="text"
                           fullWidth
                           defaultValue={label}
                           helperText={labelHelper}
                           onChange={this.onLabelTextFieldValueChange.bind(this)}
                           autoFocus
                />
                <TextField key="reference"
                           inputRef={this.reference}
                           id={SpreadsheetLabelMappingWidget.REFERENCE_TEXT_FIELD_ID}
                           margin="dense"
                           label="Reference"
                           type="text"
                           fullWidth
                           defaultValue={reference}
                           helperText={referenceHelper}
                           onChange={this.onReferenceTextFieldValueChange.bind(this)}
                />
            </span>
            <Button id={SpreadsheetLabelMappingWidget.SAVE_BUTTON_ID}
                    disabled={!labelSave}
                    href={labelSave}
                    color="primary">
                Save
            </Button>
            <Button id={SpreadsheetLabelMappingWidget.DELETE_BUTTON_ID}
                    disabled={!labelDelete}
                    href={labelDelete}
                    color="primary">
                Delete
            </Button>
        </SpreadsheetDialog>;
    }

    onLabelTextFieldValueChange(e) {
        const state = {};

        const value = e.target.value;
        this.parseLabel(value, state);

        console.log("onLabelTextFieldValueChange " + value, "state", state);
        this.setState(state);
    }

    parseLabel(text, state) {
        let newLabel;
        let message;
        try {
            newLabel = SpreadsheetLabelName.parse(text);
            state.newLabel = newLabel;
            message = null;
        } catch(e) {
            message = e.message;
        }
        state.labelHelper = message;
        return newLabel;
    }

    onReferenceTextFieldValueChange(e) {
        const state = {};

        const value = e.target.value;
        this.parseReference(value, state);

        console.log("onReferenceTextFieldValueChange " + value, "state", state);
        this.setState(state);
    }

    parseReference(text, state) {
        let reference;
        let message;
        try {
            reference = spreadsheetCellRangeCellReferenceOrLabelParse(text);
            message = null;

            const newLabel = this.parseLabel(this.label.current.value, state);
            if(newLabel){
                new SpreadsheetLabelMapping(newLabel, reference); // will complain if label and reference are the same
            }
            state.reference = reference;
        } catch(e) {
            message = e.message;
        }
        state.referenceHelper = message;
        return reference;
    }

    /**
     * Closes the dialog by clearing the label and label action history hash tokens.
     */
    close() {
        const tokens = {};
        tokens[SpreadsheetHistoryHashTokens.LABEL] = null;
        tokens[SpreadsheetHistoryHashTokens.LABEL_ACTION] = null;

        this.historyParseMergeAndPush(tokens);
    }

    /**
     * Supports several keys.
     * <ul>
     * <li>ENTER saves the label/li>
     * <li>ESCAPE closes the dialog</li>
     * </ul>
     */
    onKeyDown(e) {
        switch(e.key) {
            case Keys.ENTER:
                this.onEnter();
                break;
            default:
                // nothing special to do for other keys
                break;
        }
    }

    onEnter() {
        this.onSaveButtonClicked();
    }

    // server .........................................................................................................

    onLabelMapping(method, label, queryParameters, requestMapping, responseMapping) {
        switch(method) {
            case "GET":
                this.onLabelMappingLoadSuccess(label, responseMapping);
                break;
            case "POST":
                this.onLabelMappingSaveSuccess(responseMapping);
                break;
            case "DELETE":
                this.onLabelMappingDeleteSuccess();
                break;
            default:
                break;
        }
    }

    /**
     * Handles the response of a load label attempt.
     */
    onLabelMappingLoadSuccess(label, mapping) {
        console.log("onLabelMappingLoadSuccess: " + mapping);

        const labelValue = mapping ? mapping.label().toString() : label.toString();
        const referenceValue = mapping ? mapping.reference().toString() : "";

        const newState = {};

        // parse ignore the returned, only interested in the helper "error" text.
        this.parseLabel(labelValue, newState);
        this.parseReference(referenceValue, newState);
        this.setState(newState);

        const labelWidget = this.label.current;
        if(labelWidget){
            labelWidget.value = labelValue;
        }

        const referenceWidget = this.reference.current;
        if(referenceWidget){
            referenceWidget.value = referenceValue;
        }
    }

    onLabelMappingLoadFailure(message, error) {
        this.props.showError(message, error);

        const state = {};
        this.parseLabel("", state);
        this.parseReference("", state);
        this.setState(state);
    }

    /**
     * Updates the state.label, this means future operations will reference this label to save.
     */
    onLabelMappingSaveSuccess(mapping) {
        const tokens = {};
        tokens[SpreadsheetHistoryHashTokens.LABEL] = mapping.label();
        tokens[SpreadsheetHistoryHashTokens.LABEL_ACTION] = null;
        this.historyParseMergeAndPush(tokens);

        this.setState({
            reference: mapping.reference(),
        });

        this.props.notificationShow(SpreadsheetNotification.success("Label saved"));
    }

    onLabelMappingDeleteSuccess() {
        this.props.notificationShow(SpreadsheetNotification.success("Label deleted"));
        this.close();
    }
}

SpreadsheetLabelMappingWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetLabelCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    notificationShow: PropTypes.func.isRequired, // used to display notifications including errors and other messages
    showError: PropTypes.func.isRequired,
}