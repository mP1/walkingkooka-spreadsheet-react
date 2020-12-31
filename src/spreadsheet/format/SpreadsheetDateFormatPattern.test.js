import SpreadsheetDateFormatPattern from "./SpreadsheetDateFormatPattern.js";
import spreadsheetPatternTesting from "./SpreadsheetPatternTesting.js";

spreadsheetPatternTesting(
    function(pattern) {
        return new SpreadsheetDateFormatPattern(pattern);
    },
    SpreadsheetDateFormatPattern.fromJson,
    SpreadsheetDateFormatPattern.parse
);