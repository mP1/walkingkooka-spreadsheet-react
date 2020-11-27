import React from 'react';
import './App.css';

import SpreadsheetAppBarTop from "./widget/SpreadsheetAppBarTop.js";
import SpreadsheetViewportWidget from "./widget/SpreadsheetViewportWidget.js";
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
import SpreadsheetBox from "./widget/SpreadsheetBox";
import WindowResizer from "./widget/WindowResizer";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spreadsheetEngineEvaluation: SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY,
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY,
            cells: new Map(),
            columnWidths: new Map(),
            rowHeights: new Map(),
            viewportDimensions: {
                width: 0,
                height: 0,
            }
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
        this.spreadsheetMetadataListeners.add(this.viewportCellAndCoordinatesUpdate.bind(this));
        this.spreadsheetCellBoxListeners.add(this.requestViewportRange.bind(this));
        this.spreadsheetRangeListeners.add(this.loadSpreadsheetRangeCell.bind(this));
    }

    // state............................................................................................................

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
     * Returns the viewport dimensions of the area allocated to the cells.
     */
    viewportDimensions() {
        return this.state.viewportDimensions || {
            width: 0,
            height: 0,
        }
    }

    /**
     * Factory that creates a {@link SpreadsheetViewport} with the given home cell and also computes the actual dimensions.
     */
    spreadsheetViewport(homeCellReference) {
        const {width, height} = this.viewportDimensions();

        return new SpreadsheetViewport(homeCellReference, width, height);
    }

    // event updates....................................................................................................

    componentDidMount() {
        this.createEmptySpreadsheet(); // TODO add logic to allow selecting: create empty, prompt to load and more.
    }

    /**
     * Fires a new {@link SpreadsheetCellBox} which should trigger a redraw.
     */
    viewportCellAndCoordinatesUpdate(metadata) {
        this.spreadsheetUpdate({
            viewportCell: metadata.viewportCell(),
            viewportCoordinates: metadata.viewportCoordinates(),
        });
    }

    /**
     * Accepts {@link SpreadsheetCellBox} and requests the {@link SpreadsheetRange} that fill the content.
     */
    requestViewportRange(cellBox) {
        // always make request
        this.messenger.send(this.spreadsheetApiUrl() + "/viewport/" + this.spreadsheetViewport(cellBox.reference()),
            {
                method: "GET"
            });
    }

    /**
     * Accepts the {@link SpreadsheetRange} returned by {@link #spreadsheetViewport} and then loads all the cells in the
     * range
     */
    loadSpreadsheetRangeCell(range) {
        // TODO add window
        // always make request
        this.messenger.send(this.spreadsheetCellLoadUrl(range),
            {
                method: "GET"
            });
    }

    spreadsheetCellLoadUrl(selection) {
        const evaluation = this.state.spreadsheetEngineEvaluation || SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY;

        return this.spreadsheetApiUrl() + "/cell/" + selection + "/" + evaluation;
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

    // rendering........................................................................................................

    /**
     * Renders the basic spreadsheet layout.
     */
    render() {
        return (
            <WindowResizer dimensions={this.onWindowResized.bind(this)}>
                <SpreadsheetBox dimensions={this.onHeaderEtcResize.bind(this)}>
                    <SpreadsheetAppBarTop app={this}/>
                    <Divider/>
                    <SpreadsheetFormulaWidget/>
                    <Divider/>
                </SpreadsheetBox>
                <SpreadsheetViewportWidget dimensions={this.viewportDimensions()}/>
            </WindowResizer>
        )
    }

    // resizing.........................................................................................................

    /**
     * Updates the state windowDimensions which will triggers a redraw of the spreadsheet content and reloading of
     * the viewport cells
     */
    onWindowResized(dimensions) {
        this.spreadsheetUpdate({
            windowDimensions: dimensions,
        });
    }

    /**
     * Fired whenever the header and other tools above the cells viewport know their new size
     */
    onHeaderEtcResize(dimensions) {
        this.spreadsheetUpdate({
            aboveViewportDimensions: dimensions,
        });
    }

    /**
     * Computes and returns the cell viewport dimensions. This should be called whenever the window or header size changes.
     */
    spreadsheetUpdate(params) {
        const metadata = this.spreadsheetMetadata();
        const viewportCell = params.viewportCell || metadata.viewportCell();
        const viewportCoords = params.viewportCoordinates || metadata.viewportCoordinates();

        const windowDimensions = params.windowDimensions || {
            width: window.innerWidth,
            height: window.innerHeight,
        };
        const aboveViewportDimensions = params.aboveViewportDimensions || this.state.aboveViewportDimensions;

        const viewportDimensions = aboveViewportDimensions && {
            width: windowDimensions.width,
            height: windowDimensions.height - aboveViewportDimensions.height,
        };

        console.log("params", params,
            "windowDimensions: ", windowDimensions,
            "aboveViewportDimensions", aboveViewportDimensions,
            "viewportCell", viewportCell,
            "viewportCoords", viewportCoords,
            "viewportDimensions", viewportDimensions,
            "metadata", metadata);

        this.setState({
            windowDimensions: windowDimensions,
            aboveViewportDimensions: aboveViewportDimensions,
            viewportCell: viewportCell,
            viewportCoords: viewportCoords,
            viewportDimensions: viewportDimensions,
        });

        // wont try and fetch cellbox until ALL required layout dimensions are available.
        if(viewportCell && aboveViewportDimensions) {
            this.spreadsheetCellBoxListeners.dispatch(
                new SpreadsheetCellBox(
                    viewportCell,
                    viewportCoords.x(),
                    viewportCoords.y(),
                    viewportDimensions.width,
                    viewportDimensions.height,
                ));
        }
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
