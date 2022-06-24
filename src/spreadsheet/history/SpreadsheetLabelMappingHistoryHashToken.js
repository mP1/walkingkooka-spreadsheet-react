import SpreadsheetHistoryHashToken from "./SpreadsheetHistoryHashToken.js";
import SystemObject from "../../SystemObject.js";

/**
 * Base class for any label mapping history hash token.
 */
export default class SpreadsheetLabelMappingHistoryHashToken extends SpreadsheetHistoryHashToken {

    execute(widget) {
        SystemObject.throwUnsupportedOperation();
    }
}