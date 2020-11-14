import React from 'react';
import PropTypes from 'prop-types';

import SpreadsheetTextField from '../SpreadsheetTextField/SpreadsheetTextField.js';
import AppAwareComponent from "../AppAwareComponent";

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
        this.textField.current.setState({value: nextState.spreadsheetMetadata.spreadsheetName()});
    }

    render() {
        // TODO add a validator to verify spreadsheetName characters
        return <SpreadsheetTextField ref={this.textField}
                                     value={this.spreadsheetName.bind(this)}
                                     setValue={this.setSpreadsheetName.bind(this)}/>
    }
}

SpreadsheetNameWidget.propTypes = {
    app: PropTypes.object.isRequired,
}
