import Equality from "../../Equality.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetCellFormatPatternHistoryHashToken from "./SpreadsheetCellFormatPatternHistoryHashToken.js";
import SpreadsheetFormatPattern from "./SpreadsheetFormatPattern.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represents the save of a cell format-pattern
 */
export default class SpreadsheetCellFormatPatternSaveHistoryHashToken extends SpreadsheetCellFormatPatternHistoryHashToken {

    constructor(viewportSelection, kind, formatPattern) {
        super(viewportSelection, kind);

        this.formatPatternValue = Preconditions.optionalInstance(
            formatPattern,
            SpreadsheetFormatPattern,
            "formatPattern"
        );
    }

    formatPattern() {
        return this.formatPatternValue;
    }

    historyHashPath() {
        const formatPattern = this.formatPattern();

        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.SAVE +
            "/" +
            (formatPattern ? formatPattern.historyHashPath() : "");
    }

    equals(other) {
        return super.equals(other) &&
            other instanceof SpreadsheetCellFormatPatternSaveHistoryHashToken &&
            Equality.safeEquals(this.formatPattern(), other.formatPattern());
    }
}