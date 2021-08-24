import CharSequences from "../../CharSequences.js";
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
        return SpreadsheetHistoryHash.CELL_FORMULA;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetFormulaHistoryHashToken && this.formulaText().equals(other.formulaText()));
    }

    toString() {
        const formulaText = this.formulaText();
        return SpreadsheetHistoryHash.CELL_FORMULA + null != formulaText ? "=" + CharSequences.quoteAndEscape(formulaText) : "";
    }
}