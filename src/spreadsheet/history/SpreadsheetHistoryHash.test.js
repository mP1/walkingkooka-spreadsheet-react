import CharSequences from "../../CharSequences.js";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference.js";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetName from "../SpreadsheetName.js";
import SpreadsheetRowReference from "../reference/SpreadsheetRowReference.js";

const ID = "spreadsheet-id-123";
const SPREADSHEET_NAME = new SpreadsheetName("spreadsheet-name-456");
const CELL = SpreadsheetCellReference.parse("A1");
const COLUMN = SpreadsheetColumnReference.parse("B");
const ROW = SpreadsheetRowReference.parse("2");
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
        "selection": CELL,
    }
);

validateTest(
    "validate id & name & cell=label",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": LABEL,
    }
);

validateTest(
    "validate id & name & name edit && cell",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "name": true,
        "selection": CELL,
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
    "validate id & name & name edit && select",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "name": true,
        "select": true,
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
        "selection": CELL,
    }
);

validateTest(
    "validate id & name & cell=invalid",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": "!invalid",
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
        "selection": LABEL,
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
    "validate id & name & select",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "select": true,
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
        "selection": CELL,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "formula": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/Label123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": LABEL,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/Label123/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": LABEL,
        "formula": true,
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
        "selection": SpreadsheetCellReference.parse("A2"),
        "label": LABEL,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A2/formula/label/Label123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("A2"),
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
    "/spreadsheet-id-123/spreadsheet-name-456/name/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "select": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "select": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "formula": true,
        "select": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/select/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "formula": true,
        "select": true,
        "settings": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL,
        "select": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
        "select": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW,
        "select": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/select/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "select": true,
        "settings": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/select/settings/number",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "select": true,
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
        "selection": SpreadsheetCellReference.parse("B2"),
        "formula": true,
        "settings": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/!invalid",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
        "formula": true,
        "settings": true,
    }
);

parseAndStringifyTest(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/metadata",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
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
        "selection": SpreadsheetCellReference.parse("B2"),
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
        "selection": SpreadsheetCellReference.parse("B2"),
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
        "selection": SpreadsheetCellReference.parse("B2"),
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
        "selection": SpreadsheetCellReference.parse("B2"),
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
        "selection": CELL,
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
            "selection": SpreadsheetCellReference.parse("A1")
        },
        "/123abc/Untitled456/cell/A1"
    );

    mergeTest(
        "/123abc/Untitled456/name",
        {
            "selection": null,
        },
        "/123abc/Untitled456/name"
    );

    mergeTest(
        "/123abc/Untitled456/name",
        {
            "selection": SpreadsheetCellReference.parse("A1"),
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
            "select": true,
        },
        "/123abc/Untitled456/select"
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
            "selection": SpreadsheetCellReference.parse("A1"),
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
            "selection": SpreadsheetCellReference.parse("B2"),
        },
        "/123abc/Untitled456/cell/B2"
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/formula",
        {
            "selection": SpreadsheetCellReference.parse("B2"),
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
            "selection": null,
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

// select.............................................................................................................

    mergeTest(
        "/123abc/Untitled456/select",
        {},
        "/123abc/Untitled456/select",
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1/select",
        {},
        "/123abc/Untitled456/cell/A1/select",
    );

    mergeTest(
        "/123abc/Untitled456/label/LABEL123/select",
        {},
        "/123abc/Untitled456/label/LABEL123/select",
    );

    mergeTest(
        "/123abc/Untitled456/select/settings",
        {},
        "/123abc/Untitled456/select/settings",
    );

    mergeTest(
        "/123abc/Untitled456/",
        {
            "select": true,
        },
        "/123abc/Untitled456/select",
    );

    mergeTest(
        "/123abc/Untitled456/cell/A1",
        {
            "select": true,
        },
        "/123abc/Untitled456/cell/A1/select",
    );

    mergeTest(
        "/123abc/Untitled456/select",
        {
            "select": false,
        },
        "/123abc/Untitled456",
    );

    mergeTest(
        "/123abc/Untitled456/select",
        {
            "name": false,
        },
        "/123abc/Untitled456/select",
    );

    mergeTest(
        "/123abc/Untitled456/select",
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
            "selection": SpreadsheetCellReference.parse("B2"),
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
            "selection": SpreadsheetCellReference.parse("B2"),
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