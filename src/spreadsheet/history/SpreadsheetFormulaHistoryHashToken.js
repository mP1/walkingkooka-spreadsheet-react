import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashToken from "./SpreadsheetHistoryHashToken.js";

/**
 * Represent a token with the history hash that indicates the current (a cell or label pointing to a cell) selection formula is being edited.
 */
export default class SpreadsheetFormulaHistoryHashToken extends SpreadsheetHistoryHashToken {

    cnstructor(formulaText) {
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
        return this === other || (other instanceof SpreadsheetFormulaHistoryHashToken && this.formulaText() === other.formulaText());
    }

    toString() {
        return this.toHistoryHashToken();
    }
}