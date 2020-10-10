import React from 'react';

/**
 * A wrapper that makes it easier to receive updates to the App and also update the app in return.
 */
export default class AppAwareComponent extends React.Component {

    constructor(props) {
        super(props);
        this.app = props.app;
    }

    componentDidMount() {
        this.app.addSpreadsheetMetadataListener(this);
    }

    componentWillUnmount() {
        this.app.removeSpreadsheetMetadataListener(this);
    }

    spreadsheetName() {
        return this.state.spreadsheetMetadata.spreadsheetName();
    }

    setSpreadsheetName(name) {
        this.app.saveSpreadsheetMetadata(this.state.spreadsheetMetadata.setSpreadsheetName(name));
    }
}