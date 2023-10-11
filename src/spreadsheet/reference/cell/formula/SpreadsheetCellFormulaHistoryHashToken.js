import SpreadsheetCellHistoryHashToken from "../SpreadsheetCellHistoryHashToken.js";
import SystemObject from "../../../../SystemObject.js";

/**
 * Base for all formula actions
 */
export default class SpreadsheetCellFormulaHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    spreadsheetFormulaWidgetExecute(formulaWidget, previousViewport) {
        SystemObject.throwUnsupportedOperation();
    }
}