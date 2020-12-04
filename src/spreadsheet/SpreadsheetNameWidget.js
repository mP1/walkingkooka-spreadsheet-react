import React from 'react';
import PropTypes from 'prop-types';

import SpreadsheetButtonTextField from '../widget/SpreadsheetButtonTextField.js';
import AppAwareComponent from "../widget/AppAwareComponent.js";
import SpreadsheetName from "./SpreadsheetName.js";

/**
 * A wrapper that is a bridge between App updates and also updating following changes to the text field.
 */
export default class SpreadsheetNameWidget extends AppAwareComponent {

    constructor(props) {
        super(props);

        this.state = {spreadsheetMetadata: props.app.spreadsheetMetadata()};
        this.textField = React.createRef();
    }

    render() {
        const spreadsheetName = this.spreadsheetName();
        // TODO add a validator to verify spreadsheetName characters, then call setSpreadsheetName function
        return <SpreadsheetButtonTextField ref={this.textField}
                                           key={spreadsheetName}
                                           value={spreadsheetNameText(spreadsheetName)}
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