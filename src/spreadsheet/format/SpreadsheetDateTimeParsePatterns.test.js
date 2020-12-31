import SpreadsheetDateTimeParsePatterns from "./SpreadsheetDateTimeParsePatterns.js";
import spreadsheetPatternTesting from "./SpreadsheetPatternTesting.js";

spreadsheetPatternTesting(
    function(pattern) {
        return new SpreadsheetDateTimeParsePatterns(pattern);
    },
    SpreadsheetDateTimeParsePatterns.fromJson,
    SpreadsheetDateTimeParsePatterns.parse
);