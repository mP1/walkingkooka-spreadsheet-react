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

test("valueOf missing name fails", () => {
    expect(() => ExpressionNumberKind.valueOf().toThrow("Missing name"));
});

test("valueOf invalid name fails", () => {
    expect(() => ExpressionNumberKind.valueOf("!invalid").toThrow("Unknown name: !invalid"));
});

test("valueOf BIG_DECIMAL", () => {
    expect(ExpressionNumberKind.valueOf("BIG_DECIMAL")).toStrictEqual(ExpressionNumberKind.BIG_DECIMAL);
});

test("valueOf DOUBLE", () => {
    expect(ExpressionNumberKind.valueOf("DOUBLE")).toStrictEqual(ExpressionNumberKind.DOUBLE);
});

test("fromJson DOUBLE", () => {
    expect(ExpressionNumberKind.fromJson("DOUBLE")).toStrictEqual(ExpressionNumberKind.DOUBLE);
});

test("toJson DOUBLE", () => {
    expect(ExpressionNumberKind.valueOf("DOUBLE").toJson()).toStrictEqual("DOUBLE");
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
    expect(ExpressionNumberKind.valueOf("DOUBLE").toString()).toStrictEqual("DOUBLE");
});

