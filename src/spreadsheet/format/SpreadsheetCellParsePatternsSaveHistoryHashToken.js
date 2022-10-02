import Equality from "../../Equality.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetCellParsePatternsHistoryHashToken from "./SpreadsheetCellParsePatternsHistoryHashToken.js";
import SpreadsheetParsePatterns from "./SpreadsheetParsePatterns.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represents the save of a cell parse-patterns
 */
export default class SpreadsheetCellParsePatternsSaveHistoryHashToken extends SpreadsheetCellParsePatternsHistoryHashToken {

    constructor(viewportSelection, kind, parsePatterns) {
        super(viewportSelection, kind);

        this.parsePatternsValue = Preconditions.optionalInstance(
            parsePatterns,
            SpreadsheetParsePatterns,
            "parsePatterns"
        );
    }

    parsePatterns() {
        return this.parsePatternsValue;
    }

    historyHashPath() {
        const parsePatterns = this.parsePatterns();

        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.SAVE +
            "/" +
            (parsePatterns ? parsePatterns.historyHashPath() : "");
    }

    equals(other) {
        return super.equals(other) &&
            other instanceof SpreadsheetCellParsePatternsSaveHistoryHashToken &&
            Equality.safeEquals(this.parsePatterns(), other.parsePatterns());
    }
}