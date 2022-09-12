import Preconditions from "../../../Preconditions.js";
import SpreadsheetExpressionReference from "../SpreadsheetExpressionReference.js";
import SpreadsheetFormula from "./formula/SpreadsheetFormula.js";
import SpreadsheetSelectionWidget from "../SpreadsheetSelectionWidget.js";

/**
 * Base class for cell aware widgets.
 */
export default class SpreadsheetCellWidget extends SpreadsheetSelectionWidget {

    /**
     * Calls the server to PATCH a cell and also handles updating the history hash leaving just the selection.
     */
    patchFormula(cellOrLabel, formulaText) {
        Preconditions.requireInstance(cellOrLabel, SpreadsheetExpressionReference, "cellOrLabel");

        const cells = {}
        cells[cellOrLabel.toString()] = {
            "formula": new SpreadsheetFormula(formulaText).toJson()
        };

        this.patch(
            cellOrLabel,
            {
                "cells": cells,
            }
        );
    }
}
