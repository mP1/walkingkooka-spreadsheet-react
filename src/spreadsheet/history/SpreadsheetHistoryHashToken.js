/**
 * Base class for any {@link SpreadsheetHistoryHash#SELECTION_ACTION}.
 */
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetHistoryHashToken extends SystemObject {

    onViewportSelectionAction(viewportSelection, viewportWidget) {
        SystemObject.throwUnsupportedOperation();
    }

    toHistoryHashToken() {
        SystemObject.throwUnsupportedOperation();
    }

    toJSON() {
        return this.toString();
    }

    toString() {
        return this.toHistoryHashToken();
    }
}