import SpreadsheetName from "./SpreadsheetName";
import systemObjectTesting from "../SystemObjectTesting.js";

const value = "spreadsheetName-123-abc";

systemObjectTesting(
    new SpreadsheetName(value),
    new SpreadsheetName("different"),
    SpreadsheetName.fromJson,
    "Missing value",
    "spreadsheet-name",
    value
);

// create...............................................................................................................

test("create without value fails", () => {
    expect(() => new SpreadsheetName(null)).toThrow("Missing value");
});

test("create with non string fails", () => {
    expect(() => new SpreadsheetName(1.5)).toThrow("Expected string value got 1.5");
});

test("create with empty string fails", () => {
    expect(() => new SpreadsheetName("")).toThrow("Missing value");
});

test("create", () => {
    const spreadsheetName = new SpreadsheetName(value);
    expect(spreadsheetName.value()).toBe(value);
});

// equals...............................................................................................................

test("equals self true", () => {
    const spreadsheetName = new SpreadsheetName(value);
    expect(spreadsheetName.equals(new SpreadsheetName(value))).toBeTrue();
});

