import SpreadsheetCellFormulaHistoryHashToken from "./SpreadsheetCellFormulaHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

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

    spreadsheetViewportWidgetExecute(viewportCell, width, height, viewportWidget) {
        // viewport is not interested in formula token.
    }

    toHistoryHashToken() {
        const formulaText = this.formulaText();

        return super.toHistoryHashToken() +
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