import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from "@material-ui/core/Button";
import Preconditions from "../../Preconditions.js";
import PropTypes from 'prop-types';
import React from 'react';
import SpreadsheetCellReferenceOrLabelName from "./SpreadsheetCellReferenceOrLabelName.js";
import SpreadsheetDialog from "../../widget/SpreadsheetDialog.js";
import spreadsheetExpressionReferenceFromJson from "./SpreadsheetExpressionReferenceFromJson.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryAwareStateWidget from "../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import TextField from '@material-ui/core/TextField';

/**
 * The maximum number of similar matches
 */
const MAX_COUNT = 10;

/**
 * Displays a dialog with a text box that accepts query text that matches cells and labels. Buttons are also present
 * which support navigating, creating or editing the label.
 * <ul>
 * <li>open boolean when true the dialog should be displayed, false means hide</li>
 * <li>queryHelperText string that details if the query text is not a valid SpreadsheetCellReference or SpreadsheetLabelName</li>
 * <li>options holds all options from the matching similarities</li>
 * <li>gotoCellOrLabel A {@link SpreadsheetCellReferenceOrLabelName} for the currently selected auto complete option</li>
 * <li>editLabel The selected existing {@link SpreadsheetLabelName} for editing</li>
 * <li>createLabel The selected unknown {@link SpreadsheetLabelName} for creation</li>
 * </ul>
 */
export default class SpreadsheetNavigateAutocompleteWidget extends SpreadsheetHistoryAwareStateWidget {

    initialStateFromProps(props) {
        return {
            open: false,
            queryHelperText: null,
            options: [],
            gotoCellOrLabel: null,
            createLabel: null,
            editLabel: null,
        };
    }

    /**
     * Updates the state.navigate from the history hash tokens.
     */
    stateFromHistoryTokens(tokens) {
        const navigate = tokens[SpreadsheetHistoryHash.NAVIGATE];

        return {
            open: !!navigate,
        };
    }

    init() {
        this.autoComplete = React.createRef();
    }

    /**
     * Copies the navigate hash to state.open and also updates the AutoComplete widget to match state.option
     */
    historyTokensFromState(prevState) {
        const {open, options} = this.state;

        const autoComplete = this.autoComplete.current;
        if(autoComplete){
            autoComplete.options = options;
        }

        const historyTokens = {};
        historyTokens[SpreadsheetHistoryHash.NAVIGATE] = open;
        return historyTokens;
    }

    render() {
        return this.state.open ?
            this.renderDialog() :
            null;
    }

    /**
     * Renders a modal dialog, with an auto complete and two action buttons to GOTO and EDIT the selected cell or label.
     */
    renderDialog() {
        const {queryHelperText, options, gotoCellOrLabel, editLabel, createLabel} = this.state;

        const gotoCellOrLabelDisabled = !gotoCellOrLabel;
        const createLabelDisabled = !createLabel;
        const editLabelDisabled = !editLabel;

        return <SpreadsheetDialog id={"navigate-Dialog"}
                                  open={true}
                                  onClose={this.close.bind(this)}
        >
            <span id={"navigate-DialogTitle"}>Navigate or Edit</span>
            <Autocomplete
                id="navigate-Autocomplete-TextField"
                ref={this.autoComplete}
                freeSolo={true}
                selectOnFocus
                clearOnBlur={false}
                clearOnEscape={false}
                handleHomeEndKeys={true}
                options={options}
                getOptionLabel={(option) => typeof option == "string" ? option : option.text}
                onInputChange={this.onTextFieldChange.bind(this)}
                onChange={this.onAutoCompleteValueChange.bind(this)}
                noOptionsText={""}
                includeInputInList={true}
                style={{width: 500}}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        variant="outlined"
                        helperText={queryHelperText}
                    />
                }
            />
            <Button id="navigate-gotoCellOrLabel-Button"
                    disabled={gotoCellOrLabelDisabled}
                    color="primary"
                    onClick={this.onGotoCellOrLabelClick.bind(this)}>
                Goto
            </Button>
            <Button id="navigate-create-link-Button"
                    disabled={createLabelDisabled}
                    color="primary"
                    onClick={this.onCreateLabelClick.bind(this)}>
                Create Label
            </Button>
            <Button id="navigate-edit-link-Button"
                    disabled={editLabelDisabled}
                    color="primary"
                    onClick={this.onEditLabelClick.bind(this)}>
                Edit Label
            </Button>
        </SpreadsheetDialog>
    }

    /**
     * This is fired whenever the query TextField is updated, resulting in a new search to the server
     * which will eventually update the displayed matches.
     */
    onTextFieldChange(e, newValueText) {
        console.log("onTextFieldChange: " + newValueText, e);

        this.performSimilarities(newValueText);
    }

    onAutoCompleteValueChange(e, newValueOption) {
        console.log("onAutoCompleteValueChange: " + newValueOption, newValueOption);

        switch(typeof newValueOption) {
            case "string":
                this.performSimilarities(newValueOption);
                break;
            case "object":
                this.setState(newValueOption);
                break;
            default:
                throw new Error("Unexpected newValueOption: " + newValueOption);
        }
    }

    performSimilarities(text) {
        console.log("performSimilarities: " + text);

        try {
            spreadsheetExpressionReferenceFromJson(text);

            this.props.getSimilarities(
                text,
                MAX_COUNT,
                (s) => {
                    const options = s.toSpreadsheetNavigateWidgetOptions(text);

                    const newState = Object.assign(
                        {
                            options: options
                        },
                        options[0]
                    );

                    console.log("performSimilarities: new State", newState,
                        "similarities",
                        s);
                    this.setState(newState);
                },
                (e) => {
                    this.setState({
                        queryHelperText: null,
                        options: [],
                        gotoCellOrLabel: null,
                        createLabel: null,
                        editLabel: null,
                    });
                    this.props.showError(e);
                },
            );
        } catch(e) {
            console.log("performSimilarities " + e.message);

            this.setState({
                queryHelperText: e.message,
                options: [],
                gotoCellOrLabel: null,
                editLabel: null,
                createLabel: null,
            })
        }
    }

    /**
     * Updates the history hash token, navigating to the given cell/label
     */
    onGotoCellOrLabelClick() {
        this.updateHistoryTokens(this.state.gotoCellOrLabel, null);
    }

    /**
     * Updates the history hash token, navigating to the given label for creation
     */
    onCreateLabelClick() {
        this.updateHistoryTokens(null, this.state.createLabel);
    }

    /**
     * Updates the history hash token, navigating to the given label for editing
     */
    onEditLabelClick() {
        this.updateHistoryTokens(null, this.state.editLabel);
    }

    updateHistoryTokens(gotoCellOrLabel, label) {
        Preconditions.optionalInstance(gotoCellOrLabel, SpreadsheetCellReferenceOrLabelName, "gotoCellOrLabel");
        Preconditions.optionalInstance(label, SpreadsheetLabelName, "label");

        const historyTokens = {};

        historyTokens[SpreadsheetHistoryHash.CELL] = gotoCellOrLabel;
        historyTokens[SpreadsheetHistoryHash.CELL_FORMULA] = false;
        historyTokens[SpreadsheetHistoryHash.LABEL] = label;
        historyTokens[SpreadsheetHistoryHash.NAVIGATE] = null; // close the navigate modal

        this.historyParseMergeAndPush(historyTokens);
    }

    /**
     * Closes the dialog.
     */
    close() {
        console.log("close");
        this.setState({
            open: false,
            queryHelperText: null,
            options: [],
            gotoCellOrLabel: null,
            editLabel: null,
            createLabel: null,
        });
    }
}

SpreadsheetNavigateAutocompleteWidget.propTypes = {
    history: PropTypes.object.isRequired,
    getSimilarities: PropTypes.func.isRequired, // performs a search to find similarities to the query text field.
    notificationShow: PropTypes.func.isRequired, // used to display notifications including errors and other messages
    showError: PropTypes.func.isRequired, // used mostly to display failures around getSimilarities
}