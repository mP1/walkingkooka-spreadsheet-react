import SpreadsheetCellBox from "./SpreadsheetCellBox";
import SpreadsheetCellReference from "./SpreadsheetCellReference";
import systemObjectTesting from "../../SystemObjectTesting.js";

function reference() {
    return SpreadsheetCellReference.fromJson("A1");
}

function x() {
    return 200;
}

function y() {
    return 400;
}

function width() {
    return 100;
}

function height() {
    return 20;
}

function box() {
    return new SpreadsheetCellBox(reference(), x(), y(), width(), height());
}

systemObjectTesting(
    box(),
    new SpreadsheetCellBox(SpreadsheetCellReference.parse("Z99"), 9, 9, 9, 9),
    SpreadsheetCellBox.fromJson,
    "Missing json",
    "spreadsheet-cell-box",
    {
        "reference": "A1",
        "x": 200,
        "y": 400,
        "width": 100,
        "height": 20,
    }
);

// create...............................................................................................................

test("create without reference fails", () => {
    expect(() => new SpreadsheetCellBox(null, x(), y(), width(), height())).toThrow("Missing reference");
});

test("create invalid reference type fails", () => {
    const reference = "invalid!";
    expect(() => new SpreadsheetCellBox(reference, x(), y(), width(), height())).toThrow("Expected SpreadsheetCellReference reference got " + reference);
});

// x

test("create missing x fails", () => {
    const x = null;
    expect(() => new SpreadsheetCellBox(reference(), x, y(), width(), height())).toThrow("Expected number x got " + x);
});

test("create invalid x type fails", () => {
    const x = "invalid!"
    expect(() => new SpreadsheetCellBox(reference(), x, y(), width(), height())).toThrow("Expected number x got " + x);
});

test("create invalid x value fails", () => {
    const x = -1;
    expect(() => new SpreadsheetCellBox(reference(), x, y(), width(), height())).toThrow("Expected x >= 0 got " + x);
});

test("create invalid x value fails2", () => {
    const x = -123;
    expect(() => new SpreadsheetCellBox(reference(), x, y(), width(), height())).toThrow("Expected x >= 0 got " + x);
});

// y

test("create missing y fails", () => {
    const y = null;
    expect(() => new SpreadsheetCellBox(reference(), x(), y, width(), height())).toThrow("Expected number y got " + y);
});

test("create invalid y type fails", () => {
    const y = "invalid!"
    expect(() => new SpreadsheetCellBox(reference(), x(), y, width(), height())).toThrow("Expected number y got " + y);
});

test("create invalid y value fails", () => {
    const y = -1;
    expect(() => new SpreadsheetCellBox(reference(), x(), y, width(), height())).toThrow("Expected y >= 0 got " + y);
});

test("create invalid y value fails2", () => {
    const y = -123;
    expect(() => new SpreadsheetCellBox(reference(), x(), y, width(), height())).toThrow("Expected y >= 0 got " + y);
});

// width

test("create missing width fails", () => {
    const width = null;
    expect(() => new SpreadsheetCellBox(reference(), x(), y(), width, height())).toThrow("Expected number width got " + width);
});

test("create invalid width type fails", () => {
    const width = "invalid!"
    expect(() => new SpreadsheetCellBox(reference(), x(), y(), width, height())).toThrow("Expected number width got " + width);
});

test("create invalid width value fails", () => {
    const width = -1;
    expect(() => new SpreadsheetCellBox(reference(), x(), y(), width, height())).toThrow("Expected width >= 0 got " + width);
});

test("create invalid width value fails2", () => {
    const width = -123;
    expect(() => new SpreadsheetCellBox(reference(), x(), y(), width, height())).toThrow("Expected width >= 0 got " + width);
});

// height

test("create missing height fails", () => {
    const height = null;
    expect(() => new SpreadsheetCellBox(reference(), x(), y(), width(), height)).toThrow("Expected number height got " + height);
});

test("create invalid height type fails", () => {
    const height = "invalid!"
    expect(() => new SpreadsheetCellBox(reference(), x(), y(), width(), height)).toThrow("Expected number height got " + height);
});

test("create invalid height value fails", () => {
    const height = -1;
    expect(() => new SpreadsheetCellBox(reference(), x(), y(), width(), height)).toThrow("Expected height >= 0 got " + height);
});

test("create invalid height value fails2", () => {
    const height = -123;
    expect(() => new SpreadsheetCellBox(reference(), x(), y(), width(), height)).toThrow("Expected height >= 0 got " + height);
});

test("new", () => {
    check(new SpreadsheetCellBox(reference(), x(), y(), width(), height()),
        reference(),
        x(),
        y(),
        width(),
        height());
});

test("new x=0 y=0", () => {
    const x = 0;
    const y = 0;

    check(new SpreadsheetCellBox(reference(), x, y, width(), height()),
        reference(),
        x,
        y,
        width(),
        height());
});

test("new 0 width", () => {
    const width = 0;
    check(new SpreadsheetCellBox(reference(), x(), y(), width, height()),
        reference(),
        x(),
        y(),
        width,
        height());
});

test("new 0 height", () => {
    const height = 0;
    check(new SpreadsheetCellBox(reference(), x(), y(), width(), height),
        reference(),
        x(),
        y(),
        width(),
        height);
});

// equals...............................................................................................................

test("equals different reference false", () => {
    const b = box();
    expect(b.equals(new SpreadsheetCellBox(SpreadsheetCellReference.parse("Z9"), x(), y(), width(), height()))).toBeFalse();
});

test("equals different x false", () => {
    const b = box();
    expect(b.equals(new SpreadsheetCellBox(reference(), x() + 1, y(), width(), height()))).toBeFalse();
});

test("equals different y false", () => {
    const b = box();
    expect(b.equals(new SpreadsheetCellBox(reference(), x(), y() + 1, width(), height()))).toBeFalse();
});

test("equals different width false", () => {
    const b = box();
    expect(b.equals(new SpreadsheetCellBox(reference(), x(), y(), width() + 1, height()))).toBeFalse();
});

test("equals different height false", () => {
    const b = box();
    expect(b.equals(new SpreadsheetCellBox(reference(), x(), y(), width(), height() + 1))).toBeFalse();
});

test("equals equivalent true", () => {
    expect(box().equals(box())).toBeTrue();
});

test("equals equivalent true #2", () => {
    const box = new SpreadsheetCellBox(SpreadsheetCellReference.parse("Z9"), 1, 2, 3, 4);
    const box2 = new SpreadsheetCellBox(SpreadsheetCellReference.parse("Z9"), 1, 2, 3, 4);

    expect(box.equals(box2)).toBeTrue();
});

// helpers..............................................................................................................

function check(box, reference, x, y, width, height) {
    expect(box.reference()).toStrictEqual(reference);
    expect(box.reference()).toBeInstanceOf(SpreadsheetCellReference);

    expect(box.x()).toStrictEqual(x);
    expect(box.x()).toBeNumber();

    expect(box.y()).toStrictEqual(y);
    expect(box.y()).toBeNumber();

    expect(box.width()).toStrictEqual(width);
    expect(box.width()).toBeNumber();

    expect(box.height()).toStrictEqual(height);
    expect(box.height()).toBeNumber();

    const json = {
        "reference": reference.toJson(),
        "x": x,
        "y": y,
        "width": width,
        "height": height
    };
    expect(box.toJson()).toStrictEqual(json);

    expect(SpreadsheetCellBox.fromJson(json)).toStrictEqual(box);
}