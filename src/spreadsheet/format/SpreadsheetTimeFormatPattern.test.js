import SpreadsheetTimeFormatPattern from "./SpreadsheetTimeFormatPattern.js";
import spreadsheetPatternTesting from "./SpreadsheetPatternTesting.js";

spreadsheetPatternTesting(
    function(pattern) {
        return new SpreadsheetTimeFormatPattern(pattern);
    },
    SpreadsheetTimeFormatPattern.fromJson,
    SpreadsheetTimeFormatPattern.parse
);