import Preconditions from "../../Preconditions.js";
import SpreadsheetHistoryHashToken from "./SpreadsheetHistoryHashToken.js";

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

    toHistoryHashToken() {
        // /cell/A1 | /column/A | /row/2
        return this.viewportSelection()
            .toHistoryHashToken();
    }

    viewportSelection() {
        return this.viewportSelectionValue;
    }

    equals(other) {
        return super.equals(other) &&
            this.viewportSelection().equals(other.viewportSelection());
    }

    toString() {
        var toString = this.toHistoryHashToken();

        const navigation = this.viewportSelection()
            .navigation();
        if(navigation) {
            toString = toString + ";navigation=" + navigation
        }

        return toString;
    }
}