import SpreadsheetCellReference from "../reference/SpreadsheetCellReference.js";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetName from "../SpreadsheetName.js";

const FUNCTION = (a) =>a;

// parse..................................................................................................................

function parseFails(pathname) {
    test("parse " + pathname + " fails", () => {
        expect(() => SpreadsheetHistoryHash.parse(pathname).toThrow("Expected string pathname got " + pathname));
    });
}

parseFails(undefined);
parseFails(null);
parseFails(false);
parseFails(1);
parseFails({});
parseFails(SpreadsheetHistoryHash.parse);
parseFails([]);

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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "name": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name/cell invalid", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name/cell",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell missing reference", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/!invalid invalid reference", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/!invalid",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
        },
        "Cell: Invalid character '!' at 0",
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/A1", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/A1",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "cell": SpreadsheetCellReference.parse("A1"),
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/A1/formula", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "cell": SpreadsheetCellReference.parse("A1"),
            "formula": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/Label123", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/Label123",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "cell": SpreadsheetLabelName.parse("Label123"),
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/label invalid", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/label",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/label missing label-name", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/label",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/label/!invalid invalid label-name", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/label/!invalid",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
        },
        "Label: Invalid character '!' at 0",
    );
});

test("parse /spreadsheet-id/spreadsheet-name/label/LABEL123", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/label/LABEL123",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "label": SpreadsheetLabelName.parse("LABEL123"),
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/A2/label/LABEL123", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/A2/label/LABEL123",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "cell": SpreadsheetCellReference.parse("A2"),
            "label": SpreadsheetLabelName.parse("LABEL123"),
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/A2/formula/label/LABEL123", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/A2/formula/label/LABEL123",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "cell": SpreadsheetCellReference.parse("A2"),
            "formula": true,
            "label": SpreadsheetLabelName.parse("LABEL123"),
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "name": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name/label/Label123", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name/label/Label123",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "label": SpreadsheetLabelName.parse("Label123"),
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name/navigate", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name/navigate",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "navigate": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/navigate", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/navigate",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "navigate": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/A3/navigate", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/A3/navigate",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "cell": SpreadsheetCellReference.parse("A3"),
            "navigate": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/A3/formula/navigate", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/A3/formula/navigate",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "cell": SpreadsheetCellReference.parse("A3"),
            "formula": true,
            "navigate": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/cell/A3/formula/navigate/settings", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/cell/A3/formula/navigate/settings",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "cell": SpreadsheetCellReference.parse("A3"),
            "formula": true,
            "navigate": true,
            "settings": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/label/LABEL123/navigate", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/label/LABEL123/navigate",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "label": SpreadsheetLabelName.parse("LABEL123"),
            "navigate": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/navigate/settings", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/navigate/settings",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "navigate": true,
            "settings": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/navigate/settings/number", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/navigate/settings/number",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "navigate": true,
            "settings": true,
            "settings-section": "number",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/settings", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/settings",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "settings": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/settings/!invalid", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/settings/!invalid",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "settings": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/settings/metadata", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/settings/metadata",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "settings": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name/settings/!invalid", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name/settings/!invalid",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "settings": true,
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/name/settings/metadata", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/name/settings/metadata",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "cell": SpreadsheetCellReference.parse("B2"),
            "formula": true,
            "settings": true,
            "settings-section": "style",
        }
    );
});

test("parse /spreadsheet-id/spreadsheet-name/label/LABEL123/settings/style", () => {
    parseAndCheck(
        "/spreadsheet-id-123/spreadsheet-name-456/label/LABEL123/settings/style",
        {
            "spreadsheet-id": "spreadsheet-id-123",
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
            "label": SpreadsheetLabelName.parse("LABEL123"),
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
            "spreadsheet-name": new SpreadsheetName("spreadsheet-name-456"),
        }
    );
});

// helpers...............................................................................................................

function parseAndCheck(pathname, expected, expectedError) {
    let errors = [];
    expect(SpreadsheetHistoryHash.parse(pathname, e => errors.push(e)))
        .toStrictEqual(expected);
    if(errors.length > 0) {
        expect([expectedError])
            .toStrictEqual(errors);
    }
}

// merge...............................................................................................................

function mergeCurrentFails(current) {
    test("merge current: " + current + " fails", () => {
        expect(() => SpreadsheetHistoryHash.merge(current, {}).toThrow("Expected object current got " + current));
    });
}

mergeCurrentFails(undefined);
mergeCurrentFails(null);
mergeCurrentFails(false);
mergeCurrentFails(1);
mergeCurrentFails("");
mergeCurrentFails(SpreadsheetHistoryHash.parse);
mergeCurrentFails([]);

function mergeReplacementsFails(replacements) {
    test("merge replacements: " + replacements + " fails", () => {
        expect(() => SpreadsheetHistoryHash.merge({}, replacements).toThrow("Expected object replacements got " + replacements));
    });
}

mergeReplacementsFails(undefined);
mergeReplacementsFails(null);
mergeReplacementsFails(false);
mergeReplacementsFails(1);
mergeReplacementsFails("");
mergeReplacementsFails(SpreadsheetHistoryHash.parse);
mergeReplacementsFails([]);

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

test("/spreadsheet-id/spreadsheet-name replaced name=true", () => {
    mergeAndCheck(
        "/123abc/Untitled456",
        {
            name: true,
        },
        "/123abc/Untitled456/name"
    );
});

test("/spreadsheet-id/spreadsheet-name replaced name=false", () => {
    mergeAndCheck(
        "/123abc/Untitled456",
        {
            name: false,
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
        "/123abc/Untitled456/cell/A1/formula"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/!invalid invalid token", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/!invalid",
        {},
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/ replaced cell/A1", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/!invalid",
        {
            "cell": SpreadsheetCellReference.parse("A1")
        },
        "/123abc/Untitled456/cell/A1"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/ replaced cell deleted", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name",
        {
            "cell": null,
        },
        "/123abc/Untitled456/name"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/ replaced cell/A1/formula", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name",
        {
            "cell": SpreadsheetCellReference.parse("A1"),
            "formula": true,
        },
        "/123abc/Untitled456/cell/A1/formula"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/ replaced label/LABEL123", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name",
        {
            "label": SpreadsheetLabelName.parse("LABEL123"),
        },
        "/123abc/Untitled456/label/LABEL123"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/ replaced label deleted", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name",
        {
            "label": null,
        },
        "/123abc/Untitled456/name"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/ replaced label added", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name",
        {
            "label": SpreadsheetLabelName.parse("Label123"),
        },
        "/123abc/Untitled456/label/Label123"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/ replaced navigate", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name",
        {
            "navigate": true,
        },
        "/123abc/Untitled456/navigate"
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

test("/spreadsheet-id/spreadsheet-name/cell/A1 formula false", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1",
        {
            "formula": false,
        },
        "/123abc/Untitled456/cell/A1"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1 formula true", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1",
        {
            "formula": true,
        },
        "/123abc/Untitled456/cell/A1/formula"
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

test("/spreadsheet-id/spreadsheet-name/cell/A1/formula AND invalid token", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula/!invalid",
        {
            "formula": false,
        },
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1 cell null/deleted", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1",
        {
            "cell": null,
        },
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A2/formula formula null/deleted", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/formula",
        {
            "formula": null,
        },
        "/123abc/Untitled456/cell/A1"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A2 replaced name false", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A2",
        {
            "name": false,
        },
        "/123abc/Untitled456/cell/A2"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A2 replaced name true", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A2",
        {
            "name": true,
        },
        "/123abc/Untitled456/name"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A2/formula replaced name false", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A2/formula",
        {
            "name": false,
        },
        "/123abc/Untitled456/cell/A2/formula"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A2/formula replaced name true", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A2/formula",
        {
            "name": true,
        },
        "/123abc/Untitled456/name"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/LABEL123", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/LABEL123",
        {},
        "/123abc/Untitled456/cell/LABEL123"
    );
});

// label.................................................................................................................

test("/spreadsheet-id/spreadsheet-name/label missing label name", () => {
    mergeAndCheck(
        "/123abc/Untitled456/label",
        {},
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/label invalid label name", () => {
    mergeAndCheck(
        "/123abc/Untitled456/label/!invalid-label",
        {},
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/label cell-reference", () => {
    mergeAndCheck(
        "/123abc/Untitled456/label/A1",
        {},
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/label/LABEL123", () => {
    mergeAndCheck(
        "/123abc/Untitled456/label/LABEL123",
        {},
        "/123abc/Untitled456/label/LABEL123"
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/label/LABEL123", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/label/LABEL123",
        {},
        "/123abc/Untitled456/cell/A1/label/LABEL123"
    );
});

test("/spreadsheet-id/spreadsheet-name/label/LABEL123 replaced name=false", () => {
    mergeAndCheck(
        "/123abc/Untitled456/label/LABEL123",
        {
            name: false,
        },
        "/123abc/Untitled456/label/LABEL123"
    );
});

test("/spreadsheet-id/spreadsheet-name/label/LABEL123 replaced name=true", () => {
    mergeAndCheck(
        "/123abc/Untitled456/label/LABEL123",
        {
            name: true,
        },
        "/123abc/Untitled456/name"
    );
});

// navigate.............................................................................................................

test("/spreadsheet-id/spreadsheet-name/navigate", () => {
    mergeAndCheck(
        "/123abc/Untitled456/navigate",
        {},
        "/123abc/Untitled456/navigate",
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1/navigate", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1/navigate",
        {},
        "/123abc/Untitled456/cell/A1/navigate",
    );
});

test("/spreadsheet-id/spreadsheet-name/label/LABEL123/navigate", () => {
    mergeAndCheck(
        "/123abc/Untitled456/label/LABEL123/navigate",
        {},
        "/123abc/Untitled456/label/LABEL123/navigate",
    );
});

test("/spreadsheet-id/spreadsheet-name/navigate/settings", () => {
    mergeAndCheck(
        "/123abc/Untitled456/navigate/settings",
        {},
        "/123abc/Untitled456/navigate/settings",
    );
});

test("/spreadsheet-id/spreadsheet-name/ replacement navigate=true", () => {
    mergeAndCheck(
        "/123abc/Untitled456/",
        {
            "navigate": true,
        },
        "/123abc/Untitled456/navigate",
    );
});

test("/spreadsheet-id/spreadsheet-name/cell/A1 replacement navigate=true", () => {
    mergeAndCheck(
        "/123abc/Untitled456/cell/A1",
        {
            "navigate": true,
        },
        "/123abc/Untitled456/cell/A1/navigate",
    );
});

test("/spreadsheet-id/spreadsheet-name/ replacement navigate=false", () => {
    mergeAndCheck(
        "/123abc/Untitled456/navigate",
        {
            "navigate": false,
        },
        "/123abc/Untitled456",
    );
});

test("/spreadsheet-id/spreadsheet-name/navigate replacement name=false", () => {
    mergeAndCheck(
        "/123abc/Untitled456/navigate",
        {
            "name": false,
        },
        "/123abc/Untitled456/navigate",
    );
});

test("/spreadsheet-id/spreadsheet-name/navigate replacement name=true", () => {
    mergeAndCheck(
        "/123abc/Untitled456/navigate",
        {
            "name": true,
        },
        "/123abc/Untitled456/name",
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
        "/123abc/Untitled456/settings"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=false", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": false,
        },
        "/123abc/Untitled456"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=true settings-section=invalid", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": "invalid"
        },
        "/123abc/Untitled456/settings"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=true settings-section=metadata", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
        },
        "/123abc/Untitled456/settings/metadata"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=true settings-section=text", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_TEXT,
        },
        "/123abc/Untitled456/settings/text"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=true settings-section=number", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
        },
        "/123abc/Untitled456/settings/number"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=true settings-section=date-time", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
        },
        "/123abc/Untitled456/settings/date-time"
    );
});

test("/spreadsheet-id/spreadsheet-name/name/settings replaced settings=true settings-section=style", () => {
    mergeAndCheck(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_STYLE,
        },
        "/123abc/Untitled456/settings/style"
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

test("formula without cell", () => {
    mergeAndCheck(
        "/123abc/Untitled456",
        {
            "formula": true,
        },
        "/123abc/Untitled456"
    );
});

function parseMergeAndPushHistoryFails(history) {
    test("parseMergeAndPush history: " + history + " fails", () => {
        expect(() => SpreadsheetHistoryHash.merge(history, {}, FUNCTION).toThrow("Expected object history got " + history));
    });
}

parseMergeAndPushHistoryFails(undefined);
parseMergeAndPushHistoryFails(null);
parseMergeAndPushHistoryFails(false);
parseMergeAndPushHistoryFails(1);
parseMergeAndPushHistoryFails("");
parseMergeAndPushHistoryFails(FUNCTION);
parseMergeAndPushHistoryFails([]);

function parseMergeAndPushReplacementsFails(replacements) {
    test("parseMergeAndPush replacements: " + replacements + " fails", () => {
        expect(() => SpreadsheetHistoryHash.parseMergeAndPush({}, replacements, FUNCTION).toThrow("Expected object replacements got " + replacements));
    });
}

parseMergeAndPushReplacementsFails(undefined);
parseMergeAndPushReplacementsFails(null);
parseMergeAndPushReplacementsFails(false);
parseMergeAndPushReplacementsFails(1);
parseMergeAndPushReplacementsFails("");
parseMergeAndPushReplacementsFails({});
parseMergeAndPushReplacementsFails([]);

function parseMergeAndPushShowErrorsFails(showErrors) {
    test("parseMergeAndPush showErrors: " + showErrors + " fails", () => {
        expect(() => SpreadsheetHistoryHash.parseMergeAndPush({}, {}, showErrors).toThrow("Expected object showErrors got " + showErrors));
    });
}

parseMergeAndPushShowErrorsFails(undefined);
parseMergeAndPushShowErrorsFails(null);
parseMergeAndPushShowErrorsFails(false);
parseMergeAndPushShowErrorsFails(1);
parseMergeAndPushShowErrorsFails("");
parseMergeAndPushShowErrorsFails({});
parseMergeAndPushShowErrorsFails([]);

// helpers...............................................................................................................

function mergeAndCheck(pathname, replacements, expected) {
    expect(SpreadsheetHistoryHash.join(
        SpreadsheetHistoryHash.merge(
            SpreadsheetHistoryHash.parse(pathname, FUNCTION),
            replacements)
        )
    ).toStrictEqual(expected);

    const pushed = [pathname];
    const history = {
        location: {
            pathname: pathname,
        },
        push: function(path) {
            pushed[0] = "" === path ? "/" : path;
        },
    };
    SpreadsheetHistoryHash.parseMergeAndPush(history, replacements, FUNCTION);

    expect(pushed[0]).toStrictEqual(Object.keys(replacements).length === 0 ? pathname : expected);
}