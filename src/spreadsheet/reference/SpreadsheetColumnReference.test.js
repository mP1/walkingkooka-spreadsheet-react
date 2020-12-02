import SpreadsheetColumnReference from "./SpreadsheetColumnReference";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";
import SpreadsheetRowReference from "./SpreadsheetRowReference";

test("parse missing text fails", () => {
    expect(() => SpreadsheetColumnReference.parse()).toThrow("Missing text");
});

test("parse of invalid text fails", () => {
    expect(() => SpreadsheetColumnReference.parse(true)).toThrow("Expected string got true");
});

test("parse ABSOLUTE", () => {
    expect(SpreadsheetColumnReference.parse("$B")).toStrictEqual(new SpreadsheetColumnReference(1, SpreadsheetReferenceKind.ABSOLUTE));
});

test("parse RELATIVE", () => {
    expect(SpreadsheetColumnReference.parse("C")).toStrictEqual(new SpreadsheetColumnReference(2, SpreadsheetReferenceKind.RELATIVE));
});

test("parse RELATIVE AB", () => {
    expect(SpreadsheetColumnReference.parse("AB")).toStrictEqual(new SpreadsheetColumnReference(26 + 1, SpreadsheetReferenceKind.RELATIVE));
});

test("new < 0 fails", () => {
    expect(() => new SpreadsheetColumnReference(-1, SpreadsheetReferenceKind.RELATIVE)).toThrow("Invalid value not between 0 and 16384 got -1");
});

test("new > MAX fails", () => {
    expect(() => new SpreadsheetColumnReference(SpreadsheetColumnReference.MAX, SpreadsheetReferenceKind.RELATIVE)).toThrow("Invalid value not between 0 and 16384 got 16384");
});

test("new missing kind fails", () => {
    expect(() => new SpreadsheetColumnReference(0)).toThrow("Missing kind");
});

test("invalid kind fails", () => {
    expect(() => new SpreadsheetColumnReference(0, "!invalid")).toThrow("Expected SpreadsheetReferenceKind kind got !invalid");
});

test("new RELATIVE", () => {
    check(new SpreadsheetColumnReference(2, SpreadsheetReferenceKind.RELATIVE),
        2,
        SpreadsheetReferenceKind.RELATIVE,
        "C");
});

test("new ABSOLUTE", () => {
    check(new SpreadsheetColumnReference(1, SpreadsheetReferenceKind.ABSOLUTE),
        1,
        SpreadsheetReferenceKind.ABSOLUTE,
        "$B");
});

// setKind..............................................................................................................

test("set missing kind fails", () => {
    expect(() => new SpreadsheetColumnReference(0, SpreadsheetReferenceKind.RELATIVE).setKind()).toThrow("Missing kind");
});

test("set invalid kind fails", () => {
    expect(() => new SpreadsheetColumnReference(0, SpreadsheetReferenceKind.RELATIVE).setKind("!invalid")).toThrow("Expected SpreadsheetReferenceKind kind got !invalid");
});

test("set same kind ABSOLUTE", () => {
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    const reference = new SpreadsheetColumnReference(2, kind);
    expect(reference.setKind(kind)).toStrictEqual(reference);
});

test("set same kind RELATIVE", () => {
    const kind = SpreadsheetReferenceKind.RELATIVE;
    const reference = new SpreadsheetColumnReference(2, kind);
    expect(reference.setKind(kind)).toStrictEqual(reference);
});

test("set different kind ABSOLUTE", () => {
    const reference = new SpreadsheetColumnReference(2, SpreadsheetReferenceKind.RELATIVE);
    expect(reference.setKind(SpreadsheetReferenceKind.ABSOLUTE)).toStrictEqual(new SpreadsheetColumnReference(2, SpreadsheetReferenceKind.ABSOLUTE));
});

test("set different kind RELATIVE", () => {
    const reference = new SpreadsheetColumnReference(2, SpreadsheetReferenceKind.ABSOLUTE);
    expect(reference.setKind(SpreadsheetReferenceKind.RELATIVE)).toStrictEqual(new SpreadsheetColumnReference(2, SpreadsheetReferenceKind.RELATIVE));
});

// setValue..............................................................................................................

test("set missing value fails", () => {
    expect(() => new SpreadsheetColumnReference(undefined, SpreadsheetReferenceKind.RELATIVE).setValue()).toThrow("Expected number value got undefined");
});

test("set invalid value fails", () => {
    expect(() => new SpreadsheetColumnReference("!invalid", SpreadsheetReferenceKind.RELATIVE).setValue("!invalid")).toThrow("Expected number value got !invalid");
});

test("set same value", () => {
    const value = 2;
    const reference = new SpreadsheetColumnReference(value, SpreadsheetReferenceKind.ABSOLUTE);
    expect(reference.setValue(value)).toStrictEqual(reference);
});

test("set different value ABSOLUTE", () => {
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    const value = 2;
    const reference = new SpreadsheetColumnReference(value, kind);
    expect(reference.setValue(value)).toStrictEqual(new SpreadsheetColumnReference(value, kind));
});

test("set different value RELATIVE", () => {
    const kind = SpreadsheetReferenceKind.RELATIVE;
    const value = 2;
    const reference = new SpreadsheetColumnReference(value, kind);
    expect(reference.setValue(value)).toStrictEqual(new SpreadsheetColumnReference(value, kind));
});

// add..............................................................................................................

test("add missing value fails", () => {
    expect(() => new SpreadsheetColumnReference(1, SpreadsheetReferenceKind.RELATIVE).add()).toThrow("Expected number delta got undefined");
});

test("add invalid value fails", () => {
    expect(() => new SpreadsheetColumnReference(1, SpreadsheetReferenceKind.RELATIVE).add("!invalid")).toThrow("Expected number delta got !invalid");
});

test("add same value", () => {
    const value = 2;
    const reference = new SpreadsheetColumnReference(value, SpreadsheetReferenceKind.ABSOLUTE);
    expect(reference.add(0)).toStrictEqual(reference);
});

test("add non zero value ABSOLUTE", () => {
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    const value = 2;
    const delta = 100;
    const reference = new SpreadsheetColumnReference(value, kind);
    expect(reference.add(delta)).toStrictEqual(new SpreadsheetColumnReference(value + delta, kind));
});

test("add non zero value RELATIVE", () => {
    const kind = SpreadsheetReferenceKind.RELATIVE;
    const value = 2;
    const delta = 100;
    const reference = new SpreadsheetColumnReference(value, kind);
    expect(reference.add(delta)).toStrictEqual(new SpreadsheetColumnReference(value + delta, kind));
});

// toJson...............................................................................................................

test("toJson B", () => {
    expect(SpreadsheetColumnReference.parse("B").toJson()).toStrictEqual("B");
});

test("toJson C", () => {
    expect(SpreadsheetColumnReference.parse("C").toJson()).toStrictEqual("C");
});

// equals................................................................................................................

test("equals undefined false", () => {
    expect(SpreadsheetColumnReference.parse("C").equals()).toStrictEqual(false);
});

test("equals null false", () => {
    expect(SpreadsheetColumnReference.parse("D").equals(null)).toStrictEqual(false);
});

test("equals invalid false", () => {
    expect(SpreadsheetColumnReference.parse("E").equals("!invalid")).toStrictEqual(false);
});

test("equals SpreadsheetColumnReference false", () => {
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    expect(new SpreadsheetColumnReference(1, kind).equals(new SpreadsheetRowReference(1, kind))).toStrictEqual(false);
});

test("equals different value false", () => {
    expect(SpreadsheetColumnReference.parse("F").equals(SpreadsheetColumnReference.parse("G"))).toStrictEqual(false);
});

test("equals different kind false", () => {
    expect(SpreadsheetColumnReference.parse("$F").equals(SpreadsheetColumnReference.parse("G"))).toStrictEqual(false);
});

test("equals H true", () => {
    expect(SpreadsheetColumnReference.parse("H").equals(SpreadsheetColumnReference.parse("H"))).toStrictEqual(true);
});

test("equals I true", () => {
    expect(SpreadsheetColumnReference.parse("I").equals(SpreadsheetColumnReference.parse("I"))).toStrictEqual(true);
});

// toString.............................................................................................................

test("toStringAbsolute", () => {
    expect(new SpreadsheetColumnReference(0, SpreadsheetReferenceKind.ABSOLUTE).toString()).toStrictEqual("$A");
});

test("toStringAbsoluteAB", () => {
    expect(new SpreadsheetColumnReference((1 * 26) + 1, SpreadsheetReferenceKind.RELATIVE).toString()).toStrictEqual("AB");
});

test("toStringAbsoluteAYM", () => {
    expect(new SpreadsheetColumnReference((1 * 26 * 26) + (25 * 26) + 12, SpreadsheetReferenceKind.ABSOLUTE).toString()).toStrictEqual("$AYM");
});

test("toStringRelative", () => {
    expect(new SpreadsheetColumnReference(1, SpreadsheetReferenceKind.RELATIVE).toString()).toStrictEqual("B");
});

function check(reference, value, kind, json) {
    expect(reference.kind()).toStrictEqual(kind);
    expect(reference.kind()).toBeInstanceOf(SpreadsheetReferenceKind);

    expect(reference.value()).toStrictEqual(value);
    expect(reference.value()).toBeNumber();

    expect(reference.toJson()).toStrictEqual(json);
    expect(SpreadsheetColumnReference.parse(json)).toStrictEqual(reference);

    expect(reference.toString()).toStrictEqual(json);
}

