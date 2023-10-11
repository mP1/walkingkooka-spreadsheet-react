import SpreadsheetCellReference from "../cell/SpreadsheetCellReference.js";
import SpreadsheetCellRange from "../cell/SpreadsheetCellRange.js";
import SpreadsheetColumnReference from "../columnrow/SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "../columnrow/SpreadsheetColumnReferenceRange.js";
import SpreadsheetRowReferenceRange from "../columnrow/SpreadsheetRowReferenceRange.js";
import SpreadsheetRowReference from "../columnrow/SpreadsheetRowReference.js";
import SpreadsheetViewportRectangle from "./SpreadsheetViewportRectangle.js";
import SpreadsheetViewportSelectionAnchor from "./SpreadsheetViewportSelectionAnchor.js";
import SpreadsheetViewportSelectionNavigation from "./SpreadsheetViewportSelectionNavigation.js";
import systemObjectTesting from "../../../SystemObjectTesting.js";

function home() {
    return SpreadsheetCellReference.fromJson("B2");
}

function width() {
    return 100;
}

function height() {
    return 20;
}

function viewport() {
    return new SpreadsheetViewportRectangle(home(), width(), height());
}

systemObjectTesting(
    viewport(),
    new SpreadsheetViewportRectangle(SpreadsheetCellReference.parse("Z99"), 3, 4),
    SpreadsheetViewportRectangle.fromJson,
    "Missing text",
    "spreadsheet-viewport-rectangle",
    "B2:100:20"
);

// create...............................................................................................................

test("create without home fails", () => {
    expect(() => new SpreadsheetViewportRectangle(null, width(), height())).toThrow("Missing home");
});

test("create invalid home type fails", () => {
    const home = "invalid!";
    expect(() => new SpreadsheetViewportRectangle(home, width(), height())).toThrow("Expected SpreadsheetCellReference home got " + home);
});

// width

test("create missing width fails", () => {
    const width = null;
    expect(() => new SpreadsheetViewportRectangle(home(), width, height())).toThrow("Missing width");
});

test("create invalid width type fails", () => {
    const width = "invalid!"
    expect(() => new SpreadsheetViewportRectangle(home(), width, height())).toThrow("Expected number width got " + width);
});

test("create invalid width value fails", () => {
    const width = -1;
    expect(() => new SpreadsheetViewportRectangle(home(), width, height())).toThrow("Expected number width >= 0 got " + width);
});

test("create invalid width value fails2", () => {
    const width = -123;
    expect(() => new SpreadsheetViewportRectangle(home(), width, height())).toThrow("Expected number width >= 0 got " + width);
});

// height

test("create missing height fails", () => {
    const height = null;
    expect(() => new SpreadsheetViewportRectangle(home(), width(), height)).toThrow("Missing height");
});

test("create invalid height type fails", () => {
    const height = "invalid!"
    expect(() => new SpreadsheetViewportRectangle(home(), width(), height)).toThrow("Expected number height got " + height);
});

test("create invalid height value fails", () => {
    const height = -1;
    expect(() => new SpreadsheetViewportRectangle(home(), width(), height)).toThrow("Expected number height >= 0 got " + height);
});

test("create invalid height value fails2", () => {
    const height = -123;
    expect(() => new SpreadsheetViewportRectangle(home(), width(), height)).toThrow("Expected number height >= 0 got " + height);
});

test("new", () => {
    check(new SpreadsheetViewportRectangle(home(), width(), height()),
        home(),
        width(),
        height());
});

test("new 0 width", () => {
    const width = 0;
    check(new SpreadsheetViewportRectangle(home(), width, height()),
        home(),
        width,
        height());
});

test("new 0 height", () => {
    const height = 0;
    check(new SpreadsheetViewportRectangle(home(), width(), height),
        home(),
        width(),
        height);
});

// apiLoadCellsQueryStringParameters..............................................................................................

function apiLoadCellsQueryStringParametersAndCheck(c, w, h, s, a, n, expected) {
    test("apiLoadCellsQueryStringParametersAndCheck " + c + " " + w + " " + h + " " + s + " anchor=" + a + " navigation=" + n, () => {
        expect(expected)
            .toStrictEqual(new SpreadsheetViewportRectangle(c, w, h)
                .apiLoadCellsQueryStringParameters(s, a, n)
            );
    });
}

apiLoadCellsQueryStringParametersAndCheck(
    home(),
    width(),
    height(),
    null,
    null,
    null,
    {
        home: [home()],
        width: [width()],
        height: [height()],
        includeFrozenColumnsRows: [true],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    home(),
    width(),
    height(),
    SpreadsheetCellReference.parse("B2"),
    null,
    null,
    {
        home: [home()],
        width: [width()],
        height: [height()],
        selectionType: ["cell"],
        selection: [SpreadsheetCellReference.parse("B2")],
        includeFrozenColumnsRows: [true],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    home(),
    width(),
    height(),
    SpreadsheetCellRange.parse("B2:C3"),
    SpreadsheetViewportSelectionAnchor.TOP_LEFT,
    null,
    {
        home: [home()],
        width: [width()],
        height: [height()],
        selectionType: ["cell-range"],
        selection: [SpreadsheetCellRange.parse("B2:C3")],
        selectionAnchor: ["top-left"],
        includeFrozenColumnsRows: [true],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    home(),
    width(),
    height(),
    SpreadsheetCellReference.parse("B2"),
    null,
    null,
    {
        home: [home()],
        width: [width()],
        height: [height()],
        selectionType: ["cell"],
        selection: [SpreadsheetCellReference.parse("B2")],
        includeFrozenColumnsRows: [true],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    home(),
    width(),
    height(),
    SpreadsheetColumnReference.parse("B"),
    null,
    null,
    {
        home: [home()],
        width: [width()],
        height: [height()],
        selectionType: ["column"],
        selection: [SpreadsheetColumnReference.parse("B")],
        includeFrozenColumnsRows: [true],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    home(),
    width(),
    height(),
    SpreadsheetColumnReferenceRange.parse("B:C"),
    SpreadsheetViewportSelectionAnchor.LEFT,
    null,
    {
        home: [home()],
        width: [width()],
        height: [height()],
        selectionType: ["column-range"],
        selection: [SpreadsheetColumnReferenceRange.parse("B:C")],
        selectionAnchor: ["left"],
        includeFrozenColumnsRows: [true],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    home(),
    width(),
    height(),
    SpreadsheetRowReference.parse("99"),
    null,
    null,
    {
        home: [home()],
        width: [width()],
        height: [height()],
        selectionType: ["row"],
        selection: [SpreadsheetRowReference.parse("99")],
        includeFrozenColumnsRows: [true],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    home(),
    width(),
    height(),
    SpreadsheetRowReferenceRange.parse("98:99"),
    SpreadsheetViewportSelectionAnchor.TOP,
    null,
    {
        home: [home()],
        width: [width()],
        height: [height()],
        selectionType: ["row-range"],
        selection: [SpreadsheetRowReferenceRange.parse("98:99")],
        selectionAnchor: ["top"],
        includeFrozenColumnsRows: [true],
    }
);

apiLoadCellsQueryStringParametersAndCheck(
    home(),
    width(),
    height(),
    SpreadsheetRowReferenceRange.parse("98:99"),
    SpreadsheetViewportSelectionAnchor.TOP,
    SpreadsheetViewportSelectionNavigation.UP_ROW,
    {
        home: [home()],
        width: [width()],
        height: [height()],
        selectionType: ["row-range"],
        selection: [SpreadsheetRowReferenceRange.parse("98:99")],
        selectionAnchor: ["top"],
        selectionNavigation: ["up row"],
        includeFrozenColumnsRows: [true],
    }
);
// equals...............................................................................................................

test("equals different home false", () => {
    const v = viewport();
    expect(v.equals(new SpreadsheetViewportRectangle(SpreadsheetCellReference.parse("Z9"), width(), height()))).toBeFalse();
});

test("equals different width false", () => {
    const v = viewport();
    expect(v.equals(new SpreadsheetViewportRectangle(home(), width() + 1, height()))).toBeFalse();
});

test("equals different height false", () => {
    const v = viewport();
    expect(v.equals(new SpreadsheetViewportRectangle(home(), width(), height() + 1))).toBeFalse();
});

test("equals equivalent true", () => {
    expect(viewport().equals(viewport())).toBeTrue();
});

test("equals equivalent true #2", () => {
    const viewport = new SpreadsheetViewportRectangle(SpreadsheetCellReference.parse("Z9"), 3, 4);
    const viewport2 = new SpreadsheetViewportRectangle(SpreadsheetCellReference.parse("Z9"), 3, 4);

    expect(viewport.equals(viewport2)).toBeTrue();
});

// helpers..............................................................................................................

function check(viewport, home, width, height) {
    expect(viewport.home()).toStrictEqual(home);
    expect(viewport.home()).toBeInstanceOf(SpreadsheetCellReference);
    
    expect(viewport.width()).toStrictEqual(width);
    expect(viewport.width()).toBeNumber();

    expect(viewport.height()).toStrictEqual(height);
    expect(viewport.height()).toBeNumber();

    const json = [home, width, height].join(":");
    expect(viewport.toJson()).toStrictEqual(json);

    expect(SpreadsheetViewportRectangle.fromJson(json)).toStrictEqual(viewport);
}