import SpreadsheetColumnOrRowDeleteOrInsertHistoryHashToken
    from "./SpreadsheetColumnOrRowDeleteOrInsertHistoryHashToken.js";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";

/**
 * Represents a column/row delete history hash token.
 */
export default class SpreadsheetColumnOrRowDeleteHistoryHashToken extends SpreadsheetColumnOrRowDeleteOrInsertHistoryHashToken {

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.DELETE_COLUMN_OR_ROW + "/" + this.count();
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetColumnOrRowDeleteHistoryHashToken && this.count() === other.count());
    }
}