import SpreadsheetDateTimeParsePattern from "./SpreadsheetDateTimeParsePattern.js";
import spreadsheetPatternTesting from "./SpreadsheetPatternTesting.js";

spreadsheetPatternTesting(
    function(pattern) {
        return new SpreadsheetDateTimeParsePattern(pattern);
    },
    SpreadsheetDateTimeParsePattern.fromJson,
    SpreadsheetDateTimeParsePattern.parse
);