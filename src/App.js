import React from 'react';
import './App.css';

import SpreadsheetAppBarTop from "./widget/SpreadsheetAppBarTop.js";
import SpreadsheetContent from "./widget/SpreadsheetContent.js";
import SpreadsheetFormulaWidget from "./widget/SpreadsheetFormulaWidget.js";
import SpreadsheetMetadata from "./spreadsheet/meta/SpreadsheetMetadata.js";
import SpreadsheetMessenger from "./util/SpreadsheetMessenger.js";
import Listeners from "./util/Listeners";

import Divider from '@material-ui/core/Divider';
import SpreadsheetCellBox from "./spreadsheet/reference/SpreadsheetCellBox";
import SpreadsheetCoordinates from "./spreadsheet/SpreadsheetCoordinates";
import SpreadsheetViewport from "./spreadsheet/reference/SpreadsheetViewport";
import SpreadsheetRange from "./spreadsheet/reference/SpreadsheetRange";
import SpreadsheetDelta from "./spreadsheet/engine/SpreadsheetDelta";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY
        }

        const handleSpreadsheetCellBox = (json) => {
            this.spreadsheetCellBoxListeners.dispatch(SpreadsheetCellBox.fromJson(json));
        }

        const handleSpreadsheetCoordinates = (json) => {
            this.spreadsheetCoordinatesListeners.dispatch(SpreadsheetCoordinates.fromJson(json));
        }

        const handleSpreadsheetDelta = (json) => {
            this.spreadsheetDeltaListeners.dispatch(SpreadsheetDelta.fromJson(json));
        }

        const handleSpreadsheetMetadata = (json) => {
            this.spreadsheetMetadataListeners.dispatch(new SpreadsheetMetadata(json));
        }

        const handleSpreadsheetRange = (json) => {
            this.spreadsheetRangeListeners.dispatch(SpreadsheetRange.fromJson(json));
        }

        // the names must match the Class.getSimpleName in walkingkooka-spreadsheet
        this.messenger = new SpreadsheetMessenger({
            "SpreadsheetCellBox": handleSpreadsheetCellBox,
            "SpreadsheetCoordinates": handleSpreadsheetCoordinates,
            "SpreadsheetDeltaNonWindowed": handleSpreadsheetDelta,
            "SpreadsheetDeltaWindowed": handleSpreadsheetDelta,
            "SpreadsheetMetadataNonEmpty": handleSpreadsheetMetadata,
            "SpreadsheetRange": handleSpreadsheetRange,
        });
        this.messenger.setWebWorker(false); // TODO test webworker mode

        this.spreadsheetMetadataListeners.add(this.setStateMetadata.bind(this));
        this.spreadsheetMetadataListeners.add(this.viewportCoordinatesUpdate.bind(this));
        this.spreadsheetCellBoxListeners.add(this.requestViewportRange.bind(this));
        this.spreadsheetRangeListeners.add(this.loadSpreadsheetRangeCell.bind(this));
    }

    setStateMetadata(metadata) {
        this.setState({"spreadsheetMetadata": metadata});
    }

    /**
     * Reads the new metadata viewport and fetches the cellbox for those coordinates.
     */
    viewportCoordinatesUpdate(metadata) {
        const viewport = metadata.viewportCoordinates();

        // TODO make request *ONLY* if metadata.viewport changed or forced.
        this.messenger.send(this.spreadsheetApiUrl(metadata) + "/cellbox/" + viewport, {
            method: "GET"
        })
    }

    /**
     * Accepts {@link SpreadsheetCellBox} and requests the {@link SpreadsheetRange} that fill the content.
     */
    requestViewportRange(cellBox) {
        const width = 1000; // TODO retrieve from viewport widget.
        const height = 500;

        // always make request
        this.messenger.send(this.spreadsheetApiUrl() + "/viewport/" + new SpreadsheetViewport(cellBox.reference(), width, height),
            {
                method: "GET"
            });
    }

    /**
     * Accepts the {@link SpreadsheetRange} returned by {@link #requestViewportRange} and then loads all the cells in that
     * range.
     */
    loadSpreadsheetRangeCell(range) {
        // TODO add window
        // always make request
        this.messenger.send(this.spreadsheetCellLoadUrl(range),
            {
                method: "GET"
            });
    }

    spreadsheetCellLoadUrl(idOrRange) {
        const evaluation = this.state.spreadsheetEngineEvaluation || "compute-if-necessary";

        return this.spreadsheetApiUrl() + "/cell/" + idOrRange + "/" + evaluation;
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

    // SpreadsheetCellBox...............................................................................................

    spreadsheetCellBoxListeners = new Listeners();

    // SpreadsheetCoordinates...........................................................................................

    spreadsheetCoordinatesListeners = new Listeners();

    // SpreadsheetDelta.................................................................................................

    spreadsheetDeltaListeners = new Listeners();

    // SpreadsheetMetadata..............................................................................................

    spreadsheetApiUrl(metadata) {
        return "/api/spreadsheet/" + (metadata || this.spreadsheetMetadata()).spreadsheetId();
    }

    spreadsheetMetadata() {
        return this.state.spreadsheetMetadata;
    }

    /**
     * Updates the state and saves the metadata.
     */
    saveSpreadsheetMetadata(metadata) {
        console.log("saveSpreadsheetMetadata", metadata);

        this.messenger.send(this.spreadsheetApiUrl(), {
            "method": "POST",
            "body": JSON.stringify(metadata.toJson())
        });
    }

    spreadsheetMetadataListeners = new Listeners();

    // SpreadsheetRange.................................................................................................

    spreadsheetRangeListeners = new Listeners();

    // toString.........................................................................................................

    toString() {
        return this.spreadsheetMetadata().toString();
    }
}
