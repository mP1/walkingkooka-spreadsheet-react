import Keys from "../../Keys.js";
import SpreadsheetCellRange from "./SpreadsheetCellRange.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import systemObjectTesting from "../../SystemObjectTesting.js";
import SpreadsheetViewportSelectionAnchor from "./SpreadsheetViewportSelectionAnchor.js";

function begin() {
    return SpreadsheetCellReference.parse("A1");
}

function end() {
    return SpreadsheetCellReference.parse("B2");
}

function range() {
    return new SpreadsheetCellRange(begin(), end());
}

systemObjectTesting(
    range(),
    new SpreadsheetCellRange(SpreadsheetCellReference.parse("Z9"), SpreadsheetCellReference.parse("Z99")),
    SpreadsheetCellRange.fromJson,
    "Missing text",
    "spreadsheet-cell-range",
    "A1:B2"
);

// create...............................................................................................................

test("create without begin fails", () => {
    expect(() => new SpreadsheetCellRange(null, end())).toThrow("Missing begin");
});

test("create with begin non cell fails", () => {
    expect(() => new SpreadsheetCellRange(1.5, end())).toThrow("Expected SpreadsheetCellReference begin got 1.5");
});

test("create without end fails", () => {
    expect(() => new SpreadsheetCellRange(begin(), null)).toThrow("Missing end");
});

test("create with end non cell fails", () => {
    expect(() => new SpreadsheetCellRange(begin(), true)).toThrow("Expected SpreadsheetCellReference end got true");
});

test("create", () => {
    check(new SpreadsheetCellRange(begin(), end()), begin(), end(), "A1:B2");
});

test("create columns swapped", () => {
    check(new SpreadsheetCellRange(SpreadsheetCellReference.parse("B1"), SpreadsheetCellReference.parse("A2")),
        SpreadsheetCellReference.parse("A1"),
        SpreadsheetCellReference.parse("B2"),
        "A1:B2"
    );
});

test("create rows swapped", () => {
    check(new SpreadsheetCellRange(SpreadsheetCellReference.parse("A2"), SpreadsheetCellReference.parse("B1")),
        SpreadsheetCellReference.parse("A1"),
        SpreadsheetCellReference.parse("B2"),
        "A1:B2"
    );
});

test("create end < begin", () => {
    check(new SpreadsheetCellRange(end(), begin()), begin(), end(), "A1:B2");
});

// parse.............................................................................................................

test("parse missing fails", () => {
    expect(() => SpreadsheetCellRange.parse()).toThrow("Missing text");
});

test("parse null fails", () => {
    expect(() => SpreadsheetCellRange.parse(null)).toThrow("Missing text");
});

test("parse empty fails", () => {
    expect(() => SpreadsheetCellRange.parse("")).toThrow("Missing text");
});

test("parse wrong token count fails", () => {
    expect(() => SpreadsheetCellRange.parse("A1:B2:C3")).toThrow("Expected 1 or 2 tokens got \"A1:B2:C3\"");
});

test("parse only cell", () => {
    const range = SpreadsheetCellRange.parse("A2");
    const cell = SpreadsheetCellReference.parse("A2");
    check(range, cell, cell, "A2");
});

test("parse relative/relative", () => {
    const range = SpreadsheetCellRange.parse("B3:C5");
    const begin = SpreadsheetCellReference.parse("B3");
    const end = SpreadsheetCellReference.parse("C5");

    check(range, begin, end, "B3:C5");
});

test("parse absolute/absolute:relative", () => {
    const range = SpreadsheetCellRange.parse("$D$6:E8");
    const begin = SpreadsheetCellReference.parse("$D$6");
    const end = SpreadsheetCellReference.parse("E8");

    check(range, begin, end, "$D$6:E8");
});

test("parse absolute/relative:relative", () => {
    const range = SpreadsheetCellRange.parse("$F$10:G11");
    const begin = SpreadsheetCellReference.parse("$F$10");
    const end = SpreadsheetCellReference.parse("G11");

    check(range, begin, end, "$F$10:G11");
});

test("parse relative:absolute/absolute", () => {
    const range = SpreadsheetCellRange.parse("H12:$I$13");
    const begin = SpreadsheetCellReference.parse("H12");
    const end = SpreadsheetCellReference.parse("$I$13");

    check(range, begin, end, "H12:$I$13");
});

test("parse relative:absolute/relative", () => {
    const range = SpreadsheetCellRange.parse("J14:$K14");
    const begin = SpreadsheetCellReference.parse("J14");
    const end = SpreadsheetCellReference.parse("$K14");

    check(range, begin, end, "J14:$K14");
});

test("parse lowercase:uppercase", () => {
    const range = SpreadsheetCellRange.parse("l15:M16");
    const begin = SpreadsheetCellReference.parse("l15");
    const end = SpreadsheetCellReference.parse("M16");
    check(range, begin, end, "L15:M16");
});

test("parse lowercase:lowercase", () => {
    const range = SpreadsheetCellRange.parse("n17:o18");
    const begin = SpreadsheetCellReference.parse("n17");
    const end = SpreadsheetCellReference.parse("o18");

    check(range, begin, end, "N17:O18");
});

test("parse lowercase:lowercase/absolute", () => {
    const range = SpreadsheetCellRange.parse("$p$19:$r$20");
    const begin = SpreadsheetCellReference.parse("$p$19");
    const end = SpreadsheetCellReference.parse("$r$20");

    check(range, begin, end, "$P$19:$R$20");
});

// fromJson.............................................................................................................

test("fromJson wrong token count fails", () => {
    expect(() => SpreadsheetCellRange.fromJson("A1:B2:C3"))
        .toThrow("Expected 1 or 2 tokens got \"A1:B2:C3\"");
});

test("fromJson missing begin cell fails", () => {
    expect(() => SpreadsheetCellRange.fromJson(":"))
        .toThrow("Missing begin");
});

test("fromJson missing begin cell fails #2", () => {
    expect(() => SpreadsheetCellRange.fromJson(":B2"))
        .toThrow("Missing begin");
});

test("fromJson invalid begin cell fails", () => {
    expect(() => SpreadsheetCellRange.fromJson("A!:B2"))
        .toThrow("Invalid character '!' at 1");
});

test("fromJson missing end cell fails", () => {
    expect(() => SpreadsheetCellRange.fromJson("A1:"))
        .toThrow("Missing end");
});

test("fromJson invalid end cell fails", () => {
    expect(() => SpreadsheetCellRange.fromJson("A1:B!2"))
        .toThrow("Invalid character '!' at 4");
});

test("fromJson invalid end cell fails #2", () => {
    expect(() => SpreadsheetCellRange.fromJson("A1:B2!"))
        .toThrow("Invalid character '!' at 5");
});

test("fromJson only cell", () => {
    const range = SpreadsheetCellRange.fromJson("A2");
    const cell = SpreadsheetCellReference.parse("A2");

    check(range, cell, cell, "A2");
});

test("fromJson range", () => {
    const range = SpreadsheetCellRange.fromJson("B3:C5");
    const begin = SpreadsheetCellReference.parse("B3");
    const end = SpreadsheetCellReference.parse("C5");

    check(range, begin, end, "B3:C5");
});

test("fromJson range absolute/relative", () => {
    const range = SpreadsheetCellRange.fromJson("D$6:$E7");
    const begin = SpreadsheetCellReference.parse("D$6");
    const end = SpreadsheetCellReference.parse("$E7");

    check(range, begin, end, "D$6:$E7");
});

test("fromJson range lowercase", () => {
    const range = SpreadsheetCellRange.fromJson("f8:g9");
    const begin = SpreadsheetCellReference.parse("f8");
    const end = SpreadsheetCellReference.parse("g9");

    check(range, begin, end, "F8:G9");
});

// setBegin.............................................................................................................

test("setBegin same", () => {
    const r = range();

    expect(r.setBegin(r.begin()))
        .toStrictEqual(r);
});

test("setBegin different", () => {
    expect(SpreadsheetCellRange.parse("B2:C3")
        .setBegin(SpreadsheetCellReference.parse("A1"))
    ).toStrictEqual(SpreadsheetCellRange.parse("A1:C3"));
});

// setEnd.............................................................................................................

test("setEnd same", () => {
    const r = range();

    expect(r.setEnd(r.end()))
        .toStrictEqual(r);
});

test("setEnd different", () => {
    expect(SpreadsheetCellRange.parse("B2:C3")
        .setEnd(SpreadsheetCellReference.parse("D4"))
    ).toStrictEqual(SpreadsheetCellRange.parse("B2:D4"));
});

// width................................................................................................................

test("width A1:B2", () => {
    expect(SpreadsheetCellRange.parse("A1:B2").width())
        .toStrictEqual(2);
});

test("width C3:C4", () => {
    expect(SpreadsheetCellRange.parse("C3:C4").width())
        .toStrictEqual(1);
});

// height................................................................................................................

test("height A1:E2", () => {
    expect(SpreadsheetCellRange.parse("A1:E2").height())
        .toStrictEqual(2);
});

test("height A3:C3", () => {
    expect(SpreadsheetCellRange.parse("A3:C3").height())
        .toStrictEqual(1);
});

// cellOrRange........................................................................................................

function testCellOrRange(range, expected) {
    test("cellOrRange " + range, () => {
        expect(SpreadsheetCellRange.parse(range)
            .cellOrRange()
        ).toStrictEqual(expected.indexOf(":") > 0 ?
            SpreadsheetCellRange.parse(expected) :
            SpreadsheetCellReference.parse(expected));
    });
}

testCellOrRange("A1:B2", "A1:B2");
testCellOrRange("C3:C3", "C3");

// extendRangeLeft......................................................................................................

function testExtendRangeLeft(range, anchor, current, expected) {
    test("extendRangeLeft " + range + " anchor=" + anchor,
        () => {
            expect(SpreadsheetCellRange.parse(range)
                .extendRangeLeft(anchor, SpreadsheetCellReference.parse(current), null)
                .toString()
            ).toStrictEqual(
                expected
            )
        });
}

testExtendRangeLeft("B2:D4", SpreadsheetViewportSelectionAnchor.TOP_LEFT, "D4", "B2:C4 TOP_LEFT");
testExtendRangeLeft("B2:D4", SpreadsheetViewportSelectionAnchor.TOP_RIGHT, "B2", "A2:D4 TOP_RIGHT");

testExtendRangeLeft("B2:D4", SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT, "D4", "B2:C4 BOTTOM_LEFT");
testExtendRangeLeft("B2:D4", SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT, "B2", "A2:D4 BOTTOM_RIGHT");

// extendRangeRight......................................................................................................

function testExtendRangeRight(range, anchor, current, expected) {
    test("extendRangeRight " + range + " anchor=" + anchor,
        () => {
            expect(SpreadsheetCellRange.parse(range)
                .extendRangeRight(anchor, SpreadsheetCellReference.parse(current), null)
                .toString()
            ).toStrictEqual(
                expected
            )
        });
}

testExtendRangeRight("B2:D4", SpreadsheetViewportSelectionAnchor.TOP_LEFT, "D4", "B2:E4 TOP_LEFT");
testExtendRangeRight("B2:D4", SpreadsheetViewportSelectionAnchor.TOP_RIGHT, "B4", "C2:D4 TOP_RIGHT");

testExtendRangeRight("B2:D4", SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT, "B4", "B2:C4 BOTTOM_LEFT");
testExtendRangeRight("B2:D4", SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT, "B2", "C2:D4 BOTTOM_RIGHT");

// extendRangeUp......................................................................................................

function testExtendRangeUp(range, anchor, current, expected) {
    test("extendRangeUp " + range + " anchor=" + anchor,
        () => {
            expect(SpreadsheetCellRange.parse(range)
                .extendRangeUp(anchor, SpreadsheetCellReference.parse(current), null)
                .toString()
            ).toStrictEqual(
                expected
            )
        });
}

testExtendRangeUp("B2:C3", SpreadsheetViewportSelectionAnchor.TOP_LEFT, "B3", "B2:C2 TOP_LEFT");
testExtendRangeUp("B2:C3", SpreadsheetViewportSelectionAnchor.TOP_RIGHT, "B3", "B2:C2 TOP_RIGHT");

testExtendRangeUp("B2:C3", SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT, "B2", "B1:C3 BOTTOM_LEFT");
testExtendRangeUp("B2:C3", SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT, "B2", "B1:C3 BOTTOM_RIGHT");

// extendRangeDown......................................................................................................

function testExtendRangeDown(range, anchor, current, expected) {
    test("extendRangeDown " + range + " anchor=" + anchor,
        () => {
            expect(SpreadsheetCellRange.parse(range)
                .extendRangeDown(anchor, SpreadsheetCellReference.parse(current), null)
                .toString()
            ).toStrictEqual(
                expected
            )
        });
}

testExtendRangeDown("B1048575:B1048576", SpreadsheetViewportSelectionAnchor.TOP_LEFT, "B1048576", "B1048575:B1048576 TOP_LEFT");

testExtendRangeDown("B2:C3", SpreadsheetViewportSelectionAnchor.TOP_LEFT, "B3", "B2:C4 TOP_LEFT");
testExtendRangeDown("B2:C3", SpreadsheetViewportSelectionAnchor.TOP_RIGHT, "B3", "B2:C4 TOP_RIGHT");

testExtendRangeDown("B2:C3", SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT, "B2", "B3:C3 BOTTOM_LEFT");
testExtendRangeDown("B2:C3", SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT, "B2", "B3:C3 BOTTOM_RIGHT");

// onViewportKeyDown....................................................................................................

const SELECT_RANGE_FALSE = false;
const SELECT_RANGE_TRUE = true;

function testOnViewportKeyDown(reference, key, selectRange, viewportHome, saveSelection, giveFormulaFocus) {
    test("testOnViewportKeyDown cell=" + reference + " key=" + key + " selectRange=" + selectRange + " home=" + viewportHome, () => {

        const state = {
            selection: SpreadsheetCellRange.parse(reference).cellOrRange().toString(),
            giveFormulaFocus: false,
        };

        SpreadsheetCellRange.parse(reference)
            .onViewportKeyDown(
                key,
                selectRange,
                null, // selection
                null, // anchor
                SpreadsheetCellReference.parse(viewportHome), // viewport home
                (s) => state.selection = s && s.toString(),
                () => state.giveFormulaFocus = true,
            );
        expect(state)
            .toStrictEqual({
                selection: saveSelection,
                giveFormulaFocus: giveFormulaFocus,
            });
    });
}

testOnViewportKeyDown("A1:B2", "A", SELECT_RANGE_FALSE, "A1", "A1:B2", false);
testOnViewportKeyDown("A1:B2", "A", SELECT_RANGE_TRUE, "A1", "A1:B2", false);

testOnViewportKeyDown("A1:B2", Keys.ESCAPE, SELECT_RANGE_FALSE, "B2", null, false);
testOnViewportKeyDown("A1:B2", Keys.ESCAPE, SELECT_RANGE_TRUE, "B2", null, false);

// selectionFocus......................................................................................................

function testSelectionFocus(range, anchor, expected) {
    test("selectionFocus " + range + " anchor=" + anchor,
        () => {
            expect(SpreadsheetCellRange.parse(range)
                .selectionFocus(null, anchor)
                .toString()
            ).toStrictEqual(
                expected
            )
        });
}
testSelectionFocus("B2:B3", SpreadsheetViewportSelectionAnchor.LEFT, "B3");
testSelectionFocus("B2:C3", SpreadsheetViewportSelectionAnchor.LEFT, "C3");

testSelectionFocus("B2:C3", SpreadsheetViewportSelectionAnchor.TOP, "C3");
testSelectionFocus("B2:C3", SpreadsheetViewportSelectionAnchor.TOP_LEFT, "C3");
testSelectionFocus("B2:C3", SpreadsheetViewportSelectionAnchor.TOP_RIGHT, "B3");

testSelectionFocus("B2:C2", SpreadsheetViewportSelectionAnchor.RIGHT, "B2");
testSelectionFocus("B2:C3", SpreadsheetViewportSelectionAnchor.RIGHT, "B3");

testSelectionFocus("B2:C3", SpreadsheetViewportSelectionAnchor.BOTTOM, "C2");
testSelectionFocus("B2:C3", SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT, "C2");
testSelectionFocus("B2:C3", SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT, "B2");

// testCell.............................................................................................................

test("testCell missing fails", () => {
    expect(() => range()
        .testCell())
        .toThrow("Missing cellReference");
});

test("testCell non SpreadCellReference fails", () => {
    expect(() => range()
        .testCell(123))
        .toThrow("Expected SpreadsheetCellReference cellReference got 123");
});

function testCellAndCheck(label, range, cellReference, expected) {
    test("testCell " + label + " " + range + " testCell " + cellReference, () => {
        expect(SpreadsheetCellRange.fromJson(range)
            .testCell(SpreadsheetCellReference.parse(cellReference)))
            .toStrictEqual(expected);
    });
}

testCellAndCheck("left", "B2:D4", "A1", false);
testCellAndCheck("right", "B2:D4", "E5", false);
testCellAndCheck("above", "B2:D4", "C1", false);
testCellAndCheck("below", "B2:D4", "C5", false);

testCellAndCheck("topLeft", "B2:D4", "B2", true);
testCellAndCheck("topEdge", "B2:D4", "C2", true);
testCellAndCheck("topRight", "B2:D4", "D2", true);

testCellAndCheck("center", "B2:D4", "C3", true);

testCellAndCheck("bottomLeft", "B2:D4", "B4", true);
testCellAndCheck("bottomEdge", "B2:D4", "C4", true);
testCellAndCheck("bottomRight", "B2:D4", "D4", true);

// testColumn...........................................................................................................

test("testColumn missing fails", () => {
    expect(() => range().testColumn())
        .toThrow("Missing columnReference");
});

test("testColumn non SpreadsheetColumnReference fails", () => {
    expect(() => range()
        .testColumn(123))
        .toThrow("Expected SpreadsheetColumnReference columnReference got 123");
});

function testColumnAndCheck(label, range, columnReference, expected) {
    test(label + " testColumn " + range + " " + columnReference, () => {
        expect(SpreadsheetCellRange.fromJson(range).testColumn(SpreadsheetColumnReference.parse(columnReference))).toStrictEqual(expected);
    });
}

testColumnAndCheck("left", "B2:D4", "A", false);
testColumnAndCheck("left edge", "B2:D4", "B", true);
testColumnAndCheck("center", "B2:D4", "C", true);
testColumnAndCheck("right edge", "B2:D4", "D", true);
testColumnAndCheck("right", "B2:D4", "E", false);

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
        expect(SpreadsheetCellRange.fromJson(range)
            .testRow(SpreadsheetRowReference.parse(rowReference)))
            .toStrictEqual(expected);
    });
}

testRowAndCheck("left", "B2:D4", "1", false);
testRowAndCheck("left edge", "B2:D4", "2", true);
testRowAndCheck("center", "B2:D4", "3", true);
testRowAndCheck("right edge", "B2:D4", "4", true);
testRowAndCheck("right", "B2:D4", "5", false);

// equals...............................................................................................................

test("equals self true", () => {
    const r = range();
    expect(r.equals(r))
        .toBeTrue();
});

test("equals different false", () => {
    expect(range().equals(SpreadsheetCellRange.fromJson("C3:D4")))
        .toBeFalse();
});

test("equals equivalent true", () => {
    expect(range().equals(SpreadsheetCellRange.fromJson("A1:B2")))
        .toBeTrue();
});

// helpers..............................................................................................................

function check(range, begin, end, json) {
    expect(range.begin())
        .toStrictEqual(begin);
    expect(range.end())
        .toStrictEqual(end);

    expect(range.begin())
        .toBeInstanceOf(SpreadsheetCellReference);
    expect(range.end())
        .toBeInstanceOf(SpreadsheetCellReference);

    expect(range.toJson())
        .toStrictEqual(json);
    expect(range.toString())
        .toBe(json);

    expect(SpreadsheetCellRange.fromJson(range.toJson()))
        .toStrictEqual(range);
    expect(SpreadsheetCellRange.parse(range.toString()))
        .toStrictEqual(range);
}
