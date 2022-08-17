import SpreadsheetCellFormulaHistoryHashToken from "./SpreadsheetCellFormulaHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represent a token with the history hash that indicates the current (a cell or label pointing to a cell) selection formula should be loaded and edited.
 */
export default class SpreadsheetCellFormulaEditHistoryHashToken extends SpreadsheetCellFormulaHistoryHashToken {

    constructor(spreadsheetViewport, formulaText) {
        super(spreadsheetViewport);
        this.formulaTextValue = formulaText;
    }

    formulaText() {
        return this.formulaTextValue;
    }

    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        // viewport is not interested in formula token.
    }

    historyHashPath() {
        const formulaText = this.formulaText();

        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.CELL_FORMULA +
            (formulaText != null ?
                "/" + encodeURIComponent(formulaText) :
                "");
    }

    equals(other) {
        return super.equals(other) &&
            this.formulaText() === other.formulaText();
    }
}