import SpreadsheetError from "./SpreadsheetError";
import SpreadsheetErrorKind from "./SpreadsheetErrorKind.js";
import systemObjectTesting from "../SystemObjectTesting.js";

const KIND = SpreadsheetErrorKind.DIV0;
const MESSAGE = "spreadsheetError-123-abc";
const VALUE = "xyz123";

function error() {
    return new SpreadsheetError(KIND, MESSAGE, VALUE);
}

systemObjectTesting(
    new SpreadsheetError(KIND, MESSAGE, VALUE),
    new SpreadsheetError(KIND, "different", VALUE),
    SpreadsheetError.fromJson,
    "Missing json",
    "spreadsheet-error",
    {
        "kind": KIND.toJson(),
        "message": MESSAGE,
        "value": VALUE
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
    const spreadsheetError = new SpreadsheetError(KIND, MESSAGE, VALUE);
    expect(spreadsheetError.kind()).toBe(KIND);
    expect(spreadsheetError.message()).toBe(MESSAGE);
    expect(spreadsheetError.value()).toBe(VALUE);
});

// equals...............................................................................................................

test("equals equivalent true", () => {
    const e = error();
    expect(e.equals(e)).toBeTrue();
});

test("equals equivalent true #2", () => {
    const message = "different";
    const e = new SpreadsheetError(KIND, message, VALUE);
    expect(e.equals(new SpreadsheetError(KIND, message, VALUE))).toBeTrue();
});
