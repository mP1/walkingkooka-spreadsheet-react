import SpreadsheetCellParsePatternsHistoryHashToken from "./SpreadsheetCellParsePatternsHistoryHashToken.js";

/**
 * Represents the editing of a cell parse-patterns
 */
export default class SpreadsheetCellParsePatternsEditHistoryHashToken extends SpreadsheetCellParsePatternsHistoryHashToken {

    equals(other) {
        return super.equals(other) && other instanceof SpreadsheetCellParsePatternsEditHistoryHashToken;
    }
}