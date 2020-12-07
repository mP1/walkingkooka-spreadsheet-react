import SpreadsheetCoordinates from "./SpreadsheetCoordinates";

function x() {
    return 200;
}

function y() {
    return 400;
}

function coordinates() {
    return new SpreadsheetCoordinates(x(), y());
}

// x

test("create missing x fails", () => {
    const x = null;
    expect(() => new SpreadsheetCoordinates(x, y())).toThrow("Expected number x got " + x);
});

test("create invalid x type fails", () => {
    const x = "invalid!"
    expect(() => new SpreadsheetCoordinates(x, y())).toThrow("Expected number x got " + x);
});

test("create invalid x value fails", () => {
    const x = -1;
    expect(() => new SpreadsheetCoordinates(x, y())).toThrow("Expected x >= 0 got " + x);
});

test("create invalid x value fails2", () => {
    const x = -123;
    expect(() => new SpreadsheetCoordinates(x, y())).toThrow("Expected x >= 0 got " + x);
});

// y

test("create missing y fails", () => {
    const y = null;
    expect(() => new SpreadsheetCoordinates(x(), y)).toThrow("Expected number y got " + y);
});

test("create invalid y type fails", () => {
    const y = "invalid!"
    expect(() => new SpreadsheetCoordinates(x(), y)).toThrow("Expected number y got " + y);
});

test("create invalid y value fails", () => {
    const y = -1;
    expect(() => new SpreadsheetCoordinates(x(), y)).toThrow("Expected y >= 0 got " + y);
});

test("create invalid y value fails2", () => {
    const y = -123;
    expect(() => new SpreadsheetCoordinates(x(), y)).toThrow("Expected y >= 0 got " + y);
});

// json

test("fromJson null fails", () => {
    expect(() => SpreadsheetCoordinates.fromJson(null)).toThrow("Missing text");
});

test("new 0, 0", () => {
    const x = 0;
    const y = 0;

    check(new SpreadsheetCoordinates(x, y),
        x,
        y);
});

test("new", () => {
    check(new SpreadsheetCoordinates(x(), y()),
        x(),
        y());
});

test("from json", () => {
    const coords = SpreadsheetCoordinates.fromJson(x() + "," + y());
    check(coords,
        x(),
        y());
});

// equals...............................................................................................................

test("equals undefined false", () => {
    const c = coordinates();
    expect(c.equals()).toBe(false);
});

test("equals null false", () => {
    const c = coordinates();
    expect(c.equals(null)).toBe(false);
});

test("equals different type false", () => {
    const c = coordinates();
    expect(c.equals("different")).toBe(false);
});

test("equals self true", () => {
    const c = coordinates();
    expect(c.equals(c)).toBe(true);
});

test("equals different x false", () => {
    const c = coordinates();
    expect(c.equals(new SpreadsheetCoordinates(x() + 1, y()))).toBe(false);
});

test("equals different y false", () => {
    const c = coordinates();
    expect(c.equals(new SpreadsheetCoordinates(x(), y() + 1))).toBe(false);
});

test("equals equivalent true", () => {
    const c = coordinates();
    expect(c.equals(coordinates())).toBe(true);
});

test("equals equivalent true #2", () => {
    const x = 1;
    const y = 2;
    const c = new SpreadsheetCoordinates(x, y);
    expect(c.equals(new SpreadsheetCoordinates(x, y))).toBe(true);
});

// helpers..............................................................................................................

function check(coords, x, y) {
    expect(coords.x()).toStrictEqual(x);
    expect(coords.x()).toBeNumber();

    expect(coords.y()).toStrictEqual(y);
    expect(coords.y()).toBeNumber();

    const json = x + "," + y;
    expect(coords.toJson()).toStrictEqual(json);

    expect(SpreadsheetCoordinates.fromJson(json)).toStrictEqual(coords);
}