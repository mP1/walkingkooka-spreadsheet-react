import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetColumnReferenceRange from "./SpreadsheetColumnReferenceRange.js";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import systemObjectTesting from "../../SystemObjectTesting.js";
import SpreadsheetViewportSelectionAnchor from "./SpreadsheetViewportSelectionAnchor.js";

const JSON = "B:D";

function begin() {
    return SpreadsheetColumnReference.parse("B");
}

function end() {
    return SpreadsheetColumnReference.parse("D");
}

function range() {
    return new SpreadsheetColumnReferenceRange(begin(), end());
}

systemObjectTesting(
    new SpreadsheetColumnReferenceRange(begin(), end()),
    new SpreadsheetColumnReferenceRange(SpreadsheetColumnReference.parse("Y"), SpreadsheetColumnReference.parse("Z")),
    SpreadsheetColumnReferenceRange.fromJson,
    "Missing text",
    "spreadsheet-column-reference-range",
    JSON
);

// create...............................................................................................................

test("create without begin fails", () => {
    expect(() => new SpreadsheetColumnReferenceRange(null, end()))
        .toThrow("Missing begin");
});

test("create with begin non cell fails", () => {
    expect(() => new SpreadsheetColumnReferenceRange(1.5, end()))
        .toThrow("Expected SpreadsheetColumnReference begin got 1.5");
});

test("create without end fails", () => {
    expect(() => new SpreadsheetColumnReferenceRange(begin(), null))
        .toThrow("Missing end");
});

test("create with end non cell fails", () => {
    expect(() => new SpreadsheetColumnReferenceRange(begin(), true))
        .toThrow("Expected SpreadsheetColumnReference end got true");
});

test("create", () => {
    check(new SpreadsheetColumnReferenceRange(begin(), end()), begin(), end(), JSON);
});

test("create begin > end", () => {
    check(new SpreadsheetColumnReferenceRange(end(), begin()), begin(), end(), JSON);
});

// parse.............................................................................................................

test("parse missing fails", () => {
    expect(() => SpreadsheetColumnReferenceRange.parse())
        .toThrow("Missing text");
});

test("parse null fails", () => {
    expect(() => SpreadsheetColumnReferenceRange.parse(null))
        .toThrow("Missing text");
});

test("parse empty fails", () => {
    expect(() => SpreadsheetColumnReferenceRange.parse(""))
        .toThrow("Missing text");
});

test("parse wrong token count fails", () => {
    expect(() => SpreadsheetColumnReferenceRange.parse("A1:B2:C3"))
        .toThrow("Expected 1 or 2 tokens got \"A1:B2:C3\"");
});

test("parse only one column", () => {
    const column = begin();

    check(new SpreadsheetColumnReferenceRange(column, column), column, column, column.toJson());
});

test("parse relative/relative", () => {
    const range = SpreadsheetColumnReferenceRange.parse(JSON);
    const begin = SpreadsheetColumnReference.parse("B");
    const end = SpreadsheetColumnReference.parse("D");

    check(range, begin, end, JSON);
});

test("parse absolute/absolute", () => {
    const range = SpreadsheetColumnReferenceRange.parse("$B:$D");
    const begin = SpreadsheetColumnReference.parse("$B");
    const end = SpreadsheetColumnReference.parse("$D");

    check(range, begin, end, "$B:$D");
});

test("parse absolute/relative", () => {
    const range = SpreadsheetColumnReferenceRange.parse("$B:D");
    const begin = SpreadsheetColumnReference.parse("$B");
    const end = SpreadsheetColumnReference.parse("D");

    check(range, begin, end, "$B:D");
});

test("parse relative:absolute", () => {
    const range = SpreadsheetColumnReferenceRange.parse("B:$D");
    const begin = SpreadsheetColumnReference.parse("B");
    const end = SpreadsheetColumnReference.parse("$D");

    check(range, begin, end, "B:$D");
});

// fromJson.............................................................................................................

test("fromJson wrong token count fails", () => {
    expect(() => SpreadsheetColumnReferenceRange.fromJson("B:C:D"))
        .toThrow("Expected 1 or 2 tokens got \"B:C:D\"");
});

test("fromJson missing begin column fails", () => {
    expect(() => SpreadsheetColumnReferenceRange.fromJson(":"))
        .toThrow("Missing begin");
});

test("fromJson missing begin column fails #2", () => {
    expect(() => SpreadsheetColumnReferenceRange.fromJson(":C")).toThrow("Missing begin");
});

test("fromJson invalid begin column fails", () => {
    expect(() => SpreadsheetColumnReferenceRange.fromJson("B!:C"))
        .toThrow("Invalid character '!' at 1");
});

test("fromJson missing end column fails", () => {
    expect(() => SpreadsheetColumnReferenceRange.fromJson("B:"))
        .toThrow("Missing end");
});

test("fromJson invalid end column fails", () => {
    expect(() => SpreadsheetColumnReferenceRange.fromJson("B:C!2"))
        .toThrow("Invalid character '!' at 3");
});

test("fromJson invalid end column fails #2", () => {
    expect(() => SpreadsheetColumnReferenceRange.fromJson("B:C!")).
    toThrow("Invalid character '!' at 3");
});

test("fromJson only column", () => {
    const range = SpreadsheetColumnReferenceRange.fromJson("B");
    const column = begin();
    check(range, column, column, "B");
});

test("fromJson range", () => {
    const range = SpreadsheetColumnReferenceRange.fromJson(JSON);
    check(range, begin(), end(), JSON);
});

// setBegin..............................................................................................................

function testSetBegin(range, begin, expected) {
    test(range + ".setBegin " + begin, () => {
        expect(
            SpreadsheetColumnReferenceRange.parse(range)
                .setBegin(SpreadsheetColumnReference.parse(begin))
        ).toStrictEqual(SpreadsheetColumnReferenceRange.parse(expected));
    });
}

testSetBegin("A:B", "A", "A:B");
testSetBegin("A:B", "B", "B:B");
testSetBegin("C:E", "A", "A:E");
testSetBegin("C:E", "G", "E:G");

// setEnd..............................................................................................................

function testSetEnd(range, end, expected) {
    test(range + ".setEnd " + end, () => {
        expect(
            SpreadsheetColumnReferenceRange.parse(range)
                .setEnd(SpreadsheetColumnReference.parse(end))
        ).toStrictEqual(SpreadsheetColumnReferenceRange.parse(expected));
    });
}

testSetEnd("A:B", "A", "A:A");
testSetEnd("A:B", "B", "A:B");
testSetEnd("C:E", "A", "A:C");
testSetEnd("C:E", "G", "C:G");

// columnOrRange........................................................................................................

function testColumnOrRange(range, expected) {
    test("columnOrRange " + range, () => {
        expect(SpreadsheetColumnReferenceRange.parse(range)
            .columnOrRange()
        ).toStrictEqual(expected.indexOf(":") > 0 ?
            SpreadsheetColumnReferenceRange.parse(expected) :
            SpreadsheetColumnReference.parse(expected));
    });
}

testColumnOrRange("A:B", "A:B");
testColumnOrRange("C:C", "C");

// extendRangeLeft......................................................................................................

function testExtendRangeLeft(range, anchor, current, expected) {
    test("extendRangeLeft range=" + range + " anchor=" + anchor + " current=" + current,
        () => {
            expect(SpreadsheetColumnReferenceRange.parse(range)
                .extendRangeLeft(anchor, SpreadsheetColumnReference.parse(current))
                .toString()
            ).toStrictEqual(
                SpreadsheetColumnReferenceRange.parse(expected)
                    .columnOrRange()
                    .setAnchorConditional(anchor)
                    .toString()
            )
        });
}

testExtendRangeLeft("A:B", SpreadsheetViewportSelectionAnchor.RIGHT, "A", "A:B");
testExtendRangeLeft("B:C", SpreadsheetViewportSelectionAnchor.RIGHT, "B", "A:C");
testExtendRangeLeft("C:D", SpreadsheetViewportSelectionAnchor.RIGHT, "C", "B:D");

testExtendRangeLeft("A:A", SpreadsheetViewportSelectionAnchor.LEFT, "A", "A");
testExtendRangeLeft("A:B", SpreadsheetViewportSelectionAnchor.LEFT, "B", "A");
testExtendRangeLeft("B:C", SpreadsheetViewportSelectionAnchor.LEFT, "C", "B");
testExtendRangeLeft("C:D", SpreadsheetViewportSelectionAnchor.LEFT, "D", "C");
testExtendRangeLeft("F:H", SpreadsheetViewportSelectionAnchor.LEFT, "H", "F:G");
testExtendRangeLeft("I:J", SpreadsheetViewportSelectionAnchor.LEFT, "J", "I");
testExtendRangeLeft("I:J", SpreadsheetViewportSelectionAnchor.LEFT, "M", "I:L");

// extendRangeRight......................................................................................................

function testExtendRangeRight(range, anchor, current, expected) {
    test("extendRangeRight range=" + range + " anchor=" + anchor + " current=" + current,
        () => {
            expect(SpreadsheetColumnReferenceRange.parse(range)
                .extendRangeRight(anchor, SpreadsheetColumnReference.parse(current))
                .toString()
            ).toStrictEqual(
                SpreadsheetColumnReferenceRange.parse(expected)
                    .columnOrRange()
                    .setAnchorConditional(anchor)
                    .toString()
            )
        });
}

testExtendRangeRight("XFD:XFD", SpreadsheetViewportSelectionAnchor.LEFT, "XFD", "XFD");
testExtendRangeRight("A:XFD", SpreadsheetViewportSelectionAnchor.LEFT, "XFD","A:XFD");
testExtendRangeRight("B:C", SpreadsheetViewportSelectionAnchor.LEFT,"C", "B:D");
testExtendRangeRight("C:E", SpreadsheetViewportSelectionAnchor.LEFT,"E", "C:F");

testExtendRangeRight("XFD:XFD", SpreadsheetViewportSelectionAnchor.RIGHT, "XFD", "XFD");
testExtendRangeRight("A:XFD", SpreadsheetViewportSelectionAnchor.RIGHT,"A", "B:XFD");
testExtendRangeRight("B:C", SpreadsheetViewportSelectionAnchor.RIGHT,"B", "C");
testExtendRangeRight("E:G", SpreadsheetViewportSelectionAnchor.RIGHT,"E", "F:G");
testExtendRangeRight("H:I", SpreadsheetViewportSelectionAnchor.RIGHT,"H", "I");

// extendRangeUp......................................................................................................

function testExtendRangeUp(range, anchor, current, expected) {
    test("extendRangeUp " + range + " " + anchor,
        () => {
            expect(SpreadsheetColumnReferenceRange.parse(range)
                .extendRangeUp(anchor, SpreadsheetColumnReference.parse(current), null)
            ).toStrictEqual(
                SpreadsheetColumnReferenceRange.parse(expected)
                    .columnOrRange()
            )
        });
}

testExtendRangeUp("A:A", SpreadsheetViewportSelectionAnchor.LEFT, "A", "A:A");
testExtendRangeUp("B:C", SpreadsheetViewportSelectionAnchor.LEFT,"Z", "B:C");

testExtendRangeUp("A:A", SpreadsheetViewportSelectionAnchor.RIGHT,"Z", "A:A");
testExtendRangeUp("B:C", SpreadsheetViewportSelectionAnchor.RIGHT,"Z", "B:C");

// extendRangeDown......................................................................................................

function testExtendRangeDown(range, anchor, current, expected) {
    test("extendRangeDown " + range + " " + anchor,
        () => {
            expect(SpreadsheetColumnReferenceRange.parse(range)
                .extendRangeDown(anchor, SpreadsheetColumnReference.parse(current), null)
            ).toStrictEqual(
                SpreadsheetColumnReferenceRange.parse(expected)
                    .columnOrRange()
            )
        });
}

testExtendRangeDown("A:A", SpreadsheetViewportSelectionAnchor.LEFT,"Z", "A:A");
testExtendRangeDown("B:B", SpreadsheetViewportSelectionAnchor.LEFT, "Z", "B:B");

testExtendRangeDown("A:A", SpreadsheetViewportSelectionAnchor.RIGHT,"Z", "A:A");
testExtendRangeDown("B:B", SpreadsheetViewportSelectionAnchor.RIGHT, "Z", "B:B");

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
        expect(SpreadsheetColumnReferenceRange.fromJson(range)
            .testCell(SpreadsheetCellReference.parse(cellReference))
        ).toStrictEqual(expected);
    });
}

testCellAndCheck("before", JSON, "A1", false);
testCellAndCheck("after", JSON, "E5", false);
testCellAndCheck("above", JSON, "C1", true);

testCellAndCheck("topLeft", JSON, "B2", true);
testCellAndCheck("topEdge", JSON, "C2", true);
testCellAndCheck("topRight", JSON, "D2", true);

testCellAndCheck("center", JSON, "C3", true);

testCellAndCheck("bottomLeft", JSON, "B4", true);
testCellAndCheck("bottomEdge", JSON, "C4", true);
testCellAndCheck("bottomRight", JSON, "D4", true);

// testColumn...........................................................................................................

test("testColumn missing fails", () => {
    expect(() => range().testColumn())
        .toThrow("Missing columnReference");
});

test("testColumn non SpreadsheetColumnReference fails", () => {
    expect(() => range().testColumn(123))
        .toThrow("Expected SpreadsheetColumnReference columnReference got 123");
});

function testColumnAndCheck(label, range, columnReference, expected) {
    test(label + " testColumn " + range + " " + columnReference, () => {
        expect(SpreadsheetColumnReferenceRange.fromJson(range)
            .testColumn(SpreadsheetColumnReference.parse(columnReference)))
            .toStrictEqual(expected);
    });
}

testColumnAndCheck("before", JSON, "A", false);
testColumnAndCheck("left edge", JSON, "B", true);
testColumnAndCheck("center", JSON, "C", true);
testColumnAndCheck("right edge", JSON, "D", true);
testColumnAndCheck("after", JSON, "E", false);

// testRow...........................................................................................................

test("testRow missing fails", () => {
    expect(() => range()
        .testRow())
        .toThrow("Missing rowReference");
});

test("testRow non SpreadRowReference fails", () => {
    expect(() => range()
        .testRow(123))
        .toThrow("Expected SpreadsheetRowReference rowReference got 123");
});

function testRowAndCheck(label, range, rowReference, expected) {
    test(label + " testRow " + range + " " + rowReference, () => {
        expect(SpreadsheetColumnReferenceRange.fromJson(range)
            .testRow(SpreadsheetRowReference.parse(rowReference))
        ).toStrictEqual(expected);
    });
}

testRowAndCheck("left", JSON, "1", false);
testRowAndCheck("left", JSON, "2", false);
testRowAndCheck("left", JSON, "3", false);

// helpers..............................................................................................................

function check(range, begin, end, json) {
    expect(range.begin())
        .toStrictEqual(begin);
    expect(range.end())
        .toStrictEqual(end);

    expect(range.begin())
        .toBeInstanceOf(SpreadsheetColumnReference);
    expect(range.end())
        .toBeInstanceOf(SpreadsheetColumnReference);

    expect(range.count())
        .toStrictEqual(end.value() - begin.value() + 1);

    expect(range.toJson()).toStrictEqual(json);
    expect(range.toString()).toBe(json);

    expect(SpreadsheetColumnReferenceRange.fromJson(range.toJson()))
        .toStrictEqual(range);
    expect(SpreadsheetColumnReferenceRange.parse(range.toString()))
        .toStrictEqual(range);
}
