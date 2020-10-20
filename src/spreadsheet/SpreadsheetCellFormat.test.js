import SpreadsheetCellFormat from "./SpreadsheetCellFormat";

const pattern = "###-123-abc";

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

test("fromJson null", () => {
    expect(SpreadsheetCellFormat.fromJson(null)).toBeNull();
});

test("json", () => {
    const spreadsheetCellFormat = new SpreadsheetCellFormat(pattern);

    check(spreadsheetCellFormat, pattern);
});

// helpers..............................................................................................................

function check(spreadsheetCellFormat, pattern) {
    expect(spreadsheetCellFormat.pattern()).toStrictEqual(pattern);
    expect(spreadsheetCellFormat.toJson()).toStrictEqual(pattern);
    expect(spreadsheetCellFormat.toString()).toBe(pattern);
    expect(SpreadsheetCellFormat.fromJson(spreadsheetCellFormat.toJson())).toStrictEqual(spreadsheetCellFormat);
}
