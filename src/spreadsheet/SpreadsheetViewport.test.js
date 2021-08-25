import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetCellRange from "./reference/SpreadsheetCellRange.js";
import SpreadsheetColumnReference from "./reference/SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "./reference/SpreadsheetColumnReferenceRange.js";
import SpreadsheetRowReferenceRange from "./reference/SpreadsheetRowReferenceRange.js";
import SpreadsheetRowReference from "./reference/SpreadsheetRowReference.js";
import SpreadsheetViewport from "./SpreadsheetViewport.js";
import systemObjectTesting from "../SystemObjectTesting.js";

function cellOrLabel() {
    return SpreadsheetCellReference.fromJson("B2");
}

function xOffset() {
    return -1;
}

function yOffset() {
    return -2;
}

function width() {
    return 100;
}

function height() {
    return 20;
}

function viewport() {
    return new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset(), width(), height());
}

systemObjectTesting(
    viewport(),
    new SpreadsheetViewport(SpreadsheetCellReference.parse("Z99"), 1, 2, 3, 4),
    SpreadsheetViewport.fromJson,
    "Missing text",
    "spreadsheet-viewport",
    "B2:-1:-2:100:20"
);

// create...............................................................................................................

test("create without cellOrLabel fails", () => {
    expect(() => new SpreadsheetViewport(null, xOffset(), yOffset(), width(), height())).toThrow("Missing cellOrLabel");
});

test("create invalid cellOrLabel type fails", () => {
    const cellOrLabel = "invalid!";
    expect(() => new SpreadsheetViewport(cellOrLabel, xOffset(), yOffset(), width(), height())).toThrow("Expected SpreadsheetCellReference cellOrLabel got " + cellOrLabel);
});

// xOffset

test("create missing xOffset fails", () => {
    const xOffset = null;
    expect(() => new SpreadsheetViewport(cellOrLabel(), xOffset, yOffset(), width(), height())).toThrow("Missing xOffset");
});

test("create invalid xOffset type fails", () => {
    const xOffset = "invalid!"
    expect(() => new SpreadsheetViewport(cellOrLabel(), xOffset, yOffset(), width(), height())).toThrow("Expected number xOffset got " + xOffset);
});

// yOffet

test("create missing yOffset fails", () => {
    const yOffset = null;
    expect(() => new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset, width(), height())).toThrow("Missing yOffset");
});

test("create invalid yOffsety type fails", () => {
    const yOffset = "invalid!"
    expect(() => new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset, width(), height())).toThrow("Expected number yOffset got " + yOffset);
});

// width

test("create missing width fails", () => {
    const width = null;
    expect(() => new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset(), width, height())).toThrow("Missing width");
});

test("create invalid width type fails", () => {
    const width = "invalid!"
    expect(() => new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset(), width, height())).toThrow("Expected number width got " + width);
});

test("create invalid width value fails", () => {
    const width = -1;
    expect(() => new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset(), width, height())).toThrow("Expected number width >= 0 got " + width);
});

test("create invalid width value fails2", () => {
    const width = -123;
    expect(() => new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset(), width, height())).toThrow("Expected number width >= 0 got " + width);
});

// height

test("create missing height fails", () => {
    const height = null;
    expect(() => new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset(), width(), height)).toThrow("Missing height");
});

test("create invalid height type fails", () => {
    const height = "invalid!"
    expect(() => new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset(), width(), height)).toThrow("Expected number height got " + height);
});

test("create invalid height value fails", () => {
    const height = -1;
    expect(() => new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset(), width(), height)).toThrow("Expected number height >= 0 got " + height);
});

test("create invalid height value fails2", () => {
    const height = -123;
    expect(() => new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset(), width(), height)).toThrow("Expected number height >= 0 got " + height);
});

test("new", () => {
    check(new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset(), width(), height()),
        cellOrLabel(),
        xOffset(),
        yOffset(),
        width(),
        height());
});

test("new xOffset=0 yOffset=0", () => {
    const xOffset = 0;
    const yOffset = 0;

    check(new SpreadsheetViewport(cellOrLabel(), xOffset, yOffset, width(), height()),
        cellOrLabel(),
        xOffset,
        yOffset,
        width(),
        height());
});

test("new 0 width", () => {
    const width = 0;
    check(new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset(), width, height()),
        cellOrLabel(),
        xOffset(),
        yOffset(),
        width,
        height());
});

test("new 0 height", () => {
    const height = 0;
    check(new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset(), width(), height),
        cellOrLabel(),
        xOffset(),
        yOffset(),
        width(),
        height);
});

// toLoadCellsQueryStringParameters..............................................................................................

function toLoadCellsQueryStringParametersAndCheck(c, x, y, w, h, s, expected) {
    test("toLoadCellsQueryStringParametersAndCheck " + c + " " + x + " " + y + " " + w + " " + h + " " + s, () => {
        expect(expected)
            .toStrictEqual(new SpreadsheetViewport(c, x, y, w, h, s).toLoadCellsQueryStringParameters(s));
    });
}

toLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    xOffset(),
    yOffset(),
    width(),
    height(),
    null,
    {
        home: cellOrLabel(),
        xOffset: xOffset(),
        yOffset: yOffset(),
        width: width(),
        height: height(),
    }
);

toLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    xOffset(),
    yOffset(),
    width(),
    height(),
    SpreadsheetCellRange.parse("B2:C3"),
    {
        home: cellOrLabel(),
        xOffset: xOffset(),
        yOffset: yOffset(),
        width: width(),
        height: height(),
        selectionType: "cell-range",
        selection: SpreadsheetCellRange.parse("B2:C3"),
    }
);

toLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    xOffset(),
    yOffset(),
    width(),
    height(),
    SpreadsheetCellReference.parse("B2"),
    {
        home: cellOrLabel(),
        xOffset: xOffset(),
        yOffset: yOffset(),
        width: width(),
        height: height(),
        selectionType: "cell",
        selection: SpreadsheetCellReference.parse("B2"),
    }
);

toLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    xOffset(),
    yOffset(),
    width(),
    height(),
    SpreadsheetColumnReference.parse("B"),
    {
        home: cellOrLabel(),
        xOffset: xOffset(),
        yOffset: yOffset(),
        width: width(),
        height: height(),
        selectionType: "column",
        selection: SpreadsheetColumnReference.parse("B"),
    }
);

toLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    xOffset(),
    yOffset(),
    width(),
    height(),
    SpreadsheetColumnReferenceRange.parse("B:C"),
    {
        home: cellOrLabel(),
        xOffset: xOffset(),
        yOffset: yOffset(),
        width: width(),
        height: height(),
        selectionType: "column-range",
        selection: SpreadsheetColumnReferenceRange.parse("B:C"),
    }
);

toLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    xOffset(),
    yOffset(),
    width(),
    height(),
    SpreadsheetRowReference.parse("99"),
    {
        home: cellOrLabel(),
        xOffset: xOffset(),
        yOffset: yOffset(),
        width: width(),
        height: height(),
        selectionType: "row",
        selection: SpreadsheetRowReference.parse("99"),
    }
);

toLoadCellsQueryStringParametersAndCheck(
    cellOrLabel(),
    xOffset(),
    yOffset(),
    width(),
    height(),
    SpreadsheetRowReferenceRange.parse("98:99"),
    {
        home: cellOrLabel(),
        xOffset: xOffset(),
        yOffset: yOffset(),
        width: width(),
        height: height(),
        selectionType: "row-range",
        selection: SpreadsheetRowReferenceRange.parse("98:99"),
    }
);
// equals...............................................................................................................

test("equals different cellOrLabel false", () => {
    const v = viewport();
    expect(v.equals(new SpreadsheetViewport(SpreadsheetCellReference.parse("Z9"), xOffset(), yOffset(), width(), height()))).toBeFalse();
});

test("equals different xOffset false", () => {
    const v = viewport();
    expect(v.equals(new SpreadsheetViewport(cellOrLabel(), xOffset() + 1, yOffset(), width(), height()))).toBeFalse();
});

test("equals different yOffset false", () => {
    const v = viewport();
    expect(v.equals(new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset() + 1, width(), height()))).toBeFalse();
});

test("equals different width false", () => {
    const v = viewport();
    expect(v.equals(new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset(), width() + 1, height()))).toBeFalse();
});

test("equals different height false", () => {
    const v = viewport();
    expect(v.equals(new SpreadsheetViewport(cellOrLabel(), xOffset(), yOffset(), width(), height() + 1))).toBeFalse();
});

test("equals equivalent true", () => {
    expect(viewport().equals(viewport())).toBeTrue();
});

test("equals equivalent true #2", () => {
    const viewport = new SpreadsheetViewport(SpreadsheetCellReference.parse("Z9"), 1, 2, 3, 4);
    const viewport2 = new SpreadsheetViewport(SpreadsheetCellReference.parse("Z9"), 1, 2, 3, 4);

    expect(viewport.equals(viewport2)).toBeTrue();
});

// helpers..............................................................................................................

function check(viewport, cellOrLabel, xOffset, yOffset, width, height) {
    expect(viewport.cellOrLabel()).toStrictEqual(cellOrLabel);
    expect(viewport.cellOrLabel()).toBeInstanceOf(SpreadsheetCellReference);

    expect(viewport.xOffset()).toStrictEqual(xOffset);
    expect(viewport.xOffset()).toBeNumber();

    expect(viewport.yOffset()).toStrictEqual(yOffset);
    expect(viewport.yOffset()).toBeNumber();

    expect(viewport.width()).toStrictEqual(width);
    expect(viewport.width()).toBeNumber();

    expect(viewport.height()).toStrictEqual(height);
    expect(viewport.height()).toBeNumber();

    const json = [cellOrLabel, xOffset, yOffset, width, height].join(":");
    expect(viewport.toJson()).toStrictEqual(json);

    expect(SpreadsheetViewport.fromJson(json)).toStrictEqual(viewport);
}