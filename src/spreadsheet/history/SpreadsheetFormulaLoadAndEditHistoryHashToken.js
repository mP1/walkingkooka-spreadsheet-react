import SpreadsheetFormulaSelectionActionHistoryHashToken from "./SpreadsheetFormulaSelectionActionHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * Represent a token with the history hash that indicates the current (a cell or label pointing to a cell) selection formula should be loaded and edited.
 */
export default class SpreadsheetFormulaLoadAndEditHistoryHashToken extends SpreadsheetFormulaSelectionActionHistoryHashToken {

    constructor(formulaText) {
        super();
        this.formulaTextValue = formulaText;
    }

    formulaText() {
        return this.formulaTextValue;
    }

    onViewportSelectionAction(selection, viewportWidget) {
        // viewport is not interested in formula token.
    }

    toHistoryHashToken() {
        const formulaText = this.formulaText();

        return SpreadsheetHistoryHashTokens.CELL_FORMULA +
            (formulaText != null ?
                "/" + encodeURIComponent(formulaText) :
            "");
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetFormulaLoadAndEditHistoryHashToken && this.formulaText() === other.formulaText());
    }
}