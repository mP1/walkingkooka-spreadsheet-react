import Equality from "../../Equality.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetSelection from "./SpreadsheetSelection.js";
import SpreadsheetViewportSelectionAnchor from "./SpreadsheetViewportSelectionAnchor.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-viewport-selection";

export default class SpreadsheetViewportSelection extends SystemObject {

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

        const {selection, anchor} = json;
        return new SpreadsheetViewportSelection(
            SystemObject.fromJsonWithType(selection),
            anchor && SpreadsheetViewportSelectionAnchor.fromJson(anchor)
        );
    }

    constructor(selection, anchor) {
        super();
        Preconditions.requireInstance(selection, SpreadsheetSelection, "selection");
        selection.checkAnchor(anchor);

        this.selectionValue = selection;
        this.anchorValue = anchor;
    }

    selection() {
        return this.selectionValue;
    }

    anchor() {
        return this.anchorValue;
    }

    toJson() {
        const json = {
            selection: this.selection().toJsonWithType(),
        }

        const anchor = this.anchor();

        return anchor ?
            Object.assign(json, {
                anchor: anchor.toString(),
            }) :
            json;
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetViewportSelection && this.selection().equals(other.selection()) && Equality.safeEquals(this.anchor(), other.anchor()));
    }

    toString() {
        const anchor = this.anchor();
        return this.selection() + (anchor ? " " + anchor : "");
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetViewportSelection.fromJson);