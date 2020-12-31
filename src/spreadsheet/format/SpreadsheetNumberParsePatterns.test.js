import SpreadsheetNumberParsePatterns from "./SpreadsheetNumberParsePatterns.js";
import spreadsheetPatternTesting from "./SpreadsheetPatternTesting.js";

spreadsheetPatternTesting(
    function(pattern) {
        return new SpreadsheetNumberParsePatterns(pattern);
    },
    SpreadsheetNumberParsePatterns.fromJson,
    SpreadsheetNumberParsePatterns.parse
);