import SpreadsheetCellParsePatternHistoryHashToken from "./SpreadsheetCellParsePatternHistoryHashToken.js";

/**
 * Represents the editing of a cell parse-pattern
 */
export default class SpreadsheetCellParsePatternEditHistoryHashToken extends SpreadsheetCellParsePatternHistoryHashToken {

    equals(other) {
        return super.equals(other) && other instanceof SpreadsheetCellParsePatternEditHistoryHashToken;
    }
}