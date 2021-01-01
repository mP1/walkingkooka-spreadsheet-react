import SpreadsheetError from "./SpreadsheetError";
import systemObjectTesting from "../SystemObjectTesting.js";

const message = "spreadsheetError-123-abc";

function error() {
    return new SpreadsheetError(message);
}

systemObjectTesting(
    new SpreadsheetError(message),
    new SpreadsheetError("different"),
    SpreadsheetError.fromJson,
    "Missing message",
    "spreadsheet-error",
    message
);

// create................................................................................................................

test("create without message fails", () => {
    expect(() => new SpreadsheetError(null)).toThrow("Missing message");
});

test("create with non string fails", () => {
    expect(() => new SpreadsheetError(1.5)).toThrow("Expected string got 1.5");
});

test("create", () => {
    const spreadsheetError = new SpreadsheetError(message);
    expect(spreadsheetError.message()).toBe(message);
});

// equals...............................................................................................................

test("equals equivalent true", () => {
    const e = error();
    expect(e.equals(e)).toBeTrue();
});

test("equals equivalent true #2", () => {
    const message = "different";
    const e = new SpreadsheetError(message);
    expect(e.equals(new SpreadsheetError(message))).toBeTrue();
});

// helpers..............................................................................................................

function check(spreadsheetError, message) {
    expect(spreadsheetError.message()).toStrictEqual(message);
    expect(spreadsheetError.message()).toBeString();

    expect(spreadsheetError.toJson()).toStrictEqual(message);
    expect(spreadsheetError.toString()).toBe(message);
    expect(SpreadsheetError.fromJson(spreadsheetError.toJson())).toStrictEqual(spreadsheetError);
}
