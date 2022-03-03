import ImmutableMap from "../../util/ImmutableMap";
import SpreadsheetCell from "../SpreadsheetCell";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference.js";
import spreadsheetCellReferenceOrLabelNameParse from "../reference/SpreadsheetCellReferenceOrLabelNameParse.js";
import SpreadsheetCellRange from "../reference/SpreadsheetCellRange.js";
import SpreadsheetColumn from "../reference/SpreadsheetColumn.js";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference";
import SpreadsheetDelta from "./SpreadsheetDelta";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetRow from "../reference/SpreadsheetRow.js";
import SpreadsheetRowReference from "../reference/SpreadsheetRowReference";
import systemObjectTesting from "../../SystemObjectTesting.js";


function selection() {
    return SpreadsheetCellReference.parse("Z9")
        .setAnchor()
}

function a1() {
    return SpreadsheetCell.fromJson({
        "A1": {
            formula: {
                text: "1+2",
                value: {
                    type: "spreadsheet-error",
                    value: {
                        kind: "DIV0",
                        message: "Custom error #1"
                    }
                }
            }
        }
    });
}

function b2() {
    return SpreadsheetCell.fromJson({
        "B2": {
            formula: {
                text: "3+4",
                value: {
                    type: "spreadsheet-error",
                    value: {
                        kind: "DIV0",
                        message: "Custom error #2"
                    }
                }
            }
        }
    });
}

function cells() {
    return [a1(), b2()];
}

function a() {
    return SpreadsheetColumn.fromJson(
        {
            "A": {
                hidden: true,
            }
        }
    )
}

function b() {
    return SpreadsheetColumn.fromJson(
        {
            "B": {
                hidden: false,
            }
        }
    )
}

function columns() {
    return [
        a(),
        b()
    ];
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

function rows() {
    return [
        row1(),
        row2()
    ];
}

function row1() {
    return SpreadsheetRow.fromJson(
        {
            "1": {
                hidden: true,
            }
        }
    )
}

function row2() {
    return SpreadsheetRow.fromJson(
        {
            "2": {
                hidden: false,
            }
        }
    )
}

function deletedCells() {
    return [deletedCells1(), deletedCells2()];
}

function deletedCells1() {
    return SpreadsheetCellReference.parse("C1");
}

function deletedCells2() {
    return SpreadsheetCellReference.parse("C2");
}

function deletedColumns() {
    return [
        deletedColumn1(),
        deletedColumn2()
    ];
}

function deletedColumn1() {
    return SpreadsheetColumnReference.parse("D");
}

function deletedColumn2() {
    return SpreadsheetColumnReference.parse("E");
}

function deletedRows() {
    return [
        deletedRow1(),
        deletedRow2()
    ];
}

function deletedRow1() {
    return SpreadsheetRowReference.parse("6");
}

function deletedRow2() {
    return SpreadsheetRowReference.parse("7");
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
        selection(),
        cells(),
        columns(),
        labels(),
        rows(),
        deletedCells(),
        deletedColumns(),
        deletedRows(),
        columnWidths(),
        rowHeights(),
        window()
    );
}

systemObjectTesting(
    delta(),
    new SpreadsheetDelta(
        selection(),
        [
            SpreadsheetCell.fromJson({
                "Z9": {
                    formula: {
                        text: "99",
                        value: {
                            type: "spreadsheet-error",
                            value: {
                                kind: "DIV0",
                                message: "Different custom error #9"
                            }
                        }
                    }
                }
            })
        ],
        columns(),
        labels(),
        rows(),
        deletedCells(),
        deletedColumns(),
        deletedRows(),
        columnWidths(),
        rowHeights(),
        window()
    ),
    SpreadsheetDelta.fromJson,
    "Missing json",
    "spreadsheet-delta",
    {
        selection: selection().toJson(),
        cells: {
            "A1": {
                formula: {
                    text: "1+2",
                    value: {
                        type: "spreadsheet-error",
                        value: {
                            kind: "DIV0",
                            message: "Custom error #1"
                        }
                    }
                }
            },
            "B2": {
                formula: {
                    text: "3+4",
                    value: {
                        type: "spreadsheet-error",
                        value: {
                            kind: "DIV0",
                            message: "Custom error #2"
                        }
                    }
                }
            }
        },
        columns: {
            "A": {
                hidden: true,
            },
            "B": {
                hidden: false,
            },
        },
        labels: [
            {
                label: "Label1",
                reference: "A1"
            },
            {
                label: "Label2",
                reference: "A1"
            },
            {
                label: "Label3",
                reference: "B2"
            }
        ],
        rows: {
            "1": {
                hidden: true,
            },
            "2": {
                hidden: false,
            },
        },
        deletedCells: [
            "C1",
            "C2",
        ],
        deletedColumns: [
            "D",
            "E",
        ],
        deletedRows: [
            "6",
            "7",
        ],
        columnWidths: {
            "A": 100
        },
        rowHeights: {
            "1": 20
        },
        window: "A1:B2",
    }
);

// tests................................................................................................................

test("create without cells fails", () => {
    const s = selection();
    const c = undefined;
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)).toThrow("Missing cells");
});

test("create with cell non array fails", () => {
    const s = selection();
    const c = "!invalid";
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)).toThrow("Expected array cells got !invalid");
});

test("create without columns fails", () => {
    const s = selection();
    const c = cells();
    const col = undefined;
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)).toThrow("Missing columns");
});

test("create with columns non array fails", () => {
    const s = selection();
    const c = cells();
    const col = "!invalid";
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)).toThrow("Expected array columns got !invalid");
});

test("create without labels fails", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = undefined;
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)).toThrow("Missing labels");
});

test("create with labels non array fails", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = "!invalid";
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)).toThrow("Expected array labels got !invalid");
});

test("create without rows fails", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = undefined;
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)).toThrow("Missing rows");
});

test("create with rows non array fails", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = "!invalid";
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)).toThrow("Expected array rows got !invalid");
});

test("create without columnWidths fails", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = undefined;
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)).toThrow("Missing columnWidths");
});

test("create with columnWidths non object fails", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = "!invalid";
    const mrh = rowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)).toThrow("Expected ImmutableMap columnWidths got !invalid");
});

test("create without rowHeights fails", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = undefined;
    const w = window();

    expect(() => new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)).toThrow("Missing rowHeights");
});

test("create with rowHeights non object fails", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = "!invalid";
    const w = window();

    expect(() => new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)).toThrow("Expected ImmutableMap rowHeights got !invalid");
});

test("create", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    check(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w),
        s,
        c,
        col,
        l,
        r,
        dcell,
        dcol,
        drow,
        mcw,
        mrh,
        w,
        {
            selection: s.toJson(),
            cells: {
                "A1": {
                    formula: {
                        text: "1+2",
                        value: {
                            type: "spreadsheet-error",
                            value: {
                                kind: "DIV0",
                                message: "Custom error #1",
                            }
                        }
                    }
                },
                "B2": {
                    formula: {
                        text: "3+4",
                        value: {
                            type: "spreadsheet-error",
                            value: {
                                kind: "DIV0",
                                message: "Custom error #2",
                            }
                        }
                    }
                }
            },
            columns: {
                "A": {
                    hidden: true,
                },
                "B": {
                    hidden: false,
                }
            },
            labels: [
                {
                    label: "Label1",
                    reference: "A1"
                },
                {
                    label: "Label2",
                    reference: "A1"
                },
                {
                    label: "Label3",
                    reference: "B2"
                }
            ],
            rows: {
                "1": {
                    hidden: true,
                },
                "2": {
                    hidden: false,
                }
            },
            deletedCells: [
                "C1",
                "C2",
            ],
            deletedColumns: [
                "D",
                "E",
            ],
            deletedRows: [
                "6",
                "7",
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
    const s = undefined;
    const c = [];
    const col = [];
    const l = [];
    const r = [];
    const dcell = [];
    const dcol = [];
    const drow = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = undefined;

    check(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w),
        s,
        c,
        col,
        l,
        r,
        dcell,
        dcol,
        drow,
        mcw,
        mrh,
        w,
        {}
    );
});

// cellReferenceToCells...................................................................................................

function testCellReferenceToCellsAndCheck(cells, expected) {
    test("cellReferenceToCells " + cells,
        () => {
            const delta = new SpreadsheetDelta(
                null,
                cells, // cells
                [], // columns
                [], // labels
                [], // rows
                [], // deletedCells
                [], // deletedCells
                [], // deletedCells
                ImmutableMap.EMPTY, // cellWidths
                ImmutableMap.EMPTY, // cellHeights
                null, // window
            );

            expect(
                delta.cellReferenceToCells()
            ).toStrictEqual(expected);
        }
    );
}

testCellReferenceToCellsAndCheck(
    [],
    ImmutableMap.EMPTY
);

testCellReferenceToCellsAndCheck(
    [
        a1()
    ],
    new ImmutableMap(
        new Map(
            [
                ["A1", a1()]
            ]
        )
    )
);

testCellReferenceToCellsAndCheck(
    [
        a1(),
        b2()
    ],
    new ImmutableMap(
        new Map([
                ["A1", a1()],
                ["B2", b2()]
            ]
        )
    )
);

// cell.................................................................................................................

test("cell() missing cellOrLabel fails", () => {
    expect(
        () => delta().cell(undefined)
    ).toThrow("Missing cellOrLabel");
});

test("cell() invalid cellOrLabel fails", () => {
    expect(
        () => delta().cell("!invalid")
    ).toThrow("Expected SpreadsheetCellReferenceOrLabelName cellOrLabel got !invalid");
});

function testCellAndCheck(cells, labels, cellOrLabel, expected) {
    test("cell " + cellOrLabel,
        () => {
            const delta = new SpreadsheetDelta(
                null,
                cells, // cells
                [], // columns
                labels, // labels
                [], // rows
                [], // deletedCells
                [], // deletedCells
                [], // deletedCells
                ImmutableMap.EMPTY, // cellWidths
                ImmutableMap.EMPTY, // cellHeights
                null, // window
            );

            const cellOrLabelReference = spreadsheetCellReferenceOrLabelNameParse(cellOrLabel);

            expect(
                delta.cell(cellOrLabelReference)
            ).toStrictEqual(expected);
            expect(
                delta.cell(cellOrLabelReference)
            ).toStrictEqual(expected);
        }
    );
}

testCellAndCheck(
    cells(),
    [],
    "z99",
    undefined
);

testCellAndCheck(
    cells(),
    [],
    "UnknownLabel",
    undefined
);

testCellAndCheck(
    cells(),
    [],
    "A1",
    a1()
);

testCellAndCheck(
    cells(),
    [],
    "a1",
    a1()
);

testCellAndCheck(
    cells(),
    labels(),
    "b2",
    b2()
);

testCellAndCheck(
    cells(),
    labels(),
    "Label1",
    a1()
);

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

// cellReferenceToLabels.........................................................................................................

test("cellReferenceToLabels() several labels", () => {
    const cellReferenceToLabels = delta().cellReferenceToLabels();

    expect(cellReferenceToLabels.get(a1().reference()))
        .toStrictEqual([
            label1(),
            label2(),
        ]);
});

test("cellReferenceToLabels() 1 label", () => {
    const cellReferenceToLabels = delta().cellReferenceToLabels();

    expect(cellReferenceToLabels.get(b2().reference()))
        .toStrictEqual([
            label3(),
        ]);
});

test("cellReferenceToLabels() no labels", () => {
    const cellReferenceToLabels = delta().cellReferenceToLabels();

    expect(cellReferenceToLabels.get(SpreadsheetCellReference.parse("Z99")))
        .toBeUndefined();
});

// column.................................................................................................................

function testColumnAndCheck(columns, column, expected) {
    test("column " + column,
        () => {
            const delta = new SpreadsheetDelta(
                null,
                [], // cells
                columns,
                [], // labels
                [], // rows
                [], // deletedCells
                [], // deletedColumns
                [], // deletedRows
                ImmutableMap.EMPTY, // columnWidths
                ImmutableMap.EMPTY, // rowHeights
                null, // window
            );

            const columnReference = SpreadsheetColumnReference.parse(column);
            expect(
                delta.column(columnReference)
            ).toStrictEqual(expected);
            expect(
                delta.column(columnReference)
            ).toStrictEqual(expected);
        }
    );
}

testColumnAndCheck(
    columns(),
    "Z",
    undefined
);

testColumnAndCheck(
    columns(),
    "A",
    a()
);

testColumnAndCheck(
    columns(),
    "a",
    a()
);

testColumnAndCheck(
    columns(),
    "b",
    b()
);

// columnReferenceToColumns...................................................................................................

function testColumnReferenceToColumnsAndCheck(columns, expected) {
    test("columnReferenceToColumns " + columns,
        () => {
            const delta = new SpreadsheetDelta(
                null,
                [], // cells
                columns, // columns
                [], // labels
                [], // rows
                [], // deletedCells
                [], // deletedColumns
                [], // deletedRows
                ImmutableMap.EMPTY, // columnWidths
                ImmutableMap.EMPTY, // rowsHeights
                null, // window
            );

            expect(
                delta.columnReferenceToColumns()
            ).toStrictEqual(expected);
        }
    );
}

testColumnReferenceToColumnsAndCheck(
    [],
    ImmutableMap.EMPTY
);

testColumnReferenceToColumnsAndCheck(
    [
        a()
    ],
    new ImmutableMap(
        new Map(
            [
                ["A", a()]
            ]
        )
    )
);

testColumnReferenceToColumnsAndCheck(
    [
        a(),
        b()
    ],
    new ImmutableMap(
        new Map([
                ["A", a()],
                ["B", b()]
            ]
        )
    )
);

// labelToReferences.........................................................................................................

test("labelToReferences() several labels", () => {
    const labelToReferences = delta().labelToReferences();

    expect(labelToReferences.get(label1()))
        .toStrictEqual(a1().reference());

    expect(labelToReferences.get(label2()))
        .toStrictEqual(a1().reference());
});

test("labelToReferences() 1 label", () => {
    const labelToReferences = delta().labelToReferences();

    expect(labelToReferences.get(label3()))
        .toStrictEqual(b2().reference());
});

test("labelToReferences() no labels", () => {
    const labelToReferences = delta().labelToReferences();

    expect(labelToReferences.get(SpreadsheetLabelName.parse("Unknown")))
        .toBeUndefined();
});

// row.................................................................................................................

function testRowAndCheck(rows, row, expected) {
    test("row " + row,
        () => {
            const delta = new SpreadsheetDelta(
                null,
                [], // cells
                [], // columns
                [], // labels
                rows, // rows
                [], // deletedCells
                [], // deletedRows
                [], // deletedRows
                ImmutableMap.EMPTY, // rowWidths
                ImmutableMap.EMPTY, // rowHeights
                null, // window
            );

            const rowReference = SpreadsheetRowReference.parse(row);
            expect(
                delta.row(rowReference)
            ).toStrictEqual(expected);
            expect(
                delta.row(rowReference)
            ).toStrictEqual(expected);
        }
    );
}

testRowAndCheck(
    rows(),
    "99",
    undefined
);

testRowAndCheck(
    rows(),
    "1",
    row1()
);

testRowAndCheck(
    rows(),
    "2",
    row2()
);

// rowReferenceToRows...................................................................................................

function testRowReferenceToRowsAndCheck(rows, expected) {
    test("rowReferenceToRows " + rows,
        () => {
            const delta = new SpreadsheetDelta(
                null,
                [], // cells
                [], // columns
                [], // labels
                rows, // rows
                [], // deletedCells
                [], // deletedColumns
                [], // deletedRows
                ImmutableMap.EMPTY, // columnWidths
                ImmutableMap.EMPTY, // rowsHeights
                null, // window
            );

            expect(
                delta.rowReferenceToRows()
            ).toStrictEqual(expected);
        }
    );
}

testRowReferenceToRowsAndCheck(
    [],
    ImmutableMap.EMPTY
);

testRowReferenceToRowsAndCheck(
    [
        row1()
    ],
    new ImmutableMap(
        new Map(
            [
                ["1", row1()]
            ]
        )
    )
);

testRowReferenceToRowsAndCheck(
    [
        row1(),
        row2()
    ],
    new ImmutableMap(
        new Map([
                ["1", row1()],
                ["2", row2()]
            ]
        )
    )
);

// toJson...............................................................................................................

test("toJson only 1 cell", () => {
    const s = undefined;
    const c = [a1()];
    const col = [];
    const l = [];
    const r = [];
    const dcell = [];
    const dcol = [];
    const drow = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = null;

    expect(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
            .toJson())
        .toStrictEqual({
            cells: {
                "A1": {
                    formula: {
                        text: "1+2",
                        value: {
                            type: "spreadsheet-error",
                            value: {
                                kind: "DIV0",
                                message: "Custom error #1",
                            }
                        }
                    }
                }
            }
        });
});

test("toJson only 2 cells", () => {
    const s = undefined;
    const c = cells();
    const col = [];
    const l = [];
    const r = [];
    const dcell = [];
    const dcol = [];
    const drow = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = undefined;

    expect(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w).toJson())
        .toStrictEqual({
            "cells": {
                "A1": {
                    formula: {
                        text: "1+2",
                        value: {
                            type: "spreadsheet-error",
                            value: {
                                kind: "DIV0",
                                message: "Custom error #1",
                            }
                        }
                    }
                },
                "B2": {
                    formula: {
                        text: "3+4",
                        value: {
                            type: "spreadsheet-error",
                            value: {
                                kind: "DIV0",
                                message: "Custom error #2",
                            }
                        }
                    }
                },
            }
        });
});

test("toJson all properties", () => {
    const s = undefined;
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w).toJson())
        .toStrictEqual({
            cells: {
                "A1": {
                    formula: {
                        text: "1+2",
                        value: {
                            type: "spreadsheet-error",
                            value: {
                                kind: "DIV0",
                                message: "Custom error #1",
                            }
                        }
                    }
                },
                "B2": {
                    formula: {
                        text: "3+4",
                        value: {
                            type: "spreadsheet-error",
                            value: {
                                kind: "DIV0",
                                message: "Custom error #2",
                            }
                        }
                    }
                },
            },
            columns: {
                "A": {
                    hidden: true,
                },
                "B": {
                    hidden: false,
                },
            },
            labels: [
                {
                    label: "Label1",
                    reference: "A1"
                },
                {
                    label: "Label2",
                    reference: "A1"
                },
                {
                    label: "Label3",
                    reference: "B2"
                }
            ],
            rows: {
                "1": {
                    hidden: true,
                },
                "2": {
                    hidden: false,
                },
            },
            deletedCells: [
                "C1",
                "C2",
            ],
            deletedColumns: [
                "D",
                "E",
            ],
            deletedRows: [
                "6",
                "7",
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
    const s = undefined;
    const c = [];
    const col = [];
    const l = [];
    const r = [];
    const dcell = [];
    const dcol = [];
    const drow = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = undefined;

    expect(
        SpreadsheetDelta.fromJson({})
    ).toStrictEqual(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
    );
});

test("fromJson 1 cell", () => {
    const s = undefined;
    const c = [a1()];
    const col = [];
    const l = [];
    const r = [];
    const dcell = [];
    const dcol = [];
    const drow = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = undefined;

    expect(
        SpreadsheetDelta.fromJson(
            {
                cells: {
                    "A1": {
                        formula: {
                            text: "1+2",
                            value: {
                                type: "spreadsheet-error",
                                value: {
                                    kind: "DIV0",
                                    message: "Custom error #1",
                                }
                            }
                        }
                    }
                }
            }
        )
    ).toStrictEqual(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
    );
});

test("fromJson 2 cells only", () => {
    const s = undefined;
    const c = [a1(), b2()];
    const col = [];
    const l = [];
    const r = [];
    const dcell = [];
    const dcol = [];
    const drow = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = undefined;

    expect(
        SpreadsheetDelta.fromJson(
            {
                cells: {
                    "A1": {
                        formula: {
                            text: "1+2",
                            value: {
                                type: "spreadsheet-error",
                                value: {
                                    kind: "DIV0",
                                    message: "Custom error #1",
                                }
                            }
                        }
                    },
                    "B2": {
                        formula: {
                            text: "3+4",
                            value: {
                                type: "spreadsheet-error",
                                value: {
                                    kind: "DIV0",
                                    message: "Custom error #2",
                                }
                            }
                        }
                    }
                }
            }
        )
    ).toStrictEqual(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
    );
});

test("fromJson all properties", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(
        SpreadsheetDelta.fromJson(
            {
                selection: s.toJson(),
                cells: {
                    "A1": {
                        formula: {
                            text: "1+2",
                            value: {
                                type: "spreadsheet-error",
                                value: {
                                    kind: "DIV0",
                                    message: "Custom error #1",
                                }
                            }
                        }
                    },
                    "B2": {
                        formula: {
                            text: "3+4",
                            value: {
                                type: "spreadsheet-error",
                                value: {
                                    kind: "DIV0",
                                    message: "Custom error #2",
                                }
                            }
                        }
                    }
                },
                columns: {
                    "A": {
                        hidden: true,
                    },
                    "B": {
                        hidden: false,
                    }
                },
                labels: [
                    {
                        label: "Label1",
                        reference: "A1"
                    },
                    {
                        label: "Label2",
                        reference: "A1"
                    },
                    {
                        label: "Label3",
                        reference: "B2"
                    }
                ],
                rows: {
                    "1": {
                        hidden: true,
                    },
                    "2": {
                        hidden: false,
                    }
                },
                deletedCells: [
                    "C1",
                    "C2",
                ],
                deletedColumns: [
                    "D",
                    "E",
                ],
                deletedRows: [
                    "6",
                    "7",
                ],
                columnWidths: {
                    "A": 100
                },
                rowHeights: {
                    "1": 20
                },
                window: windowJson
            })
    ).toStrictEqual(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
    );
});

// EMPTY.............................................................................................................

test("EMPTY", () => {
    const s = undefined;
    const c = [];
    const col = [];
    const l = [];
    const r = [];
    const dcell = [];
    const dcol = [];
    const drow = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = undefined;

    expect(
        SpreadsheetDelta.EMPTY
    ).toStrictEqual(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
    );
});

// equals...............................................................................................................

test("equals different selection false", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
            .equals(
                new SpreadsheetDelta(
                    SpreadsheetColumnReference.parse("Z").setAnchor(),
                    c,
                    col,
                    l,
                    r,
                    dcell,
                    dcol,
                    drow,
                    mcw,
                    mrh,
                    w
                )
            )
    ).toBeFalse();
});

test("equals different cells false", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
            .equals(
                new SpreadsheetDelta(
                    s,
                    [
                        SpreadsheetCell.fromJson({
                                "Z9": {
                                    formula: {
                                        text: "999",
                                        value: {
                                            type: "spreadsheet-error",
                                            value: {
                                                kind: "DIV0",
                                                message: "Custom error #999",
                                            }
                                        }
                                    }
                                }
                            }
                        )
                    ],
                    col,
                    l,
                    r,
                    dcell,
                    dcol,
                    drow,
                    mcw,
                    mrh,
                    w
                )
            )
    ).toBeFalse();
});

test("equals different columns false", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
            .equals(
                new SpreadsheetDelta(
                    s,
                    c,
                    [],
                    l,
                    r,
                    dcell,
                    dcol,
                    drow,
                    mcw,
                    mrh,
                    w
                )
            )
    ).toBeFalse();
});

test("equals different labels false", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
            .equals(
                new SpreadsheetDelta(s, c, col, [], r, dcell, dcol, drow, mcw, mrh, w)
            )
    ).toBeFalse();
});

test("equals different rows false", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
            .equals(
                new SpreadsheetDelta(
                    s,
                    c,
                    col,
                    l,
                    [],
                    dcell,
                    dcol,
                    drow,
                    mcw,
                    mrh,
                    w
                )
            )
    ).toBeFalse();
});

test("equals different deletedCells false", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
            .equals(
                new SpreadsheetDelta(s, c, col, l, r, ["c3"], dcol, drow, mcw, mrh, w)
            )
    ).toBeFalse();
});

test("equals different deletedColumns false", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
            .equals(
                new SpreadsheetDelta(s, c, col, l, r, dcell, ["Z"], drow, mcw, mrh, w)
            )
    ).toBeFalse();
});

test("equals different deletedRows false", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
            .equals(
                new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, ["999"], mcw, mrh, w)
            )
    ).toBeFalse();
});

test("equals different columnWidths false", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
            .equals(
                new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, ImmutableMap.EMPTY, mrh, w)
            )
    ).toBeFalse();
});

test("equals different rowHeights false", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
            .equals(
                new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, ImmutableMap.EMPTY, w)
            )
    ).toBeFalse();
});

test("equals different window false", () => {
    const s = selection();
    const c = cells();
    const col = columns();
    const l = labels();
    const r = rows();
    const dcell = deletedCells();
    const dcol = deletedColumns();
    const drow = deletedRows();
    const mcw = columnWidths();
    const mrh = rowHeights();
    const w = window();

    expect(
        new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, w)
            .equals(
                new SpreadsheetDelta(s, c, col, l, r, dcell, dcol, drow, mcw, mrh, null)
            )
    ).toBeFalse();
});

test("equals equivalent true", () => {
    const d = delta();
    expect(d.equals(delta())).toBeTrue();
});

// helpers..............................................................................................................

function check(delta, selection, cells, columns, labels, rows, deletedCells, deletedColumns, deletedRows, columnWidths, rowHeights, window, json) {
    expect(delta.selection()).toStrictEqual(selection);

    expect(delta.cells()).toStrictEqual(cells);
    expect(delta.columns()).toStrictEqual(columns);
    expect(delta.labels()).toStrictEqual(labels);
    expect(delta.rows()).toStrictEqual(rows);

    expect(delta.deletedCells()).toStrictEqual(deletedCells);
    expect(delta.deletedColumns()).toStrictEqual(deletedColumns);
    expect(delta.deletedRows()).toStrictEqual(deletedRows);

    expect(delta.columnWidths()).toStrictEqual(columnWidths);
    expect(delta.rowHeights()).toStrictEqual(rowHeights);

    expect(delta.window()).toStrictEqual(window);

    expect(delta.toJson()).toStrictEqual(json);
    expect(delta.toString()).toBe(JSON.stringify(json));

    expect(SpreadsheetDelta.fromJson(delta.toJson())).toStrictEqual(delta);
}
