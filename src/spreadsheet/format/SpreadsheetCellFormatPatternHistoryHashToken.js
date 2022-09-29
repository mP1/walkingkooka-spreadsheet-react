import SpreadsheetCellHistoryHashToken from "../reference/cell/SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";

/**
 * A base class for the edit and save format patterns.
 */
export default class SpreadsheetCellFormatPatternHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.FORMAT_PATTERN;
    }

    equals(other) {
        return super.equals(other) && other instanceof SpreadsheetCellFormatPatternHistoryHashToken;
    }
}