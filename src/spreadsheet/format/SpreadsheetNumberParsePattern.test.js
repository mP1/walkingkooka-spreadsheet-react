import SpreadsheetNumberParsePattern from "./SpreadsheetNumberParsePattern.js";
import spreadsheetPatternTesting from "./SpreadsheetPatternTesting.js";

spreadsheetPatternTesting(
    function(pattern) {
        return new SpreadsheetNumberParsePattern(pattern);
    },
    SpreadsheetNumberParsePattern.fromJson,
    SpreadsheetNumberParsePattern.parse
);