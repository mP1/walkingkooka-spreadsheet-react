import SpreadsheetRowReference from "./SpreadsheetRowReference";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";

test("parse missing text fails", () => {
    expect(() => SpreadsheetRowReference.parse()).toThrow("Missing text");
});

test("parse of invalid text fails", () => {
    expect(() => SpreadsheetRowReference.parse(true)).toThrow("Expected string got true");
});

test("parse ABSOLUTE", () => {
    expect(SpreadsheetRowReference.parse("$2")).toStrictEqual(new SpreadsheetRowReference(1, SpreadsheetReferenceKind.ABSOLUTE));
});

test("parse RELATIVE", () => {
    expect(SpreadsheetRowReference.parse("3")).toStrictEqual(new SpreadsheetRowReference(2, SpreadsheetReferenceKind.RELATIVE));
});

test("new < 0 fails", () => {
    expect(() => new SpreadsheetRowReference(-1, SpreadsheetReferenceKind.RELATIVE)).toThrow("Invalid value not between 0 and 1048576 got -1");
});

test("new > MAX fails", () => {
    expect(() => new SpreadsheetRowReference(SpreadsheetRowReference.MAX, SpreadsheetReferenceKind.RELATIVE)).toThrow("Invalid value not between 0 and 1048576 got 1048576");
});

test("new missing kind fails", () => {
    expect(() => new SpreadsheetRowReference(0)).toThrow("Missing kind");
});

test("invalid kind fails", () => {
    expect(() => new SpreadsheetRowReference(0, "!invalid")).toThrow("Expected SpreadsheetReferenceKind kind got !invalid");
});

test("new RELATIVE", () => {
    check(new SpreadsheetRowReference(2, SpreadsheetReferenceKind.RELATIVE),
        2,
        SpreadsheetReferenceKind.RELATIVE,
        "3");
});

test("new ABSOLUTE", () => {
    check(new SpreadsheetRowReference(2, SpreadsheetReferenceKind.ABSOLUTE),
        2,
        SpreadsheetReferenceKind.ABSOLUTE,
        "$3");
});

test("toJson ABSOLUTE", () => {
    expect(new SpreadsheetRowReference(2, SpreadsheetReferenceKind.ABSOLUTE).toJson()).toStrictEqual("$3");
});

test("toJson RELATIVE", () => {
    expect(new SpreadsheetRowReference(3, SpreadsheetReferenceKind.RELATIVE).toJson()).toStrictEqual("4");
});

test("toStringAbsolute", () => {
    expect(new SpreadsheetRowReference(0, SpreadsheetReferenceKind.ABSOLUTE).toString()).toStrictEqual("$1");
});

test("toStringAbsolute99", () => {
    expect(new SpreadsheetRowReference(98, SpreadsheetReferenceKind.ABSOLUTE).toString()).toStrictEqual("$99");
});

test("toStringRelative", () => {
    expect(new SpreadsheetRowReference(1, SpreadsheetReferenceKind.RELATIVE).toString()).toStrictEqual("2");
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

