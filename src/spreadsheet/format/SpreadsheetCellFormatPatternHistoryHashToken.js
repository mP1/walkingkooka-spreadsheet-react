import Preconditions from "../../Preconditions.js";
import SpreadsheetCellFormatPatternKind from "./SpreadsheetCellFormatPatternKind.js";
import SpreadsheetCellHistoryHashToken from "../reference/cell/SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";

/**
 * A base class for the edit and save format patterns.
 */
export default class SpreadsheetCellFormatPatternHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    constructor(viewport, kind) {
        super(viewport);

        this.kindValue = Preconditions.requireInstance(
            kind,
            SpreadsheetCellFormatPatternKind,
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
            SpreadsheetHistoryHashTokens.FORMAT_PATTERN +
            "/" +
            this.kind().nameKebabCase();
    }

    equals(other) {
        return super.equals(other) && other instanceof SpreadsheetCellFormatPatternHistoryHashToken &&
            this.kind().equals(other.kind());
    }
}