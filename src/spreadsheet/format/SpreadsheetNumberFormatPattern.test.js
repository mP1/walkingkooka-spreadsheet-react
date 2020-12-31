import SpreadsheetNumberFormatPattern from "./SpreadsheetNumberFormatPattern.js";
import spreadsheetPatternTesting from "./SpreadsheetPatternTesting.js";

spreadsheetPatternTesting(
    function(pattern) {
        return new SpreadsheetNumberFormatPattern(pattern);
    },
    SpreadsheetNumberFormatPattern.fromJson,
    SpreadsheetNumberFormatPattern.parse
);