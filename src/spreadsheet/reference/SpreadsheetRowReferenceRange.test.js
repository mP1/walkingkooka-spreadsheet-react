import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetRowReferenceRange from "./SpreadsheetRowReferenceRange.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import systemObjectTesting from "../../SystemObjectTesting.js";

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

// extendRangeLeft......................................................................................................

function testExtendRangeLeft(range, expected) {
    test("extendRangeLeft " + range,
        () => {
            expect(SpreadsheetRowReferenceRange.parse(range)
                .extendRangeLeft()
            ).toStrictEqual(
                SpreadsheetRowReferenceRange.parse(expected)
                    .rowOrRange()
            )
        });
}

testExtendRangeLeft("1:1", "1");
testExtendRangeLeft("2:2", "2");
testExtendRangeLeft("3:4", "3:4");

// extendRangeRight......................................................................................................

function testExtendRangeRight(range, expected) {
    test("extendRangeRight " + range,
        () => {
            expect(SpreadsheetRowReferenceRange.parse(range)
                .extendRangeRight()
            ).toStrictEqual(
                SpreadsheetRowReferenceRange.parse(expected)
                    .rowOrRange()
            )
        });
}

testExtendRangeRight("1:1", "1");
testExtendRangeRight("2:2", "2");
testExtendRangeRight("3:4", "3:4");

// extendRangeUp......................................................................................................

function testExtendRangeUp(range, expected) {
    test("extendRangeUp " + range,
        () => {
            expect(SpreadsheetRowReferenceRange.parse(range)
                .extendRangeUp()
            ).toStrictEqual(
                SpreadsheetRowReferenceRange.parse(expected)
                    .rowOrRange()
            )
        });
}

testExtendRangeUp("1:1", "1");
testExtendRangeUp("2:3", "1:3");
testExtendRangeUp("3:4", "2:4");

// extendRangeDown......................................................................................................

function testExtendRangeDown(range, expected) {
    test("extendRangeDown " + range,
        () => {
            expect(SpreadsheetRowReferenceRange.parse(range)
                .extendRangeDown()
            ).toStrictEqual(
                SpreadsheetRowReferenceRange.parse(expected)
                    .rowOrRange()
            )
        });
}

testExtendRangeDown("1048576:1048576", "1048576");
testExtendRangeDown("1:1", "1:2");
testExtendRangeDown("2:3", "2:4");
testExtendRangeDown("1048574:1048575", "1048574:1048576");

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

    expect(range.toJson()).toStrictEqual(json);
    expect(range.toString()).toBe(json);

    expect(SpreadsheetRowReferenceRange.fromJson(range.toJson()))
        .toStrictEqual(range);
    expect(SpreadsheetRowReferenceRange.parse(range.toString()))
        .toStrictEqual(range);
}
