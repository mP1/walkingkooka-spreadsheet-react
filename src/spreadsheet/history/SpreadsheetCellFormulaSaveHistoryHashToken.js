import Preconditions from "../../Preconditions.js";
import SpreadsheetCellFormulaHistoryHashToken from "./SpreadsheetCellFormulaHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * A history hash token that saves the given formula text for the current cell.
 */
export default class SpreadsheetCellFormulaSaveHistoryHashToken extends SpreadsheetCellFormulaHistoryHashToken {

    constructor(viewportSelection, formulaText) {
        super(viewportSelection);

        this.formulaTextValue = Preconditions.requireText(formulaText, "formulaText");
    }

    formulaText() {
        return this.formulaTextValue;
    }

    toHistoryHashToken() {
        return super.toHistoryHashToken() +
            "/" +
            SpreadsheetHistoryHashTokens.CELL_FORMULA +
            "/" +
            encodeURIComponent(this.formulaText());
    }

    spreadsheetViewportWidgetExecute(viewportCell, width, height, viewportWidget) {
        // nop
    }

    equals(other) {
        return super.equals(other) &&
            this.formulaText() === other.formulaText();
    }
}