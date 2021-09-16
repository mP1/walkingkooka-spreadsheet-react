import React from 'react';
import PropTypes from 'prop-types';
import SpreadsheetButtonTextField from '../widget/SpreadsheetButtonTextField.js';
import SpreadsheetHistoryHash from "./history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryAwareStateWidget from "./history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetName from "./SpreadsheetName.js";
import SpreadsheetMessengerCrud from "./message/SpreadsheetMessengerCrud.js";
import SpreadsheetMetadata from "./meta/SpreadsheetMetadata.js";

/**
 * A wrapper that is a bridge between SpreadsheetMetadata's spreadsheet name and a text field.
 * State<br>
 * <ul>
 * <li>String value holds the spreadsheet name as text</li>
 * <li>boolean edit true means the name is currently being edited</li>
 * <li>SpreadsheetMetadata metadata: Holds the initial value which is used when reset</li>
 * </ul>
 */
export default class SpreadsheetNameWidget extends SpreadsheetHistoryAwareStateWidget {

    init() {
        this.textField = React.createRef();
    }

    initialStateFromProps(props) {
        return {};
    }

    componentDidMount() {
        super.componentDidMount();

        this.spreadsheetMetadataCrudRemover = this.props.spreadsheetMetadataCrud.addListener(this.onSpreadsheetMetadata.bind(this));
    }

    onSpreadsheetMetadata(method, id, url, requestMetadata, responseMetadata) {
        this.setState({
            metadata: responseMetadata,
            value: responseMetadata && responseMetadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME),
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.spreadsheetMetadataCrudRemover && this.spreadsheetMetadataCrudRemover();
        delete this.spreadsheetMetadataCrudRemover;
    }

    stateFromHistoryTokens(tokens) {
        return {
            edit: !!tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT],
        };
    }

    historyTokensFromState(prevState) {
        const state = this.state;
        const edit = !!state.edit;
        const name = state.value;
        const nameText = name ? name.toString() : "";

        const widget = this.textField.current;
        if(widget){
            widget.edit(edit);

            this.textField.current.setState({
                value: nameText,
            });
        }
        document.title = nameText;

        const historyTokens = {};
        historyTokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT] = edit;
        return historyTokens;
    }

    render() {
        const spreadsheetName = this.state.value;
        const value = (spreadsheetName && spreadsheetName.value()) || "";

        // TODO add a validator to verify spreadsheetName characters
        return <SpreadsheetButtonTextField ref={this.textField}
                                           key={value}
                                           id={"spreadsheet-name"}
                                           className={"spreadsheet-name"}
                                           value={value}
                                           setValue={this.onValue.bind(this)}
                                           setEdit={this.onTextFieldEdit.bind(this)}/>
    }

    /**
     * If the text value from the text field is invalid or failures validation the original loaded value is restored.
     */
    onValue(v) {
        try {
            const metadata = this.state.metadata;

            this.props.spreadsheetMetadataCrud.post(
                metadata.get(SpreadsheetMetadata.SPREADSHEET_ID),
                metadata.set(SpreadsheetMetadata.SPREADSHEET_NAME, new SpreadsheetName(v)),
                this.resetValueAndShowError.bind(this)
            );
        } catch(e) {
            this.resetValueAndShowError(e.message);
        }
        this.onTextFieldEdit(false);
    }

    /**
     * If an invalid spreadsheet name has been entered or saving failures, reload the original {@link SpreadsheetName}.
     */
    resetValueAndShowError(message, error) {
        const value = this.state.metadata.getIgnoringDefaults(SpreadsheetMetadata.SPREADSHEET_NAME);
        console.log("resetValueAndShowError" + value);
        this.setState({
            value: value,
        });
        if(message || error){
            this.showError(message, error);
        }
    }

    onTextFieldEdit(newEdit) {
        this.setState({
            edit: newEdit,
        })
    }
}

SpreadsheetNameWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetMetadataCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud).isRequired,
    showError: PropTypes.func.isRequired,
}