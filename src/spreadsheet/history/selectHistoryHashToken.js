import SpreadsheetCellSelectHistoryHashToken from "../reference/SpreadsheetCellSelectHistoryHashToken.js";
import SpreadsheetColumnOrRowSelectHistoryHashToken from "../reference/SpreadsheetColumnOrRowSelectHistoryHashToken.js";
import SpreadsheetExpressionReference from "../reference/SpreadsheetExpressionReference.js";

/**
 * Null safe history hash token factory that creates the appropriate {@link SpreadsheetSelectHistoryHashToken} after testing the
 * given {@link SpreadsheetViewportSelection}.
 */
export default function selectHistoryHashToken(viewportSelection) {
    return viewportSelection && viewportSelection.selection() instanceof SpreadsheetExpressionReference ?
        new SpreadsheetCellSelectHistoryHashToken(viewportSelection) :
        new SpreadsheetColumnOrRowSelectHistoryHashToken(viewportSelection);
}
