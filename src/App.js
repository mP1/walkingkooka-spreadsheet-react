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
import SpreadsheetEngineEvaluation from "./spreadsheet/engine/SpreadsheetEngineEvaluation";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spreadsheetEngineEvaluation: SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY,
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY,
            cells: new Map(),
            columnWidths: new Map(),
            rowHeights: new Map(),
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

        this.spreadsheetDeltaListeners.add(this.setStateDelta.bind(this));
        this.spreadsheetMetadataListeners.add(this.setStateMetadata.bind(this));
        this.spreadsheetMetadataListeners.add(this.viewportCoordinatesUpdate.bind(this));
        this.spreadsheetCellBoxListeners.add(this.requestViewportRange.bind(this));
        this.spreadsheetRangeListeners.add(this.loadSpreadsheetRangeCell.bind(this));
    }

    /**
     * Merge the new cells, columnWidths, rowHeights with the old in state.
     */
    setStateDelta(delta) {
        // merge the old and new cells.
        const cells = new Map(this.state.cells);
        delta.cells().forEach(c => {
            cells.put(c.reference(), c);
        });

        // merge columnWidths and rowHeights
        this.setState({
            cells: cells,
            columnWidths: new Map([...this.state.columnWidths, ...delta.maxColumnWidths()]),
            rowHeights: new Map([...this.state.rowHeights, ...delta.maxRowHeights()]),
        });
    }

    setStateMetadata(metadata) {
        this.setState({"spreadsheetMetadata": metadata});
    }

    /**
     * Fires a new {@link SpreadsheetCellBox} which should trigger a redraw.
     */
    viewportCoordinatesUpdate(metadata) {
        const coords = metadata.viewportCoordinates();

        this.spreadsheetCellBoxListeners.dispatch(new SpreadsheetCellBox(metadata.viewportCell(),
            coords.x(),
            coords.y(),
            0,
            0));
    }

    /**
     * Accepts {@link SpreadsheetCellBox} and requests the {@link SpreadsheetRange} that fill the content.
     */
    requestViewportRange(cellBox) {
        // always make request
        this.messenger.send(this.spreadsheetApiUrl() + "/viewport/" + this.fetchSpreadsheetViewport(cellBox.reference()),
            {
                method: "GET"
            });
    }

    /**
     * Fetch or computes the {@link SpreadsheetViewport} taking the width and height from the viewport holding the cells.
     */
    fetchSpreadsheetViewport(homeCellReference) {
        return new SpreadsheetViewport(homeCellReference,
            this.viewportWidth(),
            this.viewportHeight());
    }

    // TODO fetch width and height from viewport widget
    viewportWidth() {
        return 2000;
    }

    viewportHeight() {
        return 1000;
    }

    /**
     * Accepts the {@link SpreadsheetRange} returned by {@link #fetchViewport} and then loads all the cells in that
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
        const evaluation = this.state.spreadsheetEngineEvaluation || SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY;

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
