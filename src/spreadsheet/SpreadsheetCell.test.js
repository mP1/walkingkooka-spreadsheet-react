import lengthFromJson from "../text/LengthFromJson.js";
import React from "react";
import SpreadsheetCell from "./SpreadsheetCell.js";
import SpreadsheetCellFormat from "./SpreadsheetCellFormat";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference";
import SpreadsheetFormula from "./SpreadsheetFormula";
import systemObjectTesting from "../SystemObjectTesting.js";
import TableCell from "@material-ui/core/TableCell";
import Text from "../text/Text";
import TextStyle from "../text/TextStyle";

function cell() {
    return new SpreadsheetCell(reference(),
        formula(),
        style(),
        format(),
        formatted());
}

function reference() {
    return SpreadsheetCellReference.parse("A99");
}

function formula() {
    return new SpreadsheetFormula("1+2");
}

function style() {
    return TextStyle.fromJson({"color": "#123456"});
}

function format() {
    return new SpreadsheetCellFormat("#.##");
}

function formatted() {
    return new Text("1+2 formatted");
}

function onClick() {
    return true;
}

function onKeyDown() {
}

systemObjectTesting(
    cell(),
    new SpreadsheetCell(
        SpreadsheetCellReference.parse("Z99"),
        formula(),
        style(),
        format(),
        new Text("different")
    ),
    SpreadsheetCell.fromJson,
    "Missing json",
    "spreadsheet-cell",
    {
        "A99": {
            formula: formula().toJson(),
            format: format().toJson(),
            formatted: formatted().toJson(),
            style: style().toJson(),
        }
    }
);

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

test("create with missing style fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula())).toThrow("Missing style");
});

test("create with invalid style fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), 1.5)).toThrow("Expected TextStyle style got 1.5");
});

test("create with invalid format fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), style(), 1.5)).toThrow("Expected SpreadsheetCellFormat or nothing format got 1.5");
});

test("create with invalid formatted fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), style(), format(), 1.5)).toThrow("Expected TextNode or nothing formatted got 1.5");
});

test("create reference, formula, TextStyle.EMPTY, format, formatted", () => {
    const r = reference();
    const f = formula();
    const style = TextStyle.EMPTY;
    const f2 = format();
    const f3 = formatted();

    check(new SpreadsheetCell(r, f, style, f2, f3), r, f, style, f2, f3, {
        "A99": {
            formula: f.toJson(),
            format: f2.toJson(),
            formatted: f3.toJson()
        }
    })
})

test("create reference, formula, style, missing format, formatted", () => {
    const r = reference();
    const f = formula();
    const s = style();
    const format = undefined;
    const f3 = formatted();

    check(new SpreadsheetCell(r, f, s, format, f3), r, f, s, format, f3, {
        "A99": {
            formula: f.toJson(),
            style: s.toJson(),
            formatted: f3.toJson()
        }
    })
})

test("create reference, formula, style, format, missing formatted", () => {
    const r = reference();
    const f = formula();
    const s = style();
    const f2 = format();
    const f3 = undefined;

    check(new SpreadsheetCell(r, f, s, f2, f3), r, f, s, f2, f3, {
        "A99": {
            formula: f.toJson(),
            style: s.toJson(),
            format: f2.toJson(),
        }
    })
});

test("create reference, formula, TextStyle.EMPTY", () => {
    const r = reference();
    const f = formula();
    const s = TextStyle.EMPTY;
    const format = undefined;
    const formatted = undefined;

    check(new SpreadsheetCell(r, f, s, format, formatted), r, f, s, format, formatted, {
        "A99": {
            formula: f.toJson()
        }
    })
});

test("create reference, formula, style, format, formatted", () => {
    const r = reference();
    const f = formula();
    const s = style();
    const f2 = format();
    const f3 = formatted();

    check(new SpreadsheetCell(r, f, s, f2, f3), r, f, s, f2, f3, {
        "A99": {
            formula: f.toJson(),
            style: s.toJson(),
            format: f2.toJson(),
            formatted: f3.toJson()
        }
    })
});

test("create ABSOLUTE reference, formula, style, format, formatted", () => {
    const r = SpreadsheetCellReference.parse("$B$78");
    const f = formula();
    const s = style();
    const f2 = format();
    const f3 = formatted();

    check(new SpreadsheetCell(r, f, s, f2, f3),
        r.toRelative(),
        f,
        s,
        f2,
        f3,
        {
            "B78": {
                formula: f.toJson(),
                style: s.toJson(),
                format: f2.toJson(),
                formatted: f3.toJson()
            }
        })
});

// fromJson.............................................................................................................

test("fromJson missing style", () => {
    const r = SpreadsheetCellReference.parse("$B$78");
    const f = formula();
    const s = TextStyle.EMPTY;
    const f2 = format();
    const f3 = formatted();

    expect(SpreadsheetCell.fromJson({
        "B78": {
            formula: f.toJson(),
            format: f2.toJson(),
            formatted: f3.toJson()
        }
    })).toStrictEqual(new SpreadsheetCell(r, f, s, f2, f3));
});

test("fromJson missing style, format, formatted", () => {
    const r = SpreadsheetCellReference.parse("$B$78");
    const f = formula();
    const s = TextStyle.EMPTY;
    const f2 = undefined;
    const f3 = undefined;

    expect(SpreadsheetCell.fromJson({
        "B78": {
            formula: f.toJson(),
        }
    })).toStrictEqual(new SpreadsheetCell(r, f, s, f2, f3));
});

// setFormula...........................................................................................................

test("setFormula missing fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), style()).setFormula()).toThrow("Missing formula");
});

test("setFormula invalid type fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), style()).setFormula("!invalid")).toThrow("Expected SpreadsheetFormula formula got !invalid");
});

test("setFormula same", () => {
    const f = formula();
    const cell = new SpreadsheetCell(reference(), f, style());

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
            "A99": {
                formula: differentFormula.toJson(),
                style: s.toJson(),
                format: f2.toJson(),
                formatted: f3.toJson()
            }
        });
});

// render...............................................................................................................

test("render missing defaultStyle fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), style())
        .render())
        .toThrow("Missing defaultStyle");
});

test("render invalid defaultStyle fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), style())
        .render("!invalid"))
        .toThrow("Expected TextStyle defaultStyle got !invalid");
});

test("render missing onClick fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), style())
        .render(TextStyle.EMPTY))
        .toThrow("Missing onClick");
});

test("render invalid onClick fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), style())
        .render(TextStyle.EMPTY,"!invalid"))
        .toThrow("Expected function onClick got !invalid");
});

test("render empty style, text & defaultStyle EMPTY", () => {
    const text = "text-abc123";
    const ref = reference();
    const c = onClick;
    const kd = onKeyDown;

    expect(new SpreadsheetCell(ref,
        formula(),
        TextStyle.EMPTY,
        format(),
        new Text(text))
        .render(TextStyle.EMPTY, c, kd))
        .toEqual(<TableCell key={ref}
                            id="cell-A99"
                            tabIndex={0}
                            onClick={c}
                            onKeyDown={kd}
                            className={"cell"}
                            style={{boxSizing: "border-box"}}>{text}</TableCell>);
});

test("render empty style, text & defaultStyle EMPTY 2", () => {
    const text = "text-abc123";
    const ref = SpreadsheetCellReference.parse("B123");
    const c = onClick;
    const kd = onKeyDown;

    expect(new SpreadsheetCell(ref,
        formula(),
        TextStyle.EMPTY,
        format(),
        new Text(text))
        .render(TextStyle.EMPTY, c, kd))
        .toEqual(<TableCell key={ref}
                            id="cell-B123"
                            tabIndex={0}
                            onClick={c}
                            onKeyDown={kd}
                            className={"cell"}
                            style={{boxSizing: "border-box"}}>{text}</TableCell>);
});

test("render empty style, text & defaultStyle width&height", () => {
    const text = "text-abc123";
    const r = reference();
    const c = onClick;
    const kd = onKeyDown;

    expect(new SpreadsheetCell(r,
        formula(),
        TextStyle.EMPTY,
        format(),
        new Text(text))
        .render(
            TextStyle.EMPTY
                .set("width", lengthFromJson("100px"))
                .set("height", lengthFromJson("50px")),
            c,
            kd))
        .toEqual(<TableCell key={r}
                            id="cell-A99"
                            tabIndex={0}
                            onClick={c}
                            onKeyDown={kd}
                            className={"cell"}
                            style={{boxSizing: "border-box", width: "100px", height: "50px"}}>{text}</TableCell>);
});

test("render style=width&height, text & defaultStyle=empty", () => {
    const text = "text-abc123";
    const r = reference();
    const c = onClick;
    const kd = onKeyDown;

    expect(new SpreadsheetCell(r,
        formula(),
        TextStyle.EMPTY
            .set("width", lengthFromJson("100px"))
            .set("height", lengthFromJson("50px")),
        format(),
        new Text(text))
        .render(TextStyle.EMPTY, c, kd))
        .toEqual(<TableCell key={r}
                            id="cell-A99"
                            tabIndex={0}
                            onClick={c}
                            onKeyDown={kd}
                            className={"cell"}
                            style={{boxSizing: "border-box", width: "100px", height: "50px"}}>{text}</TableCell>);
});

test("render style=height, text & defaultStyle=width", () => {
    const text = "text-abc123";
    const r = reference();
    const c = onClick;
    const kd = onKeyDown;

    expect(new SpreadsheetCell(r,
        formula(),
        TextStyle.EMPTY
            .set("height", lengthFromJson("50px")),
        format(),
        new Text(text))
        .render(TextStyle.EMPTY
                .set("width", lengthFromJson("100px")),
            c,
            kd))
        .toEqual(<TableCell key={r}
                            id="cell-A99"
                            tabIndex={0}
                            onClick={c}
                            onKeyDown={kd}
                            className={"cell"}
                            style={{boxSizing: "border-box", width: "100px", height: "50px"}}>{text}</TableCell>);
});

test("render style=width&height, text & defaultStyle=width", () => {
    const text = "text-abc123";
    const r = reference();
    const c = onClick;
    const kd = onKeyDown;

    expect(new SpreadsheetCell(r,
        formula(),
        TextStyle.EMPTY
            .set("width", lengthFromJson("100px"))
            .set("height", lengthFromJson("50px")),
        format(),
        new Text(text))
        .render(TextStyle.EMPTY
                .set("width", lengthFromJson("99px")),
            c,
            kd))
        .toEqual(<TableCell id="cell-A99"
                            key={r}
                            tabIndex={0}
                            onClick={c}
                            onKeyDown={kd}
                            className={"cell"}
                            style={{boxSizing: "border-box", width: "100px", height: "50px"}}>{text}</TableCell>);
});

// equals...............................................................................................................

test("equals different reference false", () => {
    const c = cell();
    expect(c.equals(new SpreadsheetCell(SpreadsheetCellReference.parse("Z9"),
        formula(),
        style(),
        format(),
        formatted())
    )).toBeFalse();
});

test("equals different format false", () => {
    const c = cell();
    expect(c.equals(new SpreadsheetCell(reference(),
        formula().setText("999"),
        style(),
        format(),
        formatted())
    )).toBeFalse();
});

test("equals different style false", () => {
    const c = cell();
    expect(c.equals(new SpreadsheetCell(reference(),
        formula(),
        TextStyle.EMPTY,
        format(),
        formatted())
    )).toBeFalse();
});

test("equals different format false", () => {
    const c = cell();
    expect(c.equals(new SpreadsheetCell(reference(),
        formula(),
        style(),
        new SpreadsheetCellFormat("0"),
        formatted())
    )).toBeFalse();
});

test("equals different formatted false", () => {
    const c = cell();
    expect(c.equals(new SpreadsheetCell(reference(),
        formula(),
        style(),
        format(),
        new Text("different"))
    )).toBeFalse();
});

test("equals equivalent true", () => {
    const c = cell();
    expect(c.equals(cell())).toBeTrue();
});

test("equals equivalent true #2", () => {
    const r = SpreadsheetCellReference.parse("Z9");
    const f = formula();
    const s = style();
    const f2 = format();
    const f3 = formatted();

    const c = new SpreadsheetCell(r, f, s, f2, f3);
    expect(c.equals(new SpreadsheetCell(r, f, s, f2, f3))).toBeTrue();
});

// helpers..............................................................................................................

function check(cell, reference, formula, style, format, formatted, json) {
    expect(cell.reference()).toStrictEqual(reference);
    expect(cell.reference()).toBeInstanceOf(SpreadsheetCellReference);

    expect(cell.formula()).toStrictEqual(formula);
    expect(cell.formula()).toBeInstanceOf(SpreadsheetFormula);

    expect(cell.style()).toStrictEqual(style);

    if(style){
        expect(cell.style()).toBeInstanceOf(TextStyle);
    }

    expect(cell.format()).toStrictEqual(format);

    if(format){
        expect(cell.format()).toBeInstanceOf(SpreadsheetCellFormat);
    }

    expect(cell.formatted()).toStrictEqual(formatted);
    if(formatted){
        expect(cell.formatted()).toBeInstanceOf(Text);
    }

    expect(cell.toJson()).toStrictEqual(json);
    expect(cell.toString()).toBe(JSON.stringify(json));

    expect(SpreadsheetCell.fromJson(cell.toJson())).toStrictEqual(cell);
}
