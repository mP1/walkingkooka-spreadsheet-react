import Autocomplete from '@mui/lab/Autocomplete';
import Button from "@mui/material/Button";
import Preconditions from "../../Preconditions.js";
import PropTypes from 'prop-types';
import React from 'react';
import SpreadsheetCellRange from "./cell/SpreadsheetCellRange.js";
import SpreadsheetCellReference from "./cell/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "./columnrow/SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "./columnrow/SpreadsheetColumnReferenceRange.js";
import SpreadsheetDialog from "../../widget/SpreadsheetDialog.js";
import SpreadsheetHistoryAwareStateWidget from "../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelMapping from "./label/SpreadsheetLabelMapping.js";
import SpreadsheetLabelMappingEditHistoryHashToken from "./label/SpreadsheetLabelMappingEditHistoryHashToken.js";
import SpreadsheetLabelName from "./label/SpreadsheetLabelName.js";
import SpreadsheetRowReference from "./columnrow/SpreadsheetRowReference.js";
import SpreadsheetRowReferenceRange from "./columnrow/SpreadsheetRowReferenceRange.js";
import SpreadsheetSelection from "./SpreadsheetSelection.js";
import TextField from '@mui/material/TextField';

/**
 * The maximum number of similar matches requested against the entered text.
 */
const MAX_COUNT = 10;

/**
 * Displays a dialog with a text box that accepts query text that matches cells and labels. Buttons are also present
 * which support navigating, creating or editing the label.
 * <ul>
 * <li>text string The entered text</li>
 * <li>queryHelperText string that details if the query text is not a valid SpreadsheetCellReference or SpreadsheetLabelName</li>
 * <li>options array holds all options from the matching similarities, this might include a column and label or label mappings if similar labels were found</li>
 * </ul>
 */
export default class SpreadsheetSelectAutocompleteWidget extends SpreadsheetHistoryAwareStateWidget {

    static ID_PREFIX = "select";

    static DIALOG_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-Dialog";

    static DIALOG_CLOSE_BUTTON_ID = SpreadsheetSelectAutocompleteWidget.DIALOG_ID + "-close-Button";

    static DIALOG_TITLE_ID = SpreadsheetSelectAutocompleteWidget.DIALOG_ID + "-title";

    static TEXT_FIELD_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-Autocomplete-TextField"

    static TEXT_FIELD_HELPER_TEXT_ID = SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_ID + "-helper-text"

    static TEXT_FIELD_LISTBOX_ID = SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_ID + "-listbox"

    static TEXT_FIELD_OPTION_ID = SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_ID + "-option-"

    static CELL_GOTO_BUTTON_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-cell-goto-Button";

    static CELL_RANGE_SELECT_BUTTON_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-cell-range-select-Button";

    static COLUMN_GOTO_BUTTON_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-column-goto-Button";

    static COLUMN_RANGE_SELECT_BUTTON_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-column-range-select-Button";

    static LABEL_GOTO_BUTTON_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-label-goto-Button";

    static LABEL_CREATE_BUTTON_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-label-create-Button";

    static LABEL_EDIT_BUTTON_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-label-edit-Button";

    static ROW_GOTO_BUTTON_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-row-goto-Button";

    static ROW_RANGE_SELECT_BUTTON_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-row-range-select-Button";

    initialStateFromProps(props) {
        const historyHashTokens = props.history.tokens();

        return {
            spreadsheetId: historyHashTokens[SpreadsheetHistoryHash.SPREADSHEET_ID],
            text: null,
            queryHelperText: null,
            options: [],
        };
    }

    /**
     * Need to watch selectionXXX & label hash tokens so button links can be rebuilt.
     */
    stateFromHistoryTokens(tokens) {
        const select = tokens[SpreadsheetHistoryHashTokens.SELECT];

        const state = {
            select: select,
            viewportSelection: tokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION],
            label: tokens[SpreadsheetHistoryHashTokens.LABEL],
        };

        if(!select){
            Object.assign(
                state,
                {
                    text: "",
                    queryHelperText: "",
                    options: [],
                }
            );
        }

        return state;
    }

    init() {
        this.autoComplete = React.createRef();
    }

    /**
     * Copies the select hash to state.open and also updates the AutoComplete widget to match state.option
     */
    historyTokensFromState(prevState) {
        return SpreadsheetHistoryHashTokens.emptyTokens();
    }

    render() {
        return this.state.select ?
            this.renderDialog() :
            null;
    }

    /**
     * Renders a modal dialog, with an auto complete and two action buttons to GOTO and EDIT the selected cell or label.
     */
    renderDialog() {
        const {queryHelperText, options} = this.state;

        const autoComplete = this.autoComplete.current;
        if(autoComplete){
            autoComplete.options = options;
        }

        // if we find a cell in options then we enable the goto cell button etc.
        var cell = null;
        var cellRange = null;
        var column = null;
        var columnRange = null;
        var label = null;
        var row = null;
        var rowRange = null;

        // if we find a label mapping then turn on label edit
        var labelMapping = null;

        for(const possible of options) {
            if(possible instanceof SpreadsheetCellReference){
                cell = possible;
            }
            if(possible instanceof SpreadsheetCellRange){
                cellRange = possible;
            }
            if(possible instanceof SpreadsheetColumnReference){
                column = possible;
            }
            if(possible instanceof SpreadsheetColumnReferenceRange){
                columnRange = possible;
            }
            if(possible instanceof SpreadsheetLabelName){
                label = possible;
            }
            if(possible instanceof SpreadsheetLabelMapping){
                labelMapping = possible;
            }
            if(possible instanceof SpreadsheetRowReference){
                row = possible;
            }
            if(possible instanceof SpreadsheetRowReferenceRange){
                rowRange = possible;
            }
        }

        return <SpreadsheetDialog id={SpreadsheetSelectAutocompleteWidget.DIALOG_ID}
                                  open={true}
                                  onClose={this.close.bind(this)}
        >
            <span id={SpreadsheetSelectAutocompleteWidget.DIALOG_TITLE_ID}>Select</span>
            <Autocomplete
                id={SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_ID}
                ref={this.autoComplete}
                freeSolo={true}
                selectOnFocus
                clearOnBlur={false}
                clearOnEscape={false}
                handleHomeEndKeys={true}
                options={options}
                getOptionLabel={
                    (option) => {
                        switch(typeof option) {
                            case "string":
                                return option;
                            case "object":
                                return option.selectOptionText();
                            default:
                                return option.toString();
                        }
                    }
                }
                onInputChange={this.onTextFieldChange.bind(this)}
                onChange={this.onAutoCompleteValueChange.bind(this)}
                noOptionsText={""}
                includeInputInList={true}
                fullWidth={true}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        autoFocus
                        variant="outlined"
                        helperText={queryHelperText}
                    />
                }
            />
            {
                this.button(
                    SpreadsheetSelectAutocompleteWidget.CELL_GOTO_BUTTON_ID,
                    !cell,
                    cell,
                    null,
                    "Goto Cell"
                )
            }
            {
                this.button(
                    SpreadsheetSelectAutocompleteWidget.CELL_RANGE_SELECT_BUTTON_ID,
                    cell || !cellRange,
                    cellRange,
                    null,
                    "Select Cell Range"
                )
            }
            {
                this.button(
                    SpreadsheetSelectAutocompleteWidget.COLUMN_GOTO_BUTTON_ID,
                    !column,
                    column,
                    null,
                    "Goto Column"
                )
            }
            {
                this.button(
                    SpreadsheetSelectAutocompleteWidget.COLUMN_RANGE_SELECT_BUTTON_ID,
                    column || !columnRange,
                    columnRange,
                    null,
                    "Select Column Range"
                )
            }
            {
                this.button(
                    SpreadsheetSelectAutocompleteWidget.LABEL_GOTO_BUTTON_ID,
                    !labelMapping,
                    label,
                    null, "Goto Label"
                )
            }
            {
                this.button(
                    SpreadsheetSelectAutocompleteWidget.LABEL_CREATE_BUTTON_ID,
                    cell || !(label && !labelMapping),
                    null,
                    label,
                    "Create Label"
                )
            }
            {
                this.button(
                    SpreadsheetSelectAutocompleteWidget.LABEL_EDIT_BUTTON_ID,
                    !labelMapping,
                    null,
                    label,
                    "Edit Label"
                )
            }
            {
                this.button(
                    SpreadsheetSelectAutocompleteWidget.ROW_GOTO_BUTTON_ID,
                    !row,
                    row,
                    null,
                    "Goto Row"
                )
            }
            {
                this.button(
                    SpreadsheetSelectAutocompleteWidget.ROW_RANGE_SELECT_BUTTON_ID,
                    row || !rowRange,
                    rowRange,
                    null,
                    "Select Row Range")
            }
        </SpreadsheetDialog>;
    }

    /**
     * Factory that creates a BUTTON including the target link.
     */
    button(id, disabled, goto, label, text) {
        Preconditions.optionalInstance(goto, SpreadsheetSelection, "goto");
        Preconditions.optionalInstance(label, SpreadsheetLabelName, "label");

        var link = null;

        if(!disabled){
            const tokens = this.props.history.tokens();

            tokens[SpreadsheetHistoryHashTokens.SELECT] = null; // close the navigate modal

            if(goto){
                tokens[SpreadsheetHistoryHashTokens.VIEWPORT_SELECTION] = goto;
            }

            if(label){
                tokens[SpreadsheetHistoryHashTokens.LABEL] = new SpreadsheetLabelMappingEditHistoryHashToken(label);
            }

            link = "#" + SpreadsheetHistoryHash.stringify(tokens);
        }

        return <Button id={id}
                       disabled={!!disabled}
                       color="primary"
                       href={link}>
            {text}
        </Button>;
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

        const newState = {
            text: text,
            queryHelperText: "",
            options: [],
        };

        const trying = [
            SpreadsheetCellReference.parse,
            SpreadsheetCellRange.parse,
            SpreadsheetColumnReference.parse,
            SpreadsheetColumnReferenceRange.parse,
            SpreadsheetLabelName.parse,
            SpreadsheetRowReference.parse,
            SpreadsheetRowReferenceRange.parse,
        ];

        var clearQueryHelperText = false; // Dont want to show the error message from SpreadsheetColumnReference.parse if SpreadsheetCellReference.parse was successful

        // try all $trying so we can light up as many buttons as possible...
        for(const possible of trying) {
            try {
                const reference = possible(text);
                newState.options.push(reference);
                clearQueryHelperText = true;
            } catch(e) {
                // only want to keep the first parse failure message...
                if(e.message && !newState.queryHelperText){
                    newState.queryHelperText = e.message;
                }
            }
        }

        const props = this.props;
        try {
            props.getSimilarities(
                text,
                MAX_COUNT,
                (s) => {
                    var options = this.state.options;

                    const cellReferences = s.cellReference();
                    if(cellReferences){
                        options.push(cellReferences);
                    }
                    const label = s.label();
                    if(label){
                        options.push(label);
                    }
                    const labelMappings = s.labelMappings();
                    if(labelMappings){
                        options = options.concat(labelMappings);
                    }

                    this.setState({
                        options: options,
                    });
                },
                (e) => {
                    props.showError(e);
                },
            );
        } catch(e) {
            console.log("performSimilarities server failed: " + e.message);
            props.showError(e);
        }

        if(clearQueryHelperText){
            newState.queryHelperText = "";
        }
        this.setState(newState);
    }

    /**
     * Closes the dialog.
     */
    close() {
        console.log("close");

        const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
        tokens[SpreadsheetHistoryHashTokens.SELECT] = null;
        this.historyParseMergeAndPush(tokens);
    }
}

SpreadsheetSelectAutocompleteWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    getSimilarities: PropTypes.func.isRequired, // performs a search to find similarities to the query text field.
    notificationShow: PropTypes.func.isRequired, // used to display notifications including errors and other messages
    showError: PropTypes.func.isRequired, // used mostly to display failures around getSimilarities
}