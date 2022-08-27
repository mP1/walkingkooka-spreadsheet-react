import SpreadsheetCellSelectHistoryHashToken from "../reference/cell/SpreadsheetCellSelectHistoryHashToken.js";
import SpreadsheetColumnOrRowSelectHistoryHashToken from "../reference/SpreadsheetColumnOrRowSelectHistoryHashToken.js";

/**
 * Null safe history hash token factory that creates the appropriate {@link SpreadsheetSelectHistoryHashToken} after testing the
 * given {@link SpreadsheetViewportSelection}.
 */
export default function selectHistoryHashToken(viewportSelection) {
    return viewportSelection && viewportSelection.selection().isCellScalarOrRange() ?
        new SpreadsheetCellSelectHistoryHashToken(viewportSelection) :
        new SpreadsheetColumnOrRowSelectHistoryHashToken(viewportSelection);
}
