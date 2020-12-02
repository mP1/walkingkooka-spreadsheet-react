import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";

test("of missing text fails", () => {
    expect(() => SpreadsheetReferenceKind.of().toThrow("Missing text"));
});

test("of invalid text fails", () => {
    expect(() => SpreadsheetReferenceKind.of("!invalid").toThrow("Unknown text: !invalid"));
});

test("of ABSOLUTE", () => {
    expect(SpreadsheetReferenceKind.of("ABSOLUTE")).toStrictEqual(SpreadsheetReferenceKind.ABSOLUTE);
});

test("of RELATIVE", () => {
    expect(SpreadsheetReferenceKind.of("RELATIVE")).toStrictEqual(SpreadsheetReferenceKind.RELATIVE);
});

test("prefix ABSOLUTE", () => {
    expect(SpreadsheetReferenceKind.ABSOLUTE.prefix()).toStrictEqual("$");
});

test("prefix RELATIVE", () => {
    expect(SpreadsheetReferenceKind.RELATIVE.prefix()).toStrictEqual("");
});

test("toJson", () => {
    expect(SpreadsheetReferenceKind.of("RELATIVE").toJson()).toStrictEqual("RELATIVE");
});

// equals................................................................................................................

test("equals undefined false", () => {
    expect(SpreadsheetReferenceKind.of("RELATIVE").equals()).toStrictEqual(false);
});

test("equals null false", () => {
    expect(SpreadsheetReferenceKind.of("RELATIVE").equals(null)).toStrictEqual(false);
});

test("equals invalid false", () => {
    expect(SpreadsheetReferenceKind.of("RELATIVE").equals("!invalid")).toStrictEqual(false);
});

test("equals different false", () => {
    expect(SpreadsheetReferenceKind.RELATIVE.equals(SpreadsheetReferenceKind.ABSOLUTE)).toStrictEqual(false);
});

test("equals RELATIVE true", () => {
    expect(SpreadsheetReferenceKind.ABSOLUTE.equals(SpreadsheetReferenceKind.ABSOLUTE)).toStrictEqual(true);
});

test("equals RELATIVE true", () => {
    expect(SpreadsheetReferenceKind.RELATIVE.equals(SpreadsheetReferenceKind.RELATIVE)).toStrictEqual(true);
});

// toString.............................................................................................................

test("toString", () => {
    expect(SpreadsheetReferenceKind.of("RELATIVE").toString()).toStrictEqual("RELATIVE");
});

