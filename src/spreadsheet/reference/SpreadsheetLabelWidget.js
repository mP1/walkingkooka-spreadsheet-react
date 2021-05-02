import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Equality from "../../Equality.js";
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Slide from "@material-ui/core/Slide";
import spreadsheetExpressionReferenceFromJson from "./SpreadsheetExpressionReferenceFromJson.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryAwareStateWidget from "../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetLabelMapping from "./SpreadsheetLabelMapping.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import SpreadsheetNotification from "../notification/SpreadsheetNotification.js";
import TextField from '@material-ui/core/TextField';
import {withStyles} from "@material-ui/core/styles";

const useStyles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * A dialog with some text fields to enter the label and reference and buttons to save, delete, cancel the edit.
 */
class SpreadsheetLabelWidget extends SpreadsheetHistoryAwareStateWidget {

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
        const replacements = {};

        if(open){
            if(null != label && !Equality.safeEquals(prevState.label, label)){
                // load the mapping for the new $label, the old mapping is lost.
                this.props.loadLabelMapping(
                    label,
                    (mapping) => this.onLoadSuccess(label, mapping),
                    this.onLoadFailure.bind(this),
                );
            }
            replacements[SpreadsheetHistoryHash.LABEL] = label;
        }else {
            replacements[SpreadsheetHistoryHash.LABEL] = null; // remove label from hash
        }

        SpreadsheetHistoryHash.parseMergeAndPush(this.history, replacements);
    }

    /**
     * Handles the response of a load label attempt.
     */
    onLoadSuccess(oldLabel, mapping) {
        console.log("onLoadSuccess: " + mapping);

        const labelValue = mapping ? mapping.label().toString() : oldLabel.toString();
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
        this.props.notificationShow(SpreadsheetNotification.error(error));
        const state = {};
        this.parseLabel("", state);
        this.parseReference("", state);
        this.setState(state);
    }

    render() {
        const {label, labelHelper, reference, referenceHelper} = this.state;
        console.log("render: ", "label:" + label, "labelHelper:" + labelHelper, ", reference:" + reference, "referenceHelper" + referenceHelper)

        return this.state.open ?
            this.renderDialog() :
            null;
    }

    renderDialog() {
        const {classes} = this.props;
        const {label, labelHelper, reference, referenceHelper} = this.state;
        console.log("render: ", "label:" + label, "labelHelper:" + labelHelper, ", reference:" + reference, "referenceHelper" + referenceHelper)

        const close = this.onClose.bind(this);
        const deleteLabelMapping = this.onDelete.bind(this);
        const save = this.onSave.bind(this);

        return <Dialog key="Label"
                       id="label-mapping-Dialog"
                       open={true}
                       onKeyDown={this.onKeyDown.bind(this)}
                       onClose={close} /*aria-labelledby="form-dialog-title"*/
                       TransitionComponent={Transition}
        >
            <DialogTitle id={"label-mapping-DialogTitle"}>
                {"Label: " + label}
                <IconButton aria-label="close"
                            className={classes.closeButton}
                            onClick={close}>
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
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
            </DialogContent>
            <DialogActions>
                <Button id="label-mapping-save-Button"
                        onClick={save}
                        color="primary">
                    Save
                </Button>
                <Button id="label-mapping-delete-Button"
                        onClick={deleteLabelMapping}
                        color="primary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    }

    onLabelChange(event) {
        const state = {};
        this.parseLabel(event.target.value, state);
        console.log("onLabelChange " + event.target.value + " " + JSON.stringify(state));
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

    onReferenceChange(event) {
        const state = {};
        this.parseReference(event.target.value, state);
        console.log("onReferenceChange " + event.target.value + " " + JSON.stringify(state));
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

    onClose() {
        console.log("onClose");
        this.close();
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
            (message) => this.props.notificationShow(SpreadsheetNotification.error(message))
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
                        (message) => this.props.notificationShow(SpreadsheetNotification.error(message))
                    );
                }
            }
            this.setState(newState);
        } catch(e) {
            this.props.notificationShow(SpreadsheetNotification.error(e.message));
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
            case "Escape":
                this.onEscape();
                break;
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

    onEscape() {
        this.close();
    }
}

SpreadsheetLabelWidget.propTypes = {
    history: PropTypes.object.isRequired,
    loadLabelMapping: PropTypes.func.isRequired, // loads the given label returning its corresponding labelMapping
    saveLabelMapping: PropTypes.func.isRequired, // saves the new label mapping
    deleteLabelMapping: PropTypes.func.isRequired, // deletes the selected label
    notificationShow: PropTypes.func.isRequired, // used to display notifications including errors and other messages
}

export default withStyles(useStyles)(SpreadsheetLabelWidget);