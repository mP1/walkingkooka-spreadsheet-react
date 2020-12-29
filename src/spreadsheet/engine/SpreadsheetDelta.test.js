import ImmutableMap from "../../util/ImmutableMap";
import SpreadsheetCell from "../SpreadsheetCell";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference";
import SpreadsheetDelta from "./SpreadsheetDelta";
import SpreadsheetRange from "../reference/SpreadsheetRange";
import SpreadsheetRowReference from "../reference/SpreadsheetRowReference";

function a1() {
    return SpreadsheetCell.fromJson({
        "A1": {
            formula: {
                text: "1+2",
                error: "Custom error #1"
            }
        }
    });
}

function b2() {
    return SpreadsheetCell.fromJson({
        "B2": {
            formula: {
                text: "3+4",
                error: "Custom error #2"
            }
        }
    });
}

function cells() {
    return [a1(), b2()];
}

function maxColumnWidths() {
    return ImmutableMap.fromJson({
            "A": 100,
        },
        SpreadsheetColumnReference.parse,
        (v) => v);
}

function maxRowHeights() {
    return ImmutableMap.fromJson({
            "1": 20,
        },
        SpreadsheetRowReference.parse,
        (v) => v);
}

function window() {
    return [
        SpreadsheetRange.fromJson("A1:B2"),
        SpreadsheetRange.fromJson("C3:D4")
    ]
}

const windowJson = "A1:B2,C3:D4";

function delta() {
    return new SpreadsheetDelta(cells(), maxColumnWidths(), maxRowHeights(), window());
}

// tests................................................................................................................

test("create without cells fails", () => {
    const c = undefined;
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, mcw, mrh, w)).toThrow("Missing cells");
});

test("create with cell non array fails", () => {
    const c = "!invalid";
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, mcw, mrh, w)).toThrow("Expected array cells got !invalid");
});

test("create without maxColumnWidths fails", () => {
    const c = cells();
    const mcw = undefined;
    const mrh = maxRowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, mcw, mrh, w)).toThrow("Missing maxColumnWidths");
});

test("create with maxColumnWidths non object fails", () => {
    const c = cells();
    const mcw = "!invalid";
    const mrh = maxRowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, mcw, mrh, w)).toThrow("Expected ImmutableMap maxColumnWidths got !invalid");
});

test("create without maxRowHeights fails", () => {
    const c = cells();
    const mcw = maxColumnWidths();
    const mrh = undefined;
    const w = window();

    expect(() => new SpreadsheetDelta(c, mcw, mrh, w)).toThrow("Missing maxRowHeights");
});

test("create with maxRowHeights non object fails", () => {
    const c = cells();
    const mcw = maxColumnWidths();
    const mrh = "!invalid";
    const w = window();

    expect(() => new SpreadsheetDelta(c, mcw, mrh, w)).toThrow("Expected ImmutableMap maxRowHeights got !invalid");
});

test("create", () => {
    const c = cells();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    check(new SpreadsheetDelta(c, mcw, mrh, w),
        c,
        mcw,
        mrh,
        w,
        {
            cells: {
                "A1": {
                    formula: {
                        text: "1+2",
                        error: "Custom error #1"
                    }
                },
                "B2": {
                    formula: {
                        text: "3+4",
                        error: "Custom error #2"
                    }
                }
            },
            maxColumnWidths: {
                "A": 100
            },
            maxRowHeights: {
                "1": 20
            },
            window: windowJson
        });
});

test("create empty", () => {
    const c = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    check(new SpreadsheetDelta(c, mcw, mrh, w),
        c,
        mcw,
        mrh,
        w,
        {});
});

// referenceToCellMap...................................................................................................

test("referenceToCellMap, no cells", () => {
    const c = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(new SpreadsheetDelta(c, mcw, mrh, w).referenceToCellMap())
        .toStrictEqual(ImmutableMap.EMPTY);
});

test("referenceToCellMap, 1 cell", () => {
    const cell = a1();

    const c = [cell];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(new SpreadsheetDelta(c, mcw, mrh, w).referenceToCellMap())
        .toStrictEqual(new ImmutableMap(new Map([
            [cell.reference().toString(), cell]
        ])));
});

test("referenceToCellMap, 2 cells", () => {
    const cell = a1();
    const cell2 = b2();

    const c = [cell, cell2];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(new SpreadsheetDelta(c, mcw, mrh, w).referenceToCellMap())
        .toStrictEqual(new ImmutableMap(new Map([
            [cell.reference().toString(), cell],
            [cell2.reference().toString(), cell2]
        ])));
});

// toJson...............................................................................................................

test("toJson only 1 cell", () => {
    const c = [a1()];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(new SpreadsheetDelta(c, mcw, mrh, w).toJson())
        .toStrictEqual({
            cells: {
                "A1": {
                    formula: {
                        text: "1+2",
                        error: "Custom error #1"
                    }
                }
            }
        });
});

test("toJson only 2 cells", () => {
    const c = cells();
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(new SpreadsheetDelta(c, mcw, mrh, w).toJson())
        .toStrictEqual({
            "cells": {
                "A1": {
                    formula: {
                        text: "1+2",
                        error: "Custom error #1"
                    }
                },
                "B2": {
                    formula: {
                        text: "3+4",
                        error: "Custom error #2"
                    }
                },
            }
        });
});

test("toJson all properties", () => {
    const c = cells();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, mcw, mrh, w).toJson())
        .toStrictEqual({
            "cells": {
                "A1": {
                    formula: {
                        text: "1+2",
                        error: "Custom error #1"
                    }
                },
                "B2": {
                    formula: {
                        text: "3+4",
                        error: "Custom error #2"
                    }
                },
            },
            maxColumnWidths: {
                "A": 100
            },
            maxRowHeights: {
                "1": 20
            },
            window: windowJson
        });
});

// fromJson.............................................................................................................
test("fromJson null fails", () => {
    expect(() => SpreadsheetDelta.fromJson(null)).toThrow("Missing json");
});

test("fromJson empty", () => {
    const c = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(SpreadsheetDelta.fromJson({})).toStrictEqual(new SpreadsheetDelta(c, mcw, mrh, w));
});

test("fromJson 1 cell", () => {
    const c = [a1()];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(SpreadsheetDelta.fromJson({
        cells: {
            "A1": {
                formula: {
                    text: "1+2",
                    error: "Custom error #1"
                }
            }
        }
    })).toStrictEqual(new SpreadsheetDelta(c, mcw, mrh, w));
});

test("fromJson 2 cells", () => {
    const c = [a1(), b2()];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(SpreadsheetDelta.fromJson({
        cells: {
            "A1": {
                formula: {
                    text: "1+2",
                    error: "Custom error #1"
                }
            },
            "B2": {
                formula: {
                    text: "3+4",
                    error: "Custom error #2"
                }
            }
        }
    })).toStrictEqual(new SpreadsheetDelta(c, mcw, mrh, w));
});

test("fromJson all properties", () => {
    const c = cells();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(SpreadsheetDelta.fromJson({
        cells: {
            "A1": {
                formula: {
                    text: "1+2",
                    error: "Custom error #1"
                }
            },
            "B2": {
                formula: {
                    text: "3+4",
                    error: "Custom error #2"
                }
            }
        },
        maxColumnWidths: {
            "A": 100
        },
        maxRowHeights: {
            "1": 20
        },
        window: windowJson
    })).toStrictEqual(new SpreadsheetDelta(c, mcw, mrh, w));
});

// equals...............................................................................................................

test("equals undefined false", () => {
    expect(delta().equals()).toBeFalse();
});

test("equals null false", () => {
    expect(delta().equals(null)).toBeFalse();
});

test("equals different type false", () => {
    expect(delta().equals("!different")).toBeFalse();
});

test("equals different cells false", () => {
    const c = cells();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, mcw, mrh, w)
        .equals(
            new SpreadsheetDelta([
                SpreadsheetCell.fromJson({
                    "Z9": {
                        formula: {
                            text: "999",
                            error: "Custom error #999"
                        }
                    }
                })
            ], mcw, mrh, w)
        )
    ).toBeFalse();
});

test("equals different maxColumnWidths false", () => {
    const c = cells();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, mcw, mrh, w)
        .equals(
            new SpreadsheetDelta(c, ImmutableMap.EMPTY, mrh, w)
        )
    ).toBeFalse();
});

test("equals different maxRowHeights false", () => {
    const c = cells();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, mcw, mrh, w)
        .equals(
            new SpreadsheetDelta(c, mcw, ImmutableMap.EMPTY, w)
        )
    ).toBeFalse();
});

test("equals different window false", () => {
    const c = cells();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, mcw, mrh, w)
        .equals(
            new SpreadsheetDelta(c, mcw, mrh, [])
        )
    ).toBeFalse();
});

test("equals self true", () => {
    const d = delta();
    expect(d.equals(d)).toBeTrue();
});

test("equals equivalent true", () => {
    const d = delta();
    expect(d.equals(delta())).toBeTrue();
});

// helpers..............................................................................................................

function check(delta, cells, maxColumnWidths, maxRowHeights, window, json) {
    expect(delta.cells()).toStrictEqual(cells);
    expect(delta.maxColumnWidths()).toStrictEqual(maxColumnWidths);
    expect(delta.maxRowHeights()).toStrictEqual(maxRowHeights);
    expect(delta.window()).toStrictEqual(window);

    expect(delta.toJson()).toStrictEqual(json);
    expect(delta.toString()).toBe(JSON.stringify(json));

    expect(SpreadsheetDelta.fromJson(delta.toJson())).toStrictEqual(delta);
}
