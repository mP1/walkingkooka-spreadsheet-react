import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetNameHistoryHashToken from "./SpreadsheetNameHistoryHashToken.js";

/**
 * This token represents the spreadsheet name being edited.
 */
export default class SpreadsheetNameEditHistoryHashToken extends SpreadsheetNameHistoryHashToken {

    static INSTANCE = new SpreadsheetNameEditHistoryHashToken();

    spreadsheetNameWidgetExecute(spreadsheetNameWidget, previous) {
        if(!previous) {
            spreadsheetNameWidget.beginEditing();
        }
        return null;
    }

    historyHashPath() {
        return "/" + SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_PATH;
    }
}