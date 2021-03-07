import React from 'react';
import PropTypes from 'prop-types';
import SpreadsheetButtonTextField from '../widget/SpreadsheetButtonTextField.js';
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetName from "./SpreadsheetName.js";

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

    componentDidMount() {
        this.historyUnlisten = this.history.listen(this.onHistoryChange.bind(this));
    }

    componentWillUnmount() {
        this.historyUnlisten();
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
        this.setValue(new SpreadsheetName(v));
        this.onTextFieldEdit(false);
    }

    onTextFieldEdit(e) {
        const newEdit = !this.isEdit();

        const history = this.history;
        const current = history.location.pathname;
        const replacements = {};
        replacements[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT] = newEdit;

        const updated = SpreadsheetHistoryHash.merge(
            SpreadsheetHistoryHash.parse(current),
            replacements
        );
        console.log("onTextEdit " + e + " from " + current + " to " + updated);

        if(current !== updated){
            history.push(updated);
        }
    }

    /**
     * Loads the spreadsheet name edit token and updates the state.
     */
    onHistoryChange(location) {
        console.log("onHistoryChange " + location.pathname);
        this.edit(this.loadHistoryHash(location.pathname));
    }

    /**
     * returns a flag whether the name widget is in edit mode.
     */
    loadHistoryHash(pathname) {
        const tokens = SpreadsheetHistoryHash.parse(pathname);
        console.log("loadHistoryHash: ", tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT]);
        return !!tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT];
    }
}

SpreadsheetNameWidget.propTypes = {
    history: PropTypes.object.isRequired,
    value: PropTypes.object, // might be absent
    setValue: PropTypes.func.isRequired,
}