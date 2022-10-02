import Preconditions from "../../Preconditions.js";
import SpreadsheetCellParsePatternsKind from "./SpreadsheetCellParsePatternsKind.js";
import SpreadsheetCellHistoryHashToken from "../reference/cell/SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";

/**
 * A base class for the edit and save parse patterns.
 */
export default class SpreadsheetCellParsePatternsHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    constructor(viewportSelection, kind) {
        super(viewportSelection);

        this.kindValue = Preconditions.requireInstance(
            kind,
            SpreadsheetCellParsePatternsKind,
            "kind"
        );
    }

    /**
     * The kind of pattern eg, date, date-time, number or time.
     */
    kind() {
        return this.kindValue;
    }

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.PARSE_PATTERNS +
            "/" +
            this.kind().nameKebabCase();
    }

    equals(other) {
        return super.equals(other) && other instanceof SpreadsheetCellParsePatternsHistoryHashToken &&
            this.kind().equals(other.kind());
    }
}