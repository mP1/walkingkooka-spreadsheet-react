import SpreadsheetRowReference from "./SpreadsheetRowReference";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";

test("parse missing text fails", () => {
    expect(() => SpreadsheetRowReference.parse().toThrow("Missing text"));
});

test("parse of invalid text fails", () => {
    expect(() => SpreadsheetRowReference.parse(true).toThrow("Expected string got true"));
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

test("toStringAbsolute", () => {
    expect(new SpreadsheetRowReference(1, SpreadsheetReferenceKind.ABSOLUTE).toString()).toStrictEqual("$1");
});

test("toStringAbsolute99", () => {
    expect(new SpreadsheetRowReference(99, SpreadsheetReferenceKind.ABSOLUTE).toString()).toStrictEqual("$99");
});

test("toStringRelative", () => {
    const s = new SpreadsheetRowReference(1, SpreadsheetReferenceKind.RELATIVE).toString();

    expect(new SpreadsheetRowReference(1, SpreadsheetReferenceKind.RELATIVE).toString()).toStrictEqual("1");
});

function check(reference, value, kind, json) {
    expect(reference.kind()).toStrictEqual(kind);
    expect(reference.kind()).toBeInstanceOf(SpreadsheetReferenceKind);

    expect(reference.value()).toStrictEqual(value);
    expect(reference.value()).toBeNumber();

    expect(reference.toJson()).toStrictEqual(json);
    expect(SpreadsheetRowReference.parse(json)).toStrictEqual(reference);

    expect(reference.toString()).toStrictEqual(json);
}

