import SpreadsheetNameHistoryHashToken from "./SpreadsheetNameHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * This token represents the spreadsheet name being edited.
 */
export default class SpreadsheetNameEditHistoryHashToken extends SpreadsheetNameHistoryHashToken {

    static INSTANCE = new SpreadsheetNameEditHistoryHashToken();

    spreadsheetNameWidgetExecute(spreadsheetNameWidget) {
        // nop
    }

    toHistoryHashToken() {
        return "/" + SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_PATH;
    }
}