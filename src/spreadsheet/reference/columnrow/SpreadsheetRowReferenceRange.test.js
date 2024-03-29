import SpreadsheetCellReference from "../cell/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetRowReferenceRange from "./SpreadsheetRowReferenceRange.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import systemObjectTesting from "../../../SystemObjectTesting.js";
import SpreadsheetRow from "./SpreadsheetRow.js";
import SpreadsheetColumnReferenceRange from "./SpreadsheetColumnReferenceRange.js";
import SpreadsheetCellRange from "../cell/SpreadsheetCellRange.js";

const JSON = "2:4";

function begin() {
    return SpreadsheetRowReference.parse("2");
}

function end() {
    return SpreadsheetRowReference.parse("4");
}

function range() {
    return new SpreadsheetRowReferenceRange(begin(), end());
}

function home() {
    return SpreadsheetCellReference.parse("Z99");
}

systemObjectTesting(
    new SpreadsheetRowReferenceRange(begin(), end()),
    new SpreadsheetRowReferenceRange(SpreadsheetRowReference.parse("98"), SpreadsheetRowReference.parse("99")),
    SpreadsheetRowReferenceRange.fromJson,
    "Missing text",
    "spreadsheet-row-reference-range",
    JSON
);

// create...............................................................................................................

test("create without begin fails", () => {
    expect(() => new SpreadsheetRowReferenceRange(null, end()))
        .toThrow("Missing begin");
});

test("create with begin non cell fails", () => {
    expect(() => new SpreadsheetRowReferenceRange(1.5, end()))
        .toThrow("Expected SpreadsheetRowReference begin got 1.5");
});

test("create without end fails", () => {
    expect(() => new SpreadsheetRowReferenceRange(begin(), null))
        .toThrow("Missing end");
});

test("create with end non cell fails", () => {
    expect(() => new SpreadsheetRowReferenceRange(begin(), true))
        .toThrow("Expected SpreadsheetRowReference end got true");
});

test("create", () => {
    check(new SpreadsheetRowReferenceRange(begin(), end()), begin(), end(), JSON);
});

test("create begin > end", () => {
    check(new SpreadsheetRowReferenceRange(end(), begin()), begin(), end(), JSON);
});

// parse.............................................................................................................

test("parse missing fails", () => {
    expect(() => SpreadsheetRowReferenceRange.parse())
        .toThrow("Missing text");
});

test("parse null fails", () => {
    expect(() => SpreadsheetRowReferenceRange.parse(null))
        .toThrow("Missing text");
});

test("parse empty fails", () => {
    expect(() => SpreadsheetRowReferenceRange.parse(""))
        .toThrow("Missing text");
});

test("parse wrong token count fails", () => {
    expect(() => SpreadsheetRowReferenceRange.parse("1:2:3"))
        .toThrow("Expected 1 or 2 tokens got \"1:2:3\"");
});

test("parse only one row", () => {
    const row = begin();

    check(new SpreadsheetRowReferenceRange(row, row), row, row, row.toJson());
});

test("parse relative/relative", () => {
    const range = SpreadsheetRowReferenceRange.parse(JSON);
    const begin = SpreadsheetRowReference.parse("2");
    const end = SpreadsheetRowReference.parse("4");

    check(range, begin, end, JSON);
});

test("parse absolute/absolute", () => {
    const range = SpreadsheetRowReferenceRange.parse("$2:$4");
    const begin = SpreadsheetRowReference.parse("$2");
    const end = SpreadsheetRowReference.parse("$4");

    check(range, begin, end, "$2:$4");
});

test("parse absolute/relative", () => {
    const range = SpreadsheetRowReferenceRange.parse("$2:4");
    const begin = SpreadsheetRowReference.parse("$2");
    const end = SpreadsheetRowReference.parse("4");

    check(range, begin, end, "$2:4");
});

test("parse relative:absolute", () => {
    const range = SpreadsheetRowReferenceRange.parse("2:$4");
    const begin = SpreadsheetRowReference.parse("2");
    const end = SpreadsheetRowReference.parse("$4");

    check(range, begin, end, "2:$4");
});

// fromJson.............................................................................................................

test("fromJson wrong token count fails", () => {
    expect(() => SpreadsheetRowReferenceRange.fromJson("2:3:4"))
        .toThrow("Expected 1 or 2 tokens got \"2:3:4\"");
});

test("fromJson missing begin row fails", () => {
    expect(() => SpreadsheetRowReferenceRange.fromJson(":"))
        .toThrow("Missing begin");
});

test("fromJson missing begin row fails #2", () => {
    expect(() => SpreadsheetRowReferenceRange.fromJson(":4"))
        .toThrow("Missing begin");
});

test("fromJson invalid begin row fails", () => {
    expect(() => SpreadsheetRowReferenceRange.fromJson("2!:4"))
        .toThrow("Invalid character '!' at 1");
});

test("fromJson missing end row fails", () => {
    expect(() => SpreadsheetRowReferenceRange.fromJson("2:"))
        .toThrow("Missing end");
});

test("fromJson invalid end row fails", () => {
    expect(() => SpreadsheetRowReferenceRange.fromJson("2:3!4"))
        .toThrow("Invalid character '!' at 3");
});

test("fromJson invalid end row fails #2", () => {
    expect(() => SpreadsheetRowReferenceRange.fromJson("2:3!"))
        .toThrow("Invalid character '!' at 3");
});

test("fromJson only row", () => {
    const range = SpreadsheetRowReferenceRange.fromJson("2");
    const row = begin();
    check(range, row, row, "2");
});

test("fromJson range", () => {
    const range = SpreadsheetRowReferenceRange.fromJson(JSON);
    check(range, begin(), end(), JSON);
});

// setBegin..............................................................................................................

function testSetBegin(range, begin, expected) {
    test(range + ".setBegin " + begin, () => {
        expect(
            SpreadsheetRowReferenceRange.parse(range)
                .setBegin(SpreadsheetRowReference.parse(begin))
        ).toStrictEqual(SpreadsheetRowReferenceRange.parse(expected));
    });
}

testSetBegin("1:2", "1", "1:2");
testSetBegin("1:2", "2", "2:2");
testSetBegin("3:5", "1", "1:5");
testSetBegin("3:5", "7", "5:7");

// setEnd..............................................................................................................

function testSetEnd(range, end, expected) {
    test(range + ".setEnd " + end, () => {
        expect(
            SpreadsheetRowReferenceRange.parse(range)
                .setEnd(SpreadsheetRowReference.parse(end))
        ).toStrictEqual(SpreadsheetRowReferenceRange.parse(expected));
    });
}

testSetEnd("1:2", "1", "1:1");
testSetEnd("1:2", "2", "1:2");
testSetEnd("3:5", "1", "1:3");
testSetEnd("3:5", "7", "3:7");

// setColumns..........................................................................................................

function testSetColumns(rows, columns, expected) {
    test(rows + ".setColumns " + columns, () => {
        expect(
            SpreadsheetRowReferenceRange.parse(rows)
                .setColumns(SpreadsheetColumnReferenceRange.parse(columns))
        ).toStrictEqual(SpreadsheetCellRange.parse(expected));
    });
}

testSetColumns("1:2", "A", "A1:A2");
testSetColumns("3", "B:C", "B3:C3");
testSetColumns("4:5", "D:E", "D4:E5");
testSetColumns("6", "F", "F6");

// rowOrRange........................................................................................................

function testRowOrRange(range, expected) {
    test("rowOrRange " + range, () => {
        expect(SpreadsheetRowReferenceRange.parse(range)
            .rowOrRange()
        ).toStrictEqual(expected.indexOf(":") > 0 ?
            SpreadsheetRowReferenceRange.parse(expected) :
            SpreadsheetRowReference.parse(expected));
    });
}

testRowOrRange("2:3", "2:3");
testRowOrRange("4:4", "4");

// values...............................................................................................................

function testValues(range, expected) {
    test("values " + range, () => {
        expect(
            SpreadsheetRowReferenceRange.parse(range).values()
        ).toStrictEqual(expected);
    });
}

testValues(
    "2",
    [
        SpreadsheetRowReference.parse("2")
    ]
);

testValues(
    "3:4",
    [
        SpreadsheetRowReference.parse("3"),
        SpreadsheetRowReference.parse("4")
    ]
);

testValues(
    "5:8",
    [
        SpreadsheetRowReference.parse("5"),
        SpreadsheetRowReference.parse("6"),
        SpreadsheetRowReference.parse("7"),
        SpreadsheetRowReference.parse("8")
    ]
);

// patch................................................................................................................

function testPatchAndCheck(reference, property, value, expected) {
    test("testPatchAndCheck " + reference + " " + property + " " + value,
        () => {
            expect(
                SpreadsheetRowReferenceRange.parse(reference)
                    .patch(property, value)
            ).toStrictEqual(expected);
        }
    );
}

testPatchAndCheck(
    "2",
    "hidden",
    true,
    [
        new SpreadsheetRow(
            SpreadsheetRowReference.parse("2"),
            true
        )
    ]
);

testPatchAndCheck(
    "3",
    "hidden",
    false,
    [
        new SpreadsheetRow(
            SpreadsheetRowReference.parse("3"),
            false
        )
    ]
);

testPatchAndCheck(
    "4:6",
    "hidden",
    false,
    [
        new SpreadsheetRow(
            SpreadsheetRowReference.parse("4"),
            false
        ),
        new SpreadsheetRow(
            SpreadsheetRowReference.parse("5"),
            false
        ),
        new SpreadsheetRow(
            SpreadsheetRowReference.parse("6"),
            false
        )
    ]
);

testPatchAndCheck(
    "7:9",
    "hidden",
    true,
    [
        new SpreadsheetRow(
            SpreadsheetRowReference.parse("7"),
            true
        ),
        new SpreadsheetRow(
            SpreadsheetRowReference.parse("8"),
            true
        ),
        new SpreadsheetRow(
            SpreadsheetRowReference.parse("9"),
            true
        )
    ]
);

// testCell.............................................................................................................

test("testCell missing fails", () => {
    expect(() => range()
        .testCell())
        .toThrow("Missing cellReference");
});

test("testCell non SpreadsheetCellReference fails", () => {
    expect(() => range()
        .testCell(123))
        .toThrow("Expected SpreadsheetCellReference cellReference got 123");
});

function testCellAndCheck(label, range, cellReference, expected) {
    test("testCell " + label + " " + range + " testCell " + cellReference, () => {
        expect(SpreadsheetRowReferenceRange.fromJson(range)
            .testCell(SpreadsheetCellReference.parse(cellReference))
        ).toStrictEqual(expected);
    });
}

testCellAndCheck("above", JSON, "A1", false);
testCellAndCheck("below", JSON, "E5", false);

testCellAndCheck("topLeft", JSON, "B2", true);
testCellAndCheck("topEdge", JSON, "C2", true);
testCellAndCheck("topRight", JSON, "D2", true);

testCellAndCheck("center", JSON, "C3", true);

testCellAndCheck("bottomLeft", JSON, "B4", true);
testCellAndCheck("bottomEdge", JSON, "C4", true);
testCellAndCheck("bottomRight", JSON, "D4", true);

// testCellRange.............................................................................................................

test("testCellRange missing fails", () => {
    expect(() => SpreadsheetRowReferenceRange.parse("1:2")
        .testCellRange())
        .toThrow("Missing range");
});

test("testCellRange non SpreadsheetCellRange fails", () => {
    expect(() => SpreadsheetRowReferenceRange.parse("1:2")
        .testCellRange(123))
        .toThrow("Expected SpreadsheetCellRange range got 123");
});

function testCellRangeAndCheck(label, range, testRange, expected) {
    test("testCellRange " + label + " " + range + " testCellRange " + testRange, () => {
        expect(SpreadsheetRowReferenceRange.parse(range)
            .testCellRange(SpreadsheetCellRange.parse(testRange))
        ).toStrictEqual(expected);
    });
}

testCellRangeAndCheck("above", "3:4", "A2:B2", false);
testCellRangeAndCheck("below", "3:4", "D5:E5", false);

testCellRangeAndCheck("center", "3:4", "C3", true);
testCellRangeAndCheck("center", "3:4", "C4", true);
testCellRangeAndCheck("abovePartial", "3:4", "B2:C3", true);
testCellRangeAndCheck("belowPartial", "3:4", "C4:D5", true);
testCellRangeAndCheck("inside", "3:4", "B2:D5", true);

// testColumn...........................................................................................................

test("testColumn missing fails", () => {
    expect(() => range()
        .testColumn())
        .toThrow("Missing columnReference");
});

test("testColumn non SpreadsheetColumnReference fails", () => {
    expect(() => range()
        .testColumn(123))
        .toThrow("Expected SpreadsheetColumnReference columnReference got 123");
});

function testColumnAndCheck(label, range, columnReference, expected) {
    test(label + " testColumn " + range + " " + columnReference, () => {
        expect(SpreadsheetRowReferenceRange.fromJson(range)
            .testColumn(SpreadsheetColumnReference.parse(columnReference))
        ).toStrictEqual(expected);
    });
}

testColumnAndCheck("A", JSON, "A", false);
testColumnAndCheck("B", JSON, "B", false);
testColumnAndCheck("C", JSON, "C", false);

// testRow...........................................................................................................

test("testRow missing fails", () => {
    expect(() => range().testRow())
        .toThrow("Missing rowReference");
});

test("testRow non SpreadsheetRowReference fails", () => {
    expect(() => range().testRow(123))
        .toThrow("Expected SpreadsheetRowReference rowReference got 123");
});

function testRowAndCheck(label, range, rowReference, expected) {
    test(label + " testRow " + range + " " + rowReference, () => {
        expect(SpreadsheetRowReferenceRange.fromJson(range)
            .testRow(SpreadsheetRowReference.parse(rowReference)))
            .toStrictEqual(expected);
    });
}

testRowAndCheck("above", JSON, "1", false);
testRowAndCheck("top edge", JSON, "2", true);
testRowAndCheck("center", JSON, "3", true);
testRowAndCheck("bottom edge", JSON, "4", true);
testRowAndCheck("below", JSON, "5", false);

// toRelative............................................................................................................

function toRelativeAndCheck(selection, expected) {
    test("toRelative " + selection, () => {
        expect(SpreadsheetRowReferenceRange.parse(selection)
            .toRelative()
        ).toStrictEqual(
            SpreadsheetRowReferenceRange.parse(expected)
        );
    });
}

toRelativeAndCheck("1:2", "1:2");
toRelativeAndCheck("2:2", "2:2");
toRelativeAndCheck("$3:$3", "3:3");
toRelativeAndCheck("$4:$5", "4:5");

// equalsIgnoringKind...................................................................................................

function testEqualsIgnoringKind(range, other, expected) {
    test("equalsIgnoringKind " + range + " " + other,
        () => {
            expect(SpreadsheetRowReferenceRange.parse(range)
                .equalsIgnoringKind(SpreadsheetRowReferenceRange.parse(other))
            ).toStrictEqual(
                expected
            )
        });
}
testEqualsIgnoringKind("1:2", "1:2", true);
testEqualsIgnoringKind("$1:2", "1:2", true);
testEqualsIgnoringKind("1:$2", "1:2", true);
testEqualsIgnoringKind("1:2", "2:3", false);

// helpers..............................................................................................................

function check(range, begin, end, json) {
    expect(range.begin())
        .toStrictEqual(begin);
    expect(range.end())
        .toStrictEqual(end);

    expect(range.begin())
        .toBeInstanceOf(SpreadsheetRowReference);
    expect(range.end())
        .toBeInstanceOf(SpreadsheetRowReference);

    expect(range.count())
        .toStrictEqual(end.value() - begin.value() + 1);

    expect(range.toJson()).toStrictEqual(json);
    expect(range.toString()).toBe(json);

    expect(SpreadsheetRowReferenceRange.fromJson(range.toJson()))
        .toStrictEqual(range);
    expect(SpreadsheetRowReferenceRange.parse(range.toString()))
        .toStrictEqual(range);
}
