/**
 * Base class for any spreadsheet name history hash token.
 */
import SpreadsheetHistoryHashToken from "../history/SpreadsheetHistoryHashToken.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetMetadataNameHistoryHashToken extends SpreadsheetHistoryHashToken {

    spreadsheetNameWidgetExecute(spreadsheetNameWidget) {
        SystemObject.throwUnsupportedOperation();
    }
}