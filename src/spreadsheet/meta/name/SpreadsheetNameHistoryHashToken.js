/**
 * Base class for any spreadsheet name history hash token.
 */
import SpreadsheetHistoryHashToken from "../../history/SpreadsheetHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SystemObject from "../../../SystemObject.js";

export default class SpreadsheetNameHistoryHashToken extends SpreadsheetHistoryHashToken {

    historyHashPath() {
        return "/" + SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_PATH;
    }

    spreadsheetNameWidgetExecute(spreadsheetNameWidget) {
        SystemObject.throwUnsupportedOperation();
    }
}