import CharSequences from "../../CharSequences.js";
import SpreadsheetCellClearHistoryHashToken from "./SpreadsheetCellClearHistoryHashToken.js";
import SpreadsheetCellDeleteHistoryHashToken from "./SpreadsheetCellDeleteHistoryHashToken.js";
import SpreadsheetCellMenuHistoryHashToken from "./SpreadsheetCellMenuHistoryHashToken.js";
import SpreadsheetCellRange from "../reference/SpreadsheetCellRange.js";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference.js";
import SpreadsheetColumnOrRowClearHistoryHashToken from "./SpreadsheetColumnOrRowClearHistoryHashToken.js";
import SpreadsheetColumnOrRowDeleteHistoryHashToken from "./SpreadsheetColumnOrRowDeleteHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertAfterHistoryHashToken from "./SpreadsheetColumnOrRowInsertAfterHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertBeforeHistoryHashToken
    from "./SpreadsheetColumnOrRowInsertBeforeHistoryHashToken.js";
import SpreadsheetColumnOrRowMenuHistoryHashToken from "./SpreadsheetColumnOrRowMenuHistoryHashToken.js";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "../reference/SpreadsheetColumnReferenceRange.js";
import SpreadsheetFormulaLoadAndEditHistoryHashToken from "./SpreadsheetFormulaLoadAndEditHistoryHashToken.js";
import SpreadsheetFormulaSaveHistoryHashToken from "./SpreadsheetFormulaSaveHistoryHashToken.js";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelMappingDeleteHistoryHashToken from "./SpreadsheetLabelMappingDeleteHistoryHashToken.js";
import SpreadsheetLabelMappingSaveHistoryHashToken from "./SpreadsheetLabelMappingSaveHistoryHashToken.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetName from "../SpreadsheetName.js";
import SpreadsheetNameSaveHistoryHashToken from "./SpreadsheetNameSaveHistoryHashToken.js";
import SpreadsheetRowReference from "../reference/SpreadsheetRowReference.js";
import SpreadsheetRowReferenceRange from "../reference/SpreadsheetRowReferenceRange.js"
import SpreadsheetSettingsSaveHistoryHashToken from "./SpreadsheetSettingsSaveHistoryHashToken.js";
import SpreadsheetSettingsWidgetHistoryHashTokens from "../settings/SpreadsheetSettingsWidgetHistoryHashTokens.js";
import SpreadsheetViewportSelectionAnchor from "../reference/SpreadsheetViewportSelectionAnchor.js";
import TextStyle from "../../text/TextStyle.js";
import SpreadsheetColumnOrRowSaveHistoryHashToken from "./SpreadsheetColumnOrRowSaveHistoryHashToken.js";

const ID = "spreadsheet-id-123";
const SPREADSHEET_NAME = new SpreadsheetName("spreadsheet-name-456");

const SPREADSHEET_NAME_SAVE = new SpreadsheetNameSaveHistoryHashToken(new SpreadsheetName("new-spreadsheet-name-789"));

const CELL = SpreadsheetCellReference.parse("A1");
const CELL_RANGE = SpreadsheetCellRange.parse("C3:D4");
const COLUMN = SpreadsheetColumnReference.parse("B");
const COLUMN_RANGE = SpreadsheetColumnReferenceRange.parse("B:C");
const ROW = SpreadsheetRowReference.parse("2");
const ROW_RANGE = SpreadsheetRowReferenceRange.parse("2:3");
const COLUMN_ROW_DELETE = SpreadsheetColumnOrRowDeleteHistoryHashToken.INSTANCE;
const HIDDEN_TRUE = new SpreadsheetColumnOrRowSaveHistoryHashToken("hidden", true);
const HIDDEN_FALSE = new SpreadsheetColumnOrRowSaveHistoryHashToken("hidden", false);

const LABEL = SpreadsheetLabelName.parse("Label123");
const NEW_LABEL = SpreadsheetLabelName.parse("Label999");

const COLUMN_ROW_CLEAR = SpreadsheetColumnOrRowClearHistoryHashToken.INSTANCE;
const COLUMN_ROW_MENU = SpreadsheetColumnOrRowMenuHistoryHashToken.INSTANCE;

const CELL_CLEAR = SpreadsheetCellClearHistoryHashToken.INSTANCE;
const CELL_DELETE = SpreadsheetCellDeleteHistoryHashToken.INSTANCE;
const CELL_MENU = SpreadsheetCellMenuHistoryHashToken.INSTANCE;
const FORMULA_LOAD_EDIT = new SpreadsheetFormulaLoadAndEditHistoryHashToken();
const FORMULA_LOAD_EDIT_SAVE = new SpreadsheetFormulaSaveHistoryHashToken("Abc123");

const LABEL_DELETE = SpreadsheetLabelMappingDeleteHistoryHashToken.INSTANCE;
const LABEL_SAVE = new SpreadsheetLabelMappingSaveHistoryHashToken(
    NEW_LABEL,
    CELL_RANGE
);

// emptyTokens................................................................................................................

test("emptyTokens", () => {
    expect(SpreadsheetHistoryHashTokens.emptyTokens())
        .toStrictEqual({
            "_tx-id": 0,
        });
});

// validate................................................................................................................

function testValidate(title, tokens, expected) {
    test(
        title,
        () => {
            expect(SpreadsheetHistoryHash.validate(tokens))
                .toStrictEqual(null != expected ? expected : tokens);
        }
    );
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
        "spreadsheet-name-edit": true,
    }
);

testValidate(
    "validate id & name & name-edit & name-save",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "spreadsheet-name-edit": true,
        "spreadsheet-name-edit-action": SPREADSHEET_NAME_SAVE,
    }
);

testValidate(
    "validate id & name & selection=cell",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
    }
);

testValidate(
    "validate id & name & selection=label",
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
        "spreadsheet-name-edit": true,
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
        "spreadsheet-name-edit": true,
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
        "spreadsheet-name-edit": true,
        "select": true,
    },
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testValidate(
    "validate id & name & selection=CELL",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
    }
);

testValidate(
    "validate id & name & selection=invalid",
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
    "validate id & name & selection=CELL",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": FORMULA_LOAD_EDIT,
    }
);

testValidate(
    "validate id & name & selection=LABEL",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": LABEL,
    }
);

testValidate(
    "validate id & name & selection=CELL & delete",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": CELL_DELETE,
    }
);

testValidate(
    "validate id & name & selection=CELL & formula-save",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": FORMULA_LOAD_EDIT_SAVE,
    }
);

testValidate(
    "validate id & name & selection=CELL & menu",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": CELL_MENU,
    }
);

testValidate(
    "validate id & name & selection=COLUMN & action=DELETE",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
        "selection-action": COLUMN_ROW_DELETE,
    }
);

testValidate(
    "validate id & name & selection=COLUMN & action=DELETE",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
        "selection-action": COLUMN_ROW_DELETE,
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
    "validate id & name & selection=LABEL & formula-save",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": LABEL,
        "selection-action": FORMULA_LOAD_EDIT_SAVE,
    }
);

testValidate(
    "validate id & name & selection=CELL_RANGE & TOP_LEFT",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_RANGE,
        "selection-anchor": SpreadsheetViewportSelectionAnchor.TOP_LEFT,
    }
);

testValidate(
    "validate id & name & selection=COLUMN_RANGE & LEFT",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_RANGE,
        "selection-anchor": SpreadsheetViewportSelectionAnchor.LEFT,
    }
);

testValidate(
    "validate id & name & selection=ROW_RANGE & TOP",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_RANGE,
        "selection-anchor": SpreadsheetViewportSelectionAnchor.TOP,
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

testValidate(
    "validate id & name & settings & settings-item",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": TextStyle.COLOR,
    }
);

testValidate(
    "validate id & name & settings & settings-item & settings-action=save",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": TextStyle.COLOR,
        "settings-action": new SpreadsheetSettingsSaveHistoryHashToken("#012345"),
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
    },
    "Invalid token: \"!invalid4\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "spreadsheet-name-edit": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/save",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"save\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/save/new-spreadsheet-name-789",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "spreadsheet-name-edit": true,
        "spreadsheet-name-edit-action": SPREADSHEET_NAME_SAVE,
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
    },
    "Cell: Missing text",
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
    "/spreadsheet-id-123/spreadsheet-name-456/cell/cell/A2",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"A2\""
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
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/clear",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": CELL_CLEAR,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": CELL_DELETE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": FORMULA_LOAD_EDIT,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/save",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/save/",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": new SpreadsheetFormulaSaveHistoryHashToken(""),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/save/ABC%20123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": new SpreadsheetFormulaSaveHistoryHashToken("ABC 123"),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/save/=12%2F34",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": new SpreadsheetFormulaSaveHistoryHashToken("=12/34"),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/menu",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": CELL_MENU,
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
    "/spreadsheet-id-123/spreadsheet-name-456/cell/C3:D4/top-left",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_RANGE,
        "selection-anchor": SpreadsheetViewportSelectionAnchor.TOP_LEFT
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/C3:D4/bottom-right",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_RANGE,
        "selection-anchor": SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/C3:D4/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"formula\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/C3/formula/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"delete\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/C3/formula/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"formula\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/C3/formula/insert-before",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"insert-before\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/C3/formula/insert-after",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"insert-after\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/C3:D4/menu",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_RANGE,
        "selection-action": CELL_MENU,
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
        "selection-action": FORMULA_LOAD_EDIT,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/Label123/formula/save",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/Label123/formula/save/ABC%20123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": LABEL,
        "selection-action": new SpreadsheetFormulaSaveHistoryHashToken("ABC 123"),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Label: Missing text",
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
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL,
        "label-action": LABEL_DELETE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123/save",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    },
    "Label save missing label or cell"
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123/save/Label999/A1",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL,
        "label-action": new SpreadsheetLabelMappingSaveHistoryHashToken(NEW_LABEL, CELL),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123/save/Label999/C3:D4",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL,
        "label-action": new SpreadsheetLabelMappingSaveHistoryHashToken(NEW_LABEL, CELL_RANGE),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123/save/Label999/Label456",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL,
        "label-action": new SpreadsheetLabelMappingSaveHistoryHashToken(
            NEW_LABEL,
            SpreadsheetLabelName.parse("Label456")
        ),
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
        "selection-action": FORMULA_LOAD_EDIT,
        "label": LABEL,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "spreadsheet-name-edit": true,
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
        "selection-action": FORMULA_LOAD_EDIT,
        "select": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/select/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": FORMULA_LOAD_EDIT,
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
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/clear",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
        "selection-action": COLUMN_ROW_CLEAR,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
        "selection-action": COLUMN_ROW_DELETE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_RANGE,
        "selection-action": COLUMN_ROW_DELETE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/delete/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"delete\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/delete/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    },
    "Invalid token: \"formula\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/delete/insert-after",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    },
    "Invalid token: \"insert-after\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/delete/insert-before",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    },
    "Invalid token: \"insert-before\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/hidden",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    },
    "Invalid token: \"hidden\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/hidden/false",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
        "selection-action": HIDDEN_FALSE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/hidden/true",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
        "selection-action": HIDDEN_TRUE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/insert-after",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/insert-after/",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/insert-after/X",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/insert-after/123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
        "selection-action": new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(123),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/insert-before",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/insert-before/",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/insert-before/X",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/insert-before/123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
        "selection-action": new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(123),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/insert-before/123/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    },
    "Invalid token: \"delete\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/menu",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN,
        "selection-action": COLUMN_ROW_MENU,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"formula\""
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
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/left",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_RANGE,
        "selection-anchor": SpreadsheetViewportSelectionAnchor.LEFT
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/right",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_RANGE,
        "selection-anchor": SpreadsheetViewportSelectionAnchor.RIGHT
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/clear",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_RANGE,
        "selection-action": COLUMN_ROW_CLEAR,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_RANGE,
        "selection-action": COLUMN_ROW_DELETE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/insert-after/1",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_RANGE,
        "selection-action": new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(1),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/insert-before/2",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_RANGE,
        "selection-action": new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(2),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/menu",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_RANGE,
        "selection-action": COLUMN_ROW_MENU,
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
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/clear",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW,
        "selection-action": COLUMN_ROW_CLEAR,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW,
        "selection-action": COLUMN_ROW_DELETE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/clear",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_RANGE,
        "selection-action": COLUMN_ROW_CLEAR,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_RANGE,
        "selection-action": COLUMN_ROW_DELETE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/delete/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    },
    "Invalid token: \"formula\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/hidden",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    },
    "Invalid token: \"hidden\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/hidden/false",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW,
        "selection-action": HIDDEN_FALSE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/hidden/true",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW,
        "selection-action": HIDDEN_TRUE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/delete/insert-after",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    },
    "Invalid token: \"insert-after\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/delete/insert-before",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    },
    "Invalid token: \"insert-before\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert-after",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert-after/123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW,
        "selection-action": new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(123),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert-after/123/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"delete\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert-after/123/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"formula\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert-after/123/insert-after",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"insert-after\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert-after/123/insert-before",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"insert-before\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert-before",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"insert-before\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert-before/",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert-before/X",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert-before/123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW,
        "selection-action": new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(123),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert-before/789/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"delete\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert-before/123/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"formula\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert-before/123/insert-before",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"insert-before\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/insert-before/123/insert-after",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"insert-after\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/menu",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW,
        "selection-action": COLUMN_ROW_MENU,
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
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/top",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_RANGE,
        "selection-anchor": SpreadsheetViewportSelectionAnchor.TOP
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/bottom",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_RANGE,
        "selection-anchor": SpreadsheetViewportSelectionAnchor.BOTTOM
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_RANGE,
        "selection-action": COLUMN_ROW_DELETE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/insert-after/1",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_RANGE,
        "selection-action": new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(1),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/insert-before/2",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_RANGE,
        "selection-action": new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(2),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/menu",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_RANGE,
        "selection-action": COLUMN_ROW_MENU,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"formula\""
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
    "/spreadsheet-id-123/spreadsheet-name-456/select/settings/color",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "select": true,
        "settings": true,
        "settings-item": TextStyle.COLOR,

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/select/settings/number",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "select": true,
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.NUMBER,

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
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/metadata",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.METADATA,

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/text",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.TEXT,

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/number",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.NUMBER,

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/date-time",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.DATE_TIME,

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/style",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.STYLE,

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
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/metadata",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.METADATA,

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/text",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.TEXT,

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/number",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.NUMBER,

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/date-time",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.DATE_TIME,

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/style",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.STYLE,

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/style/save",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"save\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/style/save/",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"save\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/style/save/1",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"save\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/color",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": TextStyle.COLOR,

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/color/save",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/color/save/",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": TextStyle.COLOR,
        "settings-action": new SpreadsheetSettingsSaveHistoryHashToken(null),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/settings/color/save/012345",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": true,
        "settings-item": TextStyle.COLOR,
        "settings-action": new SpreadsheetSettingsSaveHistoryHashToken("012345"),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
        "selection-action": FORMULA_LOAD_EDIT,
        "settings": true,

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/!invalid",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/metadata",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
        "selection-action": FORMULA_LOAD_EDIT,
        "settings": true,
        "settings-item": "metadata",

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/text",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
        "selection-action": FORMULA_LOAD_EDIT,
        "settings": true,
        "settings-item": "text",

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/number",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
        "selection-action": FORMULA_LOAD_EDIT,
        "settings": true,
        "settings-item": "number",

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/date-time",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
        "selection-action": FORMULA_LOAD_EDIT,
        "settings": true,
        "settings-item": "date-time",

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/formula/settings/style",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": SpreadsheetCellReference.parse("B2"),
        "selection-action": FORMULA_LOAD_EDIT,
        "settings": true,
        "settings-item": "style",

    }
);
testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123/settings/style",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL,
        "settings": true,
        "settings-item": "style",

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/settings/metadata",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL,
        "selection-action": FORMULA_LOAD_EDIT,
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.METADATA,

    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/!invalid",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"!invalid\"",
);


function testParseAndStringify(hash, expected, expectedError) {
    test("parse " + CharSequences.quoteAndEscape(hash), () => {
        let errors = [];
        expected[SpreadsheetHistoryHashTokens.TX_ID] = 0;

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
    "/123abc/Untitled456",
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
        "spreadsheet-name-edit": true,
    },
    "/123abc/Untitled456/name"
);

testMerge(
    "/123abc/Untitled456",
    {
        "spreadsheet-name-edit": true,
        "spreadsheet-name-edit-action": SPREADSHEET_NAME_SAVE,
    },
    "/123abc/Untitled456/name/save/new-spreadsheet-name-789"
);

testMerge(
    "/123abc/Untitled456",
    {
        "spreadsheet-name-edit": false,
    },
    "/123abc/Untitled456"
);

testMerge(
    "/123abc/Untitled456/name",
    {
        "spreadsheet-name-edit": true,
    },
    "/123abc/Untitled456/name"
);

testMerge(
    "/123abc/Untitled456/name",
    {
        "spreadsheet-name-edit": false,
    },
    "/123abc/Untitled456"
);

testMerge(
    "/123abc/Untitled456/name",
    {
        "spreadsheet-name-edit": true,
    },
    "/123abc/Untitled456/name"
);

testMerge(
    "/123abc/Untitled456/name",
    {
        "spreadsheet-name-edit": true,
        "spreadsheet-name-edit-action": SPREADSHEET_NAME_SAVE,
    },
    "/123abc/Untitled456/name/save/new-spreadsheet-name-789"
);

testMerge(
    "/123abc/Untitled456/name/save/new-spreadsheet-name-789",
    {
        "spreadsheet-name-edit-action": null,
    },
    "/123abc/Untitled456/name"
);

testMerge(
    "/123abc/Untitled456/name",
    {
        "spreadsheet-name-edit": false,
    },
    "/123abc/Untitled456"
);

testMerge(
    "/123abc/Untitled456/name/cell/A1/formula",
    {},
    "/123abc/Untitled456"
);

testMerge(
    "/123abc/Untitled456/name",
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
        "selection-action": FORMULA_LOAD_EDIT,
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
        "selection-action": FORMULA_LOAD_EDIT,
    },
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
        "spreadsheet-name-edit": false,
    },
    "/123abc/Untitled456/cell/A2"
);

testMerge(
    "/123abc/Untitled456/cell/A2",
    {
        "spreadsheet-name-edit": true,
    },
    "/123abc/Untitled456/name"
);

testMerge(
    "/123abc/Untitled456/cell/A2/formula",
    {
        "spreadsheet-name-edit": false,
    },
    "/123abc/Untitled456/cell/A2/formula"
);

testMerge(
    "/123abc/Untitled456/cell/A2/formula",
    {
        "spreadsheet-name-edit": true,
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
    "/123abc/Untitled456/cell/A1",
    {
        "selection-action": CELL_MENU,
    },
    "/123abc/Untitled456/cell/A1/menu"
);

testMerge(
    "/123abc/Untitled456/cell/LABEL123",
    {},
    "/123abc/Untitled456/cell/LABEL123"
);

testMerge(
    "/123abc/Untitled456/cell/A1",
    {
        "selection": CELL_RANGE,
        "selection-anchor": SpreadsheetViewportSelectionAnchor.TOP_LEFT,
    },
    "/123abc/Untitled456/cell/C3:D4/top-left"
);

// label.................................................................................................................

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
        "spreadsheet-name-edit": false,
    },
    "/123abc/Untitled456/label/LABEL123"
);

testMerge(
    "/123abc/Untitled456/label/LABEL123",
    {
        "spreadsheet-name-edit": true,
    },
    "/123abc/Untitled456/name"
);

// column...........................................................................................................

testMerge(
    "/123abc/Untitled456",
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
    "/123abc/Untitled456/column/B",
    {
        "selection": COLUMN_RANGE,
        "selection-anchor": SpreadsheetViewportSelectionAnchor.LEFT,
    },
    "/123abc/Untitled456/column/B:C/left"
);

testMerge(
    "/123abc/Untitled456/column/B:D",
    {
        selection: COLUMN,
    },
    "/123abc/Untitled456/column/B"
);

testMerge(
    "/123abc/Untitled456/column/B",
    {
        "selection-action": COLUMN_ROW_DELETE,
    },
    "/123abc/Untitled456/column/B/delete"
);

testMerge(
    "/123abc/Untitled456/column/B",
    {
        "selection-action": HIDDEN_TRUE,
    },
    "/123abc/Untitled456/column/B/hidden/true"
);

testMerge(
    "/123abc/Untitled456/column/B",
    {
        "selection-action": COLUMN_ROW_MENU,
    },
    "/123abc/Untitled456/column/B/menu"
);

testMerge(
    "/123abc/Untitled456/column/C:D",
    {
        "selection-action": COLUMN_ROW_DELETE,
    },
    "/123abc/Untitled456/column/C:D/delete"
);

testMerge(
    "/123abc/Untitled456/column/C:D",
    {
        "selection-action": HIDDEN_TRUE,
    },
    "/123abc/Untitled456/column/C:D/hidden/true"
);

testMerge(
    "/123abc/Untitled456/column/C:D",
    {
        "selection-action": COLUMN_ROW_MENU,
    },
    "/123abc/Untitled456/column/C:D/menu"
);

// row...........................................................................................................

testMerge(
    "/123abc/Untitled456",
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
    "/123abc/Untitled456/row/2",
    {
        "selection": ROW_RANGE,
        "selection-anchor": SpreadsheetViewportSelectionAnchor.TOP,
    },
    "/123abc/Untitled456/row/2:3/top"
);

testMerge(
    "/123abc/Untitled456/row/2:3",
    {
        selection: ROW,
    },
    "/123abc/Untitled456/row/2"
);

testMerge(
    "/123abc/Untitled456/row/45",
    {
        "selection-action": COLUMN_ROW_DELETE,
    },
    "/123abc/Untitled456/row/45/delete"
);

testMerge(
    "/123abc/Untitled456/row/45",
    {
        "selection-action": COLUMN_ROW_MENU,
    },
    "/123abc/Untitled456/row/45/menu"
);

testMerge(
    "/123abc/Untitled456/row/45:67",
    {
        "selection-action": COLUMN_ROW_DELETE,
    },
    "/123abc/Untitled456/row/45:67/delete"
);

testMerge(
    "/123abc/Untitled456/row/2",
    {
        "selection-action": HIDDEN_TRUE,
    },
    "/123abc/Untitled456/row/2/hidden/true"
);

testMerge(
    "/123abc/Untitled456/row/45:67",
    {
        "selection-action": HIDDEN_TRUE,
    },
    "/123abc/Untitled456/row/45:67/hidden/true"
);

testMerge(
    "/123abc/Untitled456/row/45:67",
    {
        "selection-action": COLUMN_ROW_MENU,
    },
    "/123abc/Untitled456/row/45:67/menu"
);

// label...........................................................................................................

testMerge(
    "/123abc/Untitled456/label/Label123",
    {
        "label-action": LABEL_DELETE,
    },
    "/123abc/Untitled456/label/Label123/delete"
);

testMerge(
    "/123abc/Untitled456/label/LabelOld",
    {
        "label": LABEL,
        "label-action": LABEL_DELETE,
    },
    "/123abc/Untitled456/label/Label123/delete"
);

testMerge(
    "/123abc/Untitled456/label/LabelOld/delete",
    {
        "label": LABEL,
    },
    "/123abc/Untitled456/label/Label123/delete"
);

testMerge("/123abc/Untitled456/label/LabelOld/delete",
    {
        "label": LABEL,
        "label-action": null,
    },
    "/123abc/Untitled456/label/Label123"
);

testMerge(
    "/123abc/Untitled456/label/Label123",
    {
        "label-action": LABEL_SAVE,
    },
    "/123abc/Untitled456/label/Label123/save/Label999/C3:D4"
);

testMerge(
    "/123abc/Untitled456/label/LabelOld",
    {
        "label": LABEL,
        "label-action": LABEL_SAVE,
    },
    "/123abc/Untitled456/label/Label123/save/Label999/C3:D4"
);

testMerge(
    "/123abc/Untitled456/label/LabelOld/save/Label999/Z9",
    {
        "label": LABEL,
    },
    "/123abc/Untitled456/label/Label123/save/Label999/Z9"
);

testMerge("/123abc/Untitled456/label/LabelOld/save/new/A1",
    {
        "label": LABEL,
        "label-action": null,
    },
    "/123abc/Untitled456/label/Label123"
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
    "/123abc/Untitled456",
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
        "spreadsheet-name-edit": false,
    },
    "/123abc/Untitled456/select",
);

testMerge(
    "/123abc/Untitled456/select",
    {
        "spreadsheet-name-edit": true,
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
        "settings-item": "!invalid",
    },
    "/123abc/Untitled456/settings"
);

testMerge(
    "/123abc/Untitled456/settings",
    {
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.METADATA,
    },
    "/123abc/Untitled456/settings/metadata"
);

testMerge(
    "/123abc/Untitled456/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.METADATA,
    },
    "/123abc/Untitled456/settings/metadata"
);

testMerge(
    "/123abc/Untitled456/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.TEXT,
    },
    "/123abc/Untitled456/settings/text"
);

testMerge(
    "/123abc/Untitled456/settings",
    {
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.TEXT,
    },
    "/123abc/Untitled456/settings/text"
);

testMerge(
    "/123abc/Untitled456/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.NUMBER,
    },
    "/123abc/Untitled456/settings/number"
);

testMerge(
    "/123abc/Untitled456/settings",
    {
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.NUMBER,
    },
    "/123abc/Untitled456/settings/number"
);

testMerge(
    "/123abc/Untitled456/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.DATE_TIME,
    },
    "/123abc/Untitled456/settings/date-time"
);

testMerge(
    "/123abc/Untitled456/settings",
    {
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.DATE_TIME,
    },
    "/123abc/Untitled456/settings/date-time"
);

testMerge(
    "/123abc/Untitled456/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.STYLE,
    },
    "/123abc/Untitled456/settings/style"
);

testMerge(
    "/123abc/Untitled456/settings",
    {
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.STYLE,
    },
    "/123abc/Untitled456/settings/style"
);

testMerge(
    "/123abc/Untitled456/settings/metadata",
    {
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.TEXT,
    },
    "/123abc/Untitled456/settings/text"
);

testMerge(
    "/123abc/Untitled456/settings/color",
    {
        "settings-action": null,
    },
    "/123abc/Untitled456/settings/color"
);

testMerge(
    "/123abc/Untitled456/settings/color",
    {
        "settings-action": new SpreadsheetSettingsSaveHistoryHashToken("#012345"),
    },
    "/123abc/Untitled456/settings/color/save/#012345"
);

testMerge(
    "/123abc/Untitled456/settings/color/save/#012345",
    {
        "settings-action": null,
    },
    "/123abc/Untitled456/settings/color"
);

testMerge(
    "/123abc/Untitled456/settings/color/save/#012345",
    {
        "settings-action": new SpreadsheetSettingsSaveHistoryHashToken("#abcdef"),
    },
    "/123abc/Untitled456/settings/color/save/#abcdef"
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
        "settings-item": "invalid"
    },
    "/123abc/Untitled456/settings"
);

testMerge(
    "/123abc/Untitled456/name/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.METADATA,
    },
    "/123abc/Untitled456/settings/metadata"
);

testMerge(
    "/123abc/Untitled456/name/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.TEXT,
    },
    "/123abc/Untitled456/settings/text"
);

testMerge(
    "/123abc/Untitled456/name/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.NUMBER,
    },
    "/123abc/Untitled456/settings/number"
);

testMerge(
    "/123abc/Untitled456/name/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.DATE_TIME,
    },
    "/123abc/Untitled456/settings/date-time"
);

testMerge(
    "/123abc/Untitled456/name/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.STYLE,
    },
    "/123abc/Untitled456/settings/style"
);

testMerge(
    "/123abc/Untitled456/name/settings/color/save/#012345",
    {
        "settings-action": null,
    },
    "/123abc/Untitled456/name/settings/color"
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
    "/123abc/Untitled456/cell/A1",
    {
        "selection-action": CELL_DELETE,
    },
    "/123abc/Untitled456/cell/A1/delete"
);

testMerge(
    "/123abc/Untitled456/cell/A1/delete",
    {
        "settings": true,
    },
    "/123abc/Untitled456/cell/A1/delete/settings"
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
        "settings-item": "!invalid"
    },
    "/123abc/Untitled456/cell/A1/formula/settings"
);

testMerge(
    "/123abc/Untitled456/cell/A1/formula/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.METADATA,
    },
    "/123abc/Untitled456/cell/A1/formula/settings/metadata"
);

testMerge(
    "/123abc/Untitled456/cell/A1/formula/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.TEXT,
    },
    "/123abc/Untitled456/cell/A1/formula/settings/text"
);

testMerge(
    "/123abc/Untitled456/cell/A1/formula/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.NUMBER,
    },
    "/123abc/Untitled456/cell/A1/formula/settings/number"
);

testMerge(
    "/123abc/Untitled456/cell/A1/formula/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.DATE_TIME,
    },
    "/123abc/Untitled456/cell/A1/formula/settings/date-time"
);

testMerge(
    "/123abc/Untitled456/cell/A1/formula/settings",
    {
        "settings": true,
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.STYLE,
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
        "settings-item": SpreadsheetSettingsWidgetHistoryHashTokens.METADATA,
    },
    "/123abc/Untitled456/cell/A1/formula"
);

testMerge(
    "/123abc/Untitled456/cell/A1/formula/settings",
    {
        "spreadsheet-id": "456def",
        "spreadsheet-name": "new-spreadsheet-name-456",
        "selection": SpreadsheetCellReference.parse("B2"),
        "selection-action": FORMULA_LOAD_EDIT,
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
        "selection-action": FORMULA_LOAD_EDIT,
        "settings": false,
    },
    "/456def/new-spreadsheet-name-456/cell/B2/formula"
);

testMerge(
    "/123abc/Untitled456",
    {
        "selection-action": FORMULA_LOAD_EDIT,
    },
    "/123abc/Untitled456"
);

function testMerge(hash, update, expected) {
    test("merge " + CharSequences.quoteAndEscape(hash) + " AND " + stringify(update), () => {
        const throwError = (e) => {
            throw Error(e)
        };

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

    for(const property in object) {
        s = s + separator + property + "=" + object[property];
        separator = ", ";
    }

    return s;
}

// spreadsheetIdAndName................................................................................................

test("spreadsheetIdAndName", () => {
    expect(
        SpreadsheetHistoryHash.spreadsheetIdAndName(
            {
                "spreadsheet-id": ID,
                "spreadsheet-name": SPREADSHEET_NAME,
                "selection": CELL,
                "selection-action": FORMULA_LOAD_EDIT,
            }
        )
    ).toStrictEqual({
        "_tx-id": 0,
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
    });
});