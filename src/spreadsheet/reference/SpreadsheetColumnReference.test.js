import SpreadsheetColumnReference from "./SpreadsheetColumnReference";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";
import SpreadsheetRowReference from "./SpreadsheetRowReference";
import systemObjectTesting from "../../SystemObjectTesting.js";

systemObjectTesting(
    new SpreadsheetColumnReference(0, SpreadsheetReferenceKind.ABSOLUTE),
    new SpreadsheetColumnReference(9, SpreadsheetReferenceKind.RELATIVE),
    SpreadsheetColumnReference.fromJson,
    "Missing text",
    "spreadsheet-column-reference",
    "$A"
);

test("parse missing text fails", () => {
    expect(() => SpreadsheetColumnReference.parse()).toThrow("Missing text");
});

test("parse of invalid text fails", () => {
    expect(() => SpreadsheetColumnReference.parse(true)).toThrow("Expected string text got true");
});

test("parse includes invalid character fails", () => {
    expect(() => SpreadsheetColumnReference.parse("A1"))
        .toThrow("Expected letter between 'A' to 'Z' or 'a' to 'z', got \"1\" at 1 in \"A1\"");
});

test("parse includes invalid character fails #2", () => {
    expect(() => SpreadsheetColumnReference.parse("A!"))
        .toThrow("Expected letter between 'A' to 'Z' or 'a' to 'z', got \"1\" at 1 in \"A!\"");
});

test("parse greater than MAX fails", () => {
    expect(() => SpreadsheetColumnReference.parse("XFE")).toThrow("Invalid value > 16384 got 16385");
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

test("parse XFD", () => {
    expect(SpreadsheetColumnReference.parse("XFD")).toStrictEqual(new SpreadsheetColumnReference(16383, SpreadsheetReferenceKind.RELATIVE));
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

// parse...............................................................................................................

test("parse upper case", () => {
    check(SpreadsheetColumnReference.parse("A"),
        0,
        SpreadsheetReferenceKind.RELATIVE,
        "A");
});

test("parse upper case absolute", () => {
    check(SpreadsheetColumnReference.parse("$B"),
        1,
        SpreadsheetReferenceKind.ABSOLUTE,
        "$B");
});

test("parse lower case", () => {
    check(SpreadsheetColumnReference.parse("c"),
        2,
        SpreadsheetReferenceKind.RELATIVE,
        "C");
});

test("parse lower case absolute", () => {
    check(SpreadsheetColumnReference.parse("$d"),
        3,
        SpreadsheetReferenceKind.ABSOLUTE,
        "$D");
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
    expect(() => new SpreadsheetColumnReference(undefined, SpreadsheetReferenceKind.RELATIVE).setValue()).toThrow("Missing value");
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
    expect(() => new SpreadsheetColumnReference(1, SpreadsheetReferenceKind.RELATIVE).add()).toThrow("Missing delta");
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

// addSaturated.........................................................................................................

test("addSaturated missing value fails", () => {
    expect(() => new SpreadsheetColumnReference(1, SpreadsheetReferenceKind.RELATIVE).addSaturated()).toThrow("Missing delta");
});

test("addSaturated invalid value fails", () => {
    expect(() => new SpreadsheetColumnReference(1, SpreadsheetReferenceKind.RELATIVE).addSaturated("!invalid")).toThrow("Expected number delta got !invalid");
});

test("addSaturated same value", () => {
    const value = 2;
    const reference = new SpreadsheetColumnReference(value, SpreadsheetReferenceKind.ABSOLUTE);
    expect(reference.addSaturated(0)).toStrictEqual(reference);
});

test("addSaturated non zero value ABSOLUTE", () => {
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    const value = 2;
    const delta = 100;
    const reference = new SpreadsheetColumnReference(value, kind);
    expect(reference.addSaturated(delta)).toStrictEqual(new SpreadsheetColumnReference(value + delta, kind));
});

test("addSaturated non zero value RELATIVE", () => {
    const kind = SpreadsheetReferenceKind.RELATIVE;
    const value = 2;
    const delta = 100;
    const reference = new SpreadsheetColumnReference(value, kind);
    expect(reference.addSaturated(delta)).toStrictEqual(new SpreadsheetColumnReference(value + delta, kind));
});

test("addSaturated underflow", () => {
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    const value = 2;
    const delta = -100;
    const reference = new SpreadsheetColumnReference(value, kind);
    expect(reference.addSaturated(delta)).toStrictEqual(new SpreadsheetColumnReference(0, kind));
});

test("addSaturated overflow", () => {
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    const value = SpreadsheetColumnReference.MAX - 2;
    const delta = +2;
    const reference = new SpreadsheetColumnReference(value, kind);
    expect(reference.addSaturated(delta)).toStrictEqual(new SpreadsheetColumnReference(SpreadsheetColumnReference.MAX - 1, kind));
});

// compare..............................................................................................................

test("compare missing fails", () => {
    expect(() => new SpreadsheetColumnReference(1, SpreadsheetReferenceKind.RELATIVE).compare()).toThrow("Missing other");
});

test("compare SpreadsheetRowReference fails", () => {
    expect(() => new SpreadsheetColumnReference(1, SpreadsheetReferenceKind.RELATIVE).compare(new SpreadsheetRowReference(1, SpreadsheetReferenceKind.RELATIVE))).toThrow("Expected SpreadsheetColumnReference other got 2");
});

test("compare equals", () => {
    const value = 123;
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    expect(new SpreadsheetColumnReference(value, kind).compare(new SpreadsheetColumnReference(value, kind))).toStrictEqual(0);
});

test("compare equals different kind", () => {
    const value = 123;
    expect(new SpreadsheetColumnReference(value, SpreadsheetReferenceKind.ABSOLUTE).compare(new SpreadsheetColumnReference(value, SpreadsheetReferenceKind.RELATIVE))).toStrictEqual(0);
});

test("compare less", () => {
    const value = 123;
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    expect(new SpreadsheetColumnReference(value - 1, kind).compare(new SpreadsheetColumnReference(value, kind))).toBeLessThan(0);
});

test("compare less #2", () => {
    const value = 123;
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    expect(new SpreadsheetColumnReference(value - 2, kind).compare(new SpreadsheetColumnReference(value, kind))).toBeLessThan(0);
});

// toJson...............................................................................................................

test("toJson B", () => {
    expect(SpreadsheetColumnReference.parse("B").toJson()).toStrictEqual("B");
});

test("toJson C", () => {
    expect(SpreadsheetColumnReference.parse("C").toJson()).toStrictEqual("C");
});

// equals................................................................................................................

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

