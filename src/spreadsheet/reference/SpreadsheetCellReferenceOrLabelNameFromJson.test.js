import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import spreadsheetCellReferenceOrLabelNameFromJson from "./spreadsheetCellReferenceOrLabelNameFromJson.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";

test("fromJson null fails", () => {
    expect(() => spreadsheetCellReferenceOrLabelNameFromJson(null)).toThrow("Missing text");
});

test("fromJson true fails", () => {
    expect(() => spreadsheetCellReferenceOrLabelNameFromJson(true)).toThrow("Expected string text got true");
});

test("fromJson empty fails", () => {
    expect(() => spreadsheetCellReferenceOrLabelNameFromJson("")).toThrow("Missing text");
});

test("fromJson invalid cell reference fails", () => {
    expect(() => spreadsheetCellReferenceOrLabelNameFromJson("A1!")).toThrow("Invalid character '!' at 2");
});

test("fromJson SpreadsheetRange fails", () => {
    expect(() => spreadsheetCellReferenceOrLabelNameFromJson("A1:B2")).toThrow("Invalid character ':' at 2");
});

test("fromJson SpreadsheetViewport fails", () => {
    expect(() => spreadsheetCellReferenceOrLabelNameFromJson("A1:100:200")).toThrow("Invalid character ':' at 2");
});

function spreadsheetExpressionReferenceFromJsonAndCheck(json, reference) {
    test("spreadsheetCellReferenceOrLabelNameFromJson \"" + json + "\"", () => {
        expect(spreadsheetCellReferenceOrLabelNameFromJson(json)).toStrictEqual(reference);
    });
}

spreadsheetExpressionReferenceFromJsonAndCheck("A1", SpreadsheetCellReference.fromJson("A1"));
spreadsheetExpressionReferenceFromJsonAndCheck("Label123", SpreadsheetLabelName.fromJson("Label123"));
