import Preconditions from "../../Preconditions.js";
import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";

/**
 * Base for a history hash token that represents a column or row insert before / after.
 */
export default class SpreadsheetColumnOrRowInsertHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    constructor(count) {
        super();
        Preconditions.requirePositiveNumber(count, "count");
        this.countValue = count;
    }

    count() {
        return this.countValue;
    }
}