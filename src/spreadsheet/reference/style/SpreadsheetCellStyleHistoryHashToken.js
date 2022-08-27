import SpreadsheetCellHistoryHashToken from "../cell/SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";

/**
 * The style token.
 */
export default class SpreadsheetCellStyleHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.STYLE;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetCellStyleHistoryHashToken);
    }
}