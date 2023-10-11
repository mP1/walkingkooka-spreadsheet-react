/**
 * A pixel rectangle marks a region with one or more cells.
 */
import Preconditions from "../../../Preconditions.js";
import SpreadsheetCellReference from "../cell/SpreadsheetCellReference.js";
import SpreadsheetSelection from "../SpreadsheetSelection.js";
import SpreadsheetViewportSelectionAnchor from "./SpreadsheetViewportSelectionAnchor.js";
import SpreadsheetViewportSelectionNavigation from "./SpreadsheetViewportSelectionNavigation.js";
import SystemObject from "../../../SystemObject.js";

const SEPARATOR = ":";
const TYPE_NAME = "spreadsheet-viewport-rectangle";

export default class SpreadsheetViewportRectangle extends SystemObject {

    static fromJson(json) {
        return SpreadsheetViewportRectangle.parse(json);
    }

    static parse(text) {
        Preconditions.requireText(text, "text");

        let tokens = text.split(SEPARATOR);
        if(3 !== tokens.length){
            throw new Error("Expected 3 tokens got " + text);
        }

        return new SpreadsheetViewportRectangle(
            SpreadsheetCellReference.parse(tokens[0]),
            Number(tokens[1]),
            Number(tokens[2])
        );
    }

    constructor(home, width, height) {
        super();
        Preconditions.requireInstance(home, SpreadsheetCellReference, "home");
        this.homeValue = home;

        Preconditions.requirePositiveNumber(width, "width");
        this.widthValue = width;

        Preconditions.requirePositiveNumber(height, "height");
        this.heightValue = height;
    }

    home() {
        return this.homeValue;
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
            home: [this.home()],
            width: [this.width()],
            height: [this.height()],
            includeFrozenColumnsRows: [true],
        };

        if(selection) {
            parameters.selectionType = [selection.kebabClassName()];
            parameters.selection = [selection];

            if(navigation) {
                parameters.selectionNavigation = [
                    navigation.toQueryString()
                ];
            }
        }

        if(anchor) {
            parameters.selectionAnchor = [anchor.nameKebabCase()];
        }

        return parameters;
    }

    toJson() {
        return this.home() + SEPARATOR + this.width() + SEPARATOR + this.height();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return other instanceof SpreadsheetViewportRectangle &&
            this.home().equals(other.home()) &&
            this.width() === other.width() &&
            this.height() === other.height();
    }

    toString() {
        return this.toJson();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetViewportRectangle.fromJson);