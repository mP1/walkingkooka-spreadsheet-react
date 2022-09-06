import SpreadsheetCellFormulaHistoryHashToken from "./SpreadsheetCellFormulaHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represent a token with the history hash that indicates the current (a cell or label pointing to a cell) selection formula should be loaded and edited.
 */
export default class SpreadsheetCellFormulaEditHistoryHashToken extends SpreadsheetCellFormulaHistoryHashToken {

    formulaText() {
        return this.formulaTextValue;
    }

    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        // viewport is not interested in formula token.
    }

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.CELL_FORMULA;
    }
}