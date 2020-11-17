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

test("toJson", () => {
    expect(SpreadsheetReferenceKind.of("RELATIVE").toJson()).toStrictEqual("RELATIVE");
});

test("toString", () => {
    expect(SpreadsheetReferenceKind.of("RELATIVE").toString()).toStrictEqual("RELATIVE");
});

