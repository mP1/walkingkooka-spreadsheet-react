import React from 'react';
import PropTypes from 'prop-types';

import SpreadsheetButtonTextField from '../widget/SpreadsheetButtonTextField.js';
import SpreadsheetName from "./SpreadsheetName.js";

/**
 * A wrapper that is a bridge between SpreadsheetMetadata's spreadsheet name and a text field.
 */
export default class SpreadsheetNameWidget extends React.Component {

    constructor(props) {
        super(props);

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
                                           value={name}
                                           setValue={v => this.setValue(new SpreadsheetName(v))}
                                           setEdit={e => this.setEdit(e)}/>
    }
}

SpreadsheetNameWidget.propTypes = {
    value: PropTypes.object, // might be absent
    setValue: PropTypes.func.isRequired,
    setEdit: PropTypes.func.isRequired,
}