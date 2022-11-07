import Equality from "../../Equality.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetCellParsePatternHistoryHashToken from "./SpreadsheetCellParsePatternHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetParsePattern from "./SpreadsheetParsePattern.js";

/**
 * Represents the save of a cell parse-pattern
 */
export default class SpreadsheetCellParsePatternSaveHistoryHashToken extends SpreadsheetCellParsePatternHistoryHashToken {

    constructor(viewportSelection, kind, parsePattern) {
        super(viewportSelection, kind);

        this.parsePatternValue = Preconditions.optionalInstance(
            parsePattern,
            SpreadsheetParsePattern,
            "parsePattern"
        );
    }

    parsePattern() {
        return this.parsePatternValue;
    }

    historyHashPath() {
        const parsePattern = this.parsePattern();

        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.SAVE +
            "/" +
            (parsePattern ? parsePattern.historyHashPath() : "");
    }

    equals(other) {
        return super.equals(other) &&
            other instanceof SpreadsheetCellParsePatternSaveHistoryHashToken &&
            Equality.safeEquals(this.parsePattern(), other.parsePattern());
    }
}