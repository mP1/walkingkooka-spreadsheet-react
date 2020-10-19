import SpreadsheetError from "./SpreadsheetError";

const message = "spreadsheetError-123-abc";

test("create without message fails", () => {
    expect(() => new SpreadsheetError(null)).toThrow("message missing");
});

test("create with non string fails", () => {
    expect(() => new SpreadsheetError(1.5)).toThrow("Expected string got 1.5");
});

test("create", () => {
    const spreadsheetError = new SpreadsheetError(message);
    expect(spreadsheetError.message()).toBe(message);
});

test("fromJson null", () => {
    expect(SpreadsheetError.fromJson(null)).toBeNull();
});

test("json", () => {
    const spreadsheetError = new SpreadsheetError(message);

    check(spreadsheetError, message);
});

// helpers..............................................................................................................

function check(spreadsheetError, message) {
    expect(spreadsheetError.message()).toStrictEqual(message);
    expect(spreadsheetError.toJson()).toStrictEqual(message);
    expect(spreadsheetError.toString()).toBe(message);
    expect(SpreadsheetError.fromJson(spreadsheetError.toJson())).toStrictEqual(spreadsheetError);
}
