import Preconditions from "../../Preconditions.js";
import SpreadsheetFormulaHistoryHashToken from "./SpreadsheetFormulaHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * A history hash token that saves the given formula text for the current cell.
 */
export default class SpreadsheetFormulaSaveHistoryHashToken extends SpreadsheetFormulaHistoryHashToken {

    constructor(formulaText) {
        super();
        Preconditions.requireText(formulaText, "formulaText");
        this.formulaTextValue = formulaText;
    }

    formulaText() {
        return this.formulaTextValue;
    }

    toHistoryHashToken() {
        return SpreadsheetHistoryHashTokens.CELL_FORMULA + "/" + encodeURIComponent(this.formulaText());
    }

    onViewportSelectionAction(viewportSelection, viewportWidget) {
        // nop
    }

    equals(other) {
        return super.equals(other) &&
            this.formulaText() === other.formulaText();
    }

    toString() {
        return "save " + encodeURIComponent(this.formulaText());
    }
}