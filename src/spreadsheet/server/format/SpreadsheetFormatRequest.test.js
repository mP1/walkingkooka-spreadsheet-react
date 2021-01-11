import LocalDateTime from "../../../datetime/LocalDateTime.js";
import SpreadsheetDateFormatPattern from "../../format/SpreadsheetDateFormatPattern.js";
import SpreadsheetFormatRequest from "./SpreadsheetFormatRequest.js";
import SystemObject from "../../../SystemObject.js";
import systemObjectTesting from "../../../SystemObjectTesting.js";

function value() {
    return LocalDateTime.fromJson("2000/12/31 12:58:59");
}

function pattern() {
    return SpreadsheetDateFormatPattern.fromJson("YYYY-MM-DD HH-MM-SS");
}

function formatRequest() {
    return new SpreadsheetFormatRequest(value(), pattern());
}

systemObjectTesting(
    formatRequest(),
    new SpreadsheetFormatRequest(
        LocalDateTime.fromJson("1999-12-31 12:58:59"),
        SpreadsheetDateFormatPattern.fromJson("HH-MM-SS YYYY-MM-DD")
    ),
    SpreadsheetFormatRequest.fromJson,
    "Missing json",
    "spreadsheet-format-request",
    {
        value: value().toJsonWithType(),
        pattern: pattern().toJsonWithType(),
    }
);

// create ..............................................................................................................

test("create missing undefined value fails", () => {
    expect(
        () => new SpreadsheetFormatRequest(undefined, pattern())
    ).toThrow("Missing value");
});

test("create missing null value fails", () => {
    expect(
        () => new SpreadsheetFormatRequest(null, pattern())
    ).toThrow("Missing value");
});

test("create missing undefined pattern fails", () => {
    expect(
        () => new SpreadsheetFormatRequest(value(), undefined)
    ).toThrow("Missing pattern");
});

test("create missing null pattern fails", () => {
    expect(
        () => new SpreadsheetFormatRequest(value(), null)
    ).toThrow("Missing pattern");
});

test("create value & pattern", () => {
    const v = value();
    const p = pattern();
    check(new SpreadsheetFormatRequest(v, p),
        v,
        p);
});

test("create empty string value & pattern", () => {
    const v = "";
    const p = pattern();
    check(new SpreadsheetFormatRequest(v, p),
        v,
        p);
});

test("create number 0 value & pattern", () => {
    const v = 0;
    const p = pattern();
    check(new SpreadsheetFormatRequest(v, p),
        v,
        p);
});

// fromJson.............................................................................................................

test("fromJson string value", () => {
    const v = "string-123";
    const p = pattern();

    const formatRequest = SpreadsheetFormatRequest.fromJson(
        {
            value: {
                type: "string",
                value: v,
            },
            pattern: p.toJsonWithType(),
        }
    );

    check(formatRequest, v, p);
});

// toJson...............................................................................................................

test("toJson", () => {
    const v = value();
    const p = pattern();

    expect(new SpreadsheetFormatRequest(v, p)
        .toJson())
        .toStrictEqual(
            {
                value: v.toJsonWithType(),
                pattern: p.toJsonWithType(),
            }
        );
});

test("toJson string value", () => {
    const v = "string-123";
    const p = pattern();

    expect(new SpreadsheetFormatRequest(v, p)
        .toJson())
        .toStrictEqual(
            {
                value: SystemObject.toJsonWithType(v),
                pattern: p.toJsonWithType(),
            }
        );
});

// toJsonWithType.......................................................................................................

test("toJson", () => {
    const v = value();
    const p = pattern();

    expect(new SpreadsheetFormatRequest(v, p)
        .toJsonWithType())
        .toStrictEqual({
            type: "spreadsheet-format-request",
            value: {
                value: v.toJsonWithType(),
                pattern: p.toJsonWithType(),
            }
        });
});

// equals...............................................................................................................

test("equals different value false", () => {
    expect(formatRequest()
        .equals(new SpreadsheetFormatRequest(LocalDateTime.fromJson("1999-12-31 12:58:59"), pattern())))
        .toBeFalse();
});

test("equals different pattern false", () => {
    expect(formatRequest()
        .equals(new SpreadsheetFormatRequest(value(), SpreadsheetDateFormatPattern.fromJson("dd/mmm/yyyy"))))
        .toBeFalse();
});

// helpers..............................................................................................................

function check(formatRequest, value, pattern) {
    expect(formatRequest.value()).toStrictEqual(value);
    expect(formatRequest.pattern()).toStrictEqual(pattern);
}