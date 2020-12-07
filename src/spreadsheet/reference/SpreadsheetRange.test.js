import SpreadsheetRange from "./SpreadsheetRange";
import SpreadsheetCellReference from "./SpreadsheetCellReference";

function begin() {
    return SpreadsheetCellReference.parse("A1");
}

function end() {
    return SpreadsheetCellReference.parse("B2");
}

test("create without begin fails", () => {
    expect(() => new SpreadsheetRange(null, end())).toThrow("Missing begin");
});

test("create with begin non cell fails", () => {
    expect(() => new SpreadsheetRange(1.5, end())).toThrow("Expected SpreadsheetCellReference begin got 1.5");
});

test("create without end fails", () => {
    expect(() => new SpreadsheetRange(begin(), null)).toThrow("Missing end");
});

test("create with end non cell fails", () => {
    expect(() => new SpreadsheetRange(begin(), true)).toThrow("Expected SpreadsheetCellReference end got true");
});

test("create", () => {
    check(new SpreadsheetRange(begin(), end()), begin(), end(), "A1:B2");
});

test("fromJson null fails", () => {
    expect(() => SpreadsheetRange.fromJson(null)).toThrow("Missing text");
});

test("fromJson wrong token count fails", () => {
    expect(() => SpreadsheetRange.fromJson("A1:B2:C3")).toThrow("Expected 2 tokens got A1:B2:C3");
});

// equals...............................................................................................................

test("equals undefined false", () => {
    const range = SpreadsheetRange.fromJson("A1:B2");
    expect(range.equals()).toBeFalse();
});

test("equals null false", () => {
    const range = SpreadsheetRange.fromJson("A1:B2");
    expect(range.equals(null)).toBeFalse();
});

test("equals different type false", () => {
    const range = SpreadsheetRange.fromJson("A1:B2");
    expect(range.equals("different")).toBeFalse();
});

test("equals self true", () => {
    const range = SpreadsheetRange.fromJson("A1:B2");
    expect(range.equals(range)).toBeTrue();
});

test("equals different false", () => {
    const range = SpreadsheetRange.fromJson("A1:B2");
    expect(range.equals(SpreadsheetRange.fromJson("C3:D4"))).toBeFalse();
});

test("equals equivalent true", () => {
    const range = SpreadsheetRange.fromJson("A1:B2");
    expect(range.equals(SpreadsheetRange.fromJson("A1:B2"))).toBeTrue();
});

test("equals equivalent true #2", () => {
    const range = SpreadsheetRange.fromJson("C3:D4");
    expect(range.equals(SpreadsheetRange.fromJson("C3:D4"))).toBeTrue();
});

// helpers..............................................................................................................

function check(range, begin, end, json) {
    expect(range.begin()).toStrictEqual(begin);
    expect(range.end()).toStrictEqual(end);

    expect(range.begin()).toBeInstanceOf(SpreadsheetCellReference);
    expect(range.end()).toBeInstanceOf(SpreadsheetCellReference);

    expect(range.toJson()).toStrictEqual(json);
    expect(range.toString()).toBe(json);

    expect(SpreadsheetRange.fromJson(range.toJson())).toStrictEqual(range);
    expect(SpreadsheetRange.parse(range.toString())).toStrictEqual(range);
}
