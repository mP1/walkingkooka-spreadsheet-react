import ImmutableMap from "../../util/ImmutableMap";
import SpreadsheetCell from "../SpreadsheetCell";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference";
import SpreadsheetDelta from "./SpreadsheetDelta";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetCellRange from "../reference/SpreadsheetCellRange.js";
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

function label1() {
    return SpreadsheetLabelName.parse("Label1");
}

function label2() {
    return SpreadsheetLabelName.parse("Label2");
}

function label3() {
    return SpreadsheetLabelName.parse("Label3");
}

function labels() {
    const a1Reference = a1().reference();

    return [
        label1().mapping(a1Reference),
        label2().mapping(a1Reference),
        label3().mapping(SpreadsheetCellReference.parse("B2")),
    ];
}

function deletedCells() {
    return [deletedCell1(), deletedCell2()];
}

function deletedCell1() {
    return SpreadsheetCellReference.parse("C1");
}

function deletedCell2() {
    return SpreadsheetCellReference.parse("C2");
}

function columnWidths() {
    return ImmutableMap.fromJson({
            "A": 100,
        },
        SpreadsheetColumnReference.parse,
        (v) => v);
}

function rowHeights() {
    return ImmutableMap.fromJson({
            "1": 20,
        },
        SpreadsheetRowReference.parse,
        (v) => v);
}

function window() {
    return SpreadsheetCellRange.fromJson("A1:B2");
}

const windowJson = "A1:B2";

function delta() {
    return new SpreadsheetDelta(
        cells(),
        labels(),
        deletedCells(),
        columnWidths(),
        rowHeights(),
        window()
    );
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
        labels(),
        deletedCells(),
        columnWidths(),
        rowHeights(),
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
        "labels": [
            {
                "label": "Label1",
                "reference": "A1"
            },
            {
                "label": "Label2",
                "reference": "A1"
            },
            {
                "label": "Label3",
                "reference": "B2"
            }
        ],
        "deletedCells": [
            "C1",
            "C2",
        ],
        "columnWidths": {
            "A": 100
        },
        "rowHeights": {
            "1": 20
        },
        "window": "A1:B2"
    }
);

// tests................................................................................................................

test("create without cells fails", () => {
    const c = undefined;
    const l = labels();
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, d, mcw, mrh, w)).toThrow("Missing cells");
});

test("create with cell non array fails", () => {
    const c = "!invalid";
    const l = labels();
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, d, mcw, mrh, w)).toThrow("Expected array cells got !invalid");
});

test("create without labels fails", () => {
    const c = cells();
    const l = undefined;
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, d, mcw, mrh, w)).toThrow("Missing labels");
});

test("create with labels non array fails", () => {
    const c = cells();
    const l = "!invalid";
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, d, mcw, mrh, w)).toThrow("Expected array labels got !invalid");
});

test("create without columnWidths fails", () => {
    const c = cells();
    const l = labels();
    const d = deletedCells();
    const mcw = undefined;
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, d, mcw, mrh, w)).toThrow("Missing columnWidths");
});

test("create with columnWidths non object fails", () => {
    const c = cells();
    const l = labels();
    const d = deletedCells();
    const mcw = "!invalid";
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, d, mcw, mrh, w)).toThrow("Expected ImmutableMap columnWidths got !invalid");
});

test("create without rowHeights fails", () => {
    const c = cells();
    const l = labels();
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = undefined;
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, d, mcw, mrh, w)).toThrow("Missing rowHeights");
});

test("create with rowHeights non object fails", () => {
    const c = cells();
    const l = labels();
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = "!invalid";
    const w = window();

    expect(() => new SpreadsheetDelta(c, l, d, mcw, mrh, w)).toThrow("Expected ImmutableMap rowHeights got !invalid");
});

test("create", () => {
    const c = cells();
    const l = labels();
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    check(new SpreadsheetDelta(c, l, d, mcw, mrh, w),
        c,
        l,
        d,
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
            labels: [
                {
                    "label": "Label1",
                    "reference": "A1"
                },
                {
                    "label": "Label2",
                    "reference": "A1"
                },
                {
                    "label": "Label3",
                    "reference": "B2"
                }
            ],
            deletedCells: [
                "C1",
                "C2",
            ],
            columnWidths: {
                "A": 100
            },
            rowHeights: {
                "1": 20
            },
            window: windowJson
        });
});

test("create empty all properties", () => {
    const c = [];
    const l = [];
    const d = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = undefined;

    check(new SpreadsheetDelta(c, l, d, mcw, mrh, w),
        c,
        l,
        d,
        mcw,
        mrh,
        w,
        {});
});

// referenceToCellMap...................................................................................................

test("referenceToCellMap, no cells", () => {
    const c = [];
    const l = [];
    const d = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = null;

    expect(new SpreadsheetDelta(c, l, d, mcw, mrh, w).referenceToCellMap())
        .toStrictEqual(ImmutableMap.EMPTY);
});

test("referenceToCellMap, 1 cell", () => {
    const cell = a1();

    const c = [cell];
    const l = [];
    const d = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = null;

    expect(new SpreadsheetDelta(c, l, d, mcw, mrh, w).referenceToCellMap())
        .toStrictEqual(new ImmutableMap(new Map([
            [cell.reference().toString(), cell]
        ])));
});

test("referenceToCellMap, 2 cells", () => {
    const cell = a1();
    const cell2 = b2();

    const c = [cell, cell2];
    const l = [];
    const d = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = null;

    expect(new SpreadsheetDelta(c, l, d, mcw, mrh, w).referenceToCellMap())
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

// cellToLabels.........................................................................................................

test("cellToLabels() several labels", () => {
    const cellToLabels = delta().cellToLabels();

    expect(cellToLabels.get(a1().reference()))
        .toStrictEqual([
            label1(),
            label2(),
        ]);
});

test("cellToLabels() 1 label", () => {
    const cellToLabels = delta().cellToLabels();

    expect(cellToLabels.get(b2().reference()))
        .toStrictEqual([
            label3(),
        ]);
});

test("cellToLabels() no labels", () => {
    const cellToLabels = delta().cellToLabels();

    expect(cellToLabels.get(SpreadsheetCellReference.parse("Z99")))
        .toBeUndefined();
});

// labelToReference.........................................................................................................

test("labelToReference() several labels", () => {
    const labelToReference = delta().labelToReference();

    expect(labelToReference.get(label1()))
        .toStrictEqual(a1().reference());

    expect(labelToReference.get(label2()))
        .toStrictEqual(a1().reference());
});

test("labelToReference() 1 label", () => {
    const labelToReference = delta().labelToReference();

    expect(labelToReference.get(label3()))
        .toStrictEqual(b2().reference());
});

test("labelToReference() no labels", () => {
    const labelToReference = delta().labelToReference();

    expect(labelToReference.get(SpreadsheetLabelName.parse("Unknown")))
        .toBeUndefined();
});

// toJson...............................................................................................................

test("toJson only 1 cell", () => {
    const c = [a1()];
    const l = [];
    const d = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = null;

    expect(new SpreadsheetDelta(c, l, d, mcw, mrh, w).toJson())
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
    const l = [];
    const d = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = undefined;

    expect(new SpreadsheetDelta(c, l, d, mcw, mrh, w).toJson())
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
    const l = labels();
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, l, d, mcw, mrh, w).toJson())
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
            labels: [
                {
                    "label": "Label1",
                    "reference": "A1"
                },
                {
                    "label": "Label2",
                    "reference": "A1"
                },
                {
                    "label": "Label3",
                    "reference": "B2"
                }
            ],
            deletedCells: [
                "C1",
                "C2",
            ],
            columnWidths: {
                "A": 100
            },
            rowHeights: {
                "1": 20
            },
            window: windowJson
        });
});

// fromJson.............................................................................................................

test("fromJson empty", () => {
    const c = [];
    const l = [];
    const d = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = undefined;

    expect(SpreadsheetDelta.fromJson({})).toStrictEqual(new SpreadsheetDelta(c, l, d, mcw, mrh, w));
});

test("fromJson 1 cell", () => {
    const c = [a1()];
    const l = [];
    const d = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = undefined;

    expect(SpreadsheetDelta.fromJson({
        cells: {
            "A1": {
                formula: {
                    text: "1+2",
                    error: "Custom error #1"
                }
            }
        }
    })).toStrictEqual(new SpreadsheetDelta(c, l, d, mcw, mrh, w));
});

test("fromJson 2 cells only", () => {
    const c = [a1(), b2()];
    const l = [];
    const d = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = undefined;

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
    })).toStrictEqual(new SpreadsheetDelta(c, l, d, mcw, mrh, w));
});

test("fromJson all properties", () => {
    const c = cells();
    const l = labels();
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = rowHeights();
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
        labels: [
            {
                "label": "Label1",
                "reference": "A1"
            },
            {
                "label": "Label2",
                "reference": "A1"
            },
            {
                "label": "Label3",
                "reference": "B2"
            }
        ],
        deletedCells: [
            "C1",
            "C2",
        ],
        columnWidths: {
            "A": 100
        },
        rowHeights: {
            "1": 20
        },
        window: windowJson
    })).toStrictEqual(new SpreadsheetDelta(c, l, d, mcw, mrh, w));
});

// equals...............................................................................................................

test("equals different cells false", () => {
    const c = cells();
    const l = labels();
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, l, d, mcw, mrh, w)
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
            ], l, d, mcw, mrh, w)
        )
    ).toBeFalse();
});

test("equals different labels false", () => {
    const c = cells();
    const l = labels();
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, l, d, mcw, mrh, w)
        .equals(
            new SpreadsheetDelta(c, [], d, mcw, mrh, w)
        )
    ).toBeFalse();
});

test("equals different deletedCells false", () => {
    const c = cells();
    const l = labels();
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, l, d, mcw, mrh, w)
        .equals(
            new SpreadsheetDelta(c, l, ["c3"], mcw, mrh, w)
        )
    ).toBeFalse();
});

test("equals different columnWidths false", () => {
    const c = cells();
    const l = labels();
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, l, d, mcw, mrh, w)
        .equals(
            new SpreadsheetDelta(c, l, d, ImmutableMap.EMPTY, mrh, w)
        )
    ).toBeFalse();
});

test("equals different rowHeights false", () => {
    const c = cells();
    const l = labels();
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, l, d, mcw, mrh, w)
        .equals(
            new SpreadsheetDelta(c, l, d, mcw, ImmutableMap.EMPTY, w)
        )
    ).toBeFalse();
});

test("equals different window false", () => {
    const c = cells();
    const l = labels();
    const d = deletedCells();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, l, d, mcw, mrh, w)
        .equals(
            new SpreadsheetDelta(c, l, d, mcw, mrh, null)
        )
    ).toBeFalse();
});

test("equals equivalent true", () => {
    const d = delta();
    expect(d.equals(delta())).toBeTrue();
});

// helpers..............................................................................................................

function check(delta, cells, labels, deletedCells, columnWidths, rowHeights, window, json) {
    expect(delta.cells()).toStrictEqual(cells);
    expect(delta.labels()).toStrictEqual(labels);
    expect(delta.deletedCells()).toStrictEqual(deletedCells);
    expect(delta.columnWidths()).toStrictEqual(columnWidths);
    expect(delta.rowHeights()).toStrictEqual(rowHeights);
    expect(delta.window()).toStrictEqual(window);

    expect(delta.toJson()).toStrictEqual(json);
    expect(delta.toString()).toBe(JSON.stringify(json));

    expect(SpreadsheetDelta.fromJson(delta.toJson())).toStrictEqual(delta);
}
