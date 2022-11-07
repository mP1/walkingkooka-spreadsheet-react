import SpreadsheetDateParsePattern from "../../format/SpreadsheetDateParsePattern.js";
import SpreadsheetDateTimeParsePattern from "../../format/SpreadsheetDateTimeParsePattern.js";
import SpreadsheetParseRequest from "./SpreadsheetParseRequest.js";
import systemObjectTesting from "../../../SystemObjectTesting.js";

function text() {
    return "2000/12/31"
}

function parser() {
    return SpreadsheetDateParsePattern.TYPE_NAME;
}

function parseRequest() {
    return new SpreadsheetParseRequest(text(), parser());
}

systemObjectTesting(
    parseRequest(),
    new SpreadsheetParseRequest(
        "different",
        SpreadsheetDateTimeParsePattern.TYPE_NAME
    ),
    SpreadsheetParseRequest.fromJson,
    "Missing json",
    "spreadsheet-parse-request",
    {
        text: text(),
        parser: parser(),
    }
);

// create ..............................................................................................................

test("create missing undefined text fails", () => {
    expect(
        () => new SpreadsheetParseRequest(undefined, parser())
    ).toThrow("Missing text");
});

test("create missing null text fails", () => {
    expect(
        () => new SpreadsheetParseRequest(null, parser())
    ).toThrow("Missing text");
});

test("create missing empty text fails", () => {
    expect(
        () => new SpreadsheetParseRequest("", parser())
    ).toThrow("Missing text");
});

test("create invalid text fails", () => {
    expect(
        () => new SpreadsheetParseRequest(123, parser())
    ).toThrow("Expected string text got 123");
});

test("create missing undefined parser fails", () => {
    expect(
        () => new SpreadsheetParseRequest(text(), undefined)
    ).toThrow("Missing parser");
});

test("create missing null parser fails", () => {
    expect(
        () => new SpreadsheetParseRequest(text(), null)
    ).toThrow("Missing parser");
});

test("create missing empty parser fails", () => {
    expect(
        () => new SpreadsheetParseRequest(text(), "")
    ).toThrow("Missing parser");
});

test("create invalid parser fails", () => {
    expect(
        () => new SpreadsheetParseRequest(text(), 123)
    ).toThrow("Expected string parser got 123");
});

test("create text & parser", () => {
    const v = text();
    const p = parser();
    check(new SpreadsheetParseRequest(v, p),
        v,
        p);
});

// equals...............................................................................................................

test("equals different text false", () => {
    expect(parseRequest()
        .equals(new SpreadsheetParseRequest("different", parser())))
        .toBeFalse();
});

test("equals different different false", () => {
    expect(parseRequest()
        .equals(new SpreadsheetParseRequest(text(), SpreadsheetDateTimeParsePattern.TYPE_NAME)))
        .toBeFalse();
});

// helpers..............................................................................................................

function check(parseRequest, text, parser) {
    expect(parseRequest.text()).toStrictEqual(text);
    expect(parseRequest.parser()).toStrictEqual(parser);
}