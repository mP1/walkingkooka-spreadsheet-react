import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetFormulaSelectionActionHistoryHashToken from "./SpreadsheetFormulaSelectionActionHistoryHashToken.js";

/**
 * A history hash token that saves the given formula text for the current cell.
 */
export default class SpreadsheetFormulaSaveHistoryHashToken extends SpreadsheetFormulaSelectionActionHistoryHashToken {

    constructor(formulaText) {
        super();
        Preconditions.requireText(formulaText, "formulaText");
        this.formulaTextValue = formulaText;
    }

    formulaText() {
        return this.formulaTextValue;
    }

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.CELL_FORMULA + "/" + SpreadsheetHistoryHash.CELL_FORMULA_SAVE + "/" + encodeURIComponent(this.formulaText());
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetFormulaSaveHistoryHashToken && this.formulaText() === other.formulaText());
    }
}