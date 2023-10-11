var txId = 0;

export default class SpreadsheetHistoryHashTokens {

    static emptyTokens() {
        const tokens = {};
        tokens[SpreadsheetHistoryHashTokens.TX_ID] = txId;
        return tokens;
    }

    /**
     * Creates a history hash tokens with the given which may be null, {@link SpreadsheetHistoryHashTokens#VIEWPORT}.
     */
    static viewport(viewport) {
        const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
        tokens[SpreadsheetHistoryHashTokens.VIEWPORT] = viewport;
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

    static SPREADSHEET_NAME_EDIT = "spreadsheet-name-edit";

    static SPREADSHEET_NAME_PATH = "name";

    static VIEWPORT = "viewport";

    static CELL = "cell";
    static CELL_FORMULA = "formula";
    static COLUMN = "column";
    static ROW = "row";

    static CLEAR = "clear";
    static DELETE = "delete";
    static FORMAT_PATTERN = "format-pattern";
    static FREEZE = "freeze";
    static HIDDEN = "hidden";
    static INSERT_AFTER = "insert-after";
    static INSERT_BEFORE = "insert-before";
    static MENU = "menu";
    static PARSE_PATTERNS = "parse-pattern";
    static STYLE = "style";
    static UNFREEZE = "unfreeze";

    static SAVE = "save";

    static LABEL = "label";

    static METADATA = "metadata";

    static SELECT = "select";

    static TX_ID = "_tx-id";
}