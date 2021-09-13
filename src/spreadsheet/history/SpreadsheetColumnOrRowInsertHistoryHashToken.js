import Preconditions from "../../Preconditions.js";
import SpreadsheetColumnOrRowSelectionActionHistoryHashToken from "./SpreadsheetColumnOrRowSelectionActionHistoryHashToken.js";

/**
 * Base for a history hash token that represents a column or row insert before / after.
 */
export default class SpreadsheetColumnOrRowInsertHistoryHashToken extends SpreadsheetColumnOrRowSelectionActionHistoryHashToken {

    constructor(count) {
        super();
        Preconditions.requirePositiveNumber(count, "count");
        this.countValue = count;
    }

    count() {
        return this.countValue;
    }
}