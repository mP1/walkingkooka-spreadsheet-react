import SpreadsheetCellFormat from "./SpreadsheetCellFormat";
import SpreadsheetError from "./SpreadsheetError.js";

const pattern = "###-123-abc";

function cellFormat() {
    return new SpreadsheetCellFormat(pattern);
}

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

// equals...............................................................................................................

test("equals undefined false", () => {
    const f = cellFormat();
    expect(f.equals()).toBeFalse();
});

test("equals null false", () => {
    const f = cellFormat();
    expect(f.equals(null)).toBeFalse();
});

test("equals different type false", () => {
    const f = cellFormat();
    expect(f.equals("different")).toBeFalse();
});

test("equals self true", () => {
    const f = cellFormat();
    expect(f.equals(f)).toBeTrue();
});

test("equals different false", () => {
    const f = cellFormat();
    expect(f.equals(new SpreadsheetError("different"))).toBeFalse();
});

test("equals equivalent true", () => {
    const f = cellFormat();
    expect(f.equals(f)).toBeTrue();
});

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
