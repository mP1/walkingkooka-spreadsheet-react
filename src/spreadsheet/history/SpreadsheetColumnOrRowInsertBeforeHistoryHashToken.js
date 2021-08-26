import SpreadsheetColumnOrRowDeleteOrInsertHistoryHashToken
    from "./SpreadsheetColumnOrRowDeleteOrInsertHistoryHashToken.js";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";

/**
 * Represents a column/row insert BEFORE history hash token.
 */
export default class SpreadsheetColumnOrRowInsertBeforeHistoryHashToken extends SpreadsheetColumnOrRowDeleteOrInsertHistoryHashToken {

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.INSERT_BEFORE_COLUMN_OR_ROW + "/" + this.count();
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetColumnOrRowInsertBeforeHistoryHashToken && this.count() === other.count());
    }
}