import React from 'react';
import PropTypes from 'prop-types';
import SpreadsheetButtonTextField from '../widget/SpreadsheetButtonTextField.js';
import SpreadsheetHistoryAwareWidget from "./history/SpreadsheetHistoryAwareWidget.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetName from "./SpreadsheetName.js";

/**
 * A wrapper that is a bridge between SpreadsheetMetadata's spreadsheet name and a text field.
 */
export default class SpreadsheetNameWidget extends SpreadsheetHistoryAwareWidget {

    init() {
        this.state = {
            value: this.props.value
        };
        this.textField = React.createRef();
    }

    onHistoryChange(tokens) {
        this.edit(!!tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT]);
    }

    /**
     * Updates the widget mode between edit/view.
     */
    edit(mode) {
        const widget = this.textField.current;
        widget && widget.edit(mode);
    }

    /**
     * Returns true if the name is being edited.
     */
    isEdit() {
        const widget = this.textField.current;
        return widget && widget.state.edit;
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
                                           setEdit={this.onTextFieldEdit.bind(this)}/>
    }

    onValue(v) {
        this.props.setValue(new SpreadsheetName(v));
        this.onTextFieldEdit(false);
    }

    onTextFieldEdit(e) {
        const replacements = {};
        replacements[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT] = !this.isEdit();
        SpreadsheetHistoryHash.parseMergeAndPush(this.history, replacements);
    }
}

SpreadsheetNameWidget.propTypes = {
    history: PropTypes.object.isRequired,
    value: PropTypes.object, // might be absent
    setValue: PropTypes.func.isRequired,
}