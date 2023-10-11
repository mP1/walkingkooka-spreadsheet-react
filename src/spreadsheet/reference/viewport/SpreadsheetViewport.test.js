import SpreadsheetCellRange from "../cell/SpreadsheetCellRange.js";
import SpreadsheetCellReference from "../cell/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "../columnrow/SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "../columnrow/SpreadsheetColumnReferenceRange.js";
import SpreadsheetLabelName from "../label/SpreadsheetLabelName.js";
import SpreadsheetRowReference from "../columnrow/SpreadsheetRowReference.js";
import SpreadsheetRowReferenceRange from "../columnrow/SpreadsheetRowReferenceRange.js";
import SpreadsheetViewport from "./SpreadsheetViewport.js";
import SpreadsheetViewportSelectionAnchor from "./SpreadsheetViewportSelectionAnchor.js";
import SpreadsheetViewportSelectionNavigation from "./SpreadsheetViewportSelectionNavigation.js";
import systemObjectTesting from "../../../SystemObjectTesting.js";

function selection() {
    return cellRange();
}

function cell() {
    return SpreadsheetCellReference.parse("B2");
}

function cellRange() {
    return SpreadsheetCellRange.parse("B2:C3");
}

function column() {
    return SpreadsheetColumnReference.parse("B");
}

function columnRange() {
    return SpreadsheetColumnReferenceRange.parse("B:C");
}

function row() {
    return SpreadsheetRowReference.parse("2");
}

function rowRange() {
    return SpreadsheetRowReferenceRange.parse("2:3");
}

function label() {
    return SpreadsheetLabelName.parse("Label123");
}

function anchor() {
    return SpreadsheetViewportSelectionAnchor.TOP_LEFT;
}

function navigation() {
    return SpreadsheetViewportSelectionNavigation.LEFT_COLUMN;
}

systemObjectTesting(
    new SpreadsheetViewport(selection(), anchor(), navigation()),
    new SpreadsheetViewport(
        SpreadsheetCellReference.parse("Z99"),
        null,
        null
    ),
    SpreadsheetViewport.fromJson,
    "Missing json",
    "spreadsheet-viewport",
    {
        selection: selection().toJsonWithType(),
        anchor: anchor().toJson(),
        navigation: navigation().toJson(),
    }
);

// create...............................................................................................................

function testNewFails(selection, anchor, navigation, message) {
    test("new selection=" + selection + " anchor=" + anchor + " navigation: " + navigation + " fails", () => {
        expect(
            () => new SpreadsheetViewport(
                selection,
                anchor,
                navigation
            )
        ).toThrow(message);
    });
}

function testNew(selection, anchor, navigation) {
    test("new selection=" + selection + " anchor=" + anchor, () => {
        const viewport = new SpreadsheetViewport(selection, anchor, navigation);
        expect(viewport.selection())
            .toStrictEqual(selection);
        expect(viewport.anchor())
            .toStrictEqual(anchor);
        expect(viewport.navigation())
            .toStrictEqual(navigation);
    });
}

testNewFails(null, null, "Missing selection");

// cell
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.TOP, "Unknown anchor TOP, expected any of NONE for " + cell());
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.TOP_LEFT);
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.BOTTOM);
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.LEFT);
testNewFails(cell(), SpreadsheetViewportSelectionAnchor.RIGHT);
testNew(cell(), null);
testNew(cell(), null, SpreadsheetViewportSelectionNavigation.LEFT_COLUMN);

// cellRange
testNewFails(cellRange(), SpreadsheetViewportSelectionAnchor.TOP);
testNew(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT);
testNew(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testNewFails(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM);
testNew(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testNew(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);
testNewFails(cellRange(), SpreadsheetViewportSelectionAnchor.LEFT);
testNewFails(cellRange(), SpreadsheetViewportSelectionAnchor.RIGHT);

// column
testNewFails(column(), SpreadsheetViewportSelectionAnchor.TOP, "Unknown anchor TOP, expected any of NONE for " + column());
testNewFails(column(), SpreadsheetViewportSelectionAnchor.TOP_LEFT);
testNewFails(column(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testNewFails(column(), SpreadsheetViewportSelectionAnchor.BOTTOM);
testNewFails(column(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testNewFails(column(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);
testNewFails(column(), SpreadsheetViewportSelectionAnchor.LEFT);
testNewFails(column(), SpreadsheetViewportSelectionAnchor.RIGHT);
testNew(column(), null);

// columnRange
testNewFails(columnRange(), SpreadsheetViewportSelectionAnchor.TOP, "Unknown anchor TOP, expected any of LEFT, RIGHT for " + columnRange());
testNewFails(columnRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT);
testNewFails(columnRange(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testNewFails(columnRange(), SpreadsheetViewportSelectionAnchor.BOTTOM);
testNewFails(columnRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testNewFails(columnRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);
testNew(columnRange(), SpreadsheetViewportSelectionAnchor.LEFT);
testNew(columnRange(), SpreadsheetViewportSelectionAnchor.RIGHT);
testNew(columnRange(), null);

// row
testNewFails(row(), SpreadsheetViewportSelectionAnchor.TOP, "Unknown anchor TOP, expected any of NONE for " + row());
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
testNewFails(rowRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT, "Unknown anchor TOP_LEFT, expected any of TOP, BOTTOM for " + rowRange());
testNewFails(rowRange(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testNew(rowRange(), SpreadsheetViewportSelectionAnchor.BOTTOM);
testNewFails(rowRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testNewFails(rowRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);
testNewFails(rowRange(), SpreadsheetViewportSelectionAnchor.LEFT);
testNewFails(rowRange(), SpreadsheetViewportSelectionAnchor.RIGHT);
testNew(rowRange(), null);

// label
testNew(label(), SpreadsheetViewportSelectionAnchor.TOP);
testNew(label(), SpreadsheetViewportSelectionAnchor.TOP_LEFT);
testNew(label(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testNew(label(), SpreadsheetViewportSelectionAnchor.BOTTOM);
testNew(label(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testNew(label(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);
testNew(label(), SpreadsheetViewportSelectionAnchor.LEFT);
testNew(label(), SpreadsheetViewportSelectionAnchor.RIGHT);
testNew(label(), null);

// toQueryString........................................................................................................

function testToQueryString(selection, anchor, navigation, firstSeparator, queryString) {
    test("toQueryString: " + selection + " anchor=" + anchor + " navigation=" + navigation + " firstSeparator=" + firstSeparator,
        () => {
            const viewport = SpreadsheetViewport.fromJson(
                {
                    selection: selection.toJsonWithType(),
                    anchor: anchor && anchor.toJson(),
                    navigation: navigation && navigation.toJson(),
                }
            );

            expect(viewport.toQueryString(firstSeparator))
                .toStrictEqual(queryString);
        });
}

testToQueryString(
    column(),
    SpreadsheetViewportSelectionAnchor.NONE,
    null,
    "",
    "selection=" + column() + "&selectionType=column&selectionAnchor=none"
);

testToQueryString(
    column(),
    SpreadsheetViewportSelectionAnchor.NONE,
    null,
    "?",
    "?selection=" + column() + "&selectionType=column&selectionAnchor=none"
);

testToQueryString(
    cell(),
    SpreadsheetViewportSelectionAnchor.NONE,
    null,
    "?",
    "?selection=" + cell() + "&selectionType=cell&selectionAnchor=none"
);

testToQueryString(
    cellRange(),
    SpreadsheetViewportSelectionAnchor.TOP_LEFT,
    null,
    "?",
    "?selection=B2%3AC3&selectionType=cell-range&selectionAnchor=top-left"
);

testToQueryString(
    cellRange(),
    SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT,
    null,
    "?",
    "?selection=B2%3AC3&selectionType=cell-range&selectionAnchor=bottom-left"
);

// fromJson.............................................................................................................

function testFromJson(selection, anchor, navigation) {
    test("fromJson selection=" + selection + " anchor=" + anchor + " navigation=" + navigation, () => {
        const viewport = SpreadsheetViewport.fromJson(
            {
                selection: selection.toJsonWithType(),
                anchor: anchor && anchor.toJson(),
                navigation: navigation && navigation.toJson(),
            }
        );
        expect(viewport.selection())
            .toStrictEqual(selection);
        expect(viewport.anchor())
            .toStrictEqual(anchor);
        expect(viewport.navigation())
            .toStrictEqual(navigation);
    });
}

testFromJson(cell(), null);

testFromJson(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT);
testFromJson(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_RIGHT);
testFromJson(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT);
testFromJson(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT);
testFromJson(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT, SpreadsheetViewportSelectionNavigation.LEFT_COLUMN);
testFromJson(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT, SpreadsheetViewportSelectionNavigation.EXTEND_RIGHT_COLUMN);

testFromJson(column(), null);
testFromJson(column(), SpreadsheetViewportSelectionAnchor.NONE, SpreadsheetViewportSelectionNavigation.LEFT_COLUMN);

testFromJson(columnRange(), SpreadsheetViewportSelectionAnchor.LEFT);
testFromJson(columnRange(), SpreadsheetViewportSelectionAnchor.RIGHT);
testFromJson(columnRange(), SpreadsheetViewportSelectionAnchor.RIGHT, SpreadsheetViewportSelectionNavigation.LEFT_COLUMN);

testFromJson(row());
testFromJson(rowRange(), SpreadsheetViewportSelectionAnchor.TOP);
testFromJson(rowRange(), SpreadsheetViewportSelectionAnchor.BOTTOM);
testFromJson(rowRange(), SpreadsheetViewportSelectionAnchor.BOTTOM, SpreadsheetViewportSelectionNavigation.UP_ROW);

// toJson.............................................................................................................

function testToJson(selection, anchor) {
    test("toJson selection=" + selection + " anchor=" + anchor, () => {
        const json = {
            selection: selection.toJsonWithType(),
        };

        if(anchor){
            json.anchor = anchor.toJson();
        }

        expect(SpreadsheetViewport.fromJson(json).toJson())
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

// setAnchor.............................................................................................................

test("setAnchor same", () => {
    const viewport = new SpreadsheetViewport(
        selection(),
        anchor(),
        navigation()
    );

    expect(
        viewport.setAnchor(anchor())
            .equals(
                viewport
            )
    ).toBeTrue();
});

test("setAnchor different", () => {
    const viewport = new SpreadsheetViewport(
        selection(),
        anchor(),
        navigation()
    );

    const different = SpreadsheetViewportSelectionAnchor.TOP_RIGHT;

    expect(
        viewport.setAnchor(different)
            .equals(
                new SpreadsheetViewport(
                    selection(),
                    different,
                    navigation()
                )
            )
    ).toBeTrue();
});

test("setAnchor different null", () => {
    const viewport = new SpreadsheetViewport(
        selection(),
        anchor(),
        navigation()
    );

    const different = null;

    expect(
        viewport.setAnchor(different)
            .equals(
                new SpreadsheetViewport(
                    selection(),
                    different,
                    navigation()
                )
            )
    ).toBeTrue();
});

test("setAnchor different non null", () => {
    const viewport = new SpreadsheetViewport(
        selection(),
        null,
        navigation()
    );

    const different = anchor();

    expect(
        viewport.setAnchor(different)
            .equals(
                new SpreadsheetViewport(
                    selection(),
                    different,
                    navigation()
                )
            )
    ).toBeTrue();
});

// setNavigation.............................................................................................................

test("setNavigation same", () => {
    const viewport = new SpreadsheetViewport(
        selection(),
        anchor(),
        navigation()
    );

    expect(
        viewport.setNavigation(navigation())
            .equals(
                viewport
            )
    ).toBeTrue();
});

test("setNavigation different was null", () => {
    const viewport = new SpreadsheetViewport(
        selection(),
        anchor(),
        null
    );

    const different = SpreadsheetViewportSelectionNavigation.RIGHT_COLUMN;

    expect(
        viewport.setNavigation(different)
            .equals(
                new SpreadsheetViewport(
                    selection(),
                    anchor(),
                    different
                )
            )
    ).toBeTrue();
});

test("setNavigation different", () => {
    const viewport = new SpreadsheetViewport(
        selection(),
        anchor(),
        navigation()
    );

    const different = SpreadsheetViewportSelectionNavigation.RIGHT_COLUMN;

    expect(
        viewport.setNavigation(different)
            .equals(
                new SpreadsheetViewport(
                    selection(),
                    anchor(),
                    different
                )
            )
    ).toBeTrue();
});

test("setNavigation different null", () => {
    const viewport = new SpreadsheetViewport(
        selection(),
        anchor(),
        navigation()
    );

    const different = null;

    expect(
        viewport.setNavigation(different)
            .equals(
                new SpreadsheetViewport(
                    selection(),
                    anchor(),
                    different
                )
            )
    ).toBeTrue();
});

test("setNavigation different non null", () => {
    const viewport = new SpreadsheetViewport(
        selection(),
        anchor()
    );

    const different = navigation();

    expect(
        viewport.setNavigation(different)
            .equals(
                new SpreadsheetViewport(
                    selection(),
                    anchor(),
                    different
                )
            )
    ).toBeTrue();
});

// equals................................................................................................................

test("equals selection without anchor", () => {
    expect(new SpreadsheetViewport(cell(), null)
        .equals(new SpreadsheetViewport(cell(), null)))
        .toBeTrue();
});

test("equals selection with anchor", () => {
    expect(new SpreadsheetViewport(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT)
        .equals(new SpreadsheetViewport(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT)))
        .toBeTrue();
});

test("equals different selection false", () => {
    expect(new SpreadsheetViewport(cellRange(), anchor())
        .equals(new SpreadsheetViewport(cell(), null)))
        .toBeFalse();
});

test("equals different anchor false", () => {
    expect(new SpreadsheetViewport(cellRange(), SpreadsheetViewportSelectionAnchor.TOP_LEFT)
        .equals(new SpreadsheetViewport(cellRange(), SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT)))
        .toBeFalse();
});

test("equals same anchor, different navigation false", () => {
    expect(new SpreadsheetViewport(cell(), SpreadsheetViewportSelectionAnchor.NONE, SpreadsheetViewportSelectionNavigation.LEFT_COLUMN)
        .equals(new SpreadsheetViewport(cell(), SpreadsheetViewportSelectionAnchor.NONE)))
        .toBeFalse();
});

test("equals missing anchor, different navigation false", () => {
    expect(new SpreadsheetViewport(cell(), undefined, SpreadsheetViewportSelectionNavigation.LEFT_COLUMN)
        .equals(new SpreadsheetViewport(cell())))
        .toBeFalse();
});

test("equals different navigation false", () => {
    expect(new SpreadsheetViewport(cell(), SpreadsheetViewportSelectionAnchor.NONE, SpreadsheetViewportSelectionNavigation.LEFT_COLUMN)
        .equals(new SpreadsheetViewport(cell(), SpreadsheetViewportSelectionAnchor.NONE, SpreadsheetViewportSelectionNavigation.RIGHT_COLUMN)))
        .toBeFalse();
});

test("equals different navigation true", () => {
    expect(new SpreadsheetViewport(cell(), SpreadsheetViewportSelectionAnchor.NONE, SpreadsheetViewportSelectionNavigation.DOWN_ROW)
        .equals(new SpreadsheetViewport(cell(), SpreadsheetViewportSelectionAnchor.NONE, SpreadsheetViewportSelectionNavigation.DOWN_ROW)))
        .toBeTrue();
});