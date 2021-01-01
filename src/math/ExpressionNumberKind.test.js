import ExpressionNumberKind from "./ExpressionNumberKind";
import systemObjectTesting from "../SystemObjectTesting.js";

systemObjectTesting(
    ExpressionNumberKind.BIG_DECIMAL,
    ExpressionNumberKind.DOUBLE,
    ExpressionNumberKind.fromJson,
    "Missing name",
    "expression-number-kind",
    "BIG_DECIMAL"
);

test("of missing name fails", () => {
    expect(() => ExpressionNumberKind.of().toThrow("Missing name"));
});

test("of invalid name fails", () => {
    expect(() => ExpressionNumberKind.of("!invalid").toThrow("Unknown name: !invalid"));
});

test("of BIG_DECIMAL", () => {
    expect(ExpressionNumberKind.of("BIG_DECIMAL")).toStrictEqual(ExpressionNumberKind.BIG_DECIMAL);
});

test("of DOUBLE", () => {
    expect(ExpressionNumberKind.of("DOUBLE")).toStrictEqual(ExpressionNumberKind.DOUBLE);
});

test("fromJson DOUBLE", () => {
    expect(ExpressionNumberKind.fromJson("DOUBLE")).toStrictEqual(ExpressionNumberKind.DOUBLE);
});

test("toJson DOUBLE", () => {
    expect(ExpressionNumberKind.of("DOUBLE").toJson()).toStrictEqual("DOUBLE");
});

// equals................................................................................................................

test("equals DOUBLE true", () => {
    expect(ExpressionNumberKind.BIG_DECIMAL.equals(ExpressionNumberKind.BIG_DECIMAL)).toStrictEqual(true);
});

test("equals DOUBLE true", () => {
    expect(ExpressionNumberKind.DOUBLE.equals(ExpressionNumberKind.DOUBLE)).toStrictEqual(true);
});

// toString.............................................................................................................

test("toString", () => {
    expect(ExpressionNumberKind.of("DOUBLE").toString()).toStrictEqual("DOUBLE");
});

