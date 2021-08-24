import Preconditions from "../../Preconditions.js";
import SpreadsheetHistoryHashToken from "./SpreadsheetHistoryHashToken.js";

/**
 * Base for a history hash token that represents a column or row delete or insert.
 */
export default class SpreadsheetColumnOrRowDeleteOrInsertHistoryHashToken extends SpreadsheetHistoryHashToken {

    constructor(count) {
        super();
        Preconditions.requirePositiveNumber(count, "count");
        this.countValue = count;
    }

    count() {
        return this.countValue;
    }

    toString() {
        return this.toHistoryHashToken();
    }
}