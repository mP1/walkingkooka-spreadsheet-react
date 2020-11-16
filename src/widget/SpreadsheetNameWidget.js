import React from 'react';
import PropTypes from 'prop-types';

import SpreadsheetTextField from './SpreadsheetTextField.js';
import AppAwareComponent from "./AppAwareComponent";
import SpreadsheetName from "../spreadsheet/SpreadsheetName";

/**
 * A wrapper that is a bridge between App updates and also updating following changes to the text field.
 */
export default class SpreadsheetNameWidget extends AppAwareComponent {

    constructor(props) {
        super(props);

        this.state = {spreadsheetMetadata: props.app.spreadsheetMetadata()};
        this.textField = React.createRef();
    }

    componentWillUpdate(nextProps, nextState) {
        this.textField.current.setState({value: spreadsheetNameText(nextState.spreadsheetMetadata.spreadsheetName())});
    }

    render() {
        // TODO add a validator to verify spreadsheetName characters, then call setSpreadsheetName function
        return <SpreadsheetTextField ref={this.textField}
                                     value={spreadsheetNameText(this.spreadsheetName())}
                                     setValue={v => this.setSpreadsheetName.bind(this)(new SpreadsheetName(v))}/>
    }
}

SpreadsheetNameWidget.propTypes = {
    app: PropTypes.object.isRequired,
}

/**
 * Safely defaults to empty string if spreadsheetname is absent.
 */
function spreadsheetNameText(name) {
    return (name && name.value()) || "";
}