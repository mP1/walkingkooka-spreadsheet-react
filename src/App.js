import React from 'react';
import './App.css';

import SpreadsheetAppBarTop from "./components/SpreadsheetAppBarTop/SpreadsheetAppBarTop.js";
import SpreadsheetContent from "./components/SpreadsheetContent/SpreadsheetContent.js";
import SpreadsheetFormula from "./components/SpreadsheetFormula/SpreadsheetFormula.js";
import SpreadsheetMessenger from "./components/SpreadsheetMessenger/SpreadsheetMessenger.js";

import Divider from '@material-ui/core/Divider';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spreadsheetMetadata: {
                name: "Untitled 1"
            },
            cells: {}
        }

        const handleSpreadsheetMetadata = (metadata) => {
            this.setState({spreadsheetMetadata: metadata});
        }
        const handleSpreadsheetDelta = (delta) => {
            this.setState({cells: delta.cells});
        }

        // the names must match the name of the classes in walkingkooka-spreadsheet
        this.messenger = new SpreadsheetMessenger(new Worker("http://localhost:3000/"),
            {
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
                method: "POST",
                headers: {
                    "Accept-Charset": "UTF-8",
                    "Content-Type": "application/json"
                },
            });
    }

    /**
     * Renders the basic spreadsheet layout.
     */
    render() {
        const {spreadsheetMetadata, cells} = this.state;
        return (
            <div>
                <SpreadsheetAppBarTop spreadsheetName={spreadsheetMetadata.name}/>
                <Divider/>
                <SpreadsheetFormula/>
                <Divider/>
                <SpreadsheetContent cells={cells}/>
            </div>
        );
    }
}
