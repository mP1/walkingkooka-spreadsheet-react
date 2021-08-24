/**
 * Base class for any {@link SpreadsheetHistoryHash#SELECTION_ACTION}.
 */
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetHistoryHashToken {

    toHistoryHashToken() {
        SystemObject.throwUnsupportedOperation();
    }
}