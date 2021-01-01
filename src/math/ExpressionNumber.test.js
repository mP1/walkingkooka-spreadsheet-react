import ExpressionNumber from "./ExpressionNumber";

const text = "1.5";

function expressionNumber() {
    return new ExpressionNumber(text);
}

test("create without text fails", () => {
    expect(() => new ExpressionNumber(null)).toThrow("Missing text");
});

test("create empty text fails", () => {
    expect(() => new ExpressionNumber(null)).toThrow("Missing text");
});

test("create with non string text fails", () => {
    expect(() => new ExpressionNumber(1.5)).toThrow("Expected string got 1.5");
});

test("create", () => {
    const expressionNumber = new ExpressionNumber(text);
    expect(expressionNumber.text()).toBe(text);
});

// fromJson.............................................................................................................

test("fromJson undefined", () => {
    expect(() => ExpressionNumber.fromJson()).toThrow("Missing text");
});

test("fromJson null", () => {
    expect(() => ExpressionNumber.fromJson(null)).toThrow("Missing text");
});

test("fromJson empty string", () => {
    expect(() => ExpressionNumber.fromJson(null)).toThrow("Missing text");
});

test("fromJson string", () => {
    const text = "2000-01-01 12:58:59";
    check(ExpressionNumber.fromJson(text), text);
});

// toJson...............................................................................................................

test("json", () => {
    const expressionNumber = new ExpressionNumber(text);

    check(expressionNumber, text);
});

// equals...............................................................................................................

test("equals undefined false", () => {
    const e = expressionNumber();
    expect(e.equals()).toBeFalse();
});

test("equals null false", () => {
    const e = expressionNumber();
    expect(e.equals(null)).toBeFalse();
});

test("equals different type false", () => {
    const e = expressionNumber();
    expect(e.equals("different")).toBeFalse();
});

test("equals self true", () => {
    const e = expressionNumber();
    expect(e.equals(e)).toBeTrue();
});

test("equals different false", () => {
    const e = expressionNumber();
    expect(e.equals(new ExpressionNumber("different"))).toBeFalse();
});

test("equals equivalent true", () => {
    const e = expressionNumber();
    expect(e.equals(e)).toBeTrue();
});

test("equals equivalent true #2", () => {
    const text = "different";
    const e = new ExpressionNumber(text);
    expect(e.equals(new ExpressionNumber(text))).toBeTrue();
});

// helpers..............................................................................................................

function check(expressionNumber, text) {
    expect(expressionNumber.text()).toStrictEqual(text);
    expect(expressionNumber.text()).toBeString();

    expect(expressionNumber.toJson()).toStrictEqual(text);
    expect(expressionNumber.toString()).toBe(text);
    expect(ExpressionNumber.fromJson(expressionNumber.toJson())).toStrictEqual(expressionNumber);
}
