import SpreadsheetCellFormulaHistoryHashToken from "./SpreadsheetCellFormulaHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represent a token with the history hash that indicates the current (a cell or label pointing to a cell) selection formula should be loaded and edited.
 */
export default class SpreadsheetCellFormulaEditHistoryHashToken extends SpreadsheetCellFormulaHistoryHashToken {

    formulaText() {
        return this.formulaTextValue;
    }

    spreadsheetFormulaWidgetExecute(formulaWidget, previousViewport) {
        const viewport = this.viewport();
        let historyTokens;

        if(formulaWidget.isFocused()){
            historyTokens = SpreadsheetHistoryHashTokens.viewport(
                new SpreadsheetCellFormulaEditHistoryHashToken(viewport)
            );
        }else {
            if(!(previousViewport instanceof SpreadsheetCellFormulaHistoryHashToken)){
                formulaWidget.giveFormulaTextBoxFocus();
            }
        }

        // if cell selection changed load text only not after a formula save. the extra selection is NOT a formula save makes the selection clear after the save completes.
        const selection = viewport.selection();
        if(!selection.equalsIgnoringKind(previousViewport && previousViewport.viewport().selection())){
            formulaWidget.loadFormulaText(selection);
        }

        return historyTokens;
    }

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.CELL_FORMULA;
    }
}