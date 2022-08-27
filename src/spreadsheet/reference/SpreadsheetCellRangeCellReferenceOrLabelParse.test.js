import SpreadsheetCellRange from "./SpreadsheetCellRange.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetExpressionReferenceParse from "./SpreadsheetCellRangeCellReferenceOrLabelParse.js";
import SpreadsheetLabelName from "./label/SpreadsheetLabelName.js";

test("parse null fails", () => {
    expect(() => SpreadsheetExpressionReferenceParse(null)).toThrow("Missing text");
});

test("parse true fails", () => {
    expect(() => SpreadsheetExpressionReferenceParse(true)).toThrow("Expected string text got true");
});

test("parse empty fails", () => {
    expect(() => SpreadsheetExpressionReferenceParse("")).toThrow("Missing text");
});

test("parse invalid cell reference fails", () => {
    expect(() => SpreadsheetExpressionReferenceParse("A1!")).toThrow("Invalid character '!' at 2");
});

function testSpreadsheetExpressionReferenceParse(json, reference) {
    test("SpreadsheetExpressionReferenceParse \"" + json + "\"", () => {
        expect(SpreadsheetExpressionReferenceParse(json)).toStrictEqual(reference);
    });
}

testSpreadsheetExpressionReferenceParse("A1", SpreadsheetCellReference.parse("A1"));
testSpreadsheetExpressionReferenceParse("Label123", SpreadsheetLabelName.parse("Label123"));
testSpreadsheetExpressionReferenceParse("A1:B2", SpreadsheetCellRange.parse("A1:B2"));
