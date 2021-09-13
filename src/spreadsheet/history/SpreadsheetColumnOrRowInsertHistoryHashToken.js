import Preconditions from "../../Preconditions.js";
import SpreadsheetSelectionActionHistoryHashToken from "./SpreadsheetSelectionActionHistoryHashToken.js";

/**
 * Base for a history hash token that represents a column or row insert before / after.
 */
export default class SpreadsheetColumnOrRowInsertHistoryHashToken extends SpreadsheetSelectionActionHistoryHashToken {

    constructor(count) {
        super();
        Preconditions.requirePositiveNumber(count, "count");
        this.countValue = count;
    }

    count() {
        return this.countValue;
    }
}