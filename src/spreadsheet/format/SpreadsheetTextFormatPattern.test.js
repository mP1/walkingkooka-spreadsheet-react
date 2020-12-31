import SpreadsheetTextFormatPattern from "./SpreadsheetTextFormatPattern.js";
import spreadsheetPatternTesting from "./SpreadsheetPatternTesting.js";

spreadsheetPatternTesting(
    function(pattern) {
        return new SpreadsheetTextFormatPattern(pattern);
    },
    SpreadsheetTextFormatPattern.fromJson,
    SpreadsheetTextFormatPattern.parse
);