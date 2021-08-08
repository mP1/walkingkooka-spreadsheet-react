import CharSequences from "../../CharSequences.js";
import SpreadsheetCellRange from "./SpreadsheetCellRange.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import spreadsheetCellReferenceOrLabelNameParse from "./SpreadsheetCellReferenceOrLabelNameParse.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";


function parseFails(text, message) {
    test("parse " + CharSequences.quoteAndEscape(text), () => {
        expect(() => spreadsheetCellReferenceOrLabelNameParse(text))
            .toThrow(message);
    });
}

parseFails(null, "Missing text");
parseFails(true, "Expected string text got true");
parseFails("", "Missing text");
parseFails("A1!", "Invalid character '!' at 2");
parseFails("B2:", "Missing end");

function parseAndCheck(text, reference) {
    test("spreadsheetCellReferenceOrLabelNameParse \"" + text + "\"", () => {
        expect(spreadsheetCellReferenceOrLabelNameParse(text)).toStrictEqual(reference);
    });
}

parseAndCheck("A2:A2", SpreadsheetCellRange.parse("A2:A2"));
parseAndCheck("A1:B2", SpreadsheetCellRange.parse("A1:B2"));
parseAndCheck("A1", SpreadsheetCellReference.parse("A1"));
parseAndCheck("Label123", SpreadsheetLabelName.parse("Label123"));
