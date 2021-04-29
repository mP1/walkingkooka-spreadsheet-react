import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetRange from "./SpreadsheetRange";
import systemObjectTesting from "../../SystemObjectTesting.js";

function begin() {
    return SpreadsheetCellReference.parse("A1");
}

function end() {
    return SpreadsheetCellReference.parse("B2");
}

systemObjectTesting(
    new SpreadsheetRange(begin(), end()),
    new SpreadsheetRange(SpreadsheetCellReference.parse("Z9"), SpreadsheetCellReference.parse("Z99")),
    SpreadsheetRange.fromJson,
    "Missing text",
    "spreadsheet-range",
    "A1:B2"
);

// create...............................................................................................................

test("create without begin fails", () => {
    expect(() => new SpreadsheetRange(null, end())).toThrow("Missing begin");
});

test("create with begin non cell fails", () => {
    expect(() => new SpreadsheetRange(1.5, end())).toThrow("Expected SpreadsheetCellReference begin got 1.5");
});

test("create without end fails", () => {
    expect(() => new SpreadsheetRange(begin(), null)).toThrow("Missing end");
});

test("create with end non cell fails", () => {
    expect(() => new SpreadsheetRange(begin(), true)).toThrow("Expected SpreadsheetCellReference end got true");
});

test("create", () => {
    check(new SpreadsheetRange(begin(), end()), begin(), end(), "A1:B2");
});

// parse.............................................................................................................

test("parse missing fails", () => {
    expect(() => SpreadsheetRange.parse()).toThrow("Missing text");
});

test("parse null fails", () => {
    expect(() => SpreadsheetRange.parse(null)).toThrow("Missing text");
});

test("parse empty fails", () => {
    expect(() => SpreadsheetRange.parse("")).toThrow("Missing text");
});

test("parse wrong token count fails", () => {
    expect(() => SpreadsheetRange.parse("A1:B2:C3")).toThrow("Expected 1 or 2 tokens got \"A1:B2:C3\"");
});

test("parse only cell", () => {
    const range = SpreadsheetRange.parse("A2");
    const cell = SpreadsheetCellReference.parse("A2");
    check(range, cell, cell, "A2");
});

test("parse relative/relative", () => {
    const range = SpreadsheetRange.parse("B3:C5");
    const begin = SpreadsheetCellReference.parse("B3");
    const end = SpreadsheetCellReference.parse("C5");
    check(range, begin, end, "B3:C5");
});

test("parse absolute/absolute:relative", () => {
    const range = SpreadsheetRange.parse("$D$6:E8");
    const begin = SpreadsheetCellReference.parse("$D$6");
    const end = SpreadsheetCellReference.parse("E8");
    check(range, begin, end, "$D$6:E8");
});

test("parse absolute/relative:relative", () => {
    const range = SpreadsheetRange.parse("$F$10:G11");
    const begin = SpreadsheetCellReference.parse("$F$10");
    const end = SpreadsheetCellReference.parse("G11");
    check(range, begin, end, "$F$10:G11");
});

test("parse relative:absolute/absolute", () => {
    const range = SpreadsheetRange.parse("H12:$I$13");
    const begin = SpreadsheetCellReference.parse("H12");
    const end = SpreadsheetCellReference.parse("$I$13");
    check(range, begin, end, "H12:$I$13");
});

test("parse relative:absolute/relative", () => {
    const range = SpreadsheetRange.parse("J14:$K14");
    const begin = SpreadsheetCellReference.parse("J14");
    const end = SpreadsheetCellReference.parse("$K14");
    check(range, begin, end, "J14:$K14");
});

test("parse lowercase:uppercase", () => {
    const range = SpreadsheetRange.parse("l15:M16");
    const begin = SpreadsheetCellReference.parse("l15");
    const end = SpreadsheetCellReference.parse("M16");
    check(range, begin, end, "L15:M16");
});

test("parse lowercase:lowercase", () => {
    const range = SpreadsheetRange.parse("n17:o18");
    const begin = SpreadsheetCellReference.parse("n17");
    const end = SpreadsheetCellReference.parse("o18");
    check(range, begin, end, "N17:O18");
});

test("parse lowercase:lowercase/absolute", () => {
    const range = SpreadsheetRange.parse("$p$19:$r$20");
    const begin = SpreadsheetCellReference.parse("$p$19");
    const end = SpreadsheetCellReference.parse("$r$20");
    check(range, begin, end, "$P$19:$R$20");
});

// fromJson.............................................................................................................

test("fromJson wrong token count fails", () => {
    expect(() => SpreadsheetRange.fromJson("A1:B2:C3")).toThrow("Expected 1 or 2 tokens got \"A1:B2:C3\"");
});

test("fromJson missing begin cell fails", () => {
    expect(() => SpreadsheetRange.fromJson(":")).toThrow("Missing begin");
});

test("fromJson missing begin cell fails #2", () => {
    expect(() => SpreadsheetRange.fromJson(":B2")).toThrow("Missing begin");
});

test("fromJson invalid begin cell fails", () => {
    expect(() => SpreadsheetRange.fromJson("A!:B2")).toThrow("Invalid character '!' at 1");
});

test("fromJson missing end cell fails", () => {
    expect(() => SpreadsheetRange.fromJson("A1:")).toThrow("Missing end");
});

test("fromJson invalid end cell fails", () => {
    expect(() => SpreadsheetRange.fromJson("A1:B!2")).toThrow("Invalid character '!' at 4");
});

test("fromJson invalid end cell fails #2", () => {
    expect(() => SpreadsheetRange.fromJson("A1:B2!")).toThrow("Invalid character '!' at 5");
});

test("fromJson only cell", () => {
    const range = SpreadsheetRange.fromJson("A2");
    const cell = SpreadsheetCellReference.parse("A2");
    check(range, cell, cell, "A2");
});

test("fromJson range", () => {
    const range = SpreadsheetRange.fromJson("B3:C5");
    const begin = SpreadsheetCellReference.parse("B3");
    const end = SpreadsheetCellReference.parse("C5");
    check(range, begin, end, "B3:C5");
});

test("fromJson range absolute/relative", () => {
    const range = SpreadsheetRange.fromJson("D$6:$E7");
    const begin = SpreadsheetCellReference.parse("D$6");
    const end = SpreadsheetCellReference.parse("$E7");
    check(range, begin, end, "D$6:$E7");
});

test("fromJson range lowercase", () => {
    const range = SpreadsheetRange.fromJson("f8:g9");
    const begin = SpreadsheetCellReference.parse("f8");
    const end = SpreadsheetCellReference.parse("g9");
    check(range, begin, end, "F8:G9");
});

// equals...............................................................................................................

test("equals self true", () => {
    const range = SpreadsheetRange.fromJson("A1:B2");
    expect(range.equals(range)).toBeTrue();
});

test("equals different false", () => {
    const range = SpreadsheetRange.fromJson("A1:B2");
    expect(range.equals(SpreadsheetRange.fromJson("C3:D4"))).toBeFalse();
});

test("equals equivalent true", () => {
    const range = SpreadsheetRange.fromJson("A1:B2");
    expect(range.equals(SpreadsheetRange.fromJson("A1:B2"))).toBeTrue();
});

test("equals equivalent true #2", () => {
    const range = SpreadsheetRange.fromJson("C3:D4");
    expect(range.equals(SpreadsheetRange.fromJson("C3:D4"))).toBeTrue();
});

// helpers..............................................................................................................

function check(range, begin, end, json) {
    expect(range.begin()).toStrictEqual(begin);
    expect(range.end()).toStrictEqual(end);

    expect(range.begin()).toBeInstanceOf(SpreadsheetCellReference);
    expect(range.end()).toBeInstanceOf(SpreadsheetCellReference);

    expect(range.toJson()).toStrictEqual(json);
    expect(range.toString()).toBe(json);

    expect(SpreadsheetRange.fromJson(range.toJson())).toStrictEqual(range);
    expect(SpreadsheetRange.parse(range.toString())).toStrictEqual(range);
}
