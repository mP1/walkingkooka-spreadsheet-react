import SpreadsheetColumnOrRowInsertHistoryHashToken
    from "./SpreadsheetColumnOrRowInsertHistoryHashToken.js";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashToken from "./SpreadsheetHistoryHashToken.js";

/**
 * Represents a column/row delete history hash token.
 */
export default class SpreadsheetColumnOrRowDeleteHistoryHashToken extends SpreadsheetHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetColumnOrRowDeleteHistoryHashToken();

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.DELETE_COLUMN_OR_ROW;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetColumnOrRowDeleteHistoryHashToken);
    }

    toString() {
        return this.toHistoryHashToken();
    }
}