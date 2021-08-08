import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import spreadsheetCellReferenceOrLabelNameParse from "./SpreadsheetCellReferenceOrLabelNameParse.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import CharSequences from "../../CharSequences.js";

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
parseFails("A1:B2", "Invalid character ':' at 2")
parseFails("A1:100:200", "Invalid character ':' at 2");

function parseAndCheck(text, reference) {
    test("spreadsheetCellReferenceOrLabelNameParse \"" + text + "\"", () => {
        expect(spreadsheetCellReferenceOrLabelNameParse(text)).toStrictEqual(reference);
    });
}

parseAndCheck("A1", SpreadsheetCellReference.parse("A1"));
parseAndCheck("Label123", SpreadsheetLabelName.parse("Label123"));
