import React from 'react';

import SpreadsheetTextField from '../SpreadsheetTextField/SpreadsheetTextField.js';

export default class SpreadsheetName extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return new SpreadsheetTextField(this.props).render();
    }
}
