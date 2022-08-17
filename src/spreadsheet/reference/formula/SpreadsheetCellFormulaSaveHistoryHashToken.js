import Preconditions from "../../../Preconditions.js";
import SpreadsheetCellFormulaHistoryHashToken from "./SpreadsheetCellFormulaHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";

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

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.CELL_FORMULA +
            "/" +
            encodeURIComponent(this.formulaText());
    }

    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        // nop
    }

    equals(other) {
        return super.equals(other) &&
            this.formulaText() === other.formulaText();
    }
}