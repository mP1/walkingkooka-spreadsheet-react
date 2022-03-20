import SpreadsheetSelectionHistoryHashToken from "./SpreadsheetSelectionHistoryHashToken.js";

/**
 * Base for all cell actions
 */
export default class SpreadsheetCellSelectionActionHistoryHashToken extends SpreadsheetSelectionHistoryHashToken {

    static INSTANCE = new SpreadsheetCellSelectionActionHistoryHashToken();
}