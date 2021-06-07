import ImmutableMap from "../../util/ImmutableMap";
import SpreadsheetCell from "../SpreadsheetCell";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference";
import SpreadsheetDelta from "./SpreadsheetDelta";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetRange from "../reference/SpreadsheetRange";
import SpreadsheetRowReference from "../reference/SpreadsheetRowReference";
import systemObjectTesting from "../../SystemObjectTesting.js";

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

function cellToLabels() {
    return ImmutableMap.fromJson(
        {
            "A1": "Label1,Label2",
            "B2": "Label3",
        },
        SpreadsheetCellReference.parse,
        (v) => v.split(",").map(l => SpreadsheetLabelName.parse(l))
    );
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
    return new SpreadsheetDelta(cells(), cellToLabels(), maxColumnWidths(), maxRowHeights(), window());
}

systemObjectTesting(
    delta(),
    new SpreadsheetDelta(
        [
            SpreadsheetCell.fromJson({
                "Z9": {
                    formula: {
                        text: "99",
                        error: "Different custom error #9"
                    }
                }
            })
        ],
        cellToLabels(),
        maxColumnWidths(),
        maxRowHeights(),
        window()
    ),
    SpreadsheetDelta.fromJson,
    "Missing json",
    "spreadsheet-delta",
    {
        "cells": {
            "A1": {
                "formula": {
                    "error": "Custom error #1",
                    "text": "1+2"
                }
            },
            "B2": {
                "formula": {
                    "error": "Custom error #2",
                    "text": "3+4"
                }
            }
        },
        "labels": {
            "A1": "Label1,Label2",
            "B2": "Label3"
        },
        "maxColumnWidths": {
            "A": 100
        },
        "maxRowHeights": {
            "1": 20
        },
        "window": "A1:B2,C3:D4"
    }
);

// tests................................................................................................................

test("create without cells fails", () => {
    const c = undefined;
    const l = cellToLabels();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, mcw, mrh, w)).toThrow("Missing cells");
});

test("create with cell non array fails", () => {
    const c = "!invalid";
    const l = cellToLabels();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, mcw, mrh, w)).toThrow("Expected array cells got !invalid");
});

test("create without cellToLabels fails", () => {
    const c = cells();
    const l = undefined;
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, mcw, mrh, w)).toThrow("Missing cellToLabels");
});

test("create with cellToLabels non object fails", () => {
    const c = cells();
    const l = "!invalid"
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, mcw, mrh, w)).toThrow("Expected ImmutableMap cellToLabels got !invalid");
});

test("create without maxColumnWidths fails", () => {
    const c = cells();
    const l = cellToLabels();
    const mcw = undefined;
    const mrh = maxRowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, mcw, mrh, w)).toThrow("Missing maxColumnWidths");
});

test("create with maxColumnWidths non object fails", () => {
    const c = cells();
    const l = cellToLabels();
    const mcw = "!invalid";
    const mrh = maxRowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, mcw, mrh, w)).toThrow("Expected ImmutableMap maxColumnWidths got !invalid");
});

test("create without maxRowHeights fails", () => {
    const c = cells();
    const l = cellToLabels();
    const mcw = maxColumnWidths();
    const mrh = undefined;
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, mcw, mrh, w)).toThrow("Missing maxRowHeights");
});

test("create with maxRowHeights non object fails", () => {
    const c = cells();
    const l = cellToLabels();
    const mcw = maxColumnWidths();
    const mrh = "!invalid";
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, mcw, mrh, w)).toThrow("Expected ImmutableMap maxRowHeights got !invalid");
});

test("create", () => {
    const c = cells();
    const l = cellToLabels();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    check(new SpreadsheetDelta(c, l, mcw, mrh, w),
        c,
        l,
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
            labels: {
                "A1": "Label1,Label2",
                "B2": "Label3"
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
    const l = ImmutableMap.EMPTY;
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    check(new SpreadsheetDelta(c, l, mcw, mrh, w),
        c,
        l,
        mcw,
        mrh,
        w,
        {});
});

// referenceToCellMap...................................................................................................

test("referenceToCellMap, no cells", () => {
    const c = [];
    const l = ImmutableMap.EMPTY;
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(new SpreadsheetDelta(c, l, mcw, mrh, w).referenceToCellMap())
        .toStrictEqual(ImmutableMap.EMPTY);
});

test("referenceToCellMap, 1 cell", () => {
    const cell = a1();

    const c = [cell];
    const l = ImmutableMap.EMPTY;
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(new SpreadsheetDelta(c, l, mcw, mrh, w).referenceToCellMap())
        .toStrictEqual(new ImmutableMap(new Map([
            [cell.reference().toString(), cell]
        ])));
});

test("referenceToCellMap, 2 cells", () => {
    const cell = a1();
    const cell2 = b2();

    const c = [cell, cell2];
    const l = ImmutableMap.EMPTY;
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(new SpreadsheetDelta(c, l, mcw, mrh, w).referenceToCellMap())
        .toStrictEqual(new ImmutableMap(new Map([
            [cell.reference().toString(), cell],
            [cell2.reference().toString(), cell2]
        ])));
});

// cell.................................................................................................................

test("cell() missing cellOrLabel fails", () => {
    expect(() => delta().cell(undefined)).toThrow("Missing cellOrLabel");
});

test("cell() invalid cellOrLabel fails", () => {
    expect(() => delta().cell("!invalid")).toThrow("Expected SpreadsheetCellReferenceOrLabelName cellOrLabel got !invalid");
});

test("cell() with present cell-reference", () => {
    const cell = a1();
    expect(delta().cell(cell.reference()))
        .toStrictEqual(cell);
});

test("cell() absent cell-reference", () => {
    expect(delta().cell(SpreadsheetCellReference.parse("Z99")))
        .toBeUndefined();
});

test("cell() with present label", () => {
    const cell = a1();
    expect(delta().cell(SpreadsheetLabelName.parse("Label1")))
        .toStrictEqual(cell);
});

test("cell() with absent label", () => {
    const cell = a1();
    expect(delta().cell(SpreadsheetLabelName.parse("Unknown")))
        .toBeUndefined();
});

// cellReference........................................................................................................

test("cellReference() missing cellOrLabel fails", () => {
    expect(() => delta().cellReference(undefined)).toThrow("Missing label");
});

test("cellReference() invalid cellOrLabel fails", () => {
    expect(() => delta().cellReference("!invalid")).toThrow("Expected SpreadsheetLabelName label got !invalid");
});

test("cellReference() with present label", () => {
    expect(delta()
        .cellReference(SpreadsheetLabelName.parse("Label1")))
        .toStrictEqual(a1().reference());
});

test("cellReference() with absent label", () => {
    expect(delta()
        .cellReference(SpreadsheetLabelName.parse("Unknown")))
        .toBeUndefined();
});

// toJson...............................................................................................................

test("toJson only 1 cell", () => {
    const c = [a1()];
    const l = ImmutableMap.EMPTY;
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(new SpreadsheetDelta(c, l, mcw, mrh, w).toJson())
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
    const l = ImmutableMap.EMPTY;
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(new SpreadsheetDelta(c, l, mcw, mrh, w).toJson())
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
    const l = cellToLabels();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, l, mcw, mrh, w).toJson())
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
            labels: {
                "A1": "Label1,Label2",
                "B2": "Label3"
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

test("fromJson empty", () => {
    const c = [];
    const l = ImmutableMap.EMPTY;
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(SpreadsheetDelta.fromJson({})).toStrictEqual(new SpreadsheetDelta(c, l, mcw, mrh, w));
});

test("fromJson 1 cell", () => {
    const c = [a1()];
    const l = ImmutableMap.EMPTY;
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
    })).toStrictEqual(new SpreadsheetDelta(c, l, mcw, mrh, w));
});

test("fromJson 2 cells only", () => {
    const c = [a1(), b2()];
    const l = ImmutableMap.EMPTY;
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
    })).toStrictEqual(new SpreadsheetDelta(c, l, mcw, mrh, w));
});

test("fromJson all properties", () => {
    const c = cells();
    const l = cellToLabels();
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
        labels: {
            "A1": "Label1,Label2",
            "B2": "Label3"
        },
        maxColumnWidths: {
            "A": 100
        },
        maxRowHeights: {
            "1": 20
        },
        window: windowJson
    })).toStrictEqual(new SpreadsheetDelta(c, l, mcw, mrh, w));
});

// equals...............................................................................................................

test("equals different cells false", () => {
    const c = cells();
    const l = cellToLabels();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, l, mcw, mrh, w)
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
            ], l, mcw, mrh, w)
        )
    ).toBeFalse();
});

test("equals different cellToLabels false", () => {
    const c = cells();
    const l = cellToLabels();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, l, mcw, mrh, w)
        .equals(
            new SpreadsheetDelta(c, ImmutableMap.EMPTY, mcw, mrh, w)
        )
    ).toBeFalse();
});

test("equals different maxColumnWidths false", () => {
    const c = cells();
    const l = cellToLabels();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, l, mcw, mrh, w)
        .equals(
            new SpreadsheetDelta(c, l, ImmutableMap.EMPTY, mrh, w)
        )
    ).toBeFalse();
});

test("equals different maxRowHeights false", () => {
    const c = cells();
    const l = cellToLabels();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, l, mcw, mrh, w)
        .equals(
            new SpreadsheetDelta(c, l, mcw, ImmutableMap.EMPTY, w)
        )
    ).toBeFalse();
});

test("equals different window false", () => {
    const c = cells();
    const l = cellToLabels();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, l, mcw, mrh, w)
        .equals(
            new SpreadsheetDelta(c, l, mcw, mrh, [])
        )
    ).toBeFalse();
});

test("equals equivalent true", () => {
    const d = delta();
    expect(d.equals(delta())).toBeTrue();
});

// helpers..............................................................................................................

function check(delta, cells, cellToLabels, maxColumnWidths, maxRowHeights, window, json) {
    expect(delta.cells()).toStrictEqual(cells);
    expect(delta.cellToLabels()).toStrictEqual(cellToLabels);
    expect(delta.maxColumnWidths()).toStrictEqual(maxColumnWidths);
    expect(delta.maxRowHeights()).toStrictEqual(maxRowHeights);
    expect(delta.window()).toStrictEqual(window);

    expect(delta.toJson()).toStrictEqual(json);
    expect(delta.toString()).toBe(JSON.stringify(json));

    expect(SpreadsheetDelta.fromJson(delta.toJson())).toStrictEqual(delta);
}
