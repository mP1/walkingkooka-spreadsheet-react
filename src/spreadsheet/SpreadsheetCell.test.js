import lengthFromJson from "../text/LengthFromJson.js";
import React from "react";
import SpreadsheetCell from "./SpreadsheetCell.js";
import SpreadsheetCellReference from "./reference/cell/SpreadsheetCellReference.js";
import SpreadsheetExpressionReference from "./reference/SpreadsheetExpressionReference.js";
import SpreadsheetFormatPattern from "./format/SpreadsheetFormatPattern.js";
import SpreadsheetFormula from "./reference/cell/formula/SpreadsheetFormula.js";
import SpreadsheetLabelName from "./reference/label/SpreadsheetLabelName.js";
import SpreadsheetNumberFormatPattern from "./format/SpreadsheetNumberFormatPattern.js";
import SpreadsheetTextFormatPattern from "./format/SpreadsheetTextFormatPattern.js";
import systemObjectTesting from "../SystemObjectTesting.js";
import TableCell from "@mui/material/TableCell";
import Text from "../text/Text";
import TextStyle from "../text/TextStyle";
import Tooltip from "@mui/material/Tooltip";
import TextStyleNode from "../text/TextStyleNode.js";

function cell() {
    return new SpreadsheetCell(reference(),
        formula(),
        style(),
        formatPattern(),
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

function formatPattern() {
    return SpreadsheetTextFormatPattern.parse("@@");
}

function formatted() {
    return new Text("1+2 formatted");
}

systemObjectTesting(
    cell(),
    new SpreadsheetCell(
        SpreadsheetCellReference.parse("Z99"),
        formula(),
        style(),
        formatPattern(),
        new Text("different")
    ),
    SpreadsheetCell.fromJson,
    "Missing json",
    "spreadsheet-cell",
    {
        "A99": {
            formula: formula().toJson(),
            formatPattern: formatPattern().toJsonWithType(),
            formatted: formatted().toJsonWithType(),
            style: style().toJson(),
        }
    }
);

// constructor(reference, formula, style, formatPattern, formatted) {

test("create without reference fails", () => {
    expect(() => new SpreadsheetCell()).toThrow("Missing reference");
});

test("create with invalid reference fails", () => {
    expect(() => new SpreadsheetCell(1.5)).toThrow("Expected SpreadsheetExpressionReference reference got 1.5");
});

test("create with invalid formula fails", () => {
    expect(() => new SpreadsheetCell(reference(), 1.5)).toThrow("Expected SpreadsheetFormula or nothing formula got 1.5");
});

test("create with missing style fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula())).toThrow("Missing style");
});

test("create with invalid style fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), 1.5)).toThrow("Expected TextStyle style got 1.5");
});

test("create with invalid formatPattern fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), style(), 1.5)).toThrow("Expected SpreadsheetFormatPattern or nothing formatPattern got 1.5");
});

test("create with invalid formatted fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), style(), formatPattern(), 1.5)).toThrow("Expected TextNode or nothing formatted got 1.5");
});

test("create reference, formula, TextStyle.EMPTY, formatPattern, formatted", () => {
    const r = reference();
    const f = formula();
    const style = TextStyle.EMPTY;
    const f2 = formatPattern();
    const f3 = formatted();

    check(new SpreadsheetCell(r, f, style, f2, f3), r, f, style, f2, f3, {
        "A99": {
            formula: f.toJson(),
            formatPattern: f2.toJsonWithType(),
            formatted: f3.toJsonWithType()
        }
    })
})

test("create reference, missing formula", () => {
    const r = reference();
    const f = undefined;
    const s = style();
    const f2 = formatPattern();
    const f3 = formatted();

    check(
        new SpreadsheetCell(r, f, s, f2, f3),
        r,
        f,
        s,
        f2,
        f3,
        {
            "A99": {
                style: s.toJson(),
                formatPattern: f2.toJsonWithType(),
                formatted: f3.toJsonWithType()
            }
        })
});

test("create reference, formula, style, missing formatPattern, formatted", () => {
    const r = reference();
    const f = formula();
    const s = style();
    const formatPattern = undefined;
    const f3 = formatted();

    check(new SpreadsheetCell(r, f, s, formatPattern, f3), r, f, s, formatPattern, f3, {
        "A99": {
            formula: f.toJson(),
            style: s.toJson(),
            formatted: f3.toJsonWithType()
        }
    })
})

test("create reference, formula, style, formatPattern, missing formatted", () => {
    const r = reference();
    const f = formula();
    const s = style();
    const f2 = formatPattern();
    const f3 = undefined;

    check(new SpreadsheetCell(r, f, s, f2, f3), r, f, s, f2, f3, {
        "A99": {
            formula: f.toJson(),
            style: s.toJson(),
            formatPattern: f2.toJsonWithType(),
        }
    })
});

test("create reference, formula, TextStyle.EMPTY", () => {
    const r = reference();
    const f = formula();
    const s = TextStyle.EMPTY;
    const formatPattern = undefined;
    const formatted = undefined;

    check(new SpreadsheetCell(r, f, s, formatPattern, formatted), r, f, s, formatPattern, formatted, {
        "A99": {
            formula: f.toJson()
        }
    })
});

test("create reference, formula, style, formatPattern, formatted", () => {
    const r = reference();
    const f = formula();
    const s = style();
    const f2 = formatPattern();
    const f3 = formatted();

    check(new SpreadsheetCell(r, f, s, f2, f3), r, f, s, f2, f3, {
        "A99": {
            formula: f.toJson(),
            style: s.toJson(),
            formatPattern: f2.toJsonWithType(),
            formatted: f3.toJsonWithType()
        }
    })
});

test("create ABSOLUTE reference, formula, style, formatPattern, formatted", () => {
    const r = SpreadsheetCellReference.parse("$B$78");
    const f = formula();
    const s = style();
    const f2 = formatPattern();
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
                formatPattern: f2.toJsonWithType(),
                formatted: f3.toJsonWithType()
            }
        })
});

test("create label, formula, style, formatPattern, formatted", () => {
    const r = SpreadsheetLabelName.parse("Label123");
    const f = formula();
    const s = style();
    const f2 = formatPattern();
    const f3 = formatted();

    check(new SpreadsheetCell(r, f, s, f2, f3),
        r,
        f,
        s,
        f2,
        f3,
        {
            "Label123": {
                formula: f.toJson(),
                style: s.toJson(),
                formatPattern: f2.toJsonWithType(),
                formatted: f3.toJsonWithType()
            }
        })
});

// fromJson.............................................................................................................

test("fromJson missing style", () => {
    const r = SpreadsheetCellReference.parse("$B$78");
    const f = formula();
    const s = TextStyle.EMPTY;
    const f2 = formatPattern();
    const f3 = formatted();

    expect(SpreadsheetCell.fromJson({
        "B78": {
            formula: f.toJson(),
            formatPattern: f2.toJsonWithType(),
            formatted: f3.toJsonWithType()
        }
    })).toStrictEqual(new SpreadsheetCell(r, f, s, f2, f3));
});

test("fromJson missing style, formatPattern, formatted", () => {
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
    const f2 = formatPattern();
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
                formatPattern: f2.toJsonWithType(),
                formatted: f3.toJsonWithType()
            }
        });
});

// renderViewport.......................................................................................................

test("renderViewport missing defaultStyle fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), style())
        .renderViewport())
        .toThrow("Missing defaultStyle");
});

test("renderViewport invalid defaultStyle fails", () => {
    expect(() => new SpreadsheetCell(reference(), formula(), style())
        .renderViewport("!invalid"))
        .toThrow("Expected TextStyle defaultStyle got !invalid");
});

test("renderViewport empty style, text & defaultStyle EMPTY", () => {
    const text = "text-abc123";
    const ref = reference();
    const l = [];

    expect(new SpreadsheetCell(ref,
        formula(),
        TextStyle.EMPTY,
        formatPattern(),
        new Text(text))
        .renderViewport(TextStyle.EMPTY, l))
        .toEqual(<TableCell key={ref.viewportId()}
                            id={ref.viewportId()}
                            tabIndex={0}
                            className={"cell"}
                            style={{boxSizing: "border-box"}}
                            data-selection={ref}
        >{text}</TableCell>);
});

test("renderViewport empty style, text & defaultStyle EMPTY 2", () => {
    const text = "text-abc123";
    const ref = SpreadsheetCellReference.parse("B123");
    const l = [];

    expect(new SpreadsheetCell(ref,
        formula(),
        TextStyle.EMPTY,
        formatPattern(),
        new Text(text))
        .renderViewport(TextStyle.EMPTY, l))
        .toEqual(<TableCell key={ref.viewportId()}
                            id={ref.viewportId()}
                            tabIndex={0}
                            className={"cell"}
                            data-selection={ref}
                            style={{boxSizing: "border-box"}}>{text}</TableCell>);
});

test("renderViewport empty style, text & defaultStyle width&height", () => {
    const text = "text-abc123";
    const r = reference();
    const l = [];

    expect(new SpreadsheetCell(r,
        formula(),
        TextStyle.EMPTY,
        formatPattern(),
        new Text(text))
        .renderViewport(
            TextStyle.EMPTY
                .set("width", lengthFromJson("100px"))
                .set("height", lengthFromJson("50px")),
            l))
        .toEqual(<TableCell key={r.viewportId()}
                            id={r.viewportId()}
                            tabIndex={0}
                            className={"cell"}
                            style={{boxSizing: "border-box", width: "100px", height: "50px"}}
                            data-selection={r}
        >{text}</TableCell>);
});

test("renderViewport style=width&height, text & defaultStyle=empty", () => {
    const text = "text-abc123";
    const r = reference();
    const l = [];

    expect(
        new SpreadsheetCell(
            r,
            formula(),
            TextStyle.EMPTY,
            formatPattern(),
            new TextStyleNode(
                TextStyle.EMPTY
                    .set("width", lengthFromJson("100px"))
                    .set("height", lengthFromJson("50px")),
                [
                    new Text(text)
                ]
            )
        ).renderViewport(TextStyle.EMPTY, l))
        .toEqual(<TableCell key={r.viewportId()}
                            id={r.viewportId()}
                            tabIndex={0}
                            className={"cell"}
                            style={{boxSizing: "border-box", width: "100px", height: "50px"}}
                            data-selection={r}
        ><React.Fragment>{[text]}</React.Fragment></TableCell>);
});

test("renderViewport style=height, text & defaultStyle=width", () => {
    const text = "text-abc123";
    const r = reference();
    const l = [];

    expect(
        new SpreadsheetCell(
            r,
            formula(),
            TextStyle.EMPTY,
            formatPattern(),
            new TextStyleNode(
                TextStyle.EMPTY
                    .set("height", lengthFromJson("50px")),
                [
                    new Text(text)
                ]
            )
        ).renderViewport(TextStyle.EMPTY
                .set("width", lengthFromJson("100px")),
            l))
        .toEqual(<TableCell key={r.viewportId()}
                            id={r.viewportId()}
                            tabIndex={0}
                            className={"cell"}
                            style={{boxSizing: "border-box", width: "100px", height: "50px"}}
                            data-selection={r}
        ><React.Fragment>{[text]}</React.Fragment></TableCell>);
});

test("renderViewport style=width&height, text & defaultStyle=width", () => {
    const text = "text-abc123";
    const r = reference();
    const l = [];

    expect(
        new SpreadsheetCell(
            r,
            formula(),
            TextStyle.EMPTY,
            formatPattern(),
            new TextStyleNode(
                TextStyle.EMPTY
                    .set("width", lengthFromJson("100px"))
                    .set("height", lengthFromJson("50px")),
                [
                    new Text(text)
                ]
            )
        ).renderViewport(
            TextStyle.EMPTY
                .set("width", lengthFromJson("99px")),
            l)
    ).toEqual(<TableCell key={r.viewportId()}
                         id={r.viewportId()}
                         tabIndex={0}
                         className={"cell"}
                         style={{boxSizing: "border-box", width: "100px", height: "50px"}}
                         data-selection={r}
    ><React.Fragment>{[text]}</React.Fragment></TableCell>);
});

test("renderViewport with labels", () => {
    const text = "text-abc123";
    const r = reference();
    const l = [SpreadsheetLabelName.parse("Label1"), SpreadsheetLabelName.parse("Label2")];

    expect(
        new SpreadsheetCell(
            r,
            formula(),
            TextStyle.EMPTY,
            formatPattern(),
            new TextStyleNode(
                TextStyle.EMPTY
                    .set("width", lengthFromJson("100px"))
                    .set("height", lengthFromJson("50px")),
                [
                    new Text(text)
                ]
            )
        ).renderViewport(TextStyle.EMPTY
                .set("width", lengthFromJson("99px")),
            l))
        .toEqual(<Tooltip key={r.viewportTooltipId()}
                          id={r.viewportTooltipId()}
                          title={"Label1, Label2"}
                          placement={"top"}>
            <TableCell key={r.viewportId()}
                       id={r.viewportId()}
                       tabIndex={0}
                       className={"cell"}
                       style={{boxSizing: "border-box", width: "100px", height: "50px"}}
                       data-selection={r}
            ><React.Fragment>{[text]}</React.Fragment></TableCell>
        </Tooltip>);
});

// equals...............................................................................................................

test("equals different reference false", () => {
    const c = cell();
    expect(c.equals(new SpreadsheetCell(SpreadsheetCellReference.parse("Z9"),
        formula(),
        style(),
        formatPattern(),
        formatted())
    )).toBeFalse();
});

test("equals different formatPattern false", () => {
    const c = cell();
    expect(c.equals(new SpreadsheetCell(reference(),
        formula().setText("999"),
        style(),
        formatPattern(),
        formatted())
    )).toBeFalse();
});

test("equals different style false", () => {
    const c = cell();
    expect(c.equals(new SpreadsheetCell(reference(),
        formula(),
        TextStyle.EMPTY,
        formatPattern(),
        formatted())
    )).toBeFalse();
});

test("equals different formatPattern false", () => {
    const c = cell();
    expect(c.equals(new SpreadsheetCell(reference(),
        formula(),
        style(),
        SpreadsheetNumberFormatPattern.parse("0.00"),
        formatted())
    )).toBeFalse();
});

test("equals different formatted false", () => {
    const c = cell();
    expect(c.equals(new SpreadsheetCell(reference(),
        formula(),
        style(),
        formatPattern(),
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
    const f2 = formatPattern();
    const f3 = formatted();

    const c = new SpreadsheetCell(r, f, s, f2, f3);
    expect(c.equals(new SpreadsheetCell(r, f, s, f2, f3))).toBeTrue();
});

// helpers..............................................................................................................

function check(cell, reference, formula, style, formatPattern, formatted, json) {
    expect(cell.reference()).toStrictEqual(reference);
    expect(cell.reference()).toBeInstanceOf(SpreadsheetExpressionReference);

    expect(cell.formula()).toStrictEqual(formula);

    if(formula){
        expect(cell.formula())
            .toBeInstanceOf(SpreadsheetFormula);
    } else {
        expect(cell.formula())
            .toBeUndefined();
    }
    expect(cell.formula()).toStrictEqual(formula);

    expect(cell.style()).toStrictEqual(style);

    if(style){
        expect(cell.style()).toBeInstanceOf(TextStyle);
    }

    expect(cell.formatPattern()).toStrictEqual(formatPattern);

    if(formatPattern){
        expect(cell.formatPattern()).toBeInstanceOf(SpreadsheetFormatPattern);
    }

    expect(cell.formatted()).toStrictEqual(formatted);
    if(formatted){
        expect(cell.formatted()).toBeInstanceOf(Text);
    }

    expect(cell.toJson()).toStrictEqual(json);
    expect(cell.toString()).toBe(JSON.stringify(json));

    expect(SpreadsheetCell.fromJson(cell.toJson())).toStrictEqual(cell);
}
