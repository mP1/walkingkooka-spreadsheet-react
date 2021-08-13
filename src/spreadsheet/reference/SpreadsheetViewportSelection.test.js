import SpreadsheetCellRange from "./SpreadsheetCellRange.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetViewportSelection from "./SpreadsheetViewportSelection.js";
import SpreadsheetViewportSelectionAnchor from "./SpreadsheetViewportSelectionAnchor.js";
import systemObjectTesting from "../../SystemObjectTesting.js";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import SpreadsheetColumnReferenceRange from "./SpreadsheetColumnReferenceRange.js";
import SpreadsheetRowReferenceRange from "./SpreadsheetRowReferenceRange.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";

function selection() {
    return cellRange();
};

function cell() {
    return SpreadsheetCellReference.parse("B2");
};

function cellRange() {
    return SpreadsheetCellRange.parse("B2:C3");
}

function column() {
    return SpreadsheetColumnReference.parse("B");
};

function columnRange() {
    return SpreadsheetColumnReferenceRange.parse("B:C");
}

function row() {
    return SpreadsheetRowReference.parse("2");
};

function rowRange() {
    return SpreadsheetRowReferenceRange.parse("2:3");
}

function anchor() {
    return SpreadsheetViewportSelectionAnchor.TOP_LEFT;
};

systemObjectTesting(
    new SpreadsheetViewportSelection(selection(), anchor()),
    new SpreadsheetViewportSelection(
        SpreadsheetCellReference.parse("Z99"),
        null
    ),
    SpreadsheetViewportSelection.fromJson,
    "Missing json",
    "spreadsheet-viewport-selection",
    {
        selection: selection().toJsonWithType(),
        anchor: anchor().toJson(),
    }
);

// create...............................................................................................................

function testNewFails(selection, anchor, message) {
    test("new selection=" + selection + " anchor=" + anchor + " fails", () => {
        expect(() => new SpreadsheetViewportSelection(selection, anchor)).toThrow(message);
    });
}

function testNew(selection, anchor) {
    test("new selection=" + selection + " anchor=" + anchor, () => {
        const viewportSelection = new SpreadsheetViewportSelection(selection, anchor);
        expect(viewportSelection.selection())
            .toStrictEqual(selection);
        expect(viewportSelection.anchor())
            .toStrictEqual(anchor);
    });
}

testNewFails(null, null, "Missing selection");
testNewFails(SpreadsheetLabelName.parse("Label123"), null, "Label Label123 cannot be appear within SpreadsheetViewportSelection");

// cell
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.TOP, "Expected no anchor got TOP");
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.TOP_LEFT);
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.BOTTOM);
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.LEFT);
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.RIGHT);
testNew(cell(), null);

// cellRange
testNewFails(cellRange(), SpreadsheetViewportSelectionAnchor.TOP, "Unknown anchor TOP, expected any of TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT");
testNew(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT);
testNew(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testNewFails(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM);
testNew(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testNew(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);
testNewFails(cellRange(), SpreadsheetViewportSelectionAnchor.LEFT);
testNewFails(cellRange(), SpreadsheetViewportSelectionAnchor.RIGHT);
testNewFails(cellRange(), null, "Missing anchor");

// column
testNewFails(column(), SpreadsheetViewportSelectionAnchor.TOP, "Expected no anchor got TOP");
testNewFails(column(), SpreadsheetViewportSelectionAnchor.TOP_LEFT);
testNewFails(column(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testNewFails(column(), SpreadsheetViewportSelectionAnchor.BOTTOM);
testNewFails(column(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testNewFails(column(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);
testNewFails(column(), SpreadsheetViewportSelectionAnchor.LEFT);
testNewFails(column(), SpreadsheetViewportSelectionAnchor.RIGHT);
testNew(column(), null);

// columnRange
testNewFails(columnRange(), SpreadsheetViewportSelectionAnchor.TOP, "Unknown anchor TOP, expected any of LEFT, RIGHT");
testNewFails(columnRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT);
testNewFails(columnRange(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testNewFails(columnRange(), SpreadsheetViewportSelectionAnchor.BOTTOM);
testNewFails(columnRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testNewFails(columnRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);
testNew(columnRange(), SpreadsheetViewportSelectionAnchor.LEFT);
testNew(columnRange(), SpreadsheetViewportSelectionAnchor.RIGHT);
testNewFails(columnRange(), null, "Missing anchor");

// row
testNewFails(row(), SpreadsheetViewportSelectionAnchor.TOP, "Expected no anchor got TOP");
testNewFails(row(), SpreadsheetViewportSelectionAnchor.TOP_LEFT);
testNewFails(row(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testNewFails(row(), SpreadsheetViewportSelectionAnchor.BOTTOM);
testNewFails(row(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testNewFails(row(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);
testNewFails(row(), SpreadsheetViewportSelectionAnchor.LEFT);
testNewFails(row(), SpreadsheetViewportSelectionAnchor.RIGHT);
testNew(row(), null);

// rowRange
testNew(rowRange(), SpreadsheetViewportSelectionAnchor.TOP);
testNewFails(rowRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT, "Unknown anchor TOP_LEFT, expected any of TOP, BOTTOM");
testNewFails(rowRange(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testNew(rowRange(), SpreadsheetViewportSelectionAnchor.BOTTOM);
testNewFails(rowRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testNewFails(rowRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);
testNewFails(rowRange(), SpreadsheetViewportSelectionAnchor.LEFT);
testNewFails(rowRange(), SpreadsheetViewportSelectionAnchor.RIGHT);
testNewFails(rowRange(), null, "Missing anchor");

// fromJson.............................................................................................................

function testFromJson(selection, anchor) {
    test("fromJson selection=" + selection + " anchor=" + anchor, () => {
        const viewportSelection = SpreadsheetViewportSelection.fromJson({
            selection: selection.toJsonWithType(),
            anchor: anchor && anchor.toJson()
        });
        expect(viewportSelection.selection())
            .toStrictEqual(selection);
        expect(viewportSelection.anchor())
            .toStrictEqual(anchor);
    });
}

testFromJson(cell(), null);

testFromJson(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT);
testFromJson(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testFromJson(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testFromJson(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);

testFromJson(column(), null);

testFromJson(columnRange(), SpreadsheetViewportSelectionAnchor.LEFT);
testFromJson(columnRange(), SpreadsheetViewportSelectionAnchor.RIGHT);

testFromJson(row(), null);
testFromJson(rowRange(), SpreadsheetViewportSelectionAnchor.TOP);
testFromJson(rowRange(), SpreadsheetViewportSelectionAnchor.BOTTOM);

// toJson.............................................................................................................

function testToJson(selection, anchor) {
    test("toJson selection=" + selection + " anchor=" + anchor, () => {
        const json = {
            selection: selection.toJsonWithType(),
        };

        if(anchor){
            json.anchor = anchor.toJson();
        }

        expect(SpreadsheetViewportSelection.fromJson(json).toJson())
            .toStrictEqual(json);
    });
}

testToJson(cell(), null);

testToJson(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT);
testToJson(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testToJson(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testToJson(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);

testToJson(column(), null);

testToJson(columnRange(), SpreadsheetViewportSelectionAnchor.LEFT);
testToJson(columnRange(), SpreadsheetViewportSelectionAnchor.RIGHT);

testToJson(row(), null);
testToJson(rowRange(), SpreadsheetViewportSelectionAnchor.TOP);
testToJson(rowRange(), SpreadsheetViewportSelectionAnchor.BOTTOM);

// equals................................................................................................................

test("equals selection without anchor", () => {
    expect(new SpreadsheetViewportSelection(cell(), null)
        .equals(new SpreadsheetViewportSelection(cell(), null)))
        .toBeTrue();
});

test("equals selection with anchor", () => {
    expect(new SpreadsheetViewportSelection(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT)
        .equals(new SpreadsheetViewportSelection(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT)))
        .toBeTrue();
});

test("equals different selection false", () => {
    expect(new SpreadsheetViewportSelection(cellRange(), anchor())
        .equals(new SpreadsheetViewportSelection(cell(), null)))
        .toBeFalse();
});

test("equals different anchor false", () => {
    expect(new SpreadsheetViewportSelection(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT)
        .equals(new SpreadsheetViewportSelection(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT)))
        .toBeFalse();
});
