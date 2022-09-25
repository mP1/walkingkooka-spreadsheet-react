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
}