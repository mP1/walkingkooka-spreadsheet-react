import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference";
import SpreadsheetRowReference from "./SpreadsheetRowReference";

function column() {
    return SpreadsheetColumnReference.parse("A");
};

function row() {
    return SpreadsheetRowReference.parse("1");
};

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

test("fromJson null fails", () => {
    expect(() => SpreadsheetCellReference.fromJson(null)).toThrow("Missing text");
});

test("fromJson A1", () => {
    check(SpreadsheetCellReference.fromJson("A1"),
        column(),
        row(),
        "A1");
});

test("fromJson $A$1", () => {
    check(SpreadsheetCellReference.fromJson("$A$1"),
        SpreadsheetColumnReference.parse("$A"),
        SpreadsheetRowReference.parse("$1"),
        "$A$1");
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

// equals................................................................................................................

test("equals undefined false", () => {
    expect(SpreadsheetCellReference.parse("A1").equals()).toStrictEqual(false);
});

test("equals null false", () => {
    expect(SpreadsheetCellReference.parse("B2").equals(null)).toStrictEqual(false);
});

test("equals invalid false", () => {
    expect(SpreadsheetCellReference.parse("C3").equals("!invalid")).toStrictEqual(false);
});

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
