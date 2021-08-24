import CharSequences from "../../CharSequences.js";
import SpreadsheetCellRange from "../reference/SpreadsheetCellRange.js";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference.js";
import SpreadsheetColumnOrRowDeleteHistoryHashToken from "./SpreadsheetColumnOrRowDeleteHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertHistoryHashToken from "./SpreadsheetColumnOrRowInsertHistoryHashToken.js";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "../reference/SpreadsheetColumnReferenceRange.js";
import SpreadsheetFormulaHistoryHashToken from "./SpreadsheetFormulaHistoryHashToken.js";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetName from "../SpreadsheetName.js";
import SpreadsheetRowReference from "../reference/SpreadsheetRowReference.js";
import SpreadsheetRowReferenceRange from "../reference/SpreadsheetRowReferenceRange.js"

const ID = "spreadsheet-id-123";
const SPREADSHEET_NAME = new SpreadsheetName("spreadsheet-name-456");
const CELL = SpreadsheetCellReference.parse("A1");
const CELL_RANGE = SpreadsheetCellRange.parse("C3:D4");
const COLUMN = SpreadsheetColumnReference.parse("B");
const COLUMN_RANGE = SpreadsheetColumnReferenceRange.parse("B:C");
const ROW = SpreadsheetRowReference.parse("2");
const ROW_RANGE = SpreadsheetRowReferenceRange.parse("2:3");
const LABEL = SpreadsheetLabelName.parse("Label123");

// validate................................................................................................................

function testValidate(label, tokens, expected) {
    test(label, () => {
        expect(SpreadsheetHistoryHash.validate(tokens))
            .toStrictEqual(null != expected ? expected : tokens);
    });
}

testValidate(
    "validate empty",
    {}
);

testValidate(
    "validate id & name",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testValidate(
    "validate id & name & name-edit",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "name": true,
    }
);

testValidate(
    "validate id & name & cell=cell",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
    }
);

testValidate(
    "validate id & name & cell=label",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": LABEL,
    }
);

testValidate(
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

testValidate(
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

testValidate(
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

testValidate(
    "validate id & name & cell=CELL",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
    }
);

testValidate(
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

testValidate(
    "validate id & name & cell=LABEL",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": LABEL,
    }
);

testValidate(
    "validate id & name & label=LABEL",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL,
    }
);

testValidate(
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

testValidate(
    "validate id & name & select",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "select": true,
    }
);

testValidate(
    "validate id & name & settings",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
    }
);

// parse..................................................................................................................

function testParseFails(hash) {
    test("parse " + CharSequences.quoteAndEscape(hash) + " fails", () => {
        expect(() => SpreadsheetHistoryHash.parse(hash).toThrow("Expected string pathname got " + hash));
    });
}

testParseFails(undefined);
testParseFails(null);
testParseFails(false);
testParseFails(1);
testParseFails({});
testParseFails(SpreadsheetHistoryHash.parse);
testParseFails([]);

testParseAndStringify(
    "",
    {}
);

testParseAndStringify(
    "/",
    {}
);

testParseAndStringify(
    "/spreadsheet-id-123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/!invalid4",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "name": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/cell/A1",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/!invalid",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Cell: Invalid character '!' at 0",
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": new SpreadsheetFormulaHistoryHashToken(),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/C3:D4",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_RANGE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/C3:D4/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/Label123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": LABEL,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/Label123/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": LABEL,
        "selection-action": new SpreadsheetFormulaHistoryHashToken(),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label/!invalid",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Label: Invalid character '!' at 0",
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A2/label/Label123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("A2"),
        "label": LABEL,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A2/formula/label/Label123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("A2"),
        "selection-action": new SpreadsheetFormulaHistoryHashToken(),
        "label": LABEL,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "name": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/label/Label123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "select": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "select": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": new SpreadsheetFormulaHistoryHashToken(),
        "select": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/select/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": new SpreadsheetFormulaHistoryHashToken(),
        "select": true,
        "settings": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL,
        "select": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/delete/123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
        "selection-action": new SpreadsheetColumnOrRowDeleteHistoryHashToken(123),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/insert",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/insert/123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
        "selection-action": new SpreadsheetColumnOrRowInsertHistoryHashToken(123),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_RANGE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:B",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
        "select": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/delete/123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW,
        "selection-action": new SpreadsheetColumnOrRowDeleteHistoryHashToken(123),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert/123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW,
        "selection-action": new SpreadsheetColumnOrRowInsertHistoryHashToken(123),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_RANGE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:2",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW,
        "select": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/select/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "select": true,
        "settings": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/select/settings/number",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "select": true,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/!invalid",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/metadata",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/text",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_TEXT,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/number",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/date-time",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/style",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_STYLE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/!invalid",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/metadata",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/text",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_TEXT,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/number",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/date-time",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/style",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_STYLE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
        "selection-action": new SpreadsheetFormulaHistoryHashToken(),
        "settings": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/!invalid",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
        "selection-action": new SpreadsheetFormulaHistoryHashToken(),
        "settings": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/metadata",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
        "selection-action": new SpreadsheetFormulaHistoryHashToken(),
        "settings": true,
        "settings-section": "metadata",
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/text",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
        "selection-action": new SpreadsheetFormulaHistoryHashToken(),
        "settings": true,
        "settings-section": "text",
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/number",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
        "selection-action": new SpreadsheetFormulaHistoryHashToken(),
        "settings": true,
        "settings-section": "number",
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/date-time",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
        "selection-action": new SpreadsheetFormulaHistoryHashToken(),
        "settings": true,
        "settings-section": "date-time",
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/style",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
        "selection-action": new SpreadsheetFormulaHistoryHashToken(),
        "settings": true,
        "settings-section": "style",
    }
);
testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123/settings/style",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL,
        "settings": true,
        "settings-section": "style",
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/settings/metadata",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": new SpreadsheetFormulaHistoryHashToken(),
        "settings": true,
        "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
    }
);

function testParseAndStringify(hash, expected, expectedError) {
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

function testMergeCurrentFails(current) {
    test("merge current: " + CharSequences.quoteAndEscape(current) + " fails", () => {
        expect(() => SpreadsheetHistoryHash.merge(current, {}).toThrow("Expected object current got " + current));
    });
}

testMergeCurrentFails(undefined);
testMergeCurrentFails(null);
testMergeCurrentFails(false);
testMergeCurrentFails(1);
testMergeCurrentFails("");
testMergeCurrentFails(SpreadsheetHistoryHash.parse);
testMergeCurrentFails([]);

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

    testMerge(
        "",
        {},
        "/"
    );

    testMerge(
        "/123abc",
        {},
        "/123abc"
    );

    testMerge(
        "/123abc",
        {
            "spreadsheet-id": "456def",
        },
        "/456def"
    );

    testMerge(
        "/123abc/Untitled456",
        {},
        "/123abc/Untitled456"
    );

    testMerge(
        "/123abc/Untitled456",
        {
            "spreadsheet-name": "Untitled999",
        },
        "/123abc/Untitled999"
    );

    testMerge(
        "/123abc/Untitled456/!invalid",
        {},
        "/123abc/Untitled456"
    );

// spreadsheet name edit................................................................................................

    testMerge(
        "/123abc/Untitled456/name",
        {},
        "/123abc/Untitled456/name"
    );

    testMerge(
        "/123abc/Untitled456",
        {
            name: true,
        },
        "/123abc/Untitled456/name"
    );

   testMerge(
        "/123abc/Untitled456",
        {
            name: false,
        },
        "/123abc/Untitled456"
    );

    testMerge(
        "/123abc/Untitled456/name",
        {
            "name": true,
        },
        "/123abc/Untitled456/name"
    );

    testMerge(
        "/123abc/Untitled456/name",
        {
            "name": false,
        },
        "/123abc/Untitled456"
    );

    testMerge(
        "/123abc/Untitled456/name",
        {
            "name": true,
        },
        "/123abc/Untitled456/name"
    );

    testMerge(
        "/123abc/Untitled456/name",
        {
            "name": false,
        },
        "/123abc/Untitled456"
    );

    testMerge(
        "/123abc/Untitled456/name/cell/A1/formula",
        {},
        "/123abc/Untitled456"
    );

    testMerge(
        "/123abc/Untitled456/name/!invalid2",
        {},
        "/123abc/Untitled456"
    );

    testMerge(
        "/123abc/Untitled456/name/!invalid",
        {
            "selection": SpreadsheetCellReference.parse("A1")
        },
        "/123abc/Untitled456/cell/A1"
    );

    testMerge(
        "/123abc/Untitled456/name",
        {
            "selection": null,
        },
        "/123abc/Untitled456/name"
    );

    testMerge(
        "/123abc/Untitled456/name",
        {
            "selection": SpreadsheetCellReference.parse("A1"),
            "selection-action": new SpreadsheetFormulaHistoryHashToken(),
        },
        "/123abc/Untitled456/cell/A1/formula"
    );

    testMerge(
        "/123abc/Untitled456/name",
        {
            "label": SpreadsheetLabelName.parse("LABEL123"),
        },
        "/123abc/Untitled456/label/LABEL123"
    );

    testMerge(
        "/123abc/Untitled456/name",
        {
            "label": null,
        },
        "/123abc/Untitled456/name"
    );

    testMerge(
        "/123abc/Untitled456/name",
        {
            "label": SpreadsheetLabelName.parse("Label123"),
        },
        "/123abc/Untitled456/label/Label123"
    );

    testMerge(
        "/123abc/Untitled456/name",
        {
            "select": true,
        },
        "/123abc/Untitled456/select"
    );

// cell.................................................................................................................

    testMerge(
        "/123abc/Untitled456/cell",
        {},
        "/123abc/Untitled456"
    );

    testMerge(
        "/123abc/Untitled456/cell/999",
        {},
        "/123abc/Untitled456"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1",
        {},
        "/123abc/Untitled456/cell/A1"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1",
        {
            "selection-action": null,
        },
        "/123abc/Untitled456/cell/A1"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1",
        {
            "selection-action": new SpreadsheetFormulaHistoryHashToken(),
        },
        "/123abc/Untitled456/cell/A1/formula"
    );

    testMerge(
        "/123abc/Untitled456/cell",
        {
            "selection": SpreadsheetCellReference.parse("A1"),
        },
        "/123abc/Untitled456/cell/A1"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula",
        {},
        "/123abc/Untitled456/cell/A1/formula"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1",
        {
            "selection": SpreadsheetCellReference.parse("B2"),
        },
        "/123abc/Untitled456/cell/B2"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula",
        {
            "selection": SpreadsheetCellReference.parse("B2"),
        },
        "/123abc/Untitled456/cell/B2/formula"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula",
        {
            "selection-action": null,
        },
        "/123abc/Untitled456/cell/A1"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula/!invalid3",
        {
            "selection-action": null,
        },
        "/123abc/Untitled456"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1",
        {
            "selection": null,
        },
        "/123abc/Untitled456"
    );

  testMerge(
        "/123abc/Untitled456/cell/A1/formula",
        {
            "selection-action": null,
        },
        "/123abc/Untitled456/cell/A1"
    );

    testMerge(
        "/123abc/Untitled456/cell/A2",
        {
            "name": false,
        },
        "/123abc/Untitled456/cell/A2"
    );

    testMerge(
        "/123abc/Untitled456/cell/A2",
        {
            "name": true,
        },
        "/123abc/Untitled456/name"
    );

    testMerge(
        "/123abc/Untitled456/cell/A2/formula",
        {
            "name": false,
        },
        "/123abc/Untitled456/cell/A2/formula"
    );

    testMerge(
        "/123abc/Untitled456/cell/A2/formula",
        {
            "name": true,
        },
        "/123abc/Untitled456/name"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1",
        {
            "selection": CELL_RANGE,
        },
        "/123abc/Untitled456/cell/C3:D4"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula",
        {
            "selection": CELL_RANGE,
            "selection-action": null,
        },
        "/123abc/Untitled456/cell/C3:D4"
    );

    testMerge(
        "/123abc/Untitled456/cell/LABEL123",
        {},
        "/123abc/Untitled456/cell/LABEL123"
    );

// label.................................................................................................................

    testMerge(
        "/123abc/Untitled456/label",
        {},
        "/123abc/Untitled456"
    );

    testMerge(
        "/123abc/Untitled456/label/!invalid-label",
        {},
        "/123abc/Untitled456"
    );

    testMerge(
        "/123abc/Untitled456/label/A1",
        {},
        "/123abc/Untitled456"
    );

    testMerge(
        "/123abc/Untitled456/label/LABEL123",
        {},
        "/123abc/Untitled456/label/LABEL123"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/label/LABEL123",
        {},
        "/123abc/Untitled456/cell/A1/label/LABEL123"
    );

    testMerge(
        "/123abc/Untitled456/label/LABEL123",
        {
            name: false,
        },
        "/123abc/Untitled456/label/LABEL123"
    );

    testMerge(
        "/123abc/Untitled456/label/LABEL123",
        {
            name: true,
        },
        "/123abc/Untitled456/name"
    );

    // column...........................................................................................................

    testMerge(
        "/123abc/Untitled456/",
        {
            selection: COLUMN,
        },
        "/123abc/Untitled456/column/B"
    );

    testMerge(
        "/123abc/Untitled456/column/B",
        {
            selection: COLUMN_RANGE,
        },
        "/123abc/Untitled456/column/B:C"
    );

    testMerge(
        "/123abc/Untitled456/column/B:D",
        {
            selection: COLUMN,
        },
        "/123abc/Untitled456/column/B"
    );

    // row...........................................................................................................

    testMerge(
        "/123abc/Untitled456/",
        {
            selection: ROW,
        },
        "/123abc/Untitled456/row/2"
    );
    
    testMerge(
        "/123abc/Untitled456/row/2",
        {
            selection: ROW_RANGE,
        },
        "/123abc/Untitled456/row/2:3"
    );
    
    testMerge(
        "/123abc/Untitled456/row/2:3",
        {
            selection: ROW,
        },
        "/123abc/Untitled456/row/2"
    );

    // select.............................................................................................................

    testMerge(
        "/123abc/Untitled456/select",
        {},
        "/123abc/Untitled456/select",
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/select",
        {},
        "/123abc/Untitled456/cell/A1/select",
    );

    testMerge(
        "/123abc/Untitled456/label/LABEL123/select",
        {},
        "/123abc/Untitled456/label/LABEL123/select",
    );

    testMerge(
        "/123abc/Untitled456/select/settings",
        {},
        "/123abc/Untitled456/select/settings",
    );

    testMerge(
        "/123abc/Untitled456/",
        {
            "select": true,
        },
        "/123abc/Untitled456/select",
    );

    testMerge(
        "/123abc/Untitled456/cell/A1",
        {
            "select": true,
        },
        "/123abc/Untitled456/cell/A1/select",
    );

    testMerge(
        "/123abc/Untitled456/select",
        {
            "select": false,
        },
        "/123abc/Untitled456",
    );

    testMerge(
        "/123abc/Untitled456/select",
        {
            "name": false,
        },
        "/123abc/Untitled456/select",
    );

    testMerge(
        "/123abc/Untitled456/select",
        {
            "name": true,
        },
        "/123abc/Untitled456/name",
    );

// settings.............................................................................................................

    testMerge(
        "/123abc/Untitled456/settings",
        {},
        "/123abc/Untitled456/settings"
    );

   testMerge(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
        },
        "/123abc/Untitled456/settings"
    );

    testMerge(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": "!invalid",
        },
        "/123abc/Untitled456/settings"
    );

    testMerge(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
        },
        "/123abc/Untitled456/settings/metadata"
    );

    testMerge(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_TEXT,
        },
        "/123abc/Untitled456/settings/text"
    );

    testMerge(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
        },
        "/123abc/Untitled456/settings/number"
    );

    testMerge(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
        },
        "/123abc/Untitled456/settings/date-time"
    );

    testMerge(
        "/123abc/Untitled456/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_STYLE,
        },
        "/123abc/Untitled456/settings/style"
    );

    testMerge(
        "/123abc/Untitled456/settings",
        {
            "settings": false,
        },
        "/123abc/Untitled456"
    );

    testMerge(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
        },
        "/123abc/Untitled456/settings"
    );

    testMerge(
        "/123abc/Untitled456/name/settings",
        {
            "settings": false,
        },
        "/123abc/Untitled456"
    );

    testMerge(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": "invalid"
        },
        "/123abc/Untitled456/settings"
    );

    testMerge(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
        },
        "/123abc/Untitled456/settings/metadata"
    );

    testMerge(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_TEXT,
        },
        "/123abc/Untitled456/settings/text"
    );

    testMerge(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
        },
        "/123abc/Untitled456/settings/number"
    );

    testMerge(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
        },
        "/123abc/Untitled456/settings/date-time"
    );

    testMerge(
        "/123abc/Untitled456/name/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_STYLE,
        },
        "/123abc/Untitled456/settings/style"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1",
        {
            "settings": true,
        },
        "/123abc/Untitled456/cell/A1/settings"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/settings",
        {
            "settings": false,
        },
        "/123abc/Untitled456/cell/A1"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula",
        {
            "settings": true,
        },
        "/123abc/Untitled456/cell/A1/formula/settings"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
        },
        "/123abc/Untitled456/cell/A1/formula/settings"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": "!invalid"
        },
        "/123abc/Untitled456/cell/A1/formula/settings"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/metadata"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_TEXT,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/text"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_NUMBER,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/number"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_DATE_TIME,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/date-time"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": true,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_STYLE,
        },
        "/123abc/Untitled456/cell/A1/formula/settings/style"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": false,
        },
        "/123abc/Untitled456/cell/A1/formula"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "settings": false,
            "settings-section": SpreadsheetHistoryHash.SETTINGS_METADATA,
        },
        "/123abc/Untitled456/cell/A1/formula"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "spreadsheet-id": "456def",
            "spreadsheet-name": "new-spreadsheet-name-456",
            "selection": SpreadsheetCellReference.parse("B2"),
            "selection-action": new SpreadsheetFormulaHistoryHashToken(),
            "settings": true,
        },
        "/456def/new-spreadsheet-name-456/cell/B2/formula/settings"
    );

    testMerge(
        "/123abc/Untitled456/cell/A1/formula/settings",
        {
            "spreadsheet-id": "456def",
            "spreadsheet-name": "new-spreadsheet-name-456",
            "selection": SpreadsheetCellReference.parse("B2"),
            "selection-action": new SpreadsheetFormulaHistoryHashToken(),
            "settings": false,
        },
        "/456def/new-spreadsheet-name-456/cell/B2/formula"
    );

    testMerge(
        "/123abc/Untitled456",
        {
            "selection-action": new SpreadsheetFormulaHistoryHashToken(),
        },
        "/123abc/Untitled456"
    );

function testMerge(hash, update, expected) {
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