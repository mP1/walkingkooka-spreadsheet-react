import CharSequences from "../../CharSequences.js";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference.js";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetName from "../SpreadsheetName.js";

const ID = "spreadsheet-id-123";
const SPREADSHEET_NAME = new SpreadsheetName("spreadsheet-name-456");
const CELL = SpreadsheetCellReference.parse("A1");
const LABEL = SpreadsheetLabelName.parse("Label123");

// validate................................................................................................................

function validateTest(label, tokens, expected) {
    test(label, () => {
        expect(SpreadsheetHistoryHash.validate(tokens))
            .toStrictEqual(null != expected ? expected : tokens);
    });
}

validateTest(
    "validate empty",
    {}
);

validateTest(
    "validate id & name",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

validateTest(
    "validate id & name & name-edit",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "name": true,
    }
);

validateTest(
    "validate id & name & cell=cell",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": CELL,
    }
);

validateTest(
    "validate id & name & cell=label",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": LABEL,
    }
);

validateTest(
    "validate id & name & name edit && cell",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "name": true,
        "cell": CELL,
    },
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

validateTest(
    "validate id & name & name edit && label",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "name": true,
        "label": LABEL,
    },
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

validateTest(
    "validate id & name & name edit && navigate",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "name": true,
        "navigate": true,
    },
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

validateTest(
    "validate id & name & cell=CELL",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": CELL,
    }
);

validateTest(
    "validate id & name & cell=invalid",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": "!invalid",
    },
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
    },
);

validateTest(
    "validate id & name & cell=LABEL",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": LABEL,
    }
);

validateTest(
    "validate id & name & label=LABEL",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL,
    }
);

validateTest(
    "validate id & name & label=!invalid",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": "!invalid",
    },
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

validateTest(
    "validate id & name & navigate",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "navigate": true,
    }
);

validateTest(
    "validate id & name & settings",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
    }
);

// parse..................................................................................................................

function parseFails(hash) {
    test("parse " + CharSequences.quoteAndEscape(hash) + " fails", () => {
        expect(() => SpreadsheetHistoryHash.parse(hash).toThrow("Expected string pathname got " + hash));
    });
}

parseFails(undefined);
parseFails(null);
parseFails(false);
parseFails(1);
parseFails({});
parseFails(SpreadsheetHistoryHash.parse);
parseFails([]);

parseAndStringifyTest(
    "",
    {}
);

parseAndStringifyTest(
    "/",
    {}
);

parseAndStringifyTest(
    "/spreadsheet-id-123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/name/!invalid4",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/name",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "name": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/name/cell/A1",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/!invalid",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Cell: Invalid character '!' at 0",
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": CELL,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": CELL,
        "formula": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/Label123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": LABEL,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/label",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/label",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/label/!invalid",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Label: Invalid character '!' at 0",
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A2/label/Label123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": SpreadsheetCellReference.parse("A2"),
        "label": LABEL,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A2/formula/label/Label123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": SpreadsheetCellReference.parse("A2"),
        "formula": true,
        "label": LABEL,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/name",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "name": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/name/label/Label123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/name/navigate",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/navigate",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "navigate": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/navigate",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": CELL,
        "navigate": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/navigate",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": CELL,
        "formula": true,
        "navigate": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/navigate/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": CELL,
        "formula": true,
        "navigate": true,
        "settings": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123/navigate",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL,
        "navigate": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/navigate/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "navigate": true,
        "settings": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/navigate/settings/number",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "navigate": true,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/!invalid",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/metadata",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/text",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_TEXT,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/number",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/date-time",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/style",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_STYLE,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/!invalid",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/metadata",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/text",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_TEXT,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/number",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/date-time",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/style",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_STYLE,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": SpreadsheetCellReference.parse("B2"),
        "formula": true,
        "settings": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/!invalid",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": SpreadsheetCellReference.parse("B2"),
        "formula": true,
        "settings": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/metadata",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": SpreadsheetCellReference.parse("B2"),
        "formula": true,
        "settings": true,
        "settings-section": "metadata",
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/text",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": SpreadsheetCellReference.parse("B2"),
        "formula": true,
        "settings": true,
        "settings-section": "text",
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/number",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": SpreadsheetCellReference.parse("B2"),
        "formula": true,
        "settings": true,
        "settings-section": "number",
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/date-time",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": SpreadsheetCellReference.parse("B2"),
        "formula": true,
        "settings": true,
        "settings-section": "date-time",
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/style",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": SpreadsheetCellReference.parse("B2"),
        "formula": true,
        "settings": true,
        "settings-section": "style",
    }
);
parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123/settings/style",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL,
        "settings": true,
        "settings-section": "style",
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/settings/metadata",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "cell": CELL,
        "formula": true,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
    }
);

function parseAndStringifyTest(hash, expected, expectedError) {
    test("parse " + CharSequences.quoteAndEscape(hash), () => {
        let errors = [];
        expect(SpreadsheetHistoryHash.parse(hash, e => errors.push(e)))
            .toStrictEqual(expected);
        if(errors.length > 0){
            expect([expectedError])
                .toStrictEqual(errors);
        }
    });

    test("stringify " + stringify(expected), () => {
        const string = SpreadsheetHistoryHash.stringify(expected);

        expect(SpreadsheetHistoryHash.parse(string, e => {
            throw new Error(e)
        }))
            .toStrictEqual(expected);
    });
}

// merge...............................................................................................................

function mergeCurrentFails(current) {
    test("merge current: " + CharSequences.quoteAndEscape(current) + " fails", () => {
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

function mergeUpdatesFails(updates) {
    test("merge updates: " + updates + " fails", () => {
        expect(() => SpreadsheetHistoryHash.merge({}, updates).toThrow("Expected object updates got " + updates));
    });
}

mergeUpdatesFails(undefined);
mergeUpdatesFails(null);
mergeUpdatesFails(false);
mergeUpdatesFails(1);
mergeUpdatesFails("");
mergeUpdatesFails(SpreadsheetHistoryHash.parse);
mergeUpdatesFails([]);

    mergeTest(
        "",
        {},
        "/"
    );

    mergeTest(
        "/123abc",
        {},
        "/123abc"
    );

    mergeTest(
        "/123abc",
        {
            "spreadsheet-id": "456def",
        },
        "/456def"
    );

    mergeTest(
        "/123abc/Untitled456",
        {},
        "/123abc/Untitled456"
    );

    mergeTest(
        "/123abc/Untitled456",
        {
            "spreadsheet-name": "Untitled999",
        },
        "/123abc/Untitled999"
    );

    mergeTest(
        "/123abc/Untitled456/!invalid",
        {},
        "/123abc/Untitled456"
    );

// spreadsheet name edit................................................................................................

    mergeTest(
        "/123abc/Untitled456/name",
        {},
        "/123abc/Untitled456/name"
    );

    mergeTest(
        "/123abc/Untitled456",
        {
            name: true,
        },
        "/123abc/Untitled456/name"
    );

   mergeTest(
        "/123abc/Untitled456",
        {
            name: false,
        },
        "/123abc/Untitled456"
    );

    mergeTest(
        "/123abc/Untitled456/name",
        {
            "name": true,
        },
        "/123abc/Untitled456/name"
    );

    mergeTest(
        "/123abc/Untitled456/name",
        {
            "name": false,
        },
        "/123abc/Untitled456"
    );

    mergeTest(
        "/123abc/Untitled456/name",
        {
            "name": true,
        },
        "/123abc/Untitled456/name"
    );

    mergeTest(
        "/123abc/Untitled456/name",
        {
            "name": false,
        },
        "/123abc/Untitled456"
    );

    mergeTest(
        "/123abc/Untitled456/name/cell/A1/formula",
        {},
        "/123abc/Untitled456"
    );

    mergeTest(
        "/123abc/Untitled456/name/!invalid2",
        {},
        "/123abc/Untitled456"
    );

    mergeTest(
        "/123abc/Untitled456/name/!invalid",
        {
            "cell": SpreadsheetCellReference.parse("A1")
        },
        "/123abc/Untitled456/cell/A1"
    );

    mergeTest(
        "/123abc/Untitled456/name",
        {
            "cell": null,
        },
        "/123abc/Untitled456/name"
    );

    mergeTest(
        "/123abc/Untitled456/name",
        {
            "cell": SpreadsheetCellReference.parse("A1"),
            "formula": true,
        },
        "/123abc/Untitled456/cell/A1/formula"
    );

    mergeTest(
        "/123abc/Untitled456/name",
        {
            "label": SpreadsheetLabelName.parse("LABEL123"),
        },
        "/123abc/Untitled456/label/LABEL123"
    );

    mergeTest(
        "/123abc/Untitled456/name",
        {
            "label": null,
        },
        "/123abc/Untitled456/name"
    );

    mergeTest(
        "/123abc/Untitled456/name",
        {
            "label": SpreadsheetLabelName.parse("Label123"),
        },
        "/123abc/Untitled456/label/Label123"
    );

    mergeTest(
        "/123abc/Untitled456/name",
        {
            "navigate": true,
        },
        "/123abc/Untitled456/navigate"
    );

// cell.................................................................................................................

    mergeTest(
        "/123abc/Untitled456/cell",
        {},
        "/123abc/Untitled456"
    );

    mergeTest(
        "/123abc/Untitled456/cell/999",
        {},
        "/123abc/Untitled456"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1",
        {},
        "/123abc/Untitled456/cell/A1"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1",
        {
            "formula": false,
        },
        "/123abc/Untitled456/cell/A1"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1",
        {
            "formula": true,
        },
        "/123abc/Untitled456/cell/A1/formula"
    );

    mergeTest(
        "/123abc/Untitled456/cell",
        {
            "cell": SpreadsheetCellReference.parse("A1"),
        },
        "/123abc/Untitled456/cell/A1"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula",
        {},
        "/123abc/Untitled456/cell/A1/formula"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1",
        {
            "cell": SpreadsheetCellReference.parse("B2"),
        },
        "/123abc/Untitled456/cell/B2"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula",
        {
            "cell": SpreadsheetCellReference.parse("B2"),
        },
        "/123abc/Untitled456/cell/B2/formula"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula",
        {
            "formula": false,
        },
        "/123abc/Untitled456/cell/A1"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula/!invalid3",
        {
            "formula": false,
        },
        "/123abc/Untitled456"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1",
        {
            "cell": null,
        },
        "/123abc/Untitled456"
    );

  mergeTest(
        "/123abc/Untitled456/cell/A1/formula",
        {
            "formula": null,
        },
        "/123abc/Untitled456/cell/A1"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A2",
        {
            "name": false,
        },
        "/123abc/Untitled456/cell/A2"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A2",
        {
            "name": true,
        },
        "/123abc/Untitled456/name"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A2/formula",
        {
            "name": false,
        },
        "/123abc/Untitled456/cell/A2/formula"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A2/formula",
        {
            "name": true,
        },
        "/123abc/Untitled456/name"
    );

    mergeTest(
        "/123abc/Untitled456/cell/LABEL123",
        {},
        "/123abc/Untitled456/cell/LABEL123"
    );

// label.................................................................................................................

    mergeTest(
        "/123abc/Untitled456/label",
        {},
        "/123abc/Untitled456"
    );

    mergeTest(
        "/123abc/Untitled456/label/!invalid-label",
        {},
        "/123abc/Untitled456"
    );

    mergeTest(
        "/123abc/Untitled456/label/A1",
        {},
        "/123abc/Untitled456"
    );

    mergeTest(
        "/123abc/Untitled456/label/LABEL123",
        {},
        "/123abc/Untitled456/label/LABEL123"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/label/LABEL123",
        {},
        "/123abc/Untitled456/cell/A1/label/LABEL123"
    );

    mergeTest(
        "/123abc/Untitled456/label/LABEL123",
        {
            name: false,
        },
        "/123abc/Untitled456/label/LABEL123"
    );

    mergeTest(
        "/123abc/Untitled456/label/LABEL123",
        {
            name: true,
        },
        "/123abc/Untitled456/name"
    );

// navigate.............................................................................................................

    mergeTest(
        "/123abc/Untitled456/navigate",
        {},
        "/123abc/Untitled456/navigate",
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/navigate",
        {},
        "/123abc/Untitled456/cell/A1/navigate",
    );

    mergeTest(
        "/123abc/Untitled456/label/LABEL123/navigate",
        {},
        "/123abc/Untitled456/label/LABEL123/navigate",
    );

    mergeTest(
        "/123abc/Untitled456/navigate/settings",
        {},
        "/123abc/Untitled456/navigate/settings",
    );

    mergeTest(
        "/123abc/Untitled456/",
        {
            "navigate": true,
        },
        "/123abc/Untitled456/navigate",
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1",
        {
            "navigate": true,
        },
        "/123abc/Untitled456/cell/A1/navigate",
    );

    mergeTest(
        "/123abc/Untitled456/navigate",
        {
            "navigate": false,
        },
        "/123abc/Untitled456",
    );

    mergeTest(
        "/123abc/Untitled456/navigate",
        {
            "name": false,
        },
        "/123abc/Untitled456/navigate",
    );

    mergeTest(
        "/123abc/Untitled456/navigate",
        {
            "name": true,
        },
        "/123abc/Untitled456/name",
    );

// settings.............................................................................................................

    mergeTest(
        "/123abc/Untitled456/settings",
        {},
        "/123abc/Untitled456/settings"
    );

   mergeTest(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
        },
        "/123abc/Untitled456/settings"
    );

    mergeTest(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": "!invalid",
        },
        "/123abc/Untitled456/settings"
    );

    mergeTest(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
        },
        "/123abc/Untitled456/settings/metadata"
    );

    mergeTest(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_TEXT,
        },
        "/123abc/Untitled456/settings/text"
    );

    mergeTest(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
        },
        "/123abc/Untitled456/settings/number"
    );

    mergeTest(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
        },
        "/123abc/Untitled456/settings/date-time"
    );

    mergeTest(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_STYLE,
        },
        "/123abc/Untitled456/settings/style"
    );

    mergeTest(
        "/123abc/Untitled456/settings",
        {
            "settings": false,
        },
        "/123abc/Untitled456"
    );

    mergeTest(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
        },
        "/123abc/Untitled456/settings"
    );

    mergeTest(
        "/123abc/Untitled456/name/settings",
        {
            "settings": false,
        },
        "/123abc/Untitled456"
    );

    mergeTest(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": "invalid"
        },
        "/123abc/Untitled456/settings"
    );

    mergeTest(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
        },
        "/123abc/Untitled456/settings/metadata"
    );

    mergeTest(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_TEXT,
        },
        "/123abc/Untitled456/settings/text"
    );

    mergeTest(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
        },
        "/123abc/Untitled456/settings/number"
    );

    mergeTest(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
        },
        "/123abc/Untitled456/settings/date-time"
    );

    mergeTest(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_STYLE,
        },
        "/123abc/Untitled456/settings/style"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1",
        {
            "settings": true,
        },
        "/123abc/Untitled456/cell/A1/settings"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/settings",
        {
            "settings": false,
        },
        "/123abc/Untitled456/cell/A1"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula",
        {
            "settings": true,
        },
        "/123abc/Untitled456/cell/A1/formula/settings"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
        },
        "/123abc/Untitled456/cell/A1/formula/settings"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": "!invalid"
        },
        "/123abc/Untitled456/cell/A1/formula/settings"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/metadata"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_TEXT,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/text"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/number"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/date-time"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_STYLE,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/style"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": false,
        },
        "/123abc/Untitled456/cell/A1/formula"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": false,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
        },
        "/123abc/Untitled456/cell/A1/formula"
    );

    mergeTest(
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

    mergeTest(
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

    mergeTest(
        "/123abc/Untitled456",
        {
            "formula": true,
        },
        "/123abc/Untitled456"
    );

function mergeTest(hash, update, expected) {
    test("merge " + CharSequences.quoteAndEscape(hash) + " AND " + stringify(update), () => {
        const throwError = (e) => {throw Error(e)};

        const hashTokens = SpreadsheetHistoryHash.parse(hash, throwError);
        const expectedTokens = SpreadsheetHistoryHash.parse(expected, throwError);

        expect(SpreadsheetHistoryHash.stringify(
            SpreadsheetHistoryHash.merge(
                hashTokens,
                update
            )
        )).toStrictEqual(SpreadsheetHistoryHash.stringify(expectedTokens));
    });
}

function stringify(object) {
    var s = "";
    var separator = "";

    for (const property in object) {
        s = s + separator + property + "=" + object[property];
        separator = ", ";
    }

    return s;
}