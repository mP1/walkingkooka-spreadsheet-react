import SpreadsheetRange from "../reference/SpreadsheetRange";
import SpreadsheetCell from "../SpreadsheetCell";
import SpreadsheetDelta from "./SpreadsheetDelta";

function a1() {
    return SpreadsheetCell.fromJson({
        reference: "A1",
        formula: {
            text: "1+2",
            error: "Custom error #1"
        }
    });
}

function cells() {
    return [a1(),
        SpreadsheetCell.fromJson({
            reference: "B2",
            formula: {
                text: "2+3",
                value: 5.0
            }
        })
    ];
}

function window() {
    return [SpreadsheetRange.fromJson("A1:B2"), SpreadsheetRange.fromJson("C3:D4")]
}

test("create without cells fails", () => {
    expect(() => new SpreadsheetDelta(null, window())).toThrow("Missing cells");
});

test("create with cell non array fails", () => {
    expect(() => new SpreadsheetDelta(1.5, window())).toThrow("Expected array cells got 1.5");
});

test("create 1 cell without window", () => {
    let cells = [a1()];

    check(new SpreadsheetDelta(cells), cells, [], {
        cells: cells.map(c => c.toJson())
    });
});

test("create 1 cell with window", () => {
    let cells = [a1()];

    check(new SpreadsheetDelta(cells, window()), cells, window(), {
        cells: cells.map(c => c.toJson()),
        window: "A1:B2,C3:D4"
    });
});

test("create with window", () => {
    check(new SpreadsheetDelta(cells(), window()), cells(), window(), {
        cells: cells().map(c => c.toJson()),
        window: "A1:B2,C3:D4"
    });
});

test("create without window", () => {
    check(new SpreadsheetDelta(cells(), undefined), cells(), [], {
        cells: cells().map(c => c.toJson())
    });
});

test("toJson without window", () => {
    expect(new SpreadsheetDelta([a1()]).toJson())
        .toStrictEqual({
            cells: [{
                reference: "A1",
                formula: {
                    text: "1+2",
                    error: "Custom error #1"
                }
            }]
        });
});

test("toJson with window", () => {
    expect(new SpreadsheetDelta([a1()], [SpreadsheetRange.fromJson("A1:B2")]).toJson())
        .toStrictEqual({
            cells: [{
                reference: "A1",
                formula: {
                    text: "1+2",
                    error: "Custom error #1"
                }
            }],
            window: "A1:B2"
        });
});

test("fromJson null fails", () => {
    expect(() => SpreadsheetDelta.fromJson(null)).toThrow("Missing json");
});

test("fromJson without window", () => {
    expect(SpreadsheetDelta.fromJson({
        cells: [{
            reference: "A1",
            formula: {
                text: "1+2",
                error: "Custom error #1"
            }
        }]
    })).toStrictEqual(new SpreadsheetDelta([a1()]));
});

test("toJson with window", () => {
    expect(SpreadsheetDelta.fromJson({
        cells: [{
            reference: "A1",
            formula: {
                text: "1+2",
                error: "Custom error #1"
            }
        }],
        window: "A1:B2"
    })).toStrictEqual(new SpreadsheetDelta([a1()], [SpreadsheetRange.fromJson("A1:B2")]));
});

// helpers..............................................................................................................

function check(delta, cells, window, json) {
    expect(delta.cells()).toStrictEqual(cells);
    expect(delta.window()).toStrictEqual(window);

    expect(delta.toJson()).toStrictEqual(json);
    expect(delta.toString()).toBe(JSON.stringify(json));

    expect(SpreadsheetDelta.fromJson(delta.toJson())).toStrictEqual(delta);
}
