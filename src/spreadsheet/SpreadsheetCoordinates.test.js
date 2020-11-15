import SpreadsheetCoordinates from "./SpreadsheetCoordinates";

function x() {
    return 200;
}

function y() {
    return 400;
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
    const x = 0;
    expect(() => new SpreadsheetCoordinates(x, y())).toThrow("Expected x > 0 got " + x);
});

test("create invalid x value fails2", () => {
    const x = -123;
    expect(() => new SpreadsheetCoordinates(x, y())).toThrow("Expected x > 0 got " + x);
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
    const y = 0;
    expect(() => new SpreadsheetCoordinates(x(), y)).toThrow("Expected y > 0 got " + y);
});

test("create invalid y value fails2", () => {
    const y = -123;
    expect(() => new SpreadsheetCoordinates(x(), y)).toThrow("Expected y > 0 got " + y);
});

// json

test("fromJson null fails", () => {
    expect(() => SpreadsheetCoordinates.fromJson(null)).toThrow("Missing text");
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