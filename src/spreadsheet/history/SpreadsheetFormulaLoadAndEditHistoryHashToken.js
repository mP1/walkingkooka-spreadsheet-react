import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetFormulaHistoryHashToken from "./SpreadsheetFormulaHistoryHashToken.js";

/**
 * Represent a token with the history hash that indicates the current (a cell or label pointing to a cell) selection formula should be loaded and edited.
 */
export default class SpreadsheetFormulaLoadAndEditHistoryHashToken extends SpreadsheetFormulaHistoryHashToken {

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

        return SpreadsheetHistoryHash.CELL_FORMULA +
            (formulaText != null ?
                "/" + encodeURI(formulaText) :
            "");
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetFormulaLoadAndEditHistoryHashToken && this.formulaText() === other.formulaText());
    }
}