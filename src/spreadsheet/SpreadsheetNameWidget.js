import React from 'react';
import PropTypes from 'prop-types';

import SpreadsheetButtonTextField from '../widget/SpreadsheetButtonTextField.js';
import SpreadsheetName from "./SpreadsheetName.js";
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import HistoryHash from "./history/HistoryHash.js";

/**
 * A wrapper that is a bridge between SpreadsheetMetadata's spreadsheet name and a text field.
 */
export default class SpreadsheetNameWidget extends React.Component {

    constructor(props) {
        super(props);

        this.history = props.history;

        this.state = {
            value: props.value
        };
        this.setValue = props.setValue;
        this.setEdit = props.setEdit;

        this.textField = React.createRef();
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
                                           setValue={v => this.setValue(new SpreadsheetName(v))}
                                           setEdit={this.onTextFieldEdit.bind(this)}/>
    }

    onTextFieldEdit(e) {
        const history = this.history;
        const current = history.location.pathname;
        const updated = SpreadsheetHistoryHash.merge(
            SpreadsheetHistoryHash.parse(current),
            {
                "name": !this.state.name,
            }
        );
        if(current != updated) {
            history.push(updated);
        }

        this.setEdit(e);
    }
}

SpreadsheetNameWidget.propTypes = {
    history: PropTypes.instanceOf(HistoryHash).isRequired, // history will provide open
    value: PropTypes.object, // might be absent
    setValue: PropTypes.func.isRequired,
}