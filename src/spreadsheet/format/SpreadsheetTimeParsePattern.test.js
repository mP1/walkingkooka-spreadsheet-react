import SpreadsheetTimeParsePattern from "./SpreadsheetTimeParsePattern.js";
import spreadsheetPatternTesting from "./SpreadsheetPatternTesting.js";

spreadsheetPatternTesting(
    function(pattern) {
        return new SpreadsheetTimeParsePattern(pattern);
    },
    SpreadsheetTimeParsePattern.fromJson,
    SpreadsheetTimeParsePattern.parse
);