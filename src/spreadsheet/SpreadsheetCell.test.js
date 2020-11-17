import SpreadsheetCell from "./SpreadsheetCell";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference";
import SpreadsheetFormula from "./SpreadsheetFormula";
import SpreadsheetCellFormat from "./SpreadsheetCellFormat";
import TextStyle from "../text/TextStyle";
import Text from "../text/Text";

function reference() {
    return new SpreadsheetCellReference("A99");
}

function formula() {
    return new SpreadsheetFormula("1+2");
}

function style() {
    return new TextStyle({"color": "#123"});
}

function format() {
    return new SpreadsheetCellFormat("#.##");
}

function formatted() {
    return new Text("1+2 formatted");
}

// constructor(reference, formula, style, format, formatted) {

test("create without reference fails", () => {
    expect(() => new SpreadsheetCell()).toThrow("Missing reference");
});

test("create with invalid reference fails", () => {
    expect(() => new SpreadsheetCell(1.5)).toThrow("Expected SpreadsheetCellReference reference got 1.5");
});

test("create without formula fails", () => {
    expect(() => new SpreadsheetCell(reference())).toThrow("Missing formula");
});

test("create with invalid formula fails", () => {
    expect(() => new SpreadsheetCell(reference(), 1.5)).toThrow("Expected SpreadsheetFormula formula got 1.5");
});

test("create with invalid style fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), 1.5)).toThrow("Expected TextStyle style got 1.5");
});

test("create with invalid format fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), style(), 1.5)).toThrow("Expected SpreadsheetCellFormat format got 1.5");
});

test("create with invalid formatted fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), style(), format(), 1.5)).toThrow("Expected TextNode formatted got 1.5");
});

test("create reference, formula, missing style, format, formatted", () => {
    const r = reference();
    const f = formula();
    const style = undefined;
    const f2 = format();
    const f3 = formatted();

    check(new SpreadsheetCell(r, f, style, f2, f3), r, f, style, f2, f3, {
        reference: r.toJson(),
        formula: f.toJson(),
        format: f2.toJson(),
        formatted: f3.toJson()
    })
})

test("create reference, formula, style, missing format, formatted", () => {
    const r = reference();
    const f = formula();
    const s = style();
    const format = undefined;
    const f3 = formatted();

    check(new SpreadsheetCell(r, f, s, format, f3), r, f, s, format, f3, {
        reference: r.toJson(),
        formula: f.toJson(),
        style: s.toJson(),
        formatted: f3.toJson()
    })
})

test("create reference, formula, style, format, missing formatted", () => {
    const r = reference();
    const f = formula();
    const s = style();
    const f2 = format();
    const f3 = undefined;

    check(new SpreadsheetCell(r, f, s, f2, f3), r, f, s, f2, f3, {
        reference: r.toJson(),
        formula: f.toJson(),
        style: s.toJson(),
        format: f2.toJson(),
    })
});

test("create reference, formula", () => {
    const r = reference();
    const f = formula();
    const s = undefined;
    const format = undefined;
    const formatted = undefined;

    check(new SpreadsheetCell(r, f, s, format, formatted), r, f, s, format, formatted, {
        reference: r.toJson(),
        formula: f.toJson()
    })
});

test("create reference, formula, style, format, formatted", () => {
    const r = reference();
    const f = formula();
    const s = style();
    const f2 = format();
    const f3 = formatted();

    check(new SpreadsheetCell(r, f, s, f2, f3), r, f, s, f2, f3, {
        reference: r.toJson(),
        formula: f.toJson(),
        style: s.toJson(),
        format: f2.toJson(),
        formatted: f3.toJson()
    })
});

test("fromJson null fails", () => {
    expect(() => SpreadsheetCell.fromJson(null)).toThrow("Missing json");
});

// setFormula...........................................................................................................

test("setFormula missing fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula()).setFormula()).toThrow("Missing formula");
});

test("setFormula invalid type fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula()).setFormula("!invalid")).toThrow("Expected SpreadsheetFormula formula got !invalid");
});

test("setFormula same", () => {
    const f = formula();
    const cell = new SpreadsheetCell(reference(), f);

    expect(cell.setFormula(f)).toStrictEqual(cell);
});

test("setFormula different", () => {
    const r = reference();
    const f = formula();
    const s = style();
    const f2 = format();
    const f3 = formatted();

    const cell = new SpreadsheetCell(r, f, s, f2, f3);

    const differentFormula = new SpreadsheetFormula("3+4");
    expect(differentFormula).not.toStrictEqual(f);

    const different = cell.setFormula(differentFormula);
    check(different,
        r,
        differentFormula,
        s,
        f2,
        f3,
        {
            reference: r.toJson(),
            formula: differentFormula.toJson(),
            style: s.toJson(),
            format: f2.toJson(),
            formatted: f3.toJson()
        });
});

// helpers..............................................................................................................

function check(cell, reference, formula, style, format, formatted, json) {
    expect(cell.reference()).toStrictEqual(reference);
    expect(cell.reference()).toBeInstanceOf(SpreadsheetCellReference);

    expect(cell.formula()).toStrictEqual(formula);
    expect(cell.formula()).toBeInstanceOf(SpreadsheetFormula);

    expect(cell.style()).toStrictEqual(style);

    if (style) {
        expect(cell.style()).toBeInstanceOf(TextStyle);
    }

    expect(cell.format()).toStrictEqual(format);

    if (format) {
        expect(cell.format()).toBeInstanceOf(SpreadsheetCellFormat);
    }

    expect(cell.formatted()).toStrictEqual(formatted);
    if (formatted) {
        expect(cell.formatted()).toBeInstanceOf(Text);
    }

    expect(cell.toJson()).toStrictEqual(json);
    expect(cell.toString()).toBe(JSON.stringify(json));

    expect(SpreadsheetCell.fromJson(cell.toJson())).toStrictEqual(cell);
}
