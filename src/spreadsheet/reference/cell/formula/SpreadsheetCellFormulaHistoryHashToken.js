import SpreadsheetCellHistoryHashToken from "../SpreadsheetCellHistoryHashToken.js";
import SystemObject from "../../../../SystemObject.js";

/**
 * Base for all formula actions
 */
export default class SpreadsheetCellFormulaHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    spreadsheetFormulaWidgetExecute(formulaWidget, previousViewportSelection) {
        SystemObject.throwUnsupportedOperation();
    }

    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        // nop
    }
}