import Preconditions from "../../Preconditions.js";
import SpreadsheetHistoryHashToken from "../history/SpreadsheetHistoryHashToken.js";
import SystemObject from "../../SystemObject.js";

/**
 * Base for all selection actions.
 */
export default class SpreadsheetSelectionHistoryHashToken extends SpreadsheetHistoryHashToken {

    constructor(viewport) {
        super();

        this.viewportValue = Preconditions.requireInstance(
            viewport,
            "SpreadsheetViewport",
            "viewport"
        );
    }

    spreadsheetViewportWidgetExecute(viewportWidget, previousViewport, viewportCell, width, height) {
        SystemObject.throwUnsupportedOperation();
    }

    historyHashPath() {
        // /cell/A1 | /column/A | /row/2
        return this.viewport()
            .historyHashPath();
    }

    viewport() {
        return this.viewportValue;
    }

    equals(other) {
        return super.equals(other) &&
            this.viewport().equals(other.viewport());
    }

    toString() {
        var toString = this.historyHashPath();

        const navigation = this.viewport()
            .navigation();
        if(navigation) {
            toString = toString + ";navigation=" + navigation
        }

        return toString;
    }
}