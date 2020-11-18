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
