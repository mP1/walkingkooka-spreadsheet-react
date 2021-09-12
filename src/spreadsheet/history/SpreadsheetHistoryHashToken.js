/**
 * Base class for any {@link SpreadsheetHistoryHash#SELECTION_ACTION}.
 */
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetHistoryHashToken {

    onViewportSelectionAction(selection, viewportWidget) {
        SystemObject.throwUnsupportedOperation();
    }

    toHistoryHashToken() {
        SystemObject.throwUnsupportedOperation();
    }

    toString() {
        return this.toHistoryHashToken();
    }
}