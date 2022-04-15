import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetCellRange from "./reference/SpreadsheetCellRange.js";
import SpreadsheetColumnReference from "./reference/SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "./reference/SpreadsheetColumnReferenceRange.js";
import SpreadsheetRowReferenceRange from "./reference/SpreadsheetRowReferenceRange.js";
import SpreadsheetRowReference from "./reference/SpreadsheetRowReference.js";
import SpreadsheetViewport from "./SpreadsheetViewport.js";
import SpreadsheetViewportSelectionAnchor from "./reference/SpreadsheetViewportSelectionAnchor.js";
import SpreadsheetViewportSelectionNavigation from "./reference/SpreadsheetViewportSelectionNavigation.js";
import systemObjectTesting from "../SystemObjectTesting.js";

function cellOrLabel() {
    return SpreadsheetCellReference.fromJson("B2");
}

function width() {
    return 100;
}

function height() {
    return 20;
}

function viewport() {
    return new SpreadsheetViewport(cellOrLabel(), width(), height());
}

systemObjectTesting(
    viewport(),
    new SpreadsheetViewport(SpreadsheetCellReference.parse("Z99"), 3, 4),
    SpreadsheetViewport.fromJson,
    "Missing text",
    "spreadsheet-viewport",
    "B2:100:20"
);

// create...............................................................................................................

test("create without cellOrLabel fails", () => {
    expect(() => new SpreadsheetViewport(null, width(), height())).toThrow("Missing cellOrLabel");
});

test("create invalid cellOrLabel type fails", () => {
    const cellOrLabel = "invalid!";
    expect(() => new SpreadsheetViewport(cellOrLabel, width(), height())).toThrow("Expected SpreadsheetCellReference cellOrLabel got " + cellOrLabel);
});

// width

test("create missing width fails", () => {
    const width = null;
    expect(() => new SpreadsheetViewport(cellOrLabel(), width, height())).toThrow("Missing width");
});

test("create invalid width type fails", () => {
    const width = "invalid!"
    expect(() => new SpreadsheetViewport(cellOrLabel(), width, height())).toThrow("Expected number width got " + width);
});

test("create invalid width value fails", () => {
    const width = -1;
    expect(() => new SpreadsheetViewport(cellOrLabel(), width, height())).toThrow("Expected number width >= 0 got " + width);
});

test("create invalid width value fails2", () => {
    const width = -123;
    expect(() => new SpreadsheetViewport(cellOrLabel(), width, height())).toThrow("Expected number width >= 0 got " + width);
});

// height

test("create missing height fails", () => {
    const height = null;
    expect(() => new SpreadsheetViewport(cellOrLabel(), width(), height)).toThrow("Missing height");
});

test("create invalid height type fails", () => {
    const height = "invalid!"
    expect(() => new SpreadsheetViewport(cellOrLabel(), width(), height)).toThrow("Expected number height got " + height);
});

test("create invalid height value fails", () => {
    const height = -1;
    expect(() => new SpreadsheetViewport(cellOrLabel(), width(), height)).toThrow("Expected number height >= 0 got " + height);
});

test("create invalid height value fails2", () => {
    const height = -123;
    expect(() => new SpreadsheetViewport(cellOrLabel(), width(), height)).toThrow("Expected number height >= 0 got " + height);
});

test("new", () => {
    check(new SpreadsheetViewport(cellOrLabel(), width(), height()),
        cellOrLabel(),
        width(),
        height());
});

test("new 0 width", () => {
    const width = 0;
    check(new SpreadsheetViewport(cellOrLabel(), width, height()),
        cellOrLabel(),
        width,
        height());
});

test("new 0 height", () => {
    const height = 0;
    check(new SpreadsheetViewport(cellOrLabel(), width(), height),
        cellOrLabel(),
        width(),
        height);
});

// apiLoadCellsQueryStringParameters..............................................................................................

function apiLoadCellsQueryStringParametersAndCheck(c, w, h, s, a, n, expected) {
    test("apiLoadCellsQueryStringParametersAndCheck " + c + " " + w + " " + h + " " + s + " anchor=" + a + " navigation=" + n, () => {
        expect(expected)
            .toStrictEqual(new SpreadsheetViewport(c, w, h)
                .apiLoadCellsQueryStringParameters(s, a, n)
            );
    });
}

apiLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    width(),
    height(),
    null,
    null,
    null,
    {
        home: [cellOrLabel()],
        width: [width()],
        height: [height()],
        includeFrozenColumnsRows: [false],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    width(),
    height(),
    SpreadsheetCellReference.parse("B2"),
    null,
    null,
    {
        home: [cellOrLabel()],
        width: [width()],
        height: [height()],
        selectionType: ["cell"],
        selection: [SpreadsheetCellReference.parse("B2")],
        includeFrozenColumnsRows: [false],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    width(),
    height(),
    SpreadsheetCellRange.parse("B2:C3"),
    SpreadsheetViewportSelectionAnchor.TOP_LEFT,
    null,
    {
        home: [cellOrLabel()],
        width: [width()],
        height: [height()],
        selectionType: ["cell-range"],
        selection: [SpreadsheetCellRange.parse("B2:C3")],
        selectionAnchor: ["top-left"],
        includeFrozenColumnsRows: [false],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    width(),
    height(),
    SpreadsheetCellReference.parse("B2"),
    null,
    null,
    {
        home: [cellOrLabel()],
        width: [width()],
        height: [height()],
        selectionType: ["cell"],
        selection: [SpreadsheetCellReference.parse("B2")],
        includeFrozenColumnsRows: [false],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    width(),
    height(),
    SpreadsheetColumnReference.parse("B"),
    null,
    null,
    {
        home: [cellOrLabel()],
        width: [width()],
        height: [height()],
        selectionType: ["column"],
        selection: [SpreadsheetColumnReference.parse("B")],
        includeFrozenColumnsRows: [false],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    width(),
    height(),
    SpreadsheetColumnReferenceRange.parse("B:C"),
    SpreadsheetViewportSelectionAnchor.LEFT,
    null,
    {
        home: [cellOrLabel()],
        width: [width()],
        height: [height()],
        selectionType: ["column-range"],
        selection: [SpreadsheetColumnReferenceRange.parse("B:C")],
        selectionAnchor: ["left"],
        includeFrozenColumnsRows: [false],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    width(),
    height(),
    SpreadsheetRowReference.parse("99"),
    null,
    null,
    {
        home: [cellOrLabel()],
        width: [width()],
        height: [height()],
        selectionType: ["row"],
        selection: [SpreadsheetRowReference.parse("99")],
        includeFrozenColumnsRows: [false],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    width(),
    height(),
    SpreadsheetRowReferenceRange.parse("98:99"),
    SpreadsheetViewportSelectionAnchor.TOP,
    null,
    {
        home: [cellOrLabel()],
        width: [width()],
        height: [height()],
        selectionType: ["row-range"],
        selection: [SpreadsheetRowReferenceRange.parse("98:99")],
        selectionAnchor: ["top"],
        includeFrozenColumnsRows: [false],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    width(),
    height(),
    SpreadsheetRowReferenceRange.parse("98:99"),
    SpreadsheetViewportSelectionAnchor.TOP,
    SpreadsheetViewportSelectionNavigation.UP,
    {
        home: [cellOrLabel()],
        width: [width()],
        height: [height()],
        selectionType: ["row-range"],
        selection: [SpreadsheetRowReferenceRange.parse("98:99")],
        selectionAnchor: ["top"],
        selectionNavigation: ["up"],
        includeFrozenColumnsRows: [false],
    }
);
// equals...............................................................................................................

test("equals different cellOrLabel false", () => {
    const v = viewport();
    expect(v.equals(new SpreadsheetViewport(SpreadsheetCellReference.parse("Z9"), width(), height()))).toBeFalse();
});

test("equals different width false", () => {
    const v = viewport();
    expect(v.equals(new SpreadsheetViewport(cellOrLabel(), width() + 1, height()))).toBeFalse();
});

test("equals different height false", () => {
    const v = viewport();
    expect(v.equals(new SpreadsheetViewport(cellOrLabel(), width(), height() + 1))).toBeFalse();
});

test("equals equivalent true", () => {
    expect(viewport().equals(viewport())).toBeTrue();
});

test("equals equivalent true #2", () => {
    const viewport = new SpreadsheetViewport(SpreadsheetCellReference.parse("Z9"), 3, 4);
    const viewport2 = new SpreadsheetViewport(SpreadsheetCellReference.parse("Z9"), 3, 4);

    expect(viewport.equals(viewport2)).toBeTrue();
});

// helpers..............................................................................................................

function check(viewport, cellOrLabel, width, height) {
    expect(viewport.cellOrLabel()).toStrictEqual(cellOrLabel);
    expect(viewport.cellOrLabel()).toBeInstanceOf(SpreadsheetCellReference);
    
    expect(viewport.width()).toStrictEqual(width);
    expect(viewport.width()).toBeNumber();

    expect(viewport.height()).toStrictEqual(height);
    expect(viewport.height()).toBeNumber();

    const json = [cellOrLabel, width, height].join(":");
    expect(viewport.toJson()).toStrictEqual(json);

    expect(SpreadsheetViewport.fromJson(json)).toStrictEqual(viewport);
}