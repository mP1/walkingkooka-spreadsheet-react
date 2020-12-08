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

        this.state = {value: props.value};
        this.setValue = props.setValue;

        this.textField = React.createRef();
    }

    render() {
        const spreadsheetName = this.state.value;
        const name = (spreadsheetName && spreadsheetName.value()) || "";

        // TODO add a validator to verify spreadsheetName characters
        return <SpreadsheetButtonTextField ref={this.textField}
                                           key={name}
                                           value={name}
                                           setValue={v => this.setValue(new SpreadsheetName(v))}/>
    }
}

SpreadsheetNameWidget.propTypes = {
    value: PropTypes.object, // might be absent
    setValue: PropTypes.func.isRequired,
}