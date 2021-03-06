import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference";
import SpreadsheetRowReference from "./SpreadsheetRowReference";
import systemObjectTesting from "../../SystemObjectTesting.js";

function column() {
    return SpreadsheetColumnReference.parse("A");
};

function row() {
    return SpreadsheetRowReference.parse("1");
};

systemObjectTesting(
    new SpreadsheetCellReference(column(), row()),
    new SpreadsheetCellReference(
        SpreadsheetColumnReference.parse("Z"),
        SpreadsheetRowReference.parse("9")
    ),
    SpreadsheetCellReference.fromJson,
    "Missing text",
    "spreadsheet-cell-reference",
    "A1"
);

// isCellReferenceText..................................................................................................

test("isCellReferenceText null fails", () => {
    expect(() => SpreadsheetCellReference.isCellReferenceText(null)).toThrow("Missing text");
});

test("isCellReferenceText non string fails", () => {
    expect(() => SpreadsheetCellReference.isCellReferenceText(1.5)).toThrow("Expected string text got 1.5");
});

function testIsCellReferenceText(text, expected) {
    test("isCellReferenceText \"" + text + "\"", () => {
        expect(
            SpreadsheetCellReference.isCellReferenceText(text)
        ).toEqual(expected);
    });
}

testIsCellReferenceText("", false);
testIsCellReferenceText("!", false);
testIsCellReferenceText("9", false);
testIsCellReferenceText("A1!", false);
testIsCellReferenceText("A1", true);
testIsCellReferenceText("a1", true);
testIsCellReferenceText("$A1", true);
testIsCellReferenceText("B12", true);
testIsCellReferenceText("$B12", true);
testIsCellReferenceText("C123", true);
testIsCellReferenceText("$C123", true);
testIsCellReferenceText("ZZ9", true);
testIsCellReferenceText("$ZZ9", true);
testIsCellReferenceText("LABEL", false);
testIsCellReferenceText("LABEL123", false);

// create...............................................................................................................

test("create without column fails", () => {
    expect(() => new SpreadsheetCellReference(null)).toThrow("Missing column");
});

test("create with non SpreadsheetColumnReference fails", () => {
    expect(() => new SpreadsheetCellReference(1.5)).toThrow("Expected SpreadsheetColumnReference column got 1.5");
});

test("create without row fails", () => {
    expect(() => new SpreadsheetCellReference(column())).toThrow("Missing row");
});

test("create with non SpreadsheetRowReference fails", () => {
    expect(() => new SpreadsheetCellReference(column(), 1.5)).toThrow("Expected SpreadsheetRowReference row got 1.5");
});

test("create A1", () => {
    const c = column();
    const r = row();
    const cell = new SpreadsheetCellReference(c, r);

    check(cell,
        c,
        r,
        "A1");
});

test("create BC987", () => {
    const c = SpreadsheetColumnReference.parse("$BC");
    const r = SpreadsheetRowReference.parse("$987");
    const cell = new SpreadsheetCellReference(c, r);

    check(cell,
        c,
        r,
        "$BC$987");
});

// parse.............................................................................................................

test("parse null fails", () => {
    expect(() => SpreadsheetCellReference.parse(null)).toThrow("Missing text");
});

test("parse empty fails", () => {
    expect(() => SpreadsheetCellReference.parse("")).toThrow("Missing text");
});

test("parse invalid column fails", () => {
    expect(() => SpreadsheetCellReference.parse("1")).toThrow("Invalid character '1' at 0");
});

test("parse invalid column fails #2", () => {
    expect(() => SpreadsheetCellReference.parse("12")).toThrow("Invalid character '1' at 0");
});

test("parse missing row fails", () => {
    expect(() => SpreadsheetCellReference.parse("A")).toThrow("Missing row");
});

test("parse missing row fails #2", () => {
    expect(() => SpreadsheetCellReference.parse("A$")).toThrow("Missing row");
});

test("parse invalid row fails", () => {
    expect(() => SpreadsheetCellReference.parse("A!")).toThrow("Invalid character '!' at 1");
});

test("parse invalid row fails #2", () => {
    expect(() => SpreadsheetCellReference.parse("A1!")).toThrow("Invalid character '!' at 2");
});

test("parse A2", () => {
    check(SpreadsheetCellReference.parse("A2"),
        SpreadsheetColumnReference.parse("A"),
        SpreadsheetRowReference.parse("2"),
        "A2");
});

test("parse $C3", () => {
    check(SpreadsheetCellReference.parse("$C3"),
        SpreadsheetColumnReference.parse("$C"),
        SpreadsheetRowReference.parse("3"),
        "C$3");
});

test("parse E$4", () => {
    check(SpreadsheetCellReference.parse("E$4"),
        SpreadsheetColumnReference.parse("E"),
        SpreadsheetRowReference.parse("$4"),
        "E$4");
});

test("parse $G$6", () => {
    check(SpreadsheetCellReference.parse("$G$6"),
        SpreadsheetColumnReference.parse("$G"),
        SpreadsheetRowReference.parse("$6"),
        "$G$6");
});

test("parse $i$8 lowercased", () => {
    check(SpreadsheetCellReference.parse("$i$8"),
        SpreadsheetColumnReference.parse("$i"),
        SpreadsheetRowReference.parse("$8"),
        "$I$8");
});

// fromJson.............................................................................................................

test("fromJson A2", () => {
    check(SpreadsheetCellReference.fromJson("A2"),
        SpreadsheetColumnReference.parse("A"),
        SpreadsheetRowReference.parse("2"),
        "A2");
});

test("fromJson $C3", () => {
    check(SpreadsheetCellReference.fromJson("$C3"),
        SpreadsheetColumnReference.parse("$C"),
        SpreadsheetRowReference.parse("3"),
        "C$3");
});

test("fromJson E$4", () => {
    check(SpreadsheetCellReference.fromJson("E$4"),
        SpreadsheetColumnReference.parse("E"),
        SpreadsheetRowReference.parse("$4"),
        "E$4");
});

test("fromJson $G$6", () => {
    check(SpreadsheetCellReference.fromJson("$G$6"),
        SpreadsheetColumnReference.parse("$G"),
        SpreadsheetRowReference.parse("$6"),
        "$G$6");
});

// setColumn............................................................................................................

test("setColumn missing fails", () => {
    expect(() => new SpreadsheetCellReference(column(), row()).setColumn()).toThrow("Missing column");
});

test("setColumn with non SpreadsheetRowReference fails", () => {
    expect(() => new SpreadsheetCellReference(column(), row()).setColumn("!invalid")).toThrow("Expected SpreadsheetColumnReference column got !invalid");
});

test("setColumn same", () => {
    const c = column();
    const reference = new SpreadsheetCellReference(c, row());
    expect(reference.setColumn(c)).toEqual(reference);
});

test("setColumn different ABSOLUTE", () => {
    const r = row();
    const reference = new SpreadsheetCellReference(column(), r);
    const different = SpreadsheetColumnReference.parse("XY");
    expect(reference.setColumn(different)).toEqual(new SpreadsheetCellReference(different, r));
});

test("setColumn different RELATIVE", () => {
    const r = row();
    const reference = new SpreadsheetCellReference(column(), r);
    const different = SpreadsheetColumnReference.parse("YZ");
    expect(reference.setColumn(different)).toEqual(new SpreadsheetCellReference(different, r));
});

// addColumn............................................................................................................

test("addColumn delta 0", () => {
    const reference = new SpreadsheetCellReference(column(), row());
    expect(reference.addColumn(0)).toEqual(reference);
});

test("addColumn delta 1", () => {
    expect(
        SpreadsheetCellReference.parse("B2")
            .addColumn(1)
    ).toEqual(SpreadsheetCellReference.parse("C2"));
});

test("addColumn delta -1", () => {
    expect(
        SpreadsheetCellReference.parse("B2")
            .addColumn(-1)
    ).toEqual(SpreadsheetCellReference.parse("A2"));
});

test("addColumn delta -10 underflow", () => {
    expect(() => SpreadsheetCellReference.parse("B2").addColumn(-3))
        .toThrow("Invalid value not between 0 and 16384 got -2");
});

test("addColumn delta +10 overflow", () => {
    expect(() => SpreadsheetCellReference.parse("B2").addColumn(SpreadsheetColumnReference.MAX))
        .toThrow("Invalid value not between 0 and 16384 got 16385");
});

// addColumnSaturated............................................................................................................

test("addColumnSaturated delta 0", () => {
    const reference = new SpreadsheetCellReference(column(), row());
    expect(reference.addColumnSaturated(0)).toEqual(reference);
});

test("addColumnSaturated delta 1", () => {
    expect(
        SpreadsheetCellReference.parse("B2")
            .addColumnSaturated(1)
    ).toEqual(SpreadsheetCellReference.parse("C2"));
});

test("addColumnSaturated delta -1", () => {
    expect(
        SpreadsheetCellReference.parse("B2")
            .addColumnSaturated(-1)
    ).toEqual(SpreadsheetCellReference.parse("A2"));
});

test("addColumnSaturated delta underflow", () => {
    expect(
        SpreadsheetCellReference.parse("B2")
            .addColumnSaturated(-3)
    ).toEqual(SpreadsheetCellReference.parse("A2"));
});

test("addColumnSaturated delta overflow", () => {
    expect(
        SpreadsheetCellReference.parse("B2")
            .addColumnSaturated(1024 * 1024)
    ).toEqual(SpreadsheetCellReference.parse("XFD2"));
});

// setRow............................................................................................................

test("setRow missing fails", () => {
    expect(() => new SpreadsheetCellReference(column(), row()).setRow()).toThrow("Missing row");
});

test("setRow with non SpreadsheetRowReference fails", () => {
    expect(() => new SpreadsheetCellReference(column(), row()).setRow("!invalid")).toThrow("Expected SpreadsheetRowReference row got !invalid");
});

test("setRow same", () => {
    const r = row();
    const reference = new SpreadsheetCellReference(column(), r);
    expect(reference.setRow(r)).toEqual(reference);
});

test("setRow different ABSOLUTE", () => {
    const c = column();
    const reference = new SpreadsheetCellReference(c, row());
    const different = SpreadsheetRowReference.parse("$34");
    expect(reference.setRow(different)).toEqual(new SpreadsheetCellReference(c, different));
});

test("setRow different RELATIVE", () => {
    const c = column();
    const reference = new SpreadsheetCellReference(c, row());
    const different = SpreadsheetRowReference.parse("45");
    expect(reference.setRow(different)).toEqual(new SpreadsheetCellReference(c, different));
});

// addRow............................................................................................................

test("addRow delta 0", () => {
    const reference = new SpreadsheetCellReference(column(), row());
    expect(reference.addRow(0)).toEqual(reference);
});

test("addRow delta 1", () => {
    expect(
        SpreadsheetCellReference.parse("B2")
            .addRow(1)
    ).toEqual(SpreadsheetCellReference.parse("B3"));
});

test("addRow delta -1", () => {
    expect(
        SpreadsheetCellReference.parse("B3")
            .addRow(-1)
    ).toEqual(SpreadsheetCellReference.parse("B2"));
});

test("addRow delta underflow", () => {
    expect(() => SpreadsheetCellReference.parse("B2").addRow(-3)).toThrow("Invalid value not between 0 and 1048576 got -2");
});

test("addRow delta overflow", () => {
    expect(() => SpreadsheetCellReference.parse("B1048576").addRow(+3)).toThrow("Invalid value not between 0 and 1048576 got 1048578");
});

// addRowSaturated............................................................................................................

test("addRowSaturated delta 0", () => {
    const reference = new SpreadsheetCellReference(column(), row());
    expect(reference.addRowSaturated(0)).toEqual(reference);
});

test("addRowSaturated delta 1", () => {
    expect(
        SpreadsheetCellReference.parse("B2")
            .addRowSaturated(1)
    ).toEqual(SpreadsheetCellReference.parse("B3"));
});

test("addRowSaturated delta -1", () => {
    expect(
        SpreadsheetCellReference.parse("B2")
            .addRowSaturated(-1)
    ).toEqual(SpreadsheetCellReference.parse("B1"));
});

test("addRowSaturated delta underflow", () => {
    expect(
        SpreadsheetCellReference.parse("B2")
            .addRowSaturated(-3)
    ).toEqual(SpreadsheetCellReference.parse("B1"));
});

test("addRowSaturated delta overflow", () => {
    expect(
        SpreadsheetCellReference.parse("B2")
            .addRowSaturated(SpreadsheetRowReference.MAX)
    ).toEqual(SpreadsheetCellReference.parse("B" + SpreadsheetRowReference.MAX));
});

// toRelative............................................................................................................

test("toRelative", () => {
    expect(SpreadsheetCellReference.parse("A1").toRelative()).toEqual(SpreadsheetCellReference.parse("A1"));
});

test("toRelative absolute", () => {
    expect(SpreadsheetCellReference.parse("$B$2").toRelative()).toEqual(SpreadsheetCellReference.parse("B2"));
});

test("toRelative absolute2", () => {
    expect(SpreadsheetCellReference.parse("$C3").toRelative()).toEqual(SpreadsheetCellReference.parse("C3"));
});

// toSpreadsheetNavigateWidgetOption....................................................................................

test("toSpreadsheetNavigateWidgetOption", () => {
    const cell = SpreadsheetCellReference.parse("B2");

    expect(cell.toSpreadsheetNavigateWidgetOption()).toStrictEqual({
        text: "B2",
        createLabel: null,
        editLabel: null,
        gotoCellOrLabel: cell,
    });
});

// equals................................................................................................................

test("equals different column false", () => {
    expect(SpreadsheetCellReference.parse("D4").equals(SpreadsheetCellReference.parse("E4"))).toStrictEqual(false);
});

test("equals different column kind false", () => {
    expect(SpreadsheetCellReference.parse("F5").equals(SpreadsheetCellReference.parse("$F5"))).toStrictEqual(false);
});

test("equals different row false", () => {
    expect(SpreadsheetCellReference.parse("G6").equals(SpreadsheetCellReference.parse("G7"))).toStrictEqual(false);
});

test("equals different row kind false", () => {
    expect(SpreadsheetCellReference.parse("H8").equals(SpreadsheetCellReference.parse("$H8"))).toStrictEqual(false);
});

test("equals", () => {
    expect(SpreadsheetCellReference.parse("I9").equals(SpreadsheetCellReference.parse("I9"))).toStrictEqual(true);
});

test("equals absolute", () => {
    const reference = "$J11";
    expect(SpreadsheetCellReference.parse(reference).equals(SpreadsheetCellReference.parse(reference))).toStrictEqual(true);
});

test("equals absolute #2", () => {
    const reference = "K$12";
    expect(SpreadsheetCellReference.parse(reference).equals(SpreadsheetCellReference.parse(reference))).toStrictEqual(true);
});

test("equals absolute #3", () => {
    const reference = "$L$13";
    expect(SpreadsheetCellReference.parse(reference).equals(SpreadsheetCellReference.parse(reference))).toStrictEqual(true);
});

// helpers..............................................................................................................

function check(cell,
               column,
               row) {
    expect(cell.column()).toStrictEqual(column);
    expect(cell.column()).toBeInstanceOf(SpreadsheetColumnReference);

    expect(cell.row()).toStrictEqual(row);
    expect(cell.row()).toBeInstanceOf(SpreadsheetRowReference);

    const json = "" + column + row;
    expect(cell.toJson()).toStrictEqual(json);
    expect(cell.toString()).toBe(json);

    expect(SpreadsheetCellReference.parse(json)).toStrictEqual(cell);
    expect(SpreadsheetCellReference.fromJson(json)).toStrictEqual(cell);
}
