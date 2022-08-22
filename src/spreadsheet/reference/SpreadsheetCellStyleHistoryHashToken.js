import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";

/**
 * The style token.
 */
export default class SpreadsheetCellStyleHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    equals(other) {
        return this === other || (other instanceof SpreadsheetCellStyleHistoryHashToken);
    }
}