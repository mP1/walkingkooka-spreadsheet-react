import SpreadsheetNameHistoryHashToken from "./SpreadsheetNameHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * This token represents the spreadsheet name being edited.
 */
export default class SpreadsheetNameEditHistoryHashToken extends SpreadsheetNameHistoryHashToken {

    static INSTANCE = new SpreadsheetNameEditHistoryHashToken();

    toHistoryHashToken() {
        return "/" + SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_PATH;
    }

    execute(spreadsheetNameWidget) {
        // nop
    }

    equals(other) {
        return this === other || other instanceof SpreadsheetNameEditHistoryHashToken;
    }
}