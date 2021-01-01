import ExpressionNumber from "./ExpressionNumber";
import systemObjectTesting from "../SystemObjectTesting.js";

const text = "1.5";

function expressionNumber() {
    return new ExpressionNumber(text);
}

systemObjectTesting(
    expressionNumber(),
    new ExpressionNumber("999"),
    ExpressionNumber.fromJson,
    "Missing text",
    "expression-number",
    text
);

// create...............................................................................................................

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

test("fromJson empty string", () => {
    expect(() => ExpressionNumber.fromJson(null)).toThrow("Missing text");
});

test("fromJson string", () => {
    const text = "2000-01-01 12:58:59";
    check(ExpressionNumber.fromJson(text), text);
});

// equals...............................................................................................................

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
