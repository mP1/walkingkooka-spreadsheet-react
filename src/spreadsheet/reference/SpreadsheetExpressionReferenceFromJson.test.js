import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetExpressionReferenceFromJson from "./SpreadsheetExpressionReferenceFromJson.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import SpreadsheetRange from "./SpreadsheetRange.js";

function spreadsheetExpressionReferenceFromJsonAndCheck(json, reference) {
    test("SpreadsheetExpressionReferenceFromJson \"" + json + "\"", () => {
        expect(SpreadsheetExpressionReferenceFromJson(json)).toStrictEqual(reference);
    });
}

spreadsheetExpressionReferenceFromJsonAndCheck("A1", SpreadsheetCellReference.fromJson("A1"));
spreadsheetExpressionReferenceFromJsonAndCheck("Label123", SpreadsheetLabelName.fromJson("Label123"));
spreadsheetExpressionReferenceFromJsonAndCheck("A1:B2", SpreadsheetRange.fromJson("A1:B2"));
