import SpreadsheetCellRange from "../cell/SpreadsheetCellRange.js";
import SpreadsheetCellReference from "../cell/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "../columnrow/SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "../columnrow/SpreadsheetColumnReferenceRange.js";
import SpreadsheetLabelName from "../label/SpreadsheetLabelName.js";
import SpreadsheetRowReference from "../columnrow/SpreadsheetRowReference.js";
import SpreadsheetRowReferenceRange from "../columnrow/SpreadsheetRowReferenceRange.js";
import SpreadsheetViewport from "./SpreadsheetViewport.js";
import SpreadsheetViewportAnchor from "./SpreadsheetViewportAnchor.js";
import SpreadsheetViewportNavigation from "./SpreadsheetViewportNavigation.js";
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
    return SpreadsheetViewportAnchor.TOP_LEFT;
}

function navigation() {
    return SpreadsheetViewportNavigation.LEFT_COLUMN;
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
testNewFails(cell(), SpreadsheetViewportAnchor.TOP, "Unknown anchor TOP, expected any of NONE for " + cell());
testNewFails(cell(), SpreadsheetViewportAnchor.TOP_LEFT);
testNewFails(cell(), SpreadsheetViewportAnchor.TOP_RIGHT);
testNewFails(cell(), SpreadsheetViewportAnchor.BOTTOM);
testNewFails(cell(), SpreadsheetViewportAnchor.BOTTOM_LEFT);
testNewFails(cell(), SpreadsheetViewportAnchor.BOTTOM_RIGHT);
testNewFails(cell(), SpreadsheetViewportAnchor.LEFT);
testNewFails(cell(), SpreadsheetViewportAnchor.RIGHT);
testNew(cell(), null);
testNew(cell(), null, SpreadsheetViewportNavigation.LEFT_COLUMN);

// cellRange
testNewFails(cellRange(), SpreadsheetViewportAnchor.TOP);
testNew(cellRange(), SpreadsheetViewportAnchor.TOP_LEFT);
testNew(cellRange(), SpreadsheetViewportAnchor.TOP_RIGHT);
testNewFails(cellRange(), SpreadsheetViewportAnchor.BOTTOM);
testNew(cellRange(), SpreadsheetViewportAnchor.BOTTOM_LEFT);
testNew(cellRange(), SpreadsheetViewportAnchor.BOTTOM_RIGHT);
testNewFails(cellRange(), SpreadsheetViewportAnchor.LEFT);
testNewFails(cellRange(), SpreadsheetViewportAnchor.RIGHT);

// column
testNewFails(column(), SpreadsheetViewportAnchor.TOP, "Unknown anchor TOP, expected any of NONE for " + column());
testNewFails(column(), SpreadsheetViewportAnchor.TOP_LEFT);
testNewFails(column(), SpreadsheetViewportAnchor.TOP_RIGHT);
testNewFails(column(), SpreadsheetViewportAnchor.BOTTOM);
testNewFails(column(), SpreadsheetViewportAnchor.BOTTOM_LEFT);
testNewFails(column(), SpreadsheetViewportAnchor.BOTTOM_RIGHT);
testNewFails(column(), SpreadsheetViewportAnchor.LEFT);
testNewFails(column(), SpreadsheetViewportAnchor.RIGHT);
testNew(column(), null);

// columnRange
testNewFails(columnRange(), SpreadsheetViewportAnchor.TOP, "Unknown anchor TOP, expected any of LEFT, RIGHT for " + columnRange());
testNewFails(columnRange(), SpreadsheetViewportAnchor.TOP_LEFT);
testNewFails(columnRange(), SpreadsheetViewportAnchor.TOP_RIGHT);
testNewFails(columnRange(), SpreadsheetViewportAnchor.BOTTOM);
testNewFails(columnRange(), SpreadsheetViewportAnchor.BOTTOM_LEFT);
testNewFails(columnRange(), SpreadsheetViewportAnchor.BOTTOM_RIGHT);
testNew(columnRange(), SpreadsheetViewportAnchor.LEFT);
testNew(columnRange(), SpreadsheetViewportAnchor.RIGHT);
testNew(columnRange(), null);

// row
testNewFails(row(), SpreadsheetViewportAnchor.TOP, "Unknown anchor TOP, expected any of NONE for " + row());
testNewFails(row(), SpreadsheetViewportAnchor.TOP_LEFT);
testNewFails(row(), SpreadsheetViewportAnchor.TOP_RIGHT);
testNewFails(row(), SpreadsheetViewportAnchor.BOTTOM);
testNewFails(row(), SpreadsheetViewportAnchor.BOTTOM_LEFT);
testNewFails(row(), SpreadsheetViewportAnchor.BOTTOM_RIGHT);
testNewFails(row(), SpreadsheetViewportAnchor.LEFT);
testNewFails(row(), SpreadsheetViewportAnchor.RIGHT);
testNew(row(), null);

// rowRange
testNew(rowRange(), SpreadsheetViewportAnchor.TOP);
testNewFails(rowRange(), SpreadsheetViewportAnchor.TOP_LEFT, "Unknown anchor TOP_LEFT, expected any of TOP, BOTTOM for " + rowRange());
testNewFails(rowRange(), SpreadsheetViewportAnchor.TOP_RIGHT);
testNew(rowRange(), SpreadsheetViewportAnchor.BOTTOM);
testNewFails(rowRange(), SpreadsheetViewportAnchor.BOTTOM_LEFT);
testNewFails(rowRange(), SpreadsheetViewportAnchor.BOTTOM_RIGHT);
testNewFails(rowRange(), SpreadsheetViewportAnchor.LEFT);
testNewFails(rowRange(), SpreadsheetViewportAnchor.RIGHT);
testNew(rowRange(), null);

// label
testNew(label(), SpreadsheetViewportAnchor.TOP);
testNew(label(), SpreadsheetViewportAnchor.TOP_LEFT);
testNew(label(), SpreadsheetViewportAnchor.TOP_RIGHT);
testNew(label(), SpreadsheetViewportAnchor.BOTTOM);
testNew(label(), SpreadsheetViewportAnchor.BOTTOM_LEFT);
testNew(label(), SpreadsheetViewportAnchor.BOTTOM_RIGHT);
testNew(label(), SpreadsheetViewportAnchor.LEFT);
testNew(label(), SpreadsheetViewportAnchor.RIGHT);
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
    SpreadsheetViewportAnchor.NONE,
    null,
    "",
    "selection=" + column() + "&selectionType=column&selectionAnchor=none"
);

testToQueryString(
    column(),
    SpreadsheetViewportAnchor.NONE,
    null,
    "?",
    "?selection=" + column() + "&selectionType=column&selectionAnchor=none"
);

testToQueryString(
    cell(),
    SpreadsheetViewportAnchor.NONE,
    null,
    "?",
    "?selection=" + cell() + "&selectionType=cell&selectionAnchor=none"
);

testToQueryString(
    cellRange(),
    SpreadsheetViewportAnchor.TOP_LEFT,
    null,
    "?",
    "?selection=B2%3AC3&selectionType=cell-range&selectionAnchor=top-left"
);

testToQueryString(
    cellRange(),
    SpreadsheetViewportAnchor.BOTTOM_LEFT,
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

testFromJson(cellRange(), SpreadsheetViewportAnchor.TOP_LEFT);
testFromJson(cellRange(), SpreadsheetViewportAnchor.TOP_RIGHT);
testFromJson(cellRange(), SpreadsheetViewportAnchor.BOTTOM_LEFT);
testFromJson(cellRange(), SpreadsheetViewportAnchor.BOTTOM_RIGHT);
testFromJson(cellRange(), SpreadsheetViewportAnchor.BOTTOM_RIGHT, SpreadsheetViewportNavigation.LEFT_COLUMN);
testFromJson(cellRange(), SpreadsheetViewportAnchor.BOTTOM_RIGHT, SpreadsheetViewportNavigation.EXTEND_RIGHT_COLUMN);

testFromJson(column(), null);
testFromJson(column(), SpreadsheetViewportAnchor.NONE, SpreadsheetViewportNavigation.LEFT_COLUMN);

testFromJson(columnRange(), SpreadsheetViewportAnchor.LEFT);
testFromJson(columnRange(), SpreadsheetViewportAnchor.RIGHT);
testFromJson(columnRange(), SpreadsheetViewportAnchor.RIGHT, SpreadsheetViewportNavigation.LEFT_COLUMN);

testFromJson(row());
testFromJson(rowRange(), SpreadsheetViewportAnchor.TOP);
testFromJson(rowRange(), SpreadsheetViewportAnchor.BOTTOM);
testFromJson(rowRange(), SpreadsheetViewportAnchor.BOTTOM, SpreadsheetViewportNavigation.UP_ROW);

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

testToJson(cellRange(), SpreadsheetViewportAnchor.TOP_LEFT);
testToJson(cellRange(), SpreadsheetViewportAnchor.TOP_RIGHT);
testToJson(cellRange(), SpreadsheetViewportAnchor.BOTTOM_LEFT);
testToJson(cellRange(), SpreadsheetViewportAnchor.BOTTOM_RIGHT);

testToJson(column(), null);

testToJson(columnRange(), SpreadsheetViewportAnchor.LEFT);
testToJson(columnRange(), SpreadsheetViewportAnchor.RIGHT);

testToJson(row(), null);
testToJson(rowRange(), SpreadsheetViewportAnchor.TOP);
testToJson(rowRange(), SpreadsheetViewportAnchor.BOTTOM);

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

    const different = SpreadsheetViewportAnchor.TOP_RIGHT;

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

    const different = SpreadsheetViewportNavigation.RIGHT_COLUMN;

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

    const different = SpreadsheetViewportNavigation.RIGHT_COLUMN;

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
    expect(new SpreadsheetViewport(cellRange(), SpreadsheetViewportAnchor.TOP_LEFT)
        .equals(new SpreadsheetViewport(cellRange(), SpreadsheetViewportAnchor.TOP_LEFT)))
        .toBeTrue();
});

test("equals different selection false", () => {
    expect(new SpreadsheetViewport(cellRange(), anchor())
        .equals(new SpreadsheetViewport(cell(), null)))
        .toBeFalse();
});

test("equals different anchor false", () => {
    expect(new SpreadsheetViewport(cellRange(), SpreadsheetViewportAnchor.TOP_LEFT)
        .equals(new SpreadsheetViewport(cellRange(), SpreadsheetViewportAnchor.BOTTOM_RIGHT)))
        .toBeFalse();
});

test("equals same anchor, different navigation false", () => {
    expect(new SpreadsheetViewport(cell(), SpreadsheetViewportAnchor.NONE, SpreadsheetViewportNavigation.LEFT_COLUMN)
        .equals(new SpreadsheetViewport(cell(), SpreadsheetViewportAnchor.NONE)))
        .toBeFalse();
});

test("equals missing anchor, different navigation false", () => {
    expect(new SpreadsheetViewport(cell(), undefined, SpreadsheetViewportNavigation.LEFT_COLUMN)
        .equals(new SpreadsheetViewport(cell())))
        .toBeFalse();
});

test("equals different navigation false", () => {
    expect(new SpreadsheetViewport(cell(), SpreadsheetViewportAnchor.NONE, SpreadsheetViewportNavigation.LEFT_COLUMN)
        .equals(new SpreadsheetViewport(cell(), SpreadsheetViewportAnchor.NONE, SpreadsheetViewportNavigation.RIGHT_COLUMN)))
        .toBeFalse();
});

test("equals different navigation true", () => {
    expect(new SpreadsheetViewport(cell(), SpreadsheetViewportAnchor.NONE, SpreadsheetViewportNavigation.DOWN_ROW)
        .equals(new SpreadsheetViewport(cell(), SpreadsheetViewportAnchor.NONE, SpreadsheetViewportNavigation.DOWN_ROW)))
        .toBeTrue();
});