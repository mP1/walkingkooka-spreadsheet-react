import SpreadsheetName from "./SpreadsheetName";

const value = "spreadsheetName-123-abc";

test("create without value fails", () => {
    expect(() => new SpreadsheetName(null)).toThrow("Missing value");
});

test("create with non string fails", () => {
    expect(() => new SpreadsheetName(1.5)).toThrow("Expected string got 1.5");
});

test("create", () => {
    const spreadsheetName = new SpreadsheetName(value);
    expect(spreadsheetName.value()).toBe(value);
});

test("fromJson null", () => {
    expect(() => SpreadsheetName.fromJson(null)).toThrow("Missing value");
});

test("json", () => {
    const spreadsheetName = new SpreadsheetName(value);

    check(spreadsheetName, value);
});

// helpers..............................................................................................................

function check(spreadsheetName, value) {
    expect(spreadsheetName.value()).toStrictEqual(value);
    expect(spreadsheetName.value()).toBeString();

    expect(spreadsheetName.toJson()).toStrictEqual(value);
    expect(spreadsheetName.toString()).toBe(value);
    expect(SpreadsheetName.fromJson(spreadsheetName.toJson())).toStrictEqual(spreadsheetName);
}
