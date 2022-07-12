import Preconditions from "../../Preconditions.js";
import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";

/**
 * Base for a history hash token that represents a column or row insert before / after.
 */
export default class SpreadsheetColumnOrRowInsertHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    constructor(spreadsheetViewport, count) {
        super(spreadsheetViewport);

        this.countValue = Preconditions.requirePositiveNumber(count, "count");
    }

    count() {
        return this.countValue;
    }
}