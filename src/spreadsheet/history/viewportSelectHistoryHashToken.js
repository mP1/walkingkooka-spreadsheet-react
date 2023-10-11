import SpreadsheetCellSelectHistoryHashToken from "../reference/cell/SpreadsheetCellSelectHistoryHashToken.js";
import SpreadsheetColumnOrRowSelectHistoryHashToken
    from "../reference/columnrow/SpreadsheetColumnOrRowSelectHistoryHashToken.js";

/**
 * Null safe history hash token factory that creates the appropriate {@link SpreadsheetSelectHistoryHashToken} after testing the
 * given {@link SpreadsheetViewport}.
 */
export default function viewportSelectHistoryHashToken(viewport) {
    return viewport && viewport.selection().isCellScalarOrRange() ?
        new SpreadsheetCellSelectHistoryHashToken(viewport) :
        new SpreadsheetColumnOrRowSelectHistoryHashToken(viewport);
}
