import SpreadsheetError from "./SpreadsheetError";
import systemObjectTesting from "../SystemObjectTesting.js";
import SpreadsheetErrorKind from "./SpreadsheetErrorKind.js";

const KIND = SpreadsheetErrorKind.DIV0;
const MESSAGE = "spreadsheetError-123-abc";

function error() {
    return new SpreadsheetError(KIND, MESSAGE);
}

systemObjectTesting(
    new SpreadsheetError(KIND, MESSAGE),
    new SpreadsheetError(KIND, "different"),
    SpreadsheetError.fromJson,
    "Missing json",
    "spreadsheet-error",
    {
        "kind": KIND.toJson(),
        "message": MESSAGE,
    }
);

// create................................................................................................................

test("create without kind fails", () => {
    expect(() => new SpreadsheetError(null, MESSAGE)).toThrow("Missing kind");
});

test("create without message fails", () => {
    expect(() => new SpreadsheetError(KIND, null)).toThrow("Missing message");
});

test("create with non string fails", () => {
    expect(() => new SpreadsheetError(KIND, 1.5)).toThrow("Expected string message got 1.5");
});

test("create", () => {
    const spreadsheetError = new SpreadsheetError(KIND, MESSAGE);
    expect(spreadsheetError.kind()).toBe(KIND);
    expect(spreadsheetError.message()).toBe(MESSAGE);
});

// equals...............................................................................................................

test("equals equivalent true", () => {
    const e = error();
    expect(e.equals(e)).toBeTrue();
});

test("equals equivalent true #2", () => {
    const message = "different";
    const e = new SpreadsheetError(KIND, message);
    expect(e.equals(new SpreadsheetError(KIND, message))).toBeTrue();
});

// helpers..............................................................................................................

function check(spreadsheetError, kind, message) {
    expect(spreadsheetError.message()).toStrictEqual(message);
    expect(spreadsheetError.kind()).toStrictEqual(kind);
    expect(spreadsheetError.message()).toBeString();

    expect(spreadsheetError.toJson()).toStrictEqual(message);
    expect(spreadsheetError.toString()).toBe(kind + " " + message);
    expect(SpreadsheetError.fromJson(spreadsheetError.toJson())).toStrictEqual(spreadsheetError);
}
