/**
 * Base class for any spreadsheet name history hash token.
 */
import SpreadsheetHistoryHashToken from "./SpreadsheetHistoryHashToken.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetNameHistoryHashToken extends SpreadsheetHistoryHashToken {

    spreadsheetNameWidgetExecute(spreadsheetNameWidget) {
        SystemObject.throwUnsupportedOperation();
    }
}