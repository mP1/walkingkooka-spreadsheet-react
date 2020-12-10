import React from 'react';
import './App.css';

import SpreadsheetAppBarTop from "./widget/SpreadsheetAppBarTop.js";
import SpreadsheetViewportWidget from "./widget/SpreadsheetViewportWidget.js";
import SpreadsheetFormulaWidget from "./spreadsheet/SpreadsheetFormulaWidget.js";
import SpreadsheetMetadata from "./spreadsheet/meta/SpreadsheetMetadata.js";
import SpreadsheetMessenger from "./util/SpreadsheetMessenger.js";

import Divider from '@material-ui/core/Divider';
import SpreadsheetCellBox from "./spreadsheet/reference/SpreadsheetCellBox";
import SpreadsheetCoordinates from "./spreadsheet/SpreadsheetCoordinates";
import SpreadsheetRange from "./spreadsheet/reference/SpreadsheetRange";
import SpreadsheetDelta from "./spreadsheet/engine/SpreadsheetDelta";
import SpreadsheetEngineEvaluation from "./spreadsheet/engine/SpreadsheetEngineEvaluation";
import SpreadsheetBox from "./widget/SpreadsheetBox";
import WindowResizer from "./widget/WindowResizer";
import ImmutableMap from "./util/ImmutableMap";
import SpreadsheetCell from "./spreadsheet/SpreadsheetCell";
import SpreadsheetFormula from "./spreadsheet/SpreadsheetFormula";
import TextStyle from "./text/TextStyle.js";
import SpreadsheetNameWidget from "./spreadsheet/SpreadsheetNameWidget.js";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spreadsheetEngineEvaluation: SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY,
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY,
            cells: ImmutableMap.EMPTY,
            columnWidths: ImmutableMap.EMPTY,
            rowHeights: ImmutableMap.EMPTY,
            windowDimensions: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
        }

        // the names must match the Class.getSimpleName in walkingkooka-spreadsheet
        this.messenger = new SpreadsheetMessenger({
            "SpreadsheetCellBox": json => this.onCellBoxViewportRangeUpdate(SpreadsheetCellBox.fromJson(json)),
            "SpreadsheetCoordinates": json => this.setState({viewportCoordinates: SpreadsheetCoordinates.fromJson(json)}),
            "SpreadsheetDelta": json => {
                const delta = SpreadsheetDelta.fromJson(json);
                const state = this.state;
                this.setState({
                    cells: state.cells.set(delta.referenceToCellMap()),
                    columnWidths: state.columnWidths.set(delta.maxColumnWidths()),
                    rowHeights: state.rowHeights.set(delta.maxRowHeights()),
                });
            },
            "SpreadsheetMetadata": json => this.setState({spreadsheetMetadata: SpreadsheetMetadata.fromJson(json)}),
            "SpreadsheetRange": json => this.setState({viewportRange: SpreadsheetRange.fromJson(json)}),
        });

        this.messenger.setWebWorker(false); // TODO test webworker mode

        this.spreadsheetName = React.createRef();
        this.formula = React.createRef();
        this.viewport = React.createRef();
    }

    // app lifecycle....................................................................................................

    /**
     * Makes a request which returns some basic default metadata, and without cells the spreadsheet will be empty.
     */
    createEmptySpreadsheet() {
        this.messenger.send("/api/spreadsheet",
            {
                method: "POST"
            });
    }

    // component lifecycle..............................................................................................

    componentDidMount() {
        this.createEmptySpreadsheet(); // TODO add logic to allow selecting: create empty, prompt to load and more.
    }

    /**
     * Computes and returns the cell viewport dimensions. This should be called whenever the window or header size changes.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("componentDidUpdate", "prevState", prevState, "state", this.state);

        this.onSpreadsheetViewport(prevState);
        this.onSpreadsheetFormula();
        this.onSpreadsheetMetadataSpreadsheetName();
    }

    /**
     * Update the viewport after computing the viewport metrics.
     */
    onSpreadsheetViewport(prevState) {
        const state = this.state;

        const metadata = state.spreadsheetMetadata;
        const viewportCell = metadata.viewportCell();
        const viewportCoordinates = metadata.viewportCoordinates();
        const windowDimensions = state.windowDimensions;
        const aboveViewportDimensions = state.aboveViewportDimensions;

        const viewport = this.viewport.current;

        if (viewportCell && viewportCoordinates && windowDimensions && aboveViewportDimensions && viewport) {
            viewport.setState({
                home: viewportCell,
                cells: state.cells,
                columnWidths: state.columnWidths,
                rowHeights: state.rowHeights,
                editCell: metadata.editCell(),
                defaultStyle: metadata.style(),
            });
            const previous = viewport.state.dimensions;
            const width = windowDimensions.width;
            const height = windowDimensions.height - aboveViewportDimensions.height;

            if (previous.width !== width || previous.height !== height) {
                viewport.setState({
                    dimensions: {
                        width: width,
                        height: height,
                    }
                });

                const previousMetadata = prevState.spreadsheetMetadata;
                const previousViewportCell = previousMetadata && previousMetadata.viewportCell();

                if ((width > previous.width || height > previous.height) && (viewportCell.equals(previousViewportCell) || !previousViewportCell)) {
                    this.onCellBoxViewportRangeUpdate(
                        new SpreadsheetCellBox(viewportCell,
                            viewportCoordinates.x(),
                            viewportCoordinates.y(),
                            width,
                            height)
                    );
                }
            }
        }
    }

    /**
     * Updates the state of the formula widget so it matches the metadata editCell
     */
    onSpreadsheetFormula() {
        const metadata = this.state.spreadsheetMetadata;
        const formula = this.formula.current;

        console.log("onSpreadsheetFormula", "formula", formula.current, "metadata", metadata);

        if (formula) {
            const reference = metadata.editCell();
            if (reference) {
                const cell = this.getCellOrEmpty(reference);
                formula.setValue = this.cellToFormulaTextSetter(cell);

                const formulaText = this.cellToFormulaText(cell);

                console.log("onSpreadsheetFormula " + reference + " formula text=" + formulaText);

                formula.setState({
                    value: formulaText,
                    reference: reference,
                });
            }
        }
    }

    /**
     * Updates the SpreadsheetNameWidget whenever metadata is updated.
     */
    onSpreadsheetMetadataSpreadsheetName() {
        const metadata = this.state.spreadsheetMetadata;
        const spreadsheetName = this.spreadsheetName.current;
        const name = metadata.spreadsheetName();

        if (spreadsheetName && name) {
            console.log("onSpreadsheetMetadataSpreadsheetName updated from metadata to ", metadata.name);

            spreadsheetName.setState({
                value: name,
            });
        } else {
            console.log("onSpreadsheetMetadataSpreadsheetName widget not updated", "spreadsheetName", spreadsheetName.current, "metadata", metadata);
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
     * Accepts {@link SpreadsheetCellBox} and requests the {@link SpreadsheetRange} that fill the content.
     */
    onCellBoxViewportRangeUpdate(cellBox) {
        console.log("onCellBoxViewportRangeUpdate " + cellBox);

        this.messenger.send(this.spreadsheetMetadataApiUrl() + "/viewport/" + cellBox.viewport(),
            {
                method: "GET"
            });
    }

    /**
     * Accepts the {@link SpreadsheetRange} returned by {@link #spreadsheetViewport} and then loads all the cells in the
     * range
     */
    loadSpreadsheetCellOrRange(selection) {
        console.log("loadSpreadsheetCellOrRange " + selection);

        const evaluation = this.state.spreadsheetEngineEvaluation || SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY;

        this.messenger.send(this.spreadsheetCellApiUrl(selection) + "/" + evaluation,
            {
                method: "GET"
            });
    }

    /**
     * Saves the given cell. Eventually the returned value will trigger a re-render.
     */
    saveSpreadsheetCell(cell) {
        const reference = cell.reference();

        if (cell.equals(this.state.cells.get(reference))) {
            console.log("saveSpreadsheetCell cell unchanged save skipped", cell);
        } else {
            console.log("saveSpreadsheetCell", cell);

            this.messenger.send(this.spreadsheetCellApiUrl(cell.reference()),
                {
                    method: "POST",
                    body: JSON.stringify(new SpreadsheetDelta([cell],
                        ImmutableMap.EMPTY,
                        ImmutableMap.EMPTY,
                        [this.state.viewportRange])
                        .toJson()),
                });
        }
    }

    /**
     * Returns a URL with the spreadsheet id and ONLY the provided cell selection.
     */
    spreadsheetCellApiUrl(selection) {
        return this.spreadsheetMetadataApiUrl() + "/cell/" + selection;
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
        const state = this.state;
        console.log("render", state);

        const metadata = this.spreadsheetMetadata();

        const spreadsheetName = metadata.spreadsheetName();

        const style = metadata.style();
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
                    <SpreadsheetAppBarTop>
                        <SpreadsheetNameWidget ref={this.spreadsheetName}
                                               key={spreadsheetName}
                                               value={spreadsheetName}
                                               setValue={this.saveSpreadsheetName.bind(this)}
                        />
                    </SpreadsheetAppBarTop>
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
        );
    }

    // resizing.........................................................................................................

    /**
     * Updates the state windowDimensions which will triggers a redraw of the spreadsheet content and reloading of
     * the viewport cells
     */
    onWindowResized(dimensions) {
        console.log("onWindowResized", dimensions);

        this.setState({
            windowDimensions: dimensions,
        });
    }

    /**
     * Fired whenever the header and other tools above the cells viewport know their new size
     */
    onAboveViewportResize(dimensions) {
        console.log("onAboveViewportResize", dimensions);

        this.setState({
            aboveViewportDimensions: dimensions,
        });
    }

    // SpreadsheetMetadata..............................................................................................

    /**
     * Uses the provided spreadsheetid or falls back to the current {@Link SpreadsheetMetadata} spreadsheet id
     */
    spreadsheetMetadataApiUrl(spreadsheetId) {
        const id = spreadsheetId || this.spreadsheetMetadata().spreadsheetId();
        if (!id) {
            throw new Error("Missing spreadsheetId parameter and current SpreadsheetMetadata.spreadsheetId");
        }
        if (typeof id !== "string") {
            throw new Error("Expected string spreadsheetId got " + id);
        }
        return "/api/spreadsheet/" + id;
    }

    spreadsheetMetadata() {
        return this.state.spreadsheetMetadata;
    }

    /**
     * If the new metadata is different call the save service otherwise skip.
     */
    saveSpreadsheetMetadata(metadata) {
        if (metadata.equals(this.spreadsheetMetadata())) {
            console.log("saveSpreadsheetMetadata unchanged, save skipped", metadata);
        } else {
            console.log("saveSpreadsheetMetadata", metadata);

            this.messenger.send(this.spreadsheetMetadataApiUrl(), {
                method: "POST",
                body: JSON.stringify(metadata.toJson())
            });
        }
    }

    saveSpreadsheetName(name) {
        this.saveSpreadsheetMetadata(this.state.spreadsheetMetadata.setSpreadsheetName(name));
    }

    // toString.........................................................................................................

    toString() {
        return this.spreadsheetMetadata().toString();
    }
}
