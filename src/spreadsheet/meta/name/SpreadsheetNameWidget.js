import Button from "@mui/material/Button";
import Equality from "../../../Equality.js";
import Keys from "../../../Keys.js";
import PropTypes from 'prop-types';
import React from 'react';
import SpreadsheetHistoryHash from "../../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetMessengerCrud from "../../message/SpreadsheetMessengerCrud.js";
import SpreadsheetMetadata from "../SpreadsheetMetadata.js";
import SpreadsheetMetadataWidget from "../SpreadsheetMetadataWidget.js";
import SpreadsheetNameEditHistoryHashToken from "./SpreadsheetNameEditHistoryHashToken.js";
import SpreadsheetNameSaveHistoryHashToken from "./SpreadsheetNameSaveHistoryHashToken.js";
import SpreadsheetName from "./SpreadsheetName.js";
import TextField from "@mui/material/TextField";

/**
 * A widget that displays the spreadsheet name as a button which when clicked turns into a text field and may be edited.
 */
export default class SpreadsheetNameWidget extends SpreadsheetMetadataWidget {

    static SPREADSHEET_METADATA_NAME_ID = "metadata-name";

    static BUTTON_ID = SpreadsheetNameWidget.SPREADSHEET_METADATA_NAME_ID + "-Button";

    static TEXT_FIELD_ID = SpreadsheetNameWidget.SPREADSHEET_METADATA_NAME_ID + "-TextField";

    init() {
    }

    initialStateFromProps(props) {
        return {
            name: null,
            value: "",
            edit: null,
        };
    }

    stateFromHistoryTokens(tokens) {
        return {
            id: tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID],
            name: tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME],
            edit: tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT],
        };
    }

    historyTokensFromState(prevState) {
        const state = this.state;
        const newEdit = state.edit;

        const historyTokens = SpreadsheetHistoryHashTokens.emptyTokens();

        if(!Equality.safeEquals(newEdit, prevState.edit)){
            newEdit && newEdit.spreadsheetNameWidgetExecute(this);

            historyTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = newEdit;
        }

        return historyTokens;
    }

    render() {
        const {edit, name, value} = this.state;

        const text = edit ?
            value :
            name ? name.value() : "";

        document.title = text;

        const tokens = this.props.history.tokens();
        tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = SpreadsheetNameEditHistoryHashToken.INSTANCE;
        const buttonLink = "#" + SpreadsheetHistoryHash.stringify(tokens);

        const textOnBlur = () => {
            this.setState({
                edit: null,
                value: this.state.name,
            });
        };

        const textOnChange = (e) => {
            this.setState({
                value: e.target.value || "",
            });
        };

        const textOnKeyDown = (e) => {
            switch(e.key) {
                case Keys.ESCAPE:
                    e.preventDefault();
                    this.setState({
                        edit: null,
                    });
                    break;
                case Keys.ENTER:
                    e.preventDefault();
                    this.saveNewSpreadsheetName();
                    break;
                default:
                // ignore other keys
            }
        };

        return !edit ?
            <Button
                id={SpreadsheetNameWidget.BUTTON_ID}
                href={buttonLink}
                style={{
                    color: "#000",
                    textTransform: "none",
                }}
            >{text}</Button> :
            <TextField ref={this.textField}
                       id={SpreadsheetNameWidget.TEXT_FIELD_ID}
                       fullWidth={true}
                       margin={"none"}
                       onBlur={textOnBlur}
                       onKeyDown={textOnKeyDown}
                       value={value}
                       onChange={textOnChange}
                       autoFocus
            />;
    }

    saveNewSpreadsheetName() {
        const historyHashTokens = SpreadsheetHistoryHash.emptyTokens();
        historyHashTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = new SpreadsheetNameSaveHistoryHashToken(
            new SpreadsheetName(this.state.value)
        );
        this.historyMergeAndPush(historyHashTokens);
    }

    onSpreadsheetMetadata(method, id, url, requestMetadata, responseMetadata) {
        if(responseMetadata){
            const spreadsheetName = responseMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME);

            this.setState({
                id: id, // SpreadsheetId
                name: spreadsheetName,
                value: spreadsheetName ? spreadsheetName.value() : "",
            });
        }
    }
}

SpreadsheetNameWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetMetadataCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud).isRequired,
    showError: PropTypes.func.isRequired,
}