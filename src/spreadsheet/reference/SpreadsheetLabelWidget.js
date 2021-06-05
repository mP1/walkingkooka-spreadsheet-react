import Button from '@material-ui/core/Button';
import Equality from "../../Equality.js";
import PropTypes from 'prop-types';
import React from 'react';
import SpreadsheetDialog from "../../widget/SpreadsheetDialog.js";
import spreadsheetExpressionReferenceFromJson from "./SpreadsheetExpressionReferenceFromJson.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryAwareStateWidget from "../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetLabelMapping from "./SpreadsheetLabelMapping.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import SpreadsheetNotification from "../notification/SpreadsheetNotification.js";
import TextField from '@material-ui/core/TextField';

/**
 * A dialog with some text fields to enter the label and reference and buttons to save, delete, cancel the edit.
 */
export default class SpreadsheetLabelWidget extends SpreadsheetHistoryAwareStateWidget {

    initialStateFromProps(props) {
        return {
            open: false,
        };
    }

    /**
     * Updates the state.label from the history hash tokens.
     */
    stateFromHistoryTokens(tokens) {
        const label = tokens[SpreadsheetHistoryHash.LABEL];

        return {
            open: !!label, // open if label present, close if label absent
            label: label,
        };
    }

    init() {
        this.label = React.createRef();
        this.reference = React.createRef();
    }

    /**
     * Updates the label within the history hash.
     */
    historyTokensFromState(prevState) {
        const state = this.state;
        const {label, open} = state;
        const historyTokens = {};

        if(open){
            if(null != label && !Equality.safeEquals(prevState.label, label)){
                // load the mapping for the new $label, the old mapping is lost.
                this.props.loadLabelMapping(
                    label,
                    (l, m) => this.onLoadSuccess(l, m),
                    this.onLoadFailure.bind(this),
                );
            }
            historyTokens[SpreadsheetHistoryHash.LABEL] = label;
        }else {
            historyTokens[SpreadsheetHistoryHash.LABEL] = null; // remove label from hash
        }

        return historyTokens;
    }

    /**
     * Handles the response of a load label attempt.
     */
    onLoadSuccess(label, mapping) {
        console.log("onLoadSuccess: " + mapping);

        const labelValue = mapping ? mapping.label().toString() : label.toString();
        const referenceValue = mapping ? mapping.reference().toString() : "";

        const newState = {
            open: true,
        };
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

    onLoadFailure(error) {
        this.props.showError(error);
        const state = {};
        this.parseLabel("", state);
        this.parseReference("", state);
        this.setState(state);
    }

    render() {
        return this.state.open ?
            this.renderDialog() :
            null;
    }

    renderDialog() {
        const {label, labelHelper, reference, referenceHelper} = this.state;
        console.log("render: ", "label:" + label, "labelHelper:" + labelHelper, ", reference:" + reference, "referenceHelper" + referenceHelper);

        return <SpreadsheetDialog id={"label-mapping-Dialog"}
                                  key={"label-mapping"}
                                  open={true}
                                  onClose={this.close.bind(this)}
        >
            <span id="label-mapping-DialogTitle">{"Label: " + label}</span>
            <span>
                <TextField key={"label"}
                           inputRef={this.label}
                           id="label-mapping-label-TextField"
                           margin="dense"
                           label="Label"
                           type="text"
                           fullWidth
                           defaultValue={label}
                           helperText={labelHelper}
                           onChange={this.onLabelChange.bind(this)}

                />
                <TextField key="reference"
                           inputRef={this.reference}
                           id="label-mapping-reference-TextField"
                           margin="dense"
                           label="Reference"
                           type="text"
                           fullWidth
                           defaultValue={reference}
                           helperText={referenceHelper}
                           onChange={this.onReferenceChange.bind(this)}
                />
            </span>
            <Button id="label-mapping-save-Button"
                    onClick={this.onSave.bind(this)}
                    color="primary">
                Save
            </Button>
            <Button id="label-mapping-delete-Button"
                    onClick={this.onDelete.bind(this)}
                    color="primary">
                Delete
            </Button>
        </SpreadsheetDialog>
    }

    onLabelChange(e) {
        const state = {};

        const value = e.target.value;
        console.log("onLabelChange " + value + " " + JSON.stringify(state));

        this.parseLabel(value, state);
        this.setState(state);
    }

    parseLabel(text, state) {
        let label;
        let message;
        try {
            label = SpreadsheetLabelName.parse(text);
            message = null;
        } catch(e) {
            message = e.message;
        }
        state.labelHelper = message;
        return label;
    }

    onReferenceChange(e) {
        const state = {};

        const value = e.target.value;
        console.log("onReferenceChange " + value + " " + JSON.stringify(state));
        this.parseReference(value, state);
        this.setState(state);
    }

    parseReference(text, state) {
        let reference;
        let message;
        try {
            reference = spreadsheetExpressionReferenceFromJson(text);
            message = null;

            const label = this.parseLabel(this.label.current.value, state);
            if(label){
                new SpreadsheetLabelMapping(label, reference); // will complain if label and reference are the same
            }
        } catch(e) {
            message = e.message;
        }
        state.referenceHelper = message;
        return reference;
    }

    /**
     * Closes the dialog.
     */
    close() {
        this.setState({
            open: false,
            label: null,
            reference: null,
        });
    }

    /**
     * When delete completes close this modal. The delete mapping actually uses the old label name,
     * ignoring the label text field.
     */
    onDelete() {
        this.props.deleteLabelMapping(
            this.state.label,
            this.onDeleteCompleted.bind(this),
            this.props.showError
        );
    }

    onDeleteCompleted() {
        this.props.notificationShow(SpreadsheetNotification.success("Label deleted"));
        this.close();
    }

    /**
     * When the SAVE button is clicked save the LabelMapping, which is created using the label and reference textfields.
     */
    onSave() {
        try {
            const oldLabel = this.state.label;
            const newState = {};
            const newLabel = this.parseLabel(this.label.current.value, newState);
            if(newLabel){
                const reference = this.parseReference(this.reference.current.value, newState);
                if(reference){
                    this.props.saveLabelMapping(
                        oldLabel,
                        new SpreadsheetLabelMapping(newLabel, reference),
                        this.onSaveCompleted.bind(this),
                        this.props.showError,
                    );
                }
            }
            this.setState(newState);
        } catch(e) {
            this.props.showError(e.message);
        }
    }

    /**
     * Updates the state.label, this means future operations will reference this label to save.
     */
    onSaveCompleted(json) {
        const mapping = SpreadsheetLabelMapping.fromJson(json);

        this.setState({
            label: mapping.label(),
            reference: mapping.reference(),
        });

        this.props.notificationShow(SpreadsheetNotification.success("Label saved"));
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
            case "Enter":
                this.onEnter();
                break;
            default:
                // nothing special to do for other keys
                break;
        }
    }

    onEnter() {
        this.onSave();
    }
}

SpreadsheetLabelWidget.propTypes = {
    history: PropTypes.object.isRequired,
    loadLabelMapping: PropTypes.func.isRequired, // loads the given label returning its corresponding labelMapping
    saveLabelMapping: PropTypes.func.isRequired, // saves the new label mapping
    deleteLabelMapping: PropTypes.func.isRequired, // deletes the selected label
    notificationShow: PropTypes.func.isRequired, // used to display notifications including errors and other messages
    showError: PropTypes.func.isRequired,
}