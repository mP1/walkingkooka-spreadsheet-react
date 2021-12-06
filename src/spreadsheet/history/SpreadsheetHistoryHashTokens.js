var txId = 0;

export default class SpreadsheetHistoryHashTokens {

    static emptyTokens() {
        const tokens = {};
        tokens[SpreadsheetHistoryHashTokens.TX_ID] = txId;
        return tokens;
    }

    static currentTxId() {
        return txId;
    }

    static newTxId() {
        return txId++;
    }

    static SPREADSHEET_ID = "spreadsheet-id";
    static SPREADSHEET_NAME = "spreadsheet-name";

    static SPREADSHEET_NAME_EDIT_TOKEN = "name";
    static SPREADSHEET_NAME_EDIT = "spreadsheet-name-edit";
    static SPREADSHEET_NAME_EDIT_ACTION = "spreadsheet-name-edit-action";

    static SELECTION = "selection";
    static SELECTION_ANCHOR = "selection-anchor";
    static SELECTION_ACTION = "selection-action";

    static CELL = "cell";
    static CELL_FORMULA = "formula";
    static COLUMN = "column";
    static ROW = "row";

    static CLEAR = "clear";
    static DELETE = "delete";
    static INSERT_AFTER = "insert-after";
    static INSERT_BEFORE = "insert-before";
    static MENU = "menu";
    static SAVE = "save";

    static LABEL = "label";
    static LABEL_ACTION = "label-action";

    static SELECT = "select";
    static SETTINGS = "settings";
    static SETTINGS_ITEM = "settings-item";
    static SETTINGS_ACTION = "settings-action";

    static TX_ID = "_tx-id";
}