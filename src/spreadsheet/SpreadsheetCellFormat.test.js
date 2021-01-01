import SpreadsheetCellFormat from "./SpreadsheetCellFormat";
import SpreadsheetError from "./SpreadsheetError.js";
import systemObjectTesting from "../SystemObjectTesting.js";

const pattern = "###-123-abc";

function cellFormat() {
    return new SpreadsheetCellFormat(pattern);
}

systemObjectTesting(
    cellFormat(),
    new SpreadsheetCellFormat("###"),
    SpreadsheetCellFormat.fromJson,
    "Missing pattern",
    "spreadsheet-cell-format",
    pattern
);

// create...............................................................................................................

test("create without pattern fails", () => {
    expect(() => new SpreadsheetCellFormat(null)).toThrow("Missing pattern");
});

test("create with non string fails", () => {
    expect(() => new SpreadsheetCellFormat(1.5)).toThrow("Expected string got 1.5");
});

test("create", () => {
    const spreadsheetCellFormat = new SpreadsheetCellFormat(pattern);
    expect(spreadsheetCellFormat.pattern()).toBe(pattern);
});

// equals...............................................................................................................

test("equals equivalent true #2", () => {
    const format = "#";
    const f = new SpreadsheetCellFormat(format);
    expect(f.equals(new SpreadsheetCellFormat(format))).toBeTrue();
});

// helpers..............................................................................................................

function check(spreadsheetCellFormat, pattern) {
    expect(spreadsheetCellFormat.pattern()).toStrictEqual(pattern);
    expect(spreadsheetCellFormat.pattern()).toBeString();

    expect(spreadsheetCellFormat.toJson()).toStrictEqual(pattern);
    expect(spreadsheetCellFormat.toString()).toBe(pattern);
    expect(SpreadsheetCellFormat.fromJson(spreadsheetCellFormat.toJson())).toStrictEqual(spreadsheetCellFormat);
}
