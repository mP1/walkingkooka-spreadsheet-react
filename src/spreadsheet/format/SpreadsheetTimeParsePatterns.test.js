import SpreadsheetTimeParsePatterns from "./SpreadsheetTimeParsePatterns.js";
import spreadsheetPatternTesting from "./SpreadsheetPatternTesting.js";

spreadsheetPatternTesting(
    function(pattern) {
        return new SpreadsheetTimeParsePatterns(pattern);
    },
    SpreadsheetTimeParsePatterns.fromJson,
    SpreadsheetTimeParsePatterns.parse
);