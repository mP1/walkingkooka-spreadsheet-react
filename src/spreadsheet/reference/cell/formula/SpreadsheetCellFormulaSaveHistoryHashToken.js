import Preconditions from "../../../../Preconditions.js";
import SpreadsheetCellFormulaEditHistoryHashToken from "./SpreadsheetCellFormulaEditHistoryHashToken.js";
import SpreadsheetCellFormulaHistoryHashToken from "./SpreadsheetCellFormulaHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";
import viewportSelectHistoryHashToken from "../../../history/viewportSelectHistoryHashToken.js";

/**
 * A history hash token that saves the given formula text for the current cell.
 */
export default class SpreadsheetCellFormulaSaveHistoryHashToken extends SpreadsheetCellFormulaHistoryHashToken {

    constructor(viewport, formulaText) {
        super(viewport);

        this.formulaTextValue = Preconditions.requireText(formulaText, "formulaText");
    }

    formulaText() {
        return this.formulaTextValue;
    }

    // cell/A1/formula/save/=1+2
    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.CELL_FORMULA +
            "/" +
            SpreadsheetHistoryHashTokens.SAVE +
            "/" +
            encodeURIComponent(this.formulaText());
    }

    // previousViewport ignored
    spreadsheetFormulaWidgetExecute(formulaWidget, previousViewport) {
        const viewport = this.viewport();

        formulaWidget.patchFormula(
            viewport.selection(),
            this.formulaText(),
        );

        return formulaWidget.isFocused() ?
            SpreadsheetHistoryHashTokens.viewport(
                new SpreadsheetCellFormulaEditHistoryHashToken(viewport)
            ) :
            null != previousViewport ?
                SpreadsheetHistoryHashTokens.viewport(
                    viewportSelectHistoryHashToken(viewport)
                ) :
                null;
    }

    equals(other) {
        return super.equals(other) &&
            this.formulaText() === other.formulaText();
    }
}