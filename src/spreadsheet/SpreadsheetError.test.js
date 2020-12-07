import SpreadsheetError from "./SpreadsheetError";

const message = "spreadsheetError-123-abc";

function error() {
    return new SpreadsheetError(message);
}

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

test("fromJson null", () => {
    expect(SpreadsheetError.fromJson(null)).toBeNull();
});

test("json", () => {
    const spreadsheetError = new SpreadsheetError(message);

    check(spreadsheetError, message);
});

// equals...............................................................................................................

test("equals undefined false", () => {
    const e = error();
    expect(e.equals()).toBeFalse();
});

test("equals null false", () => {
    const e = error();
    expect(e.equals(null)).toBeFalse();
});

test("equals different type false", () => {
    const e = error();
    expect(e.equals("different")).toBeFalse();
});

test("equals self true", () => {
    const e = error();
    expect(e.equals(e)).toBeTrue();
});

test("equals different false", () => {
    const e = error();
    expect(e.equals(new SpreadsheetError("different"))).toBeFalse();
});

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
