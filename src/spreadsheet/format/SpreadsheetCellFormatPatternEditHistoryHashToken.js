import SpreadsheetCellFormatPatternHistoryHashToken from "./SpreadsheetCellFormatPatternHistoryHashToken.js";

/**
 * Represents the editing of a cell format-pattern
 */
export default class SpreadsheetCellFormatPatternEditHistoryHashToken extends SpreadsheetCellFormatPatternHistoryHashToken {

    equals(other) {
        return super.equals(other) && other instanceof SpreadsheetCellFormatPatternEditHistoryHashToken;
    }
}