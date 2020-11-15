import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetViewport from "./SpreadsheetViewport";

function reference() {
    return SpreadsheetCellReference.fromJson("A1");
}

function width() {
    return 100;
}

function height() {
    return 20;
}

// reference

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
    expect(() => new SpreadsheetViewport(reference(), width, height())).toThrow("Expected number width got " + width);
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
    expect(() => new SpreadsheetViewport(reference(), width(), height)).toThrow("Expected number height got " + height);
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

// json

test("fromJson null fails", () => {
    expect(() => SpreadsheetViewport.fromJson(null)).toThrow("Missing text");
});

test("json", () => {
    const viewport = new SpreadsheetViewport(reference(), width(), height());

    check(viewport, reference(), width(), height());
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