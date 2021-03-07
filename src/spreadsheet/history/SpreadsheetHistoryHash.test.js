import SpreadsheetCellReference from "../reference/SpreadsheetCellReference.js";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";

// parse..................................................................................................................

test("parse undefined", () => {
    parseAndCheck(
        undefined,
        {}
    );
});

test("parse null", () => {
    parseAndCheck(
        null,
        {}
    );
});

test("parse empty", () => {
    parseAndCheck(
        "",
        {}
    );
});

test("parse slash", () => {
    parseAndCheck(
        "/",
        {}
    );
});

test("parse /spreadsheet-id", () => {
    parseAndCheck(
        "/spreadsheet-id-123",
        {
            "spreadsheet-id": "spreadsheet-id-123",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "name": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name/cell invalid", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name/cell",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell missing reference", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/!invalid invalid reference", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/!invalid",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/A1 missing formula", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/A1",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/A1/formula", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "cell": SpreadsheetCellReference.parse("A1"),
            "formula": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/settings", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/settings",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "settings": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name/settings", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name/settings",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "name": true,
            "settings": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/B2/formula/settings", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "cell": SpreadsheetCellReference.parse("B2"),
            "formula": true,
            "settings": true,
        }
    );
});

// helpers...............................................................................................................

function parseAndCheck(pathname, expected) {
    expect(SpreadsheetHistoryHash.parse(pathname))
        .toStrictEqual(expected);
}

// merge...............................................................................................................

test("undefined", () => {
    mergeAndCheck(
        undefined,
        {},
        "/"
    );
});

test("null", () => {
    mergeAndCheck(
        null,
        {},
        "/"
    );
});

test("empty", () => {
    mergeAndCheck(
        "",
        {},
        "/"
    );
});

test("/spreadsheet-id", () => {
    mergeAndCheck(
        "/123abc",
        {},
        "/123abc"
    );
});

test("/spreadsheet-id replaced", () => {
    mergeAndCheck(
        "/123abc",
        {
            "spreadsheet-id": "456def",
        },
        "/456def"
    );
});

test("/spreadsheet-id/spreadsheet-name", () => {
    mergeAndCheck(
        "/123abc/Untitled456",
        {},
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name & replaced spreadsheet name", () => {
    mergeAndCheck(
        "/123abc/Untitled456",
        {
            "spreadsheet-name": "Untitled999",
        },
        "/123abc/Untitled999"
    );
});

test("/spreadsheet-id/spreadsheet-name invalid token", () => {
    mergeAndCheck(
        "/123abc/Untitled456/!invalid",
        {},
        "/123abc/Untitled456"
    );
});

// spreadsheet name edit................................................................................................

test("/spreadsheet-id/spreadsheet-name/name", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name",
        {},
        "/123abc/Untitled456/name"
    );
});

test("/spreadsheet-id/spreadsheet-name/name replaced name edit true", () => {
    mergeAndCheck(
        "/123abc/Untitled456",
        {
            "name": true,
        },
        "/123abc/Untitled456/name"
    );
});

test("/spreadsheet-id/spreadsheet-name/name replaced name edit false", () => {
    mergeAndCheck(
        "/123abc/Untitled456",
        {
            "name": false,
        },
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/name replaced name edit true", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name",
        {
            "name": true,
        },
        "/123abc/Untitled456/name"
    );
});

test("/spreadsheet-id/spreadsheet-name/name replaced name edit false", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name",
        {
            "name": false,
        },
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/cell/A1/formula invalid combo", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/cell/A1/formula",
        {},
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/!invalid invalid token", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/!invalid",
        {},
        "/123abc/Untitled456"
    );
});

// cell.................................................................................................................

test("/spreadsheet-id/spreadsheet-name/cell missing reference", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell",
        {},
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell invalid reference", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/999",
        {},
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1 missing formula", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1",
        {},
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula",
        {},
        "/123abc/Untitled456/cell/A1/formula"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula cell replaced", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula",
        {
            "cell": SpreadsheetCellReference.parse("B2"),
        },
        "/123abc/Untitled456/cell/B2/formula"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula formula false", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula",
        {
            "formula": false,
        },
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula invalid token", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula/!invalid",
        {
            "formula": false,
        },
        "/123abc/Untitled456"
    );
});

// settings.............................................................................................................

test("/spreadsheet-id/spreadsheet-name/settings", () => {
    mergeAndCheck(
        "/123abc/Untitled456/settings",
        {},
        "/123abc/Untitled456/settings"
    );
});

test("/spreadsheet-id/spreadsheet-name/settings replaced settings=true", () => {
    mergeAndCheck(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
        },
        "/123abc/Untitled456/settings"
    );
});

test("/spreadsheet-id/spreadsheet-name/settings replaced settings=false", () => {
    mergeAndCheck(
        "/123abc/Untitled456/settings",
        {
            "settings": false,
        },
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=true", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
        },
        "/123abc/Untitled456/name/settings"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=false", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": false,
        },
        "/123abc/Untitled456/name"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula replaced settings=true", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula",
        {
            "settings": true,
        },
        "/123abc/Untitled456/cell/A1/formula/settings"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula/settings replaced settings=true", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
        },
        "/123abc/Untitled456/cell/A1/formula/settings"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula/settings replaced settings=false", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": false,
        },
        "/123abc/Untitled456/cell/A1/formula"
    );
});

test("replacements #1", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "spreadsheet-id": "456def",
            "spreadsheet-name": "new-spreadsheet-name-456",
            "cell": SpreadsheetCellReference.parse("B2"),
            "formula": true,
            "settings": true,
        },
        "/456def/new-spreadsheet-name-456/cell/B2/formula/settings"
    );
});

test("replacements #2", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "spreadsheet-id": "456def",
            "spreadsheet-name": "new-spreadsheet-name-456",
            "cell": SpreadsheetCellReference.parse("B2"),
            "formula": true,
            "settings": false,
        },
        "/456def/new-spreadsheet-name-456/cell/B2/formula"
    );
});

// helpers...............................................................................................................

function mergeAndCheck(pathname, replacements, expected) {
    expect(SpreadsheetHistoryHash.merge(SpreadsheetHistoryHash.parse(pathname), replacements))
        .toStrictEqual(expected);
}