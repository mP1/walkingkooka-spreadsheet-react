import FormatRequest from "./FormatRequest.js";
import LocalDateTime from "../../../datetime/LocalDateTime.js";
import SpreadsheetDateFormatPattern from "../../format/SpreadsheetDateFormatPattern.js";

function value() {
    return LocalDateTime.fromJson("2000/12/31 12:58:59");
}

function pattern() {
    return SpreadsheetDateFormatPattern.fromJson("YYYY-MM-DD HH-MM-SS");
}

function formatRequest() {
    return new FormatRequest(value(), pattern());
}

test("create missing undefined value fails", () => {
    expect(
        () => new FormatRequest(undefined, pattern())
    ).toThrow("Missing value");
});

test("create missing null value fails", () => {
    expect(
        () => new FormatRequest(null, pattern())
    ).toThrow("Missing value");
});

test("create missing undefined pattern fails", () => {
    expect(
        () => new FormatRequest(value(), undefined)
    ).toThrow("Missing pattern");
});

test("create missing null pattern fails", () => {
    expect(
        () => new FormatRequest(value(), null)
    ).toThrow("Missing pattern");
});

test("create invalid pattern type fails", () => {
    const p = "invalid pattern";
    expect(
        () => new FormatRequest(value(), p)
    ).toThrow("Expected SpreadsheetPattern pattern got " + p);
});

test("create value & pattern", () => {
    const v = value();
    const p = pattern();
    check(new FormatRequest(v, p),
        v,
        p);
});

test("create empty string value & pattern", () => {
    const v = "";
    const p = pattern();
    check(new FormatRequest(v, p),
        v,
        p);
});

test("create number 0 value & pattern", () => {
    const v = 0;
    const p = pattern();
    check(new FormatRequest(v, p),
        v,
        p);
});

// fromJson.............................................................................................................

test("fromJson undefined fails", () => {
    expect(() => FormatRequest.fromJson(undefined)).toThrow("Missing json");
});

test("fromJson null fails", () => {
    expect(() => FormatRequest.fromJson(null)).toThrow("Missing json");
});

test("fromJson non object fails", () => {
    expect(() => FormatRequest.fromJson("invalid!")).toThrow("Expected object got invalid!");
});

test("fromJson", () => {
    const v = value();
    const p = pattern();

    const formatRequest = FormatRequest.fromJson({
        value: v.toJsonWithType(),
        pattern: p.toJsonWithType(),
    });

    check(formatRequest, v, p);
});

test("fromJson string value", () => {
    const v = "string-123";
    const p = pattern();

    const formatRequest = FormatRequest.fromJson({
        value: {
            type: "string",
            value: v,
        },
        pattern: p.toJsonWithType(),
    });

    check(formatRequest, v, p);
});

// toJson...............................................................................................................

test("toJson", () => {
    const v = value();
    const p = pattern();

    expect(new FormatRequest(v, p)
        .toJson())
        .toStrictEqual({
            value: v.toJsonWithType(),
            pattern: p.toJsonWithType(),
        });
});

// toJsonWithType.......................................................................................................

test("toJson", () => {
    const v = value();
    const p = pattern();

    expect(new FormatRequest(v, p)
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

test("equals undefined false", () => {
    expect(formatRequest()
        .equals())
        .toBeFalse();
});

test("equals null false", () => {
    expect(formatRequest()
        .equals(null))
        .toBeFalse();
});

test("equals different type false", () => {
    expect(formatRequest()
        .equals("different"))
        .toBeFalse();
});

test("equals self true", () => {
    const f = formatRequest();
    expect(f.equals(f))
        .toBeTrue();
});

test("equals different value false", () => {
    expect(formatRequest()
        .equals(new FormatRequest(LocalDateTime.fromJson("1999-12-31 12:58:59"), pattern())))
        .toBeFalse();
});

test("equals different pattern false", () => {
    expect(formatRequest()
        .equals(new FormatRequest(value(), SpreadsheetDateFormatPattern.fromJson("dd/mmm/yyyy"))))
        .toBeFalse();
});

// helpers..............................................................................................................

function check(formatRequest, value, pattern) {
    expect(formatRequest.value()).toStrictEqual(value);
    expect(formatRequest.pattern()).toStrictEqual(pattern);
}