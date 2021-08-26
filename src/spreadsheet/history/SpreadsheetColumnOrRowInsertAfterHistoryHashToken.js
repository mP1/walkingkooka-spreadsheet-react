import SpreadsheetColumnOrRowDeleteOrInsertHistoryHashToken
    from "./SpreadsheetColumnOrRowDeleteOrInsertHistoryHashToken.js";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";

/**
 * Represents a column/row insert AFTER history hash token.
 */
export default class SpreadsheetColumnOrRowInsertAfterHistoryHashToken extends SpreadsheetColumnOrRowDeleteOrInsertHistoryHashToken {

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.INSERT_AFTER_COLUMN_OR_ROW + "/" + this.count();
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetColumnOrRowInsertAfterHistoryHashToken && this.count() === other.count());
    }
}