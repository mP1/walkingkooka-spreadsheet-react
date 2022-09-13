import SpreadsheetCellHistoryHashToken from "../SpreadsheetCellHistoryHashToken.js";

/**
 * Base for all formula actions
 */
export default class SpreadsheetCellFormulaHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        // nop
    }
}