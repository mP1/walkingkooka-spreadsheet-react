import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetViewport from "./SpreadsheetViewport";
import systemObjectTesting from "../../SystemObjectTesting.js";

function reference() {
    return SpreadsheetCellReference.fromJson("A1");
}

function width() {
    return 100;
}

function height() {
    return 20;
}

function viewport() {
    return new SpreadsheetViewport(reference(), width(), height());
}

systemObjectTesting(
    viewport(),
    new SpreadsheetViewport(SpreadsheetCellReference.fromJson("Z99"), 9, 99),
    SpreadsheetViewport.fromJson,
    "Missing text",
    "spreadsheet-viewport",
    "A1:100:20"
);

// create...............................................................................................................

test("create without reference fails", () => {
    expect(() => new SpreadsheetViewport(null, width(), height())).toThrow("Missing reference");
});

test("create invalid reference type fails", () => {
    const reference = "invalid!";
    expect(() => new SpreadsheetViewport(reference, width(), height())).toThrow("Expected SpreadsheetCellReference reference got " + reference);
});

// width

test("create missing width fails", () => {
    const width = null;
    expect(() => new SpreadsheetViewport(reference(), width, height())).toThrow("Missing width");
});

test("create invalid width type fails", () => {
    const width = "invalid!"
    expect(() => new SpreadsheetViewport(reference(), width, height())).toThrow("Expected number width got " + width);
});

test("create invalid width value fails", () => {
    const width = 0;
    expect(() => new SpreadsheetViewport(reference(), width, height())).toThrow("Expected width > 0 got " + width);
});

test("create invalid width value fails2", () => {
    const width = -123;
    expect(() => new SpreadsheetViewport(reference(), width, height())).toThrow("Expected width > 0 got " + width);
});

// height

test("create missing height fails", () => {
    const height = null;
    expect(() => new SpreadsheetViewport(reference(), width(), height)).toThrow("Missing height");
});

test("create invalid height type fails", () => {
    const height = "invalid!"
    expect(() => new SpreadsheetViewport(reference(), width(), height)).toThrow("Expected number height got " + height);
});

test("create invalid height value fails", () => {
    const height = 0;
    expect(() => new SpreadsheetViewport(reference(), width(), height)).toThrow("Expected height > 0 got " + height);
});

test("create invalid height value fails2", () => {
    const height = -123;
    expect(() => new SpreadsheetViewport(reference(), width(), height)).toThrow("Expected height > 0 got " + height);
});

test("create ABSOLUTE reference", () => {
    const w = width();
    const h = height();
    check(new SpreadsheetViewport(SpreadsheetCellReference.parse("$B$99"), w, h),
        SpreadsheetCellReference.parse("B99"),
        w,
        h);
});

// json

test("fromJson null fails", () => {
    expect(() => SpreadsheetViewport.fromJson(null)).toThrow("Missing text");
});

test("json", () => {
    const viewport = new SpreadsheetViewport(reference(), width(), height());

    check(viewport, reference(), width(), height());
});

// equals...............................................................................................................

test("equals undefined false", () => {
    expect(viewport().equals()).toBeFalse();
});

test("equals null false", () => {
    expect(viewport().equals(null)).toBeFalse();
});

test("equals different type false", () => {
    expect(viewport().equals("different")).toBeFalse();
});

test("equals self true", () => {
    const b = viewport();
    expect(b.equals(b)).toBeTrue();
});

test("equals different width false", () => {
    const b = viewport();
    expect(b.equals(new SpreadsheetViewport(reference(), width() + 1, height()))).toBeFalse();
});

test("equals different height false", () => {
    const v = viewport();
    expect(v.equals(new SpreadsheetViewport(reference(), width(), height() + 1))).toBeFalse();
});

test("equals equivalent true", () => {
    expect(viewport().equals(viewport())).toBeTrue();
});

test("equals equivalent true #2", () => {
    const viewport = new SpreadsheetViewport(SpreadsheetCellReference.parse("Z9"), 1, 2);
    const viewport2 = new SpreadsheetViewport(SpreadsheetCellReference.parse("Z9"), 1, 2);

    expect(viewport.equals(viewport2)).toBeTrue();
});

// helpers..............................................................................................................

function check(viewport, reference, width, height) {
    expect(viewport.reference()).toStrictEqual(reference);
    expect(viewport.reference()).toBeInstanceOf(SpreadsheetCellReference);

    expect(viewport.width()).toStrictEqual(width);
    expect(viewport.width()).toBeNumber();

    expect(viewport.height()).toStrictEqual(height);
    expect(viewport.height()).toBeNumber();

    const json = reference + ":" + width + ":" + height;
    expect(viewport.toJson()).toStrictEqual(json);
    expect(viewport.toString()).toBe(json);

    expect(SpreadsheetViewport.parse(json)).toStrictEqual(viewport);
    expect(SpreadsheetViewport.fromJson(json)).toStrictEqual(viewport);
}