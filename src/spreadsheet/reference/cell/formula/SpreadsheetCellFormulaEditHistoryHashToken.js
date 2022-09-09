import SpreadsheetCellFormulaHistoryHashToken from "./SpreadsheetCellFormulaHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represent a token with the history hash that indicates the current (a cell or label pointing to a cell) selection formula should be loaded and edited.
 */
export default class SpreadsheetCellFormulaEditHistoryHashToken extends SpreadsheetCellFormulaHistoryHashToken {

    formulaText() {
        return this.formulaTextValue;
    }

    spreadsheetFormulaWidgetExecute(formulaWidget, previousViewportSelection) {
        const viewportSelection = this.viewportSelection();

        if(!formulaWidget.isFocused() && !(previousViewportSelection instanceof SpreadsheetCellFormulaHistoryHashToken)) {
            formulaWidget.giveFormulaTextBoxFocus();
        }

        // if cell selection changed load text only not after a formula save. the extra selection is NOT a formula save makes the selection clear after the save completes.
        const selection = viewportSelection.selection();
        if(!selection.equalsIgnoringKind(previousViewportSelection && previousViewportSelection.viewportSelection().selection())){
            formulaWidget.loadFormulaText(selection);
        }
    }

    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        // viewport is not interested in formula token.
    }

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.CELL_FORMULA;
    }
}