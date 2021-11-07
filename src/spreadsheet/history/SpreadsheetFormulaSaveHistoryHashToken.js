import Preconditions from "../../Preconditions.js";
import SpreadsheetFormulaSelectionActionHistoryHashToken from "./SpreadsheetFormulaSelectionActionHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

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
        return SpreadsheetHistoryHashTokens.CELL_FORMULA + "/" + SpreadsheetHistoryHashTokens.SAVE + "/" + encodeURIComponent(this.formulaText());
    }

    onViewportSelectionAction(selection, viewportWidget) {

    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetFormulaSaveHistoryHashToken && this.formulaText() === other.formulaText());
    }
}