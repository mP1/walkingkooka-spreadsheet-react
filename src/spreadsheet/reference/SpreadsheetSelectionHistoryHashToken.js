import Preconditions from "../../Preconditions.js";
import SpreadsheetHistoryHashToken from "../history/SpreadsheetHistoryHashToken.js";
import SystemObject from "../../SystemObject.js";

/**
 * Base for all selection actions.
 */
export default class SpreadsheetSelectionHistoryHashToken extends SpreadsheetHistoryHashToken {

    constructor(viewportSelection) {
        super();

        this.viewportSelectionValue = Preconditions.requireObject(
            viewportSelection,
            "viewportSelection"
        );

        // Must check Constructor.name rather than Class to avoid cycles.
        const viewportSelectionType = viewportSelection.constructor.name;
        if("SpreadsheetViewportSelection" !== viewportSelectionType){
            throw new Error("Expected SpreadsheetViewportSelection but got " + viewportSelectionType);
        }
    }

    spreadsheetViewportWidgetExecute(viewportWidget, previousViewportSelection, viewportCell, width, height) {
        SystemObject.throwUnsupportedOperation();
    }

    historyHashPath() {
        // /cell/A1 | /column/A | /row/2
        return this.viewportSelection()
            .historyHashPath();
    }

    viewportSelection() {
        return this.viewportSelectionValue;
    }

    equals(other) {
        return super.equals(other) &&
            this.viewportSelection().equals(other.viewportSelection());
    }

    toString() {
        var toString = this.historyHashPath();

        const navigation = this.viewportSelection()
            .navigation();
        if(navigation) {
            toString = toString + ";navigation=" + navigation
        }

        return toString;
    }
}