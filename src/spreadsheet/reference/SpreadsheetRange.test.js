import SpreadsheetRange from "./SpreadsheetRange";
import SpreadsheetCellReference from "./SpreadsheetCellReference";

function begin() {
    return new SpreadsheetCellReference("A1");
}

function end() {
    return new SpreadsheetCellReference("B2");
}

test("create without begin fails", () => {
    expect(() => new SpreadsheetRange(null, end())).toThrow("Begin missing");
});

test("create with begin non cell fails", () => {
    expect(() => new SpreadsheetRange(1.5, end())).toThrow("Expected SpreadsheetCellReference begin got 1.5");
});

test("create without end fails", () => {
    expect(() => new SpreadsheetRange(begin(), null)).toThrow("End missing");
});

test("create with end non cell fails", () => {
    expect(() => new SpreadsheetRange(begin(), true)).toThrow("Expected SpreadsheetCellReference end got true");
});

test("create", () => {
    check(new SpreadsheetRange(begin(), end()), begin(), end(), "A1:B2");
});

test("fromJson null fails", () => {
    expect(() => SpreadsheetRange.fromJson(null)).toThrow("Json missing");
});

test("fromJson wrong token count fails", () => {
    expect(() => SpreadsheetRange.fromJson("A1:B2:C3")).toThrow("Expected 2 tokens got A1:B2:C3");
});

// helpers..............................................................................................................

function check(range, begin, end, json) {
    expect(range.begin()).toStrictEqual(begin);
    expect(range.end()).toStrictEqual(end);

    expect(range.toJson()).toStrictEqual(json);
    expect(range.toString()).toBe(json);

    expect(SpreadsheetRange.fromJson(range.toJson())).toStrictEqual(range);
}
