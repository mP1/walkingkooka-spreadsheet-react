import React from 'react';
import PropTypes from 'prop-types';
import SpreadsheetButtonTextField from '../widget/SpreadsheetButtonTextField.js';
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetName from "./SpreadsheetName.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";

/**
 * A wrapper that is a bridge between SpreadsheetMetadata's spreadsheet name and a text field.
 */
export default class SpreadsheetNameWidget extends SpreadsheetHistoryAwareStateWidget {

    init() {
        this.textField = React.createRef();
    }

    initialStateFromProps(props) {
        return {
            value: this.props.value
        };
    }

    stateFromHistoryTokens(tokens) {
        return {
            edit: !!tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT],
        };
    }

    historyTokensFromState(prevState) {
        const edit = !!this.state.edit;

        const widget = this.textField.current;
        widget && widget.edit(edit);

        const historyTokens = {};
        historyTokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT] = edit;
        console.log("history tokens name edit: " + edit, historyTokens, "state", this.state, "history", this.props.history.location.pathname);
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

    onValue(v) {
        this.props.setValue(new SpreadsheetName(v));
        this.onTextFieldEdit(false);
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