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
import ImmutableMap from "./util/ImmutableMap";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spreadsheetEngineEvaluation: SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY,
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY,
            cells: ImmutableMap.EMPTY,
            columnWidths: ImmutableMap.EMPTY,
            rowHeights: ImmutableMap.EMPTY,
            viewportDimensions: {
                width: 0,
                height: 0,
            },
            windowDimensions: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
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
        this.spreadsheetDeltaListeners.add(this.viewportChange.bind(this));

        this.spreadsheetMetadataListeners.add(this.setStateMetadata.bind(this));
        this.spreadsheetMetadataListeners.add(this.viewportSpreadsheetMetadataUpdate.bind(this));
        this.spreadsheetCellBoxListeners.add(this.requestViewportRange.bind(this));
        this.spreadsheetRangeListeners.add(this.loadSpreadsheetRangeCell.bind(this));

        this.viewport = React.createRef();
    }

    // state............................................................................................................

    /**
     * Merge the new cells, columnWidths, rowHeights with the old in state.
     */
    setStateDelta(delta) {
        this.setState({
            cells: this.state.cells.set(delta.referenceToCellMap()),
            columnWidths: this.state.columnWidths.set(delta.maxColumnWidths()),
            rowHeights: this.state.rowHeights.set(delta.maxRowHeights()),
        });
    }

    setStateMetadata(metadata) {
        this.setState({"spreadsheetMetadata": metadata});
    }

    /**
     * Update the viewport widget with the new cells, columnWidth & rowHeight from the delta.
     */
    viewportChange(delta) {
        const viewport = this.viewport.current;
        if (viewport) {
            viewport.setState({
                cells: this.state.cells.set(delta.referenceToCellMap()),
                columnWidths: this.state.columnWidths.set(delta.maxColumnWidths()),
                rowHeights: this.state.rowHeights.set(delta.maxRowHeights()),
            });

        }
    }

    /**
     * Returns the viewport dimensions of the area allocated to the cells.
     */
    viewportDimensions() {
        const viewport = this.viewport.current;
        return (viewport && viewport.state.dimensions) || {
            width: 0,
            height: 0,
        };
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
    viewportSpreadsheetMetadataUpdate(metadata) {
        const viewportCell = metadata.viewportCell();

        this.setState({
            viewportCell: viewportCell,
            viewportCoordinates: metadata.viewportCoordinates(),
        });

        const viewport = this.viewport.current;
        if (viewport) {
            viewport.setState({
                home: viewportCell,
                editCell: metadata.editCell(),
                defaultStyle: metadata.style(),
            });
        }
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

    /**
     * This is called whenever a cell is clicked or selected for editing.
     */
    editCell(reference) {
        console.log("setEditCell " + reference);
        this.saveSpreadsheetMetadata(this.spreadsheetMetadata().setEditCell(reference));
    }

    // rendering........................................................................................................

    /**
     * Renders the basic spreadsheet layout.
     */
    render() {
        const metadata = this.spreadsheetMetadata();
        const style = metadata.style();
        const {cells, columnWidths, rowHeights} = this.state;

        const viewportDimensions = this.viewportDimensions();
        const viewportCell = metadata.viewportCell();
        const editCell = metadata.editCell();

        return (
            <WindowResizer dimensions={this.onWindowResized.bind(this)}>
                <SpreadsheetBox key={"above-viewport"}
                                dimensions={this.onAboveViewportResize.bind(this)}>
                    <SpreadsheetAppBarTop app={this}/>
                    <Divider/>
                    <SpreadsheetFormulaWidget/>
                    <Divider/>
                </SpreadsheetBox>
                <SpreadsheetViewportWidget key={[viewportDimensions, cells, columnWidths, rowHeights, style, viewportCell, editCell]}
                                           ref={this.viewport}
                                           dimensions={viewportDimensions}
                                           cells={cells}
                                           columnWidths={columnWidths}
                                           rowHeights={rowHeights}
                                           defaultStyle={style}
                                           home={viewportCell}
                                           editCell={editCell}
                                           editCellSetter={this.editCell.bind(this)}
                />
            </WindowResizer>
        )
    }

    // resizing.........................................................................................................

    /**
     * Updates the state windowDimensions which will triggers a redraw of the spreadsheet content and reloading of
     * the viewport cells
     */
    onWindowResized(dimensions) {
        this.setState({
            windowDimensions: dimensions,
        });
    }

    /**
     * Fired whenever the header and other tools above the cells viewport know their new size
     */
    onAboveViewportResize(dimensions) {
        this.setState({
            aboveViewportDimensions: dimensions,
        });
    }

    /**
     * Computes and returns the cell viewport dimensions. This should be called whenever the window or header size changes.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        const viewport = this.viewport.current;

        if(viewport) {
            const state = this.state;

            const windowDimensions = state.windowDimensions;
            const aboveViewportDimensions = state.aboveViewportDimensions;

            if(windowDimensions && aboveViewportDimensions) {
                const previous = viewport.state.dimensions;
                const width = windowDimensions.width;
                const height = windowDimensions.height - aboveViewportDimensions.height;

                if(previous.width !== width || previous.height !== height) {
                    viewport.setState({
                        dimensions: {
                            width: width,
                            height: height,
                        }
                    });
                }
            }
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
