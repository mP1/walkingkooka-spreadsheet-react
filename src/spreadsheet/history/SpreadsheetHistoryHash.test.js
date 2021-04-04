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

test("parse /spreadsheet-id/spreadsheet-name/cell/A1", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/A1",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "cell": SpreadsheetCellReference.parse("A1"),
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

test("parse /spreadsheet-id/spreadsheet-name/settings/!invalid", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/settings/!invalid",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "settings": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/settings/metadata", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/settings/metadata",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "settings": true,
            "settings-section": "metadata",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/settings/text", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/settings/text",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "settings": true,
            "settings-section": "text",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/settings/number", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/settings/number",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "settings": true,
            "settings-section": "number",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/settings/date-time", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/settings/date-time",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "settings": true,
            "settings-section": "date-time",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/settings/style", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/settings/style",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "settings": true,
            "settings-section": "style",
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

test("parse /spreadsheet-id/spreadsheet-name/name/settings/!invalid", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name/settings/!invalid",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "name": true,
            "settings": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name/settings/metadata", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name/settings/metadata",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "name": true,
            "settings": true,
            "settings-section": "metadata",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name/settings/text", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name/settings/text",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "name": true,
            "settings": true,
            "settings-section": "text",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name/settings/number", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name/settings/number",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "name": true,
            "settings": true,
            "settings-section": "number",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name/settings/date-time", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name/settings/date-time",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "name": true,
            "settings": true,
            "settings-section": "date-time",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name/settings/style", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name/settings/style",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "name": true,
            "settings": true,
            "settings-section": "style",
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

test("parse /spreadsheet-id/spreadsheet-name/cell/B2/formula/settings/!invalid", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/!invalid",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "cell": SpreadsheetCellReference.parse("B2"),
            "formula": true,
            "settings": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/B2/formula/settings/metadata", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/metadata",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "cell": SpreadsheetCellReference.parse("B2"),
            "formula": true,
            "settings": true,
            "settings-section": "metadata",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/B2/formula/settings/text", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/text",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "cell": SpreadsheetCellReference.parse("B2"),
            "formula": true,
            "settings": true,
            "settings-section": "text",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/B2/formula/settings/number", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/number",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "cell": SpreadsheetCellReference.parse("B2"),
            "formula": true,
            "settings": true,
            "settings-section": "number",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/B2/formula/settings/date-time", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/date-time",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "cell": SpreadsheetCellReference.parse("B2"),
            "formula": true,
            "settings": true,
            "settings-section": "date-time",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/B2/formula/settings/style", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/style",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
            "cell": SpreadsheetCellReference.parse("B2"),
            "formula": true,
            "settings": true,
            "settings-section": "style",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/style/metadata/name fails", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/metadata/name",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": "spreadsheet-name-456",
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

test("/spreadsheet-id/spreadsheet-name/cell/A1", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1",
        {},
        "/123abc/Untitled456/cell/A1"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell",
        {
            "cell": SpreadsheetCellReference.parse("A1"),
        },
        "/123abc/Untitled456/cell/A1"
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
        "/123abc/Untitled456/cell/A1",
        {
            "cell": SpreadsheetCellReference.parse("B2"),
        },
        "/123abc/Untitled456/cell/B2"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula cell replaced #2", () => {
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
        "/123abc/Untitled456/cell/A1"
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

test("/spreadsheet-id/spreadsheet-name/settings replaced settings=true settings-section=invalid", () => {
    mergeAndCheck(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": "!invalid",
        },
        "/123abc/Untitled456/settings"
    );
});

test("/spreadsheet-id/spreadsheet-name/settings replaced settings=true settings-section=metadata", () => {
    mergeAndCheck(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
        },
        "/123abc/Untitled456/settings/metadata"
    );
});

test("/spreadsheet-id/spreadsheet-name/settings replaced settings=true settings-section=text", () => {
    mergeAndCheck(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_TEXT,
        },
        "/123abc/Untitled456/settings/text"
    );
});

test("/spreadsheet-id/spreadsheet-name/settings replaced settings=true settings-section=number", () => {
    mergeAndCheck(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
        },
        "/123abc/Untitled456/settings/number"
    );
});

test("/spreadsheet-id/spreadsheet-name/settings replaced settings=true settings-section=date-time", () => {
    mergeAndCheck(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
        },
        "/123abc/Untitled456/settings/date-time"
    );
});

test("/spreadsheet-id/spreadsheet-name/settings replaced settings=true settings-section=style", () => {
    mergeAndCheck(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_STYLE,
        },
        "/123abc/Untitled456/settings/style"
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

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=true settings-section=invalid", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": "invalid"
        },
        "/123abc/Untitled456/name/settings"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=true settings-section=metadata", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
        },
        "/123abc/Untitled456/name/settings/metadata"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=true settings-section=text", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_TEXT,
        },
        "/123abc/Untitled456/name/settings/text"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=true settings-section=number", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
        },
        "/123abc/Untitled456/name/settings/number"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=true settings-section=date-time", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
        },
        "/123abc/Untitled456/name/settings/date-time"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=true settings-section=style", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_STYLE,
        },
        "/123abc/Untitled456/name/settings/style"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1 replaced settings=true", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1",
        {
            "settings": true,
        },
        "/123abc/Untitled456/cell/A1/settings"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/settings replaced settings=false", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/settings",
        {
            "settings": false,
        },
        "/123abc/Untitled456/cell/A1"
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

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula/settings replaced settings=true settings-section invalid", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": "!invalid"
        },
        "/123abc/Untitled456/cell/A1/formula/settings"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula/settings replaced settings=true settings-section=metadata", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/metadata"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula/settings replaced settings=true settings-section=text", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_TEXT,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/text"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula/settings replaced settings=true settings-section=number", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/number"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula/settings replaced settings=true settings-section=date-time", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/date-time"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula/settings replaced settings=true settings-section=style", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_STYLE,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/style"
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

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula/settings replaced settings=false settings-section ignored", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": false,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
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