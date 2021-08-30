import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashToken from "./SpreadsheetHistoryHashToken.js";

/**
 * Represent a token with the history hash that indicates the current (a cell or label pointing to a cell) selection formula should be loaded and edited.
 */
export default class SpreadsheetFormulaLoadAndEditHistoryHashToken extends SpreadsheetHistoryHashToken {

    constructor(formulaText) {
        super();
        this.formulaTextValue = formulaText;
    }

    formulaText() {
        return this.formulaTextValue;
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

    toString() {
        return this.toHistoryHashToken();
    }
}