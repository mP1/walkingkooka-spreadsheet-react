import React from 'react';
import './App.css';

import SpreadsheetAppBarTop from "./widget/SpreadsheetAppBarTop.js";
import SpreadsheetContent from "./widget/SpreadsheetContent.js";
import SpreadsheetFormulaWidget from "./widget/SpreadsheetFormulaWidget.js";
import SpreadsheetMetadata from "./spreadsheet/meta/SpreadsheetMetadata.js";
import SpreadsheetMessenger from "./util/SpreadsheetMessenger.js";
import Listeners from "./util/Listeners";

import Divider from '@material-ui/core/Divider';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY
        }

        const handleSpreadsheetMetadata = (metadata) => {
            console.log("handleSpreadsheetMetadata " + new SpreadsheetMetadata(metadata));

            this.spreadsheetMetadataListeners.dispatch(new SpreadsheetMetadata(metadata));
        }

        const handleSpreadsheetDelta = (delta) => {
            this.setState({cells: delta.cells}); // TODO dispatch listeners
        }

        // the names must match the name of the classes in walkingkooka-spreadsheet
        this.messenger = new SpreadsheetMessenger({
                "SpreadsheetMetadataNonEmpty": handleSpreadsheetMetadata,
                "SpreadsheetDeltaNonWindowed": handleSpreadsheetDelta,
                "SpreadsheetDeltaWindowed": handleSpreadsheetDelta,
            });
        this.messenger.setWebWorker(false); // TODO test webworker mode
    }

    componentDidMount() {
        this.createEmptySpreadsheet(); // TODO add logic to allow selecting: create empty, prompt to load and more.
    }

    /**
     * Makes a request which returns some basic default metadata, and without cells the spreadsheet will be empty.
     */
    createEmptySpreadsheet() {
        this.messenger.send("/api/spreadsheet",
            {
                method: "POST"
            });
    }

    /**
     * Renders the basic spreadsheet layout.
     */
    render() {
        console.log("App.render " + this.state);

        return (
            <div>
                <SpreadsheetAppBarTop app={this}/>
                <Divider/>
                <SpreadsheetFormulaWidget/>
                <Divider/>
                <SpreadsheetContent/>
            </div>
        );
    }

    // SpreadsheetMetadata..............................................................................................

    spreadsheetMetadata() {
        return this.state.spreadsheetMetadata;
    }

    /**
     * Updates the state and saves the metadata.
     */
    saveSpreadsheetMetadata(metadata) {
        console.log("saveSpreadsheetMetadata: " + metadata);

        //this.setState({spreadsheetMetadata: metadata});
        this.messenger.send("/api/spreadsheet/" + metadata.spreadsheetId(), {
            "method": "POST",
            "body": JSON.stringify(metadata.toJson())
        });
    }

    addSpreadsheetMetadataListener(listener) {
        this.spreadsheetMetadataListeners.add(listener);
    }

    removeSpreadsheetMetadataListener(listener) {
        this.spreadsheetMetadataListeners.remove(listener);
    }
    spreadsheetMetadataListeners = new Listeners();

    toString() {
        return this.spreadsheetMetadata().toString();
    }
}
