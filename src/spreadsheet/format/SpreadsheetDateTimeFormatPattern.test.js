import SpreadsheetDateTimeFormatPattern from "./SpreadsheetDateTimeFormatPattern.js";
import spreadsheetPatternTesting from "./SpreadsheetPatternTesting.js";

spreadsheetPatternTesting(
    function(pattern) {
        return new SpreadsheetDateTimeFormatPattern(pattern);
    },
    SpreadsheetDateTimeFormatPattern.fromJson,
    SpreadsheetDateTimeFormatPattern.parse
);