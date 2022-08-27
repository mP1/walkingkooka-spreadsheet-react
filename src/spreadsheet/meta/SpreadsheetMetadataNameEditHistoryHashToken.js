import SpreadsheetMetadataNameHistoryHashToken from "./SpreadsheetMetadataNameHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";

/**
 * This token represents the spreadsheet name being edited.
 */
export default class SpreadsheetMetadataNameEditHistoryHashToken extends SpreadsheetMetadataNameHistoryHashToken {

    static INSTANCE = new SpreadsheetMetadataNameEditHistoryHashToken();

    spreadsheetNameWidgetExecute(spreadsheetNameWidget) {
        // nop
    }

    historyHashPath() {
        return "/" + SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_PATH;
    }
}