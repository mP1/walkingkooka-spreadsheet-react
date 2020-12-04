import React from 'react';
import './App.css';

import SpreadsheetAppBarTop from "./widget/SpreadsheetAppBarTop.js";
import SpreadsheetViewportWidget from "./widget/SpreadsheetViewportWidget.js";
import SpreadsheetFormulaWidget from "./spreadsheet/SpreadsheetFormulaWidget.js";
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
import SpreadsheetCell from "./spreadsheet/SpreadsheetCell";
import SpreadsheetFormula from "./spreadsheet/SpreadsheetFormula";
import TextStyle from "./text/TextStyle.js";

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

        this.spreadsheetDeltaListeners.add(this.onSpreadsheetDeltaSetState.bind(this));
        this.spreadsheetDeltaListeners.add(this.onSpreadsheetDeltaViewportChange.bind(this));

        this.spreadsheetMetadataListeners.add(this.onSpreadsheetMetadataSetState.bind(this));
        this.spreadsheetMetadataListeners.add(this.onSpreadsheetMetadataEditCell.bind(this));
        this.spreadsheetMetadataListeners.add(this.onSpreadsheetMetadataViewport.bind(this));
        this.spreadsheetCellBoxListeners.add(this.onCellBoxViewportRangeUpdate.bind(this));
        this.spreadsheetRangeListeners.add(this.loadSpreadsheetCellOrRange.bind(this));

        this.formula = React.createRef();
        this.viewport = React.createRef();
    }

    // state............................................................................................................

    /**
     * Merge the new cells, columnWidths, rowHeights with the old in state.
     */
    onSpreadsheetDeltaSetState(delta) {
        console.log("onSpreadsheetDeltaSetState", delta);

        this.setState({
            cells: this.state.cells.set(delta.referenceToCellMap()),
            columnWidths: this.state.columnWidths.set(delta.maxColumnWidths()),
            rowHeights: this.state.rowHeights.set(delta.maxRowHeights()),
        });
    }

    onSpreadsheetMetadataSetState(metadata) {
        this.setState({"spreadsheetMetadata": metadata});
    }

    /**
     * Update the viewport widget with the new cells, columnWidth & rowHeight from the delta.
     */
    onSpreadsheetDeltaViewportChange(delta) {
        console.log("onSpreadsheetDeltaViewportChange", delta);

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
     * Fires a new {@link SpreadsheetCellBox} which should/might trigger a redraw of the formula editing widget
     */
    onSpreadsheetMetadataEditCell(metadata) {
        console.log("onSpreadsheetMetadataEditCell", metadata, "formula", this.formula.current);

        const formula = this.formula.current;
        if (formula) {
            const reference = metadata.editCell();
            if (reference) {
                const cell = this.getCellOrEmpty(reference);
                formula.setValue = this.cellToFormulaTextSetter(cell);

                const formulaText = this.cellToFormulaText(cell);

                console.log("onSpreadsheetMetadataEditCell " + reference + " formula text=" + formulaText);

                formula.setState({
                    value: formulaText,
                    reference: reference,
                });
            }
        }
    }

    /**
     * Fires a new {@link SpreadsheetCellBox} which should trigger a redraw.
     */
    onSpreadsheetMetadataViewport(metadata) {
        console.log("onSpreadsheetMetadataViewport", metadata);

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
    onCellBoxViewportRangeUpdate(cellBox) {
        console.log("onCellBoxViewportRangeUpdate", cellBox);

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
    loadSpreadsheetCellOrRange(selection) {
        console.log("loadSpreadsheetCellOrRange", selection);

        // TODO add window
        // always make request
        this.messenger.send(this.spreadsheetCellLoadUrl(selection),
            {
                method: "GET"
            });
    }

    spreadsheetCellLoadUrl(selection) {
        const evaluation = this.state.spreadsheetEngineEvaluation || SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY;

        this.messenger.send(this.spreadsheetCellUrl(selection) + "/" + evaluation,
            {
                method: "GET"
            });
    }

    /**
     * Saves the given cell. Eventually the returned value will trigger a re-render.
     */
    saveSpreadsheetCell(cell) {
        console.log("saveSpreadsheetCell", cell);

        this.messenger.send(this.spreadsheetCellUrl(cell.reference()),
            {
                method: "POST",
                body: JSON.stringify(new SpreadsheetDelta([cell],
                    ImmutableMap.EMPTY,
                    ImmutableMap.EMPTY,
                    []) // TODO include actual edit range.
                    .toJson()),
            });
    }

    /**
     * Returns a URL with the spreadsheet id and ONLY the provided cell selection.
     */
    spreadsheetCellUrl(selection) {
        return this.spreadsheetApiUrl() + "/cell/" + selection;
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

    // SpreadsheetFormula...............................................................................................

    /**
     * Returns the formula text to be edited or undefined.
     */
    cellToFormulaText(cell) {
        return (cell && cell.formula().text()) || "";
    }

    /**
     * Returns a function that updates the value of a {@link SpreadsheetFormula} triggering a cell reload.
     */
    cellToFormulaTextSetter(cell) {
        var setter;

        if (cell) {
            const formula = cell.formula();
            setter = (text) => this.saveSpreadsheetCell(cell.setFormula(formula.setText(text)));
        }
        return setter;
    }

    /**
     * Fetches the cell by the given reference or returns an empty {@link SpreadsheetCell}.
     */
    getCellOrEmpty(reference) {
        return this.state.cells.get(reference) || new SpreadsheetCell(reference, new SpreadsheetFormula(""), TextStyle.EMPTY);
    }

    // rendering........................................................................................................

    /**
     * Renders the basic spreadsheet layout.
     */
    render() {
        console.log("render");

        const metadata = this.spreadsheetMetadata();
        const style = metadata.style();

        const state = this.state;
        const {cells, columnWidths, rowHeights} = state;

        const viewportDimensions = this.viewportDimensions();
        const viewportCell = metadata.viewportCell();

        const editCellReference = metadata.editCell(); // SpreadsheetCellReference: may be undefined,
        const editCell = editCellReference && this.getCellOrEmpty(editCellReference);

        const formulaText = this.cellToFormulaText(editCell);

        return (
            <WindowResizer dimensions={this.onWindowResized.bind(this)}>
                <SpreadsheetBox key={"above-viewport"}
                                dimensions={this.onAboveViewportResize.bind(this)}>
                    <SpreadsheetAppBarTop app={this}/>
                    <Divider/>
                    <SpreadsheetFormulaWidget ref={this.formula}
                                              key={[editCellReference, formulaText]}
                                              reference={editCellReference}
                                              value={formulaText}
                                              setValue={editCellReference && this.cellToFormulaTextSetter(editCell)}/>
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
            method: "POST",
            body: JSON.stringify(metadata.toJson())
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
