import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetRowReferenceRange from "./SpreadsheetRowReferenceRange.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import SpreadsheetViewportSelectionAnchor from "./SpreadsheetViewportSelectionAnchor.js";
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

test("2:3.viewportLeft()",
    () => {
        expect(SpreadsheetRowReferenceRange.parse("2:3")
            .viewportLeft(null)
        ).toStrictEqual(
            SpreadsheetRowReferenceRange.parse("2:3")
        )
    });

test("2:3.viewportRight()",
    () => {
        expect(SpreadsheetRowReferenceRange.parse("2:3")
            .viewportRight(null)
        ).toStrictEqual(
            SpreadsheetRowReferenceRange.parse("2:3")
        )
    });

// viewportUp......................................................................................................

function testViewportUp(row, start, expected) {
    test(row + ".viewportUp " + start,
        () => {
            expect(SpreadsheetRowReferenceRange.parse(row)
                .viewportUp(SpreadsheetRowReference.parse(start))
                .toString()
            ).toStrictEqual(expected)
        });
}

testViewportUp("1:2", "1", "1");
testViewportUp("1:2", "2", "1");

testViewportUp("2:3", "2", "1");
testViewportUp("2:3", "3", "2");

testViewportUp("3:4", "3", "2");
testViewportUp("3:4", "4", "3");

// viewportDown......................................................................................................

function testViewportDown(row, start, expected) {
    test(row + ".viewportDown " + start,
        () => {
            expect(SpreadsheetRowReferenceRange.parse(row)
                .viewportDown(SpreadsheetRowReference.parse(start))
                .toString()
            ).toStrictEqual(expected)
        });
}

testViewportDown("1:2", "1", "2");
testViewportDown("1:2", "2", "3");

testViewportDown("2:3", "2", "3");
testViewportDown("2:3", "3", "4");

testViewportDown("1048575:1048576", "1048575", "1048576");
testViewportDown("1048575:1048576", "1048576", "1048576");

test("2:3.viewportLeftExtend()",
    () => {
        expect(SpreadsheetRowReferenceRange.parse("2:3")
            .viewportLeftExtend(null)
        ).toStrictEqual(
            SpreadsheetRowReferenceRange.parse("2:3")
        )
    });

test("2:3.viewportRightExtend()",
    () => {
        expect(SpreadsheetRowReferenceRange.parse("2:3")
            .viewportRightExtend(null)
        ).toStrictEqual(
            SpreadsheetRowReferenceRange.parse("2:3")
        )
    });

// viewportLeftExtend......................................................................................................

function testViewportLeftExtend(range, expected) {
    const h = home();

    test("viewportLeftExtend " + range + " home=" + h,
        () => {
            expect(SpreadsheetRowReferenceRange.parse(range)
                .viewportLeftExtend(null, null, h)
            ).toStrictEqual(
                SpreadsheetRowReferenceRange.parse(expected)
                    .rowOrRange()
            )
        });
}

testViewportLeftExtend("1:1", "1");
testViewportLeftExtend("2:2", "2");
testViewportLeftExtend("3:4", "3:4");

// viewportRightExtend......................................................................................................

function testViewportRightExtend(range, home, expected) {
    test("viewportRightExtend " + range + " home=" + home,
        () => {
            expect(SpreadsheetRowReferenceRange.parse(range)
                .viewportRightExtend(null, null, SpreadsheetCellReference.parse(home))
            ).toStrictEqual(
                SpreadsheetRowReferenceRange.parse(expected)
                    .rowOrRange()
            )
        });
}

testViewportRightExtend("1:1", "Z99", "1");
testViewportRightExtend("2:2", "Z99","2");
testViewportRightExtend("3:4", "Z99","3:4");

// viewportUpExtend......................................................................................................

function testViewportUpExtend(range, anchor, current, expected) {
    test("viewportUpExtend range=" + range + " anchor=" + anchor + " current=" + current,
        () => {
            expect(SpreadsheetRowReferenceRange.parse(range)
                .viewportUpExtend(anchor, SpreadsheetRowReference.parse(current))
                .toString()
            ).toStrictEqual(
                SpreadsheetRowReferenceRange.parse(expected)
                    .rowOrRange()
                    .setAnchorConditional(anchor)
                    .toString()
            )
        });
}

testViewportUpExtend("1:2", SpreadsheetViewportSelectionAnchor.BOTTOM, "1", "1:2");
testViewportUpExtend("2:3", SpreadsheetViewportSelectionAnchor.BOTTOM, "2", "1:3");
testViewportUpExtend("3:4", SpreadsheetViewportSelectionAnchor.BOTTOM, "3", "2:4");

testViewportUpExtend("1:1", SpreadsheetViewportSelectionAnchor.TOP, "1", "1");
testViewportUpExtend("1:2", SpreadsheetViewportSelectionAnchor.TOP, "2", "1");
testViewportUpExtend("2:3", SpreadsheetViewportSelectionAnchor.TOP, "3", "2");
testViewportUpExtend("3:4", SpreadsheetViewportSelectionAnchor.TOP, "4", "3");
testViewportUpExtend("5:7", SpreadsheetViewportSelectionAnchor.TOP, "7", "5:6");
testViewportUpExtend("7:8", SpreadsheetViewportSelectionAnchor.TOP, "8", "7");
testViewportUpExtend("7:8", SpreadsheetViewportSelectionAnchor.TOP, "9", "7:8");

// viewportDownExtend......................................................................................................

function testViewportDownExtend(range, anchor, current, expected) {
    test("viewportDownExtend range=" + range + " anchor=" + anchor + " current=" + current,
        () => {
            expect(SpreadsheetRowReferenceRange.parse(range)
                .viewportDownExtend(anchor, SpreadsheetRowReference.parse(current))
                .toString()
            ).toStrictEqual(
                SpreadsheetRowReferenceRange.parse(expected)
                    .rowOrRange()
                    .setAnchorConditional(anchor)
                    .toString()
            )
        });
}

testViewportDownExtend("1048576:1048576", SpreadsheetViewportSelectionAnchor.TOP, "1048576", "1048576");
testViewportDownExtend("1:1048576", SpreadsheetViewportSelectionAnchor.TOP, "1048576","1:1048576");
testViewportDownExtend("2:3", SpreadsheetViewportSelectionAnchor.TOP,"3", "2:4");
testViewportDownExtend("3:5", SpreadsheetViewportSelectionAnchor.TOP,"5", "3:6");

testViewportDownExtend("1048576:1048576", SpreadsheetViewportSelectionAnchor.BOTTOM, "1048576", "1048576");
testViewportDownExtend("1:1048576", SpreadsheetViewportSelectionAnchor.BOTTOM,"1", "2:1048576");
testViewportDownExtend("2:3", SpreadsheetViewportSelectionAnchor.BOTTOM,"2", "3");
testViewportDownExtend("5:7", SpreadsheetViewportSelectionAnchor.BOTTOM,"5", "6:7");
testViewportDownExtend("5:6", SpreadsheetViewportSelectionAnchor.BOTTOM,"5", "6");

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
