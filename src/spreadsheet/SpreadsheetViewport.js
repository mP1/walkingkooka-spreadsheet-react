/**
 * A pixel rectangle marks a region with one or more cells.
 */
import Preconditions from "../Preconditions.js";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetSelection from "./reference/SpreadsheetSelection.js";
import SpreadsheetViewportSelectionAnchor from "./reference/SpreadsheetViewportSelectionAnchor.js";
import SpreadsheetViewportSelectionNavigation from "./reference/SpreadsheetViewportSelectionNavigation.js";
import SystemObject from "../SystemObject.js";

const SEPARATOR = ":";
const TYPE_NAME = "spreadsheet-viewport";

export default class SpreadsheetViewport extends SystemObject {

    static fromJson(json) {
        return SpreadsheetViewport.parse(json);
    }

    static parse(text) {
        Preconditions.requireText(text, "text");

        let tokens = text.split(SEPARATOR);
        if(3 !== tokens.length){
            throw new Error("Expected 3 tokens got " + text);
        }

        return new SpreadsheetViewport(
            SpreadsheetCellReference.parse(tokens[0]),
            Number(tokens[1]),
            Number(tokens[2])
        );
    }

    constructor(cellOrLabel, width, height) {
        super();
        Preconditions.requireInstance(cellOrLabel, SpreadsheetCellReference, "cellOrLabel");
        this.cellOrLabelValue = cellOrLabel;

        Preconditions.requirePositiveNumber(width, "width");
        this.widthValue = width;

        Preconditions.requirePositiveNumber(height, "height");
        this.heightValue = height;
    }

    cellOrLabel() {
        return this.cellOrLabelValue;
    }

    width() {
        return this.widthValue;
    }

    height() {
        return this.heightValue;
    }

    /**
     * Returns a query parameters map that will be used to load all the cells for the viewport widget.
     */
    apiLoadCellsQueryStringParameters(selection, anchor, navigation) {
        Preconditions.optionalInstance(selection, SpreadsheetSelection, "selection");
        Preconditions.optionalInstance(anchor, SpreadsheetViewportSelectionAnchor, "anchor");
        Preconditions.optionalInstance(navigation, SpreadsheetViewportSelectionNavigation, "navigation");

        const parameters = {
            home: [this.cellOrLabel()],
            width: [this.width()],
            height: [this.height()],
            includeFrozenColumnsRows: [false],
        };

        if(selection) {
            parameters.selectionType = [selection.kebabClassName()];
            parameters.selection = [selection];

            if(navigation) {
                parameters.selectionNavigation = [navigation.nameKebabCase()];
            }
        }

        if(anchor) {
            parameters.selectionAnchor = [anchor.nameKebabCase()];
        }

        return parameters;
    }

    toJson() {
        return this.cellOrLabel() + SEPARATOR + this.width() + SEPARATOR + this.height();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetViewport &&
                this.cellOrLabel().equals(other.cellOrLabel()) &&
                this.width() === other.width() &&
                this.height() === other.height());
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetViewport.fromJson);