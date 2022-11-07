import SpreadsheetDateParsePattern from "./SpreadsheetDateParsePattern.js";
import spreadsheetPatternTesting from "./SpreadsheetPatternTesting.js";

spreadsheetPatternTesting(
    function(pattern) {
        return new SpreadsheetDateParsePattern(pattern);
    },
    SpreadsheetDateParsePattern.fromJson,
    SpreadsheetDateParsePattern.parse
);