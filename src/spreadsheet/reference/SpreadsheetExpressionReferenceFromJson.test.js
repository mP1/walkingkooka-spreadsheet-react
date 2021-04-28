import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetExpressionReferenceFromJson from "./SpreadsheetExpressionReferenceFromJson.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import SpreadsheetRange from "./SpreadsheetRange.js";

test("fromJson null fails", () => {
    expect(() => SpreadsheetExpressionReferenceFromJson(null)).toThrow("Missing text");
});

test("fromJson true fails", () => {
    expect(() => SpreadsheetExpressionReferenceFromJson(true)).toThrow("Expected string got true");
});

test("fromJson empty fails", () => {
    expect(() => SpreadsheetExpressionReferenceFromJson("")).toThrow("Missing text");
});

test("fromJson invalid cell reference fails", () => {
    expect(() => SpreadsheetExpressionReferenceFromJson("A1!")).toThrow("Invalid character '!' at 2");
});

function spreadsheetExpressionReferenceFromJsonAndCheck(json, reference) {
    test("SpreadsheetExpressionReferenceFromJson \"" + json + "\"", () => {
        expect(SpreadsheetExpressionReferenceFromJson(json)).toStrictEqual(reference);
    });
}

spreadsheetExpressionReferenceFromJsonAndCheck("A1", SpreadsheetCellReference.fromJson("A1"));
spreadsheetExpressionReferenceFromJsonAndCheck("Label123", SpreadsheetLabelName.fromJson("Label123"));
spreadsheetExpressionReferenceFromJsonAndCheck("A1:B2", SpreadsheetRange.fromJson("A1:B2"));
