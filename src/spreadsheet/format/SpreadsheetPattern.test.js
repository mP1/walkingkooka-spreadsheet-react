import SpreadsheetPattern from "./SpreadsheetPattern";

function pattern() {
    return "Hello";
}

function spreadsheetPattern() {
    return new SpreadsheetPattern(pattern());
}

test("create without pattern fails", () => {
    expect(() => new SpreadsheetPattern().toThrow("Missing pattern"));
});

test("create invalid pattern type fails", () => {
    const pattern = 123;
    expect(() => new SpreadsheetPattern(pattern)).toThrow("Expected string pattern got " + pattern);
});

test("create empty pattern", () => {
    const t = "";
    check(new SpreadsheetPattern(t),
        t);
});

test("create pattern", () => {
    const t = pattern();
    check(new SpreadsheetPattern(t),
        t);
});

// parse.............................................................................................................

test("parse undefined fails", () => {
    expect(() => SpreadsheetPattern.parse(undefined)).toThrow("Missing pattern");
});

test("parse null fails", () => {
    expect(() => SpreadsheetPattern.parse(null)).toThrow("Missing pattern");
});

test("parse non string fails", () => {
    expect(() => SpreadsheetPattern.parse(123)).toThrow("Expected string pattern got 123");
});

test("parse pattern", () => {
    const t = pattern();
    const spreadsheetPattern = SpreadsheetPattern.parse(t);
    check(spreadsheetPattern, t);
});

// fromJson.............................................................................................................

test("fromJson undefined fails", () => {
    expect(() => SpreadsheetPattern.fromJson(undefined)).toThrow("Missing pattern");
});

test("fromJson null fails", () => {
    expect(() => SpreadsheetPattern.fromJson(null)).toThrow("Missing pattern");
});

test("fromJson non string fails", () => {
    expect(() => SpreadsheetPattern.fromJson(123)).toThrow("Expected string pattern got 123");
});

test("fromJson pattern", () => {
    const t = pattern();
    const spreadsheetPattern = SpreadsheetPattern.fromJson(t);
    check(spreadsheetPattern, t);
});

// toJson...............................................................................................................

test("toJson", () => {
    const t = pattern();

    expect(new SpreadsheetPattern(t)
        .toJson()).toStrictEqual(t);
});

// equals...............................................................................................................

test("equals undefined false", () => {
    expect(spreadsheetPattern()
        .equals())
        .toBeFalse();
});

test("equals null false", () => {
    expect(spreadsheetPattern()
        .equals(null))
        .toBeFalse();
});

test("equals different type false", () => {
    expect(spreadsheetPattern()
        .equals("different"))
        .toBeFalse();
});

test("equals self true", () => {
    const t = spreadsheetPattern();
    expect(t.equals(t))
        .toBeTrue();
});

test("equals different pattern false", () => {
    expect(spreadsheetPattern()
        .equals(new SpreadsheetPattern("different")))
        .toBeFalse();
});

// helpers..............................................................................................................

function check(spreadsheetPattern, pattern) {
    expect(spreadsheetPattern.pattern()).toStrictEqual(pattern);
}