import SpreadsheetDateParsePatterns from "./SpreadsheetDateParsePatterns.js";
import spreadsheetPatternTesting from "./SpreadsheetPatternTesting.js";

spreadsheetPatternTesting(
    function(pattern) {
        return new SpreadsheetDateParsePatterns(pattern);
    },
    SpreadsheetDateParsePatterns.fromJson,
    SpreadsheetDateParsePatterns.parse
);