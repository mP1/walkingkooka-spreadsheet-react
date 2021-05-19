import React from 'react';
import PropTypes from 'prop-types';
import SpreadsheetButtonTextField from '../widget/SpreadsheetButtonTextField.js';
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetName from "./SpreadsheetName.js";

/**
 * A wrapper that is a bridge between SpreadsheetMetadata's spreadsheet name and a text field.
 * State<br>
 * <ul>
 * <li>value holds the spreadsheet name as text</li>
 * <li>loaded holds the initial or any loaded value. This value must be valid</li>
 * <li>edit true means the name is currently being edited</li>
 * </ul>
 */
export default class SpreadsheetNameWidget extends SpreadsheetHistoryAwareStateWidget {

    init() {
        this.textField = React.createRef();
    }

    initialStateFromProps(props) {
        const value = this.props.value;

        return {
            value: value,
            loaded: value,
        };
    }

    stateFromHistoryTokens(tokens) {
        return {
            edit: !!tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT],
        };
    }

    historyTokensFromState(prevState) {
        const state = this.state;
        const edit = !!state.edit;
        const name = state.value;
        const nameText = name ? name.toString() : "";

        const widget = this.textField.current;
        if(widget){
            widget.edit(edit);

            this.textField.current.setState({
                value: nameText,
            });
        }
        document.title = nameText;

        const historyTokens = {};
        historyTokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT] = edit;
        console.log("history tokens name edit: " + edit, historyTokens, "state", state, "history", this.props.history.location.pathname);
        return historyTokens;
    }

    render() {
        const spreadsheetName = this.state.value;
        const name = (spreadsheetName && spreadsheetName.value()) || "";

        // TODO add a validator to verify spreadsheetName characters
        return <SpreadsheetButtonTextField ref={this.textField}
                                           key={name}
                                           id={"spreadsheet-name"}
                                           className={"spreadsheet-name"}
                                           value={name}
                                           setValue={this.onValue.bind(this)}
                                           setEdit={(edit) => this.onTextFieldEdit(edit)}/>
    }

    /**
     * If the text value from the text field is invalid or failures validation the original loaded value is restored.
     */
    onValue(v) {
        try {
            this.props.setValue(
                new SpreadsheetName(v),
                (name) => {
                    this.setState({
                        value: name,
                        loaded: name,
                    });
                },
                (e) => {
                    this.resetValueAndShowError(e);
                }
            );
        } catch(e) {
            this.resetValueAndShowError(e.message);
        }
        this.onTextFieldEdit(false);
    }

    /**
     * If an invalid spreadsheet name has been entered or saving failures, reload the original {@link SpreadsheetName}.
     */
    resetValueAndShowError(e) {
        console.log("resetValueAndShowError" + this.state.loaded);
        this.setState({
            value: this.state.loaded,
        });
        if(e){
            this.showError(e);
        }
    }

    onTextFieldEdit(newEdit) {
        this.setState({
            edit: newEdit,
        })
    }
}

SpreadsheetNameWidget.propTypes = {
    history: PropTypes.object.isRequired,
    value: PropTypes.object, // might be absent
    setValue: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
}