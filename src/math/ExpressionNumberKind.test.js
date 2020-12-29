import ExpressionNumberKind from "./ExpressionNumberKind";

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

test("fromJson", () => {
    expect(ExpressionNumberKind.fromJson("DOUBLE")).toStrictEqual(ExpressionNumberKind.DOUBLE);
});

test("toJson", () => {
    expect(ExpressionNumberKind.of("DOUBLE").toJson()).toStrictEqual("DOUBLE");
});

// equals................................................................................................................

test("equals undefined false", () => {
    expect(ExpressionNumberKind.of("DOUBLE").equals()).toStrictEqual(false);
});

test("equals null false", () => {
    expect(ExpressionNumberKind.of("DOUBLE").equals(null)).toStrictEqual(false);
});

test("equals invalid false", () => {
    expect(ExpressionNumberKind.of("DOUBLE").equals("!invalid")).toStrictEqual(false);
});

test("equals different false", () => {
    expect(ExpressionNumberKind.DOUBLE.equals(ExpressionNumberKind.BIG_DECIMAL)).toStrictEqual(false);
});

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

