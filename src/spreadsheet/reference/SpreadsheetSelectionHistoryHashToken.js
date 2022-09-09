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
    }

    spreadsheetFormulaWidgetExecute(formulaWidget, previousViewportSelection) {
        // default NO-OP
    }

    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
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