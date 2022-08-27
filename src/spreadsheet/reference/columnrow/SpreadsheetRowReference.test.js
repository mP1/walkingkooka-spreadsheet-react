import SpreadsheetCellReference from "../cell/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetReferenceKind from "../SpreadsheetReferenceKind.js";
import SpreadsheetRow from "./SpreadsheetRow.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import systemObjectTesting from "../../../SystemObjectTesting.js";
import SpreadsheetCellRange from "../cell/SpreadsheetCellRange.js";

systemObjectTesting(
    new SpreadsheetRowReference(0, SpreadsheetReferenceKind.ABSOLUTE),
    new SpreadsheetRowReference(9, SpreadsheetReferenceKind.RELATIVE),
    SpreadsheetRowReference.fromJson,
    "Missing text",
    "spreadsheet-row-reference",
    "$1"
);

function home() {
    return SpreadsheetCellReference.parse("Z99");
}

test("parse missing text fails", () => {
    expect(() => SpreadsheetRowReference.parse()).toThrow("Missing text");
});

test("parse of invalid text fails", () => {
    expect(() => SpreadsheetRowReference.parse(true))
        .toThrow("Expected string text got true");
});

test("parse of includes invalid character fails", () => {
    expect(() => SpreadsheetRowReference.parse("A"))
        .toThrow("Invalid character 'A' at 0");
});

test("parse of includes invalid character fails #2", () => {
    expect(() => SpreadsheetRowReference.parse("1A"))
        .toThrow("Invalid character 'A' at 1");
});

test("parse of includes invalid character fails #3", () => {
    expect(() => SpreadsheetRowReference.parse("12A"))
        .toThrow("Invalid character 'A' at 2");
});

test("parse MAX fails", () => {
    expect(() => SpreadsheetRowReference.parse("" + (SpreadsheetRowReference.MAX + 1))).toThrow("Invalid value 1048577 > 1048576");
});

test("parse ABSOLUTE", () => {
    expect(SpreadsheetRowReference.parse("$2")).toStrictEqual(new SpreadsheetRowReference(1, SpreadsheetReferenceKind.ABSOLUTE));
});

test("parse RELATIVE", () => {
    expect(SpreadsheetRowReference.parse("3")).toStrictEqual(new SpreadsheetRowReference(2, SpreadsheetReferenceKind.RELATIVE));
});

test("parse MAX -1", () => {
    expect(
        SpreadsheetRowReference.parse("" + SpreadsheetRowReference.MAX)
    ).toStrictEqual(new SpreadsheetRowReference(SpreadsheetRowReference.MAX - 1, SpreadsheetReferenceKind.RELATIVE));
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

test("set missing kind fails", () => {
    expect(() => new SpreadsheetRowReference(0, SpreadsheetReferenceKind.RELATIVE).setKind()).toThrow("Missing kind");
});

test("set invalid kind fails", () => {
    expect(() => new SpreadsheetRowReference(0, SpreadsheetReferenceKind.RELATIVE).setKind("!invalid")).toThrow("Expected SpreadsheetReferenceKind kind got !invalid");
});

test("set same kind ABSOLUTE", () => {
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    const reference = new SpreadsheetRowReference(2, kind);
    expect(reference.setKind(kind)).toStrictEqual(reference);
});

test("set same kind RELATIVE", () => {
    const kind = SpreadsheetReferenceKind.RELATIVE;
    const reference = new SpreadsheetRowReference(2, kind);
    expect(reference.setKind(kind)).toStrictEqual(reference);
});

test("set different kind ABSOLUTE", () => {
    const reference = new SpreadsheetRowReference(2, SpreadsheetReferenceKind.RELATIVE);
    expect(reference.setKind(SpreadsheetReferenceKind.ABSOLUTE)).toStrictEqual(new SpreadsheetRowReference(2, SpreadsheetReferenceKind.ABSOLUTE));
});

test("set different kind RELATIVE", () => {
    const reference = new SpreadsheetRowReference(2, SpreadsheetReferenceKind.ABSOLUTE);
    expect(reference.setKind(SpreadsheetReferenceKind.RELATIVE)).toStrictEqual(new SpreadsheetRowReference(2, SpreadsheetReferenceKind.RELATIVE));
});

// setValue..............................................................................................................

test("set missing value fails", () => {
    expect(() => new SpreadsheetRowReference(undefined, SpreadsheetReferenceKind.RELATIVE).setValue()).toThrow("Missing value");
});

test("set invalid value fails", () => {
    expect(() => new SpreadsheetRowReference("!invalid", SpreadsheetReferenceKind.RELATIVE).setValue("!invalid")).toThrow("Expected number value got !invalid");
});

test("set same value", () => {
    const value = 2;
    const reference = new SpreadsheetRowReference(value, SpreadsheetReferenceKind.ABSOLUTE);
    expect(reference.setValue(value)).toStrictEqual(reference);
});

test("set different value ABSOLUTE", () => {
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    const value = 2;
    const reference = new SpreadsheetRowReference(value, kind);
    expect(reference.setValue(value)).toStrictEqual(new SpreadsheetRowReference(value, kind));
});

test("set different value RELATIVE", () => {
    const kind = SpreadsheetReferenceKind.RELATIVE;
    const value = 2;
    const reference = new SpreadsheetRowReference(value, kind);
    expect(reference.setValue(value)).toStrictEqual(new SpreadsheetRowReference(value, kind));
});

// add..............................................................................................................

test("add missing value fails", () => {
    expect(() => new SpreadsheetRowReference(1, SpreadsheetReferenceKind.RELATIVE).add()).toThrow("Missing delta");
});

test("add invalid value fails", () => {
    expect(() => new SpreadsheetRowReference(1, SpreadsheetReferenceKind.RELATIVE).add("!invalid")).toThrow("Expected number delta got !invalid");
});

test("add same value", () => {
    const value = 2;
    const reference = new SpreadsheetRowReference(value, SpreadsheetReferenceKind.ABSOLUTE);
    expect(reference.add(0)).toStrictEqual(reference);
});

test("add non zero value ABSOLUTE", () => {
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    const value = 2;
    const delta = 100;
    const reference = new SpreadsheetRowReference(value, kind);
    expect(reference.add(delta)).toStrictEqual(new SpreadsheetRowReference(value + delta, kind));
});

test("add non zero value RELATIVE", () => {
    const kind = SpreadsheetReferenceKind.RELATIVE;
    const value = 2;
    const delta = 100;
    const reference = new SpreadsheetRowReference(value, kind);
    expect(reference.add(delta)).toStrictEqual(new SpreadsheetRowReference(value + delta, kind));
});

// addSaturated.........................................................................................................

test("addSaturated missing value fails", () => {
    expect(() => new SpreadsheetRowReference(1, SpreadsheetReferenceKind.RELATIVE).addSaturated()).toThrow("Missing delta");
});

test("addSaturated invalid value fails", () => {
    expect(() => new SpreadsheetRowReference(1, SpreadsheetReferenceKind.RELATIVE).addSaturated("!invalid")).toThrow("Expected number delta got !invalid");
});

test("addSaturated same value", () => {
    const value = 2;
    const reference = new SpreadsheetRowReference(value, SpreadsheetReferenceKind.ABSOLUTE);
    expect(reference.addSaturated(0)).toStrictEqual(reference);
});

test("addSaturated non zero value ABSOLUTE", () => {
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    const value = 2;
    const delta = 100;
    const reference = new SpreadsheetRowReference(value, kind);
    expect(reference.addSaturated(delta)).toStrictEqual(new SpreadsheetRowReference(value + delta, kind));
});

test("addSaturated non zero value RELATIVE", () => {
    const kind = SpreadsheetReferenceKind.RELATIVE;
    const value = 2;
    const delta = 100;
    const reference = new SpreadsheetRowReference(value, kind);
    expect(reference.addSaturated(delta)).toStrictEqual(new SpreadsheetRowReference(value + delta, kind));
});

test("addSaturated underflow", () => {
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    const value = 2;
    const delta = -100;
    const reference = new SpreadsheetRowReference(value, kind);
    expect(reference.addSaturated(delta)).toStrictEqual(new SpreadsheetRowReference(0, kind));
});

test("addSaturated overflow", () => {
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    const value = SpreadsheetRowReference.MAX - 2;
    const delta = +2;
    const reference = new SpreadsheetRowReference(value, kind);
    expect(reference.addSaturated(delta)).toStrictEqual(new SpreadsheetRowReference(SpreadsheetRowReference.MAX - 1, kind));
});

// setColumn..............................................................................................................

test("setColumn", () => {
    const column = SpreadsheetColumnReference.parse("B");
    const row = SpreadsheetRowReference.parse("2");

    expect(row.setColumn(column))
        .toStrictEqual(new SpreadsheetCellReference(column, row));
});

// patch................................................................................................................

function testPatchAndCheck(reference, property, value, expected) {
    test("testPatchAndCheck " + reference + " " + property + " " + value,
        () => {
            expect(
                SpreadsheetRowReference.parse(reference)
                    .patch(property, value)
            ).toStrictEqual(expected);
        }
    );
}

testPatchAndCheck(
    "2",
    "hidden",
    true,
    new SpreadsheetRow(
        SpreadsheetRowReference.parse("2"),
        true
    )
);

testPatchAndCheck(
    "3",
    "hidden",
    false,
    new SpreadsheetRow(
        SpreadsheetRowReference.parse("3"),
        false
    )
);

// testCell SpreadsheetCellReference....................................................................................

function testCellAndCheck(row, cellReference, expected) {
    test("test " + row + " " + cellReference, () => {
        expect(
            SpreadsheetRowReference.parse(row)
                .testCell(SpreadsheetCellReference.parse(cellReference)))
            .toStrictEqual(expected);
    });
}

testCellAndCheck("2", "B1", false);
testCellAndCheck("3", "$B3", true);
testCellAndCheck("4", "C$4", true);
testCellAndCheck("5", "Z99", false);

// testCellRange.............................................................................................................

test("testCellRange missing fails", () => {
    expect(() => SpreadsheetRowReference.parse("1")
        .testCellRange())
        .toThrow("Missing range");
});

test("testCellRange non SpreadsheetCellRange fails", () => {
    expect(() => SpreadsheetRowReference.parse("1")
        .testCellRange(123))
        .toThrow("Expected SpreadsheetCellRange range got 123");
});

function testCellRangeAndCheck(label, row, testRange, expected) {
    test("testCellRange " + label + " " + row + " testCellRange " + testRange, () => {
        expect(SpreadsheetRowReference.parse(row)
            .testCellRange(SpreadsheetCellRange.parse(testRange))
        ).toStrictEqual(expected);
    });
}

testCellRangeAndCheck("above", "3", "A2:B2", false);
testCellRangeAndCheck("below", "3", "D4:E4", false);

testCellRangeAndCheck("center", "3", "C3", true);
testCellRangeAndCheck("abovePartial", "3", "B2:C3", true);
testCellRangeAndCheck("belowPartial", "3", "C3:D3", true);
testCellRangeAndCheck("inside", "3", "B2:D4", true);

// test SpreadsheetColumnReference......................................................................................

function testColumnAndCheck(row, columnReference, expected) {
    test("testColumn " + row + " " + columnReference, () => {
        expect(SpreadsheetRowReference.parse(row).testColumn(SpreadsheetColumnReference.parse(columnReference))).toStrictEqual(expected);
    });
}

testColumnAndCheck("2", "B", false);
testColumnAndCheck("$3", "C", false);
testColumnAndCheck("$4", "$D", false);

// test SpreadsheetRowReference......................................................................................

function testRowAndCheck(cellReference, rowReference, expected) {
    test("testRow " + cellReference + " " + rowReference, () => {
        expect(SpreadsheetCellReference.parse(cellReference).testRow(SpreadsheetRowReference.parse(rowReference))).toStrictEqual(expected);
    });
}

testRowAndCheck("A99", "1", false);
testRowAndCheck("B2", "2", true);
testRowAndCheck("C3", "$3", true);
testRowAndCheck("D$4", "4", true);

// toRelative............................................................................................................

function toRelativeAndCheck(selection, expected) {
    test("toRelative " + selection, () => {
        expect(SpreadsheetRowReference.parse(selection)
            .toRelative()
        ).toStrictEqual(
            SpreadsheetRowReference.parse(expected)
        );
    });
}

toRelativeAndCheck("1", "1");
toRelativeAndCheck("$2", "2");

// compareTo..............................................................................................................

test("compareTo missing fails", () => {
    expect(() => new SpreadsheetRowReference(1, SpreadsheetReferenceKind.RELATIVE).compareTo()).toThrow("Missing other");
});

test("compareTo SpreadsheetColumnReference fails", () => {
    expect(() => new SpreadsheetRowReference(1, SpreadsheetReferenceKind.RELATIVE).compareTo(new SpreadsheetColumnReference(1, SpreadsheetReferenceKind.RELATIVE))).toThrow("Expected SpreadsheetRowReference other got B");
});

test("compareTo equals", () => {
    const value = 123;
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    expect(new SpreadsheetRowReference(value, kind).compareTo(new SpreadsheetRowReference(value, kind))).toStrictEqual(0);
});

test("compareTo equals different kind", () => {
    const value = 123;
    expect(new SpreadsheetRowReference(value, SpreadsheetReferenceKind.ABSOLUTE).compareTo(new SpreadsheetRowReference(value, SpreadsheetReferenceKind.RELATIVE))).toStrictEqual(0);
});

test("compareTo less", () => {
    const value = 123;
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    expect(new SpreadsheetRowReference(value - 1, kind).compareTo(new SpreadsheetRowReference(value, kind))).toBeLessThan(0);
});

test("compareTo less #2", () => {
    const value = 123;
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    expect(new SpreadsheetRowReference(value - 2, kind).compareTo(new SpreadsheetRowReference(value, kind))).toBeLessThan(0);
});

// toJson...............................................................................................................

test("toJson ABSOLUTE", () => {
    expect(new SpreadsheetRowReference(2, SpreadsheetReferenceKind.ABSOLUTE).toJson()).toStrictEqual("$3");
});

test("toJson RELATIVE", () => {
    expect(new SpreadsheetRowReference(3, SpreadsheetReferenceKind.RELATIVE).toJson()).toStrictEqual("4");
});

// equals................................................................................................................

test("equals SpreadsheetColumnReference false", () => {
    const kind = SpreadsheetReferenceKind.ABSOLUTE;
    expect(new SpreadsheetRowReference(1, kind).equals(new SpreadsheetColumnReference(1, kind))).toStrictEqual(false);
});

test("equals different value false", () => {
    expect(SpreadsheetRowReference.parse("4").equals(SpreadsheetRowReference.parse("5"))).toStrictEqual(false);
});

test("equals different kind false", () => {
    expect(SpreadsheetRowReference.parse("$6").equals(SpreadsheetRowReference.parse("$7"))).toStrictEqual(false);
});

test("equals H true", () => {
    expect(SpreadsheetRowReference.parse("8").equals(SpreadsheetRowReference.parse("8"))).toStrictEqual(true);
});

test("equals I true", () => {
    expect(SpreadsheetRowReference.parse("9").equals(SpreadsheetRowReference.parse("9"))).toStrictEqual(true);
});

// equalsIgnoringKind...................................................................................................

function testEqualsIgnoringKind(row, other, expected) {
    test("equalsIgnoringKind " + row + " " + other,
        () => {
            expect(SpreadsheetRowReference.parse(row)
                .equalsIgnoringKind(SpreadsheetRowReference.parse(other))
            ).toStrictEqual(
                expected
            )
        });
}
testEqualsIgnoringKind("1", "1", true);
testEqualsIgnoringKind("$1", "1", true);
testEqualsIgnoringKind("1", "2", false);

// toString.............................................................................................................

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

