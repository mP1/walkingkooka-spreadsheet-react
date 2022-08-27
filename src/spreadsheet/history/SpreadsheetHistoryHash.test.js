import BorderStyle from "../../text/BorderStyle.js";
import CharSequences from "../../CharSequences.js";
import Color from "../../color/Color.js";
import ExpressionNumberKind from "../../math/ExpressionNumberKind.js";
import FontStyle from "../../text/FontStyle.js";
import Hyphens from "../../text/Hyphens.js";
import PixelLength from "../../text/PixelLength.js";
import RoundingMode from "../../math/RoundingMode.js";
import SpreadsheetCellClearHistoryHashToken from "../reference/SpreadsheetCellClearHistoryHashToken.js";
import SpreadsheetCellDeleteHistoryHashToken from "../reference/SpreadsheetCellDeleteHistoryHashToken.js";
import SpreadsheetCellFormulaEditHistoryHashToken
    from "../reference/formula/SpreadsheetCellFormulaEditHistoryHashToken.js";
import SpreadsheetCellFormulaSaveHistoryHashToken
    from "../reference/formula/SpreadsheetCellFormulaSaveHistoryHashToken.js";
import SpreadsheetCellFreezeHistoryHashToken from "../reference/SpreadsheetCellFreezeHistoryHashToken.js";
import SpreadsheetCellMenuHistoryHashToken from "../reference/SpreadsheetCellMenuHistoryHashToken.js";
import SpreadsheetCellRange from "../reference/SpreadsheetCellRange.js";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference.js";
import SpreadsheetCellSelectHistoryHashToken from "../reference/SpreadsheetCellSelectHistoryHashToken.js";
import SpreadsheetCellStyleEditHistoryHashToken from "../reference/style/SpreadsheetCellStyleEditHistoryHashToken.js";
import SpreadsheetCellStyleSaveHistoryHashToken from "../reference/style/SpreadsheetCellStyleSaveHistoryHashToken.js";
import SpreadsheetCellUnFreezeHistoryHashToken from "../reference/SpreadsheetCellUnFreezeHistoryHashToken.js";
import SpreadsheetColumnOrRowClearHistoryHashToken from "../reference/SpreadsheetColumnOrRowClearHistoryHashToken.js";
import SpreadsheetColumnOrRowDeleteHistoryHashToken from "../reference/SpreadsheetColumnOrRowDeleteHistoryHashToken.js";
import SpreadsheetColumnOrRowFreezeHistoryHashToken from "../reference/SpreadsheetColumnOrRowFreezeHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertAfterHistoryHashToken
    from "../reference/SpreadsheetColumnOrRowInsertAfterHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertBeforeHistoryHashToken
    from "../reference/SpreadsheetColumnOrRowInsertBeforeHistoryHashToken.js";
import SpreadsheetColumnOrRowMenuHistoryHashToken from "../reference/SpreadsheetColumnOrRowMenuHistoryHashToken.js";
import SpreadsheetColumnOrRowSaveHistoryHashToken from "../reference/SpreadsheetColumnOrRowSaveHistoryHashToken.js";
import SpreadsheetColumnOrRowSelectHistoryHashToken from "../reference/SpreadsheetColumnOrRowSelectHistoryHashToken.js";
import SpreadsheetColumnOrRowUnFreezeHistoryHashToken
    from "../reference/SpreadsheetColumnOrRowUnFreezeHistoryHashToken.js";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference.js";
import SpreadsheetColumnReferenceRange from "../reference/SpreadsheetColumnReferenceRange.js";
import SpreadsheetContextMenu from "../../widget/SpreadsheetContextMenu.js";
import SpreadsheetDateFormatPattern from "../format/SpreadsheetDateFormatPattern.js";
import SpreadsheetDateParsePatterns from "../format/SpreadsheetDateParsePatterns.js";
import SpreadsheetDateTimeFormatPattern from "../format/SpreadsheetDateTimeFormatPattern.js";
import SpreadsheetDateTimeParsePatterns from "../format/SpreadsheetDateTimeParsePatterns.js";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelMappingDeleteHistoryHashToken
    from "../reference/SpreadsheetLabelMappingDeleteHistoryHashToken.js";
import SpreadsheetLabelMappingEditHistoryHashToken from "../reference/SpreadsheetLabelMappingEditHistoryHashToken.js";
import SpreadsheetLabelMappingSaveHistoryHashToken from "../reference/SpreadsheetLabelMappingSaveHistoryHashToken.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetMetadata from "../meta/SpreadsheetMetadata.js";
import SpreadsheetMetadataNameEditHistoryHashToken from "../meta/SpreadsheetMetadataNameEditHistoryHashToken.js";
import SpreadsheetMetadataNameSaveHistoryHashToken from "../meta/SpreadsheetMetadataNameSaveHistoryHashToken.js";
import SpreadsheetName from "../meta/SpreadsheetName.js";
import SpreadsheetRowReference from "../reference/SpreadsheetRowReference.js";
import SpreadsheetRowReferenceRange from "../reference/SpreadsheetRowReferenceRange.js"
import SpreadsheetMetadataSaveHistoryHashToken from "../meta/drawer/SpreadsheetMetadataSaveHistoryHashToken.js";
import SpreadsheetMetadataSelectHistoryHashToken from "../meta/drawer/SpreadsheetMetadataSelectHistoryHashToken.js";
import SpreadsheetSettingsWidgetHistoryHashTokens from "../meta/drawer/SpreadsheetSettingsWidgetHistoryHashTokens.js";
import SpreadsheetTextFormatPattern from "../format/SpreadsheetTextFormatPattern.js";
import SpreadsheetTimeFormatPattern from "../format/SpreadsheetTimeFormatPattern.js";
import SpreadsheetTimeParsePatterns from "../format/SpreadsheetTimeParsePatterns.js";
import SpreadsheetViewportSelection from "../reference/viewport/SpreadsheetViewportSelection.js";
import SpreadsheetViewportSelectionAnchor from "../reference/viewport/SpreadsheetViewportSelectionAnchor.js";
import TextStyle from "../../text/TextStyle.js";

const ID = "spreadsheet-id-123";
const SPREADSHEET_NAME = new SpreadsheetName("spreadsheet-name-456");

const NAME_EDIT = SpreadsheetMetadataNameEditHistoryHashToken.INSTANCE;
const SPREADSHEET_NAME_NEW = "new-spreadsheet-name-789";
const NAME_SAVE = new SpreadsheetMetadataNameSaveHistoryHashToken(new SpreadsheetName(SPREADSHEET_NAME_NEW));

const CONTEXT_MENU = new SpreadsheetContextMenu();

const CELL = SpreadsheetCellReference.parse("A1");
const CELL_RANGE = SpreadsheetCellRange.parse("C3:D4");
const CELL_RANGE_A1C3 = SpreadsheetCellRange.parse("A1:C3");

const LABEL = SpreadsheetLabelName.parse("Label123");
const NEW_LABEL = SpreadsheetLabelName.parse("Label999");

const CELL_CLEAR = new SpreadsheetCellClearHistoryHashToken(new SpreadsheetViewportSelection(CELL));
const CELL_DELETE = new SpreadsheetCellDeleteHistoryHashToken(new SpreadsheetViewportSelection(CELL));
const CELL_FREEZE = new SpreadsheetCellFreezeHistoryHashToken(new SpreadsheetViewportSelection(CELL));
const CELL_MENU = new SpreadsheetCellMenuHistoryHashToken(new SpreadsheetViewportSelection(CELL), new SpreadsheetContextMenu());
const CELL_SELECT = new SpreadsheetCellSelectHistoryHashToken(new SpreadsheetViewportSelection(CELL));
const CELL_UNFREEZE = new SpreadsheetCellUnFreezeHistoryHashToken(new SpreadsheetViewportSelection(CELL));
const CELL_FORMULA_LOAD_EDIT = new SpreadsheetCellFormulaEditHistoryHashToken(new SpreadsheetViewportSelection(CELL));
const CELL_FORMULA_SAVE = new SpreadsheetCellFormulaSaveHistoryHashToken(new SpreadsheetViewportSelection(CELL), "Abc123");
const CELL_LABEL_SELECT = new SpreadsheetCellSelectHistoryHashToken(new SpreadsheetViewportSelection(LABEL));

const COLUMN = SpreadsheetColumnReference.parse("B");
const COLUMN_A = SpreadsheetColumnReference.parse("A");
const COLUMN_RANGE = SpreadsheetColumnReferenceRange.parse("B:C");
const COLUMN_RANGE_AC = SpreadsheetColumnReferenceRange.parse("A:C");
const COLUMN_DELETE = new SpreadsheetColumnOrRowDeleteHistoryHashToken(new SpreadsheetViewportSelection(COLUMN));
const COLUMN_HIDDEN_TRUE = new SpreadsheetColumnOrRowSaveHistoryHashToken(new SpreadsheetViewportSelection(COLUMN), "hidden", true);
const COLUMN_HIDDEN_FALSE = new SpreadsheetColumnOrRowSaveHistoryHashToken(new SpreadsheetViewportSelection(COLUMN), "hidden", false);

const COLUMN_CLEAR = new SpreadsheetColumnOrRowClearHistoryHashToken(new SpreadsheetViewportSelection(COLUMN));
const COLUMN_FREEZE = new SpreadsheetColumnOrRowFreezeHistoryHashToken(new SpreadsheetViewportSelection(COLUMN_A));
const COLUMN_MENU = new SpreadsheetColumnOrRowMenuHistoryHashToken(new SpreadsheetViewportSelection(COLUMN), CONTEXT_MENU);
const COLUMN_SELECT = new SpreadsheetColumnOrRowSelectHistoryHashToken(new SpreadsheetViewportSelection(COLUMN));
const COLUMN_UNFREEZE = new SpreadsheetColumnOrRowUnFreezeHistoryHashToken(new SpreadsheetViewportSelection(COLUMN_A));

const ROW = SpreadsheetRowReference.parse("2");
const ROW_1 = SpreadsheetRowReference.parse("1");
const ROW_RANGE = SpreadsheetRowReferenceRange.parse("2:3");
const ROW_RANGE_1_3 = SpreadsheetRowReferenceRange.parse("1:3");
const ROW_DELETE = new SpreadsheetColumnOrRowDeleteHistoryHashToken(new SpreadsheetViewportSelection(ROW));
const ROW_HIDDEN_TRUE = new SpreadsheetColumnOrRowSaveHistoryHashToken(new SpreadsheetViewportSelection(ROW), "hidden", true);
const ROW_HIDDEN_FALSE = new SpreadsheetColumnOrRowSaveHistoryHashToken(new SpreadsheetViewportSelection(ROW), "hidden", false);

const ROW_CLEAR = new SpreadsheetColumnOrRowClearHistoryHashToken(new SpreadsheetViewportSelection(ROW));
const ROW_FREEZE = new SpreadsheetColumnOrRowFreezeHistoryHashToken(new SpreadsheetViewportSelection(ROW_1));
const ROW_MENU = new SpreadsheetColumnOrRowMenuHistoryHashToken(new SpreadsheetViewportSelection(ROW), CONTEXT_MENU);
const ROW_SELECT = new SpreadsheetColumnOrRowSelectHistoryHashToken(new SpreadsheetViewportSelection(ROW));
const ROW_UNFREEZE = new SpreadsheetColumnOrRowUnFreezeHistoryHashToken(new SpreadsheetViewportSelection(ROW_1));

const LABEL_DELETE = new SpreadsheetLabelMappingDeleteHistoryHashToken(LABEL);
const LABEL_EDIT = new SpreadsheetLabelMappingEditHistoryHashToken(LABEL);
const LABEL_SAVE = new SpreadsheetLabelMappingSaveHistoryHashToken(
    LABEL,
    NEW_LABEL,
    CELL_RANGE
);

const SETTINGS_NOTHING = SpreadsheetMetadataSelectHistoryHashToken.NOTHING;

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
        "spreadsheet-name-edit": NAME_EDIT,
    }
);

testValidate(
    "validate id & name & name-edit & name-save",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "spreadsheet-name-edit": NAME_SAVE,
    }
);

testValidate(
    "validate id & name & selection=cell",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_SELECT,
    }
);

testValidate(
    "validate id & name & selection=LABEL",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_LABEL_SELECT,
    }
);

testValidate(
    "validate id & name & name edit && cell",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "spreadsheet-name-edit": NAME_EDIT,
        "selection": CELL_SELECT,
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
        "spreadsheet-name-edit": NAME_EDIT,
        "label": LABEL_EDIT,
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
        "spreadsheet-name-edit": NAME_EDIT,
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
        "selection": CELL_SELECT,
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
        "selection": CELL_FORMULA_LOAD_EDIT,
    }
);

testValidate(
    "validate id & name & selection=LABEL",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_LABEL_SELECT,
    }
);

testValidate(
    "validate id & name & selection=CELL & delete",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_DELETE,
    }
);

testValidate(
    "validate id & name & selection=CELL & formula-save",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_FORMULA_SAVE,
    }
);

testValidate(
    "validate id & name & selection=CELL & freeze",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_FREEZE,
    }
);

testValidate(
    "validate id & name & selection=CELL & menu",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_MENU,
    }
);

testValidate(
    "validate id & name & selection=CELL & settings",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_SELECT,
        "settings": SETTINGS_NOTHING,
    }
);

testValidate(
    "validate id & name & selection=CELL & unfreeze",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_UNFREEZE,
    }
);

testValidate(
    "validate id & name & selection=COLUMN & action=DELETE",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_DELETE,
    }
);

testValidate(
    "validate id & name & selection=COLUMN & action=DELETE",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_DELETE,
    }
);

testValidate(
    "validate id & name & selection=COLUMN_A & action=FREEZE",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_FREEZE,
    }
);

testValidate(
    "validate id & name & selection=COLUMN_B & action=FREEZE",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testValidate(
    "validate id & name & selection=COLUMN_A & action=UNFREEZE",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_UNFREEZE,
    }
);

testValidate(
    "validate id & name & selection=COLUMN_B & action=UNFREEZE",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowUnFreezeHistoryHashToken(
            new SpreadsheetViewportSelection(
                SpreadsheetColumnReference.parse("B")
            )
        ),
    },
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
    }
);

testValidate(
    "validate id & name & label=LABEL",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL_EDIT,
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
    "validate id & name & label=LABEL & settings",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL_EDIT,
        "settings": SETTINGS_NOTHING,
    }
);


testValidate(
    "validate id & name & selection=LABEL & formula-save",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetCellFormulaSaveHistoryHashToken(
            new SpreadsheetViewportSelection(
                LABEL
            ),
            "=1+2"
        )
    }
)

testValidate(
    "validate id & name & label-edit",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL_EDIT,
    }
);

testValidate(
    "validate id & name & label-delete",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL_DELETE,
    }
);

testValidate(
    "validate id & name & label-save",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL_SAVE,
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
    "validate id & name & select & settings",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "select": true,
        "settings": SETTINGS_NOTHING,
    }
);

testValidate(
    "validate id & name & settings",
    {
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": SETTINGS_NOTHING,
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
    "/spreadsheet-id-123/spreadsheet-name-456/name",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "spreadsheet-name-edit": NAME_EDIT,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/new-spreadsheet-name-789",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "spreadsheet-name-edit": NAME_SAVE
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/cell/A1",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"A1\"",
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
        "selection": CELL_SELECT,
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
        "selection": CELL_CLEAR,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_DELETE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_FORMULA_LOAD_EDIT,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetCellFormulaSaveHistoryHashToken(
            new SpreadsheetViewportSelection(CELL),
            ""
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/ABC%20123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetCellFormulaSaveHistoryHashToken(
            new SpreadsheetViewportSelection(CELL),
            "ABC 123"
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/formula/=12%2F34",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetCellFormulaSaveHistoryHashToken(
            new SpreadsheetViewportSelection(CELL),
            "=12/34"
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/menu",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_MENU,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_SELECT,
        "settings": SETTINGS_NOTHING,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/C3:D4",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetCellSelectHistoryHashToken(
            new SpreadsheetViewportSelection(CELL_RANGE)
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/C3:D4/top-left",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetCellSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                CELL_RANGE,
                SpreadsheetViewportSelectionAnchor.TOP_LEFT
            )
        )
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/C3:D4/bottom-right",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetCellSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                CELL_RANGE,
                SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT
            )
        )
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
    "/spreadsheet-id-123/spreadsheet-name-456/cell/C3:D4/menu",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetCellMenuHistoryHashToken(
            new SpreadsheetViewportSelection(
                CELL_RANGE
            ),
            CONTEXT_MENU
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/Label123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_LABEL_SELECT,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/Label123/formula",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetCellFormulaEditHistoryHashToken(
            new SpreadsheetViewportSelection(
                LABEL
            ),
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/Label123/formula/ABC%20123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetCellFormulaSaveHistoryHashToken(
            new SpreadsheetViewportSelection(
                LABEL
            ),
            "ABC 123"
        ),
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
        "label": LABEL_EDIT,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": LABEL_DELETE,
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
        "label": new SpreadsheetLabelMappingSaveHistoryHashToken(LABEL, NEW_LABEL, CELL),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123/save/Label999/C3:D4",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": new SpreadsheetLabelMappingSaveHistoryHashToken(LABEL, NEW_LABEL, CELL_RANGE),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/label/Label123/save/Label999/Label456",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "label": new SpreadsheetLabelMappingSaveHistoryHashToken(
            LABEL,
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
        "selection": new SpreadsheetCellSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                SpreadsheetCellReference.parse("A2")
            )
        ),
        "label": LABEL_EDIT,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "spreadsheet-name-edit": NAME_EDIT,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/name/label/Label123",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"Label123\""
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
        "selection": CELL_SELECT,
        "select": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_SELECT,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/clear",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_CLEAR,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_DELETE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowDeleteHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE
            )
        )
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
    "/spreadsheet-id-123/spreadsheet-name-456/column/A/freeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_FREEZE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/A:C/freeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowFreezeHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE_AC
            )
        )
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/freeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"freeze\"",
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
        "selection": COLUMN_HIDDEN_FALSE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/hidden/true",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_HIDDEN_TRUE,
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
        "selection": new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN
            ),
            123
        ),
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
        "selection": new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN
            ),
            123
        ),
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
        "selection": COLUMN_MENU,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/A/unfreeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_UNFREEZE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/A:C/unfreeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowUnFreezeHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE_AC
            )
        )
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/unfreeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"unfreeze\"",
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
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:B",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                SpreadsheetColumnReference.parse("B")
            )
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE
            )
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/left",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE,
                SpreadsheetViewportSelectionAnchor.LEFT
            )
        )
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/right",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE,
                SpreadsheetViewportSelectionAnchor.RIGHT
            )
        )
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/clear",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowClearHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE
            )
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowDeleteHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE
            )
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/insert-after/1",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE
            ),
            1
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/insert-before/2",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE
            ),
            2
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B:C/menu",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowMenuHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE
            ),
            CONTEXT_MENU
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/column/B/select",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": COLUMN_SELECT,
        "select": true,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_SELECT,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/clear",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_CLEAR,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_DELETE
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/1/freeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_FREEZE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/freeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"freeze\"",
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/1:3/freeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowFreezeHistoryHashToken(
            new SpreadsheetViewportSelection(
                SpreadsheetRowReferenceRange.parse("1:3")
            )
        )
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/freeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    },
    "Invalid token: \"freeze\"",
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/clear",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowClearHistoryHashToken(
            new SpreadsheetViewportSelection(
                ROW_RANGE
            )
        )
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowDeleteHistoryHashToken(
            new SpreadsheetViewportSelection(
                ROW_RANGE
            )
        ),
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
        "selection": ROW_HIDDEN_FALSE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/hidden/true",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_HIDDEN_TRUE,
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
        "selection": new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(
            new SpreadsheetViewportSelection(ROW),
            123
        ),
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
        "selection": new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(
            new SpreadsheetViewportSelection(ROW),
            123
        ),
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
        "selection": ROW_MENU,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/1/unfreeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_UNFREEZE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2/unfreeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"unfreeze\"",
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/1:3/unfreeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowUnFreezeHistoryHashToken(
            new SpreadsheetViewportSelection(
                ROW_RANGE_1_3
            )
        )
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/unfreeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    },
    "Invalid token: \"unfreeze\"",
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                ROW_RANGE
            )
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:2",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": ROW_SELECT,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/top",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                ROW_RANGE,
                SpreadsheetViewportSelectionAnchor.TOP
            )
        )
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/bottom",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                ROW_RANGE,
                SpreadsheetViewportSelectionAnchor.BOTTOM
            )
        )
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/delete",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowDeleteHistoryHashToken(
            new SpreadsheetViewportSelection(
                ROW_RANGE
            )
        )
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/insert-after/1",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(
            new SpreadsheetViewportSelection(ROW_RANGE),
            1
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/insert-before/2",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(
            new SpreadsheetViewportSelection(ROW_RANGE),
            2
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/row/2:3/menu",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetColumnOrRowMenuHistoryHashToken(
            new SpreadsheetViewportSelection(
                ROW_RANGE
            ),
            CONTEXT_MENU
        )
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
        "selection": ROW_SELECT,
        "select": true,
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
    "/spreadsheet-id-123/spreadsheet-name-456/select/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"settings\""
);


testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": SETTINGS_NOTHING,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/!invalid",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"!invalid\""
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/background-color",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSelectHistoryHashToken(
            TextStyle.BACKGROUND_COLOR,
            null
        )
    }
);

const COLOR_STRING = "#012345";
const COLOR = Color.parse(COLOR_STRING);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/background-color/",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            TextStyle.BACKGROUND_COLOR,
            null
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/background-color/" + COLOR_STRING,
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            TextStyle.BACKGROUND_COLOR,
            COLOR
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/background-color/%23012345",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            TextStyle.BACKGROUND_COLOR,
            COLOR
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/border-bottom-color/" + COLOR_STRING,
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            TextStyle.BORDER_BOTTOM_COLOR,
            COLOR
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/border-bottom-style/DASHED",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            TextStyle.BORDER_BOTTOM_STYLE,
            BorderStyle.DASHED
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/border-bottom-width/25.75px",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            TextStyle.BORDER_BOTTOM_WIDTH,
            new PixelLength(25.75)
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/hyphens/AUTO",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            TextStyle.HYPHENS,
            Hyphens.AUTO
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/currency-symbol/AUD",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            SpreadsheetMetadata.CURRENCY_SYMBOL,
            "AUD"
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/date-format-pattern/YY%2FMM%2FDD",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            SpreadsheetMetadata.DATE_FORMAT_PATTERN,
            new SpreadsheetDateFormatPattern("YY/MM/DD")
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/date-parse-patterns/YY%2FMM%2FDD",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            SpreadsheetMetadata.DATE_PARSE_PATTERNS,
            new SpreadsheetDateParsePatterns("YY/MM/DD")
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/date-time-offset/123456",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            SpreadsheetMetadata.DATETIME_OFFSET,
            123456
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/date-time-format-pattern/YY%2FMM%2FDD%20HH:MM:SS",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            SpreadsheetMetadata.DATETIME_FORMAT_PATTERN,
            new SpreadsheetDateTimeFormatPattern("YY/MM/DD HH:MM:SS")
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/date-time-parse-patterns/YY%2FMM%2FDD%20HH:MM:SS",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            SpreadsheetMetadata.DATETIME_PARSE_PATTERNS,
            new SpreadsheetDateTimeParsePatterns("YY/MM/DD HH:MM:SS")
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/decimal-separator/,",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            SpreadsheetMetadata.DECIMAL_SEPARATOR,
            ","
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/expression-number-kind/BIG_DECIMAL",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            SpreadsheetMetadata.EXPRESSION_NUMBER_KIND,
            ExpressionNumberKind.BIG_DECIMAL
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/precision/12",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            SpreadsheetMetadata.PRECISION,
            12
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/rounding-mode/CEILING",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            SpreadsheetMetadata.ROUNDING_MODE,
            RoundingMode.CEILING
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/text-format-pattern/@@",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            SpreadsheetMetadata.TEXT_FORMAT_PATTERN,
            new SpreadsheetTextFormatPattern("@@")
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/time-format-pattern/HH:MM:SS",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            SpreadsheetMetadata.TIME_FORMAT_PATTERN,
            new SpreadsheetTimeFormatPattern("HH:MM:SS")
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/settings/time-parse-patterns/HH:MM:SS",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            SpreadsheetMetadata.TIME_PARSE_PATTERNS,
            new SpreadsheetTimeParsePatterns("HH:MM:SS")
        ),
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/freeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_FREEZE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/freeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"freeze\"",
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1:C3/freeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetCellFreezeHistoryHashToken(
            new SpreadsheetViewportSelection(CELL_RANGE_A1C3)
        )
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B1:C3/freeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    },
    "Invalid token: \"freeze\"",
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/unfreeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": CELL_UNFREEZE,
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B2/unfreeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
    },
    "Invalid token: \"unfreeze\"",
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1:C3/unfreeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetCellUnFreezeHistoryHashToken(
            new SpreadsheetViewportSelection(
                CELL_RANGE_A1C3
            )
        )
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/B1:C3/unfreeze",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME
    },
    "Invalid token: \"unfreeze\"",
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/style/font-style",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetCellStyleEditHistoryHashToken(
            new SpreadsheetViewportSelection(
                CELL
            ),
            TextStyle.FONT_STYLE,
        )
    }
);

testParseAndStringify(
    "/spreadsheet-id-123/spreadsheet-name-456/cell/A1/style/font-style/ITALIC",
    {
        "spreadsheet-id": "spreadsheet-id-123",
        "spreadsheet-name": SPREADSHEET_NAME,
        "selection": new SpreadsheetCellStyleSaveHistoryHashToken(
            new SpreadsheetViewportSelection(
                CELL
            ),
            TextStyle.FONT_STYLE,
            FontStyle.ITALIC
        )
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
            expect(errors)
                .toStrictEqual([expectedError]);
        }
    });

    test("stringify " + stringify(expected), () => {
        const string = SpreadsheetHistoryHash.stringify(expected);

        expect(SpreadsheetHistoryHash.parse(string, e => {
            throw new Error(e)
        })).toStrictEqual(expected);
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
    "/123abc/Untitled4567/name",
    {},
    "/123abc/Untitled4567/name"
);

testMerge(
    "/123abc/Untitled45678",
    {
        "spreadsheet-name-edit": NAME_EDIT,
    },
    "/123abc/Untitled45678/name"
);

testMerge(
    "/123abc/Untitled4567890",
    {
        "spreadsheet-name-edit": NAME_SAVE,
    },
    "/123abc/Untitled4567890/name/new-spreadsheet-name-789"
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
        "spreadsheet-name-edit": NAME_EDIT,
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
        "spreadsheet-name-edit": NAME_EDIT,
    },
    "/123abc/Untitled456/name"
);

testMerge(
    "/123abc/Untitled456/name",
    {
        "spreadsheet-name-edit": NAME_SAVE,
    },
    "/123abc/Untitled456/name/new-spreadsheet-name-789"
);

testMerge(
    "/123abc/Untitled4567890a/name/new-spreadsheet-name-789",
    {
        "spreadsheet-name-edit": null,
    },
    "/123abc/Untitled4567890a"
);

testMerge(
    "/123abc/Untitled456/name",
    {
        "spreadsheet-name-edit": null,
    },
    "/123abc/Untitled456"
);

testMerge(
    "/123abc/Untitled456/name",
    {
        "selection": CELL_SELECT
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
        "selection": CELL_FORMULA_LOAD_EDIT,
    },
    "/123abc/Untitled456/cell/A1/formula"
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
        "selection": new SpreadsheetCellSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                SpreadsheetCellReference.parse("B2")
            )
        )
    },
    "/123abc/Untitled456/cell/B2"
);

testMerge(
    "/123abc/Untitled456/cell/B2",
    {
        "selection": new SpreadsheetCellFormulaEditHistoryHashToken(
            new SpreadsheetViewportSelection(
                SpreadsheetCellReference.parse("C3")
            )
        )
    },
    "/123abc/Untitled456/cell/C3/formula"
);

testMerge(
    "/123abc/Untitled456/cell/A1/formula",
    {},
    "/123abc/Untitled456/cell/A1/formula"
);

testMerge(
    "/123abc/Untitled456/cell/A1/formula",
    {
        "selection": new SpreadsheetCellFormulaEditHistoryHashToken(
            new SpreadsheetViewportSelection(
                SpreadsheetCellReference.parse("B2")
            )
        )
    },
    "/123abc/Untitled456/cell/B2/formula"
);

testMerge(
    "/123abc/Untitled456/cell/A1",
    {
        "selection": null,
    },
    "/123abc/Untitled456"
);

testMerge(
    "/123abc/Untitled456/cell/A2",
    {
        "spreadsheet-name-edit": NAME_EDIT,
    },
    "/123abc/Untitled456/name"
);

testMerge(
    "/123abc/Untitled456/cell/A2/formula",
    {
        "spreadsheet-name-edit": null,
    },
    "/123abc/Untitled456/cell/A2/formula"
);

testMerge(
    "/123abc/Untitled456/cell/A2/formula",
    {
        "spreadsheet-name-edit": NAME_EDIT,
    },
    "/123abc/Untitled456/name"
);

testMerge(
    "/123abc/Untitled456/cell/A1",
    {
        "selection": new SpreadsheetCellSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                CELL_RANGE
            )
        )
    },
    "/123abc/Untitled456/cell/C3:D4"
);

testMerge(
    "/123abc/Untitled456/cell/A1/formula",
    {
        "selection": new SpreadsheetCellSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                CELL_RANGE
            )
        )
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
        "spreadsheet-name-edit": NAME_EDIT,
    },
    "/123abc/Untitled456/name"
);

// column...........................................................................................................

testMerge(
    "/123abc/Untitled456",
    {
        selection: COLUMN_SELECT,
    },
    "/123abc/Untitled456/column/B"
);

testMerge(
    "/123abc/Untitled456/column/B",
    {
        selection: new SpreadsheetColumnOrRowSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE
            )
        ),
    },
    "/123abc/Untitled456/column/B:C"
);

testMerge(
    "/123abc/Untitled456/column/B",
    {
        "selection": new SpreadsheetColumnOrRowSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE,
                SpreadsheetViewportSelectionAnchor.LEFT
            )
        )
    },
    "/123abc/Untitled456/column/B:C/left"
);

testMerge(
    "/123abc/Untitled456/column/B:D",
    {
        selection: COLUMN_SELECT,
    },
    "/123abc/Untitled456/column/B"
);

testMerge(
    "/123abc/Untitled456/column/B",
    {
        "selection": COLUMN_DELETE,
    },
    "/123abc/Untitled456/column/B/delete"
);

testMerge(
    "/123abc/Untitled456/column/A",
    {
        "selection": COLUMN_FREEZE,
    },
    "/123abc/Untitled456/column/A/freeze"
);

testMerge(
    "/123abc/Untitled456/column/A:B",
    {
        "selection": new SpreadsheetColumnOrRowFreezeHistoryHashToken(
            new SpreadsheetViewportSelection(
                SpreadsheetColumnReferenceRange.parse("A:B")
            )
        ),
    },
    "/123abc/Untitled456/column/A:B/freeze"
);

testMerge(
    "/123abc/Untitled456/column/B",
    {
        "selection": COLUMN_HIDDEN_TRUE,
    },
    "/123abc/Untitled456/column/B/hidden/true"
);

testMerge(
    "/123abc/Untitled456/column/B",
    {
        "selection": COLUMN_MENU,
    },
    "/123abc/Untitled456/column/B/menu"
);

testMerge(
    "/123abc/Untitled456/column/B:C",
    {
        "selection": new SpreadsheetColumnOrRowDeleteHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE
            )
        ),
    },
    "/123abc/Untitled456/column/B:C/delete"
);

testMerge(
    "/123abc/Untitled456/column/B:C",
    {
        "selection": new SpreadsheetColumnOrRowSaveHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE
            ),
            "hidden",
            true
        ),
    },
    "/123abc/Untitled456/column/B:C/hidden/true"
);

testMerge(
    "/123abc/Untitled456/column/B:C",
    {
        "selection": new SpreadsheetColumnOrRowMenuHistoryHashToken(
            new SpreadsheetViewportSelection(
                COLUMN_RANGE
            ),
            CONTEXT_MENU
        ),
    },
    "/123abc/Untitled456/column/B:C/menu"
);

// row...........................................................................................................

testMerge(
    "/123abc/Untitled456",
    {
        selection: ROW_SELECT,
    },
    "/123abc/Untitled456/row/2"
);

testMerge(
    "/123abc/Untitled456/row/2",
    {
        selection: new SpreadsheetColumnOrRowSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                ROW_RANGE
            )
        ),
    },
    "/123abc/Untitled456/row/2:3"
);

testMerge(
    "/123abc/Untitled456/row/2",
    {
        "selection": new SpreadsheetColumnOrRowSelectHistoryHashToken(
            new SpreadsheetViewportSelection(
                ROW_RANGE,
                SpreadsheetViewportSelectionAnchor.TOP
            )
        )
    },
    "/123abc/Untitled456/row/2:3/top"
);

testMerge(
    "/123abc/Untitled456/row/2:3",
    {
        selection: ROW_SELECT,
    },
    "/123abc/Untitled456/row/2"
);

testMerge(
    "/123abc/Untitled456/row/45",
    {
        "selection": ROW_DELETE,
    },
    "/123abc/Untitled456/row/2/delete"
);

testMerge(
    "/123abc/Untitled456/row/45",
    {
        "selection": ROW_FREEZE,
    },
    "/123abc/Untitled456/row/1/freeze"
);

testMerge(
    "/123abc/Untitled456/row/45:67",
    {
        "selection": new SpreadsheetColumnOrRowFreezeHistoryHashToken(
            new SpreadsheetViewportSelection(
                SpreadsheetRowReferenceRange.parse("1:23")
            )
        ),
    },
    "/123abc/Untitled456/row/1:23/freeze"
);

testMerge(
    "/123abc/Untitled456/row/1",
    {
        "selection": ROW_FREEZE,
    },
    "/123abc/Untitled456/row/1/freeze"
);

testMerge(
    "/123abc/Untitled456/row/1:23",
    {
        "selection": new SpreadsheetColumnOrRowFreezeHistoryHashToken(
            new SpreadsheetViewportSelection(
                SpreadsheetRowReferenceRange.parse("1:2")
            )
        )
    },
    "/123abc/Untitled456/row/1:2/freeze"
);

testMerge(
    "/123abc/Untitled456/row/45",
    {
        "selection": ROW_MENU,
    },
    "/123abc/Untitled456/row/2/menu"
);

testMerge(
    "/123abc/Untitled456/row/45:67",
    {
        "selection": ROW_DELETE,
    },
    "/123abc/Untitled456/row/2/delete"
);

testMerge(
    "/123abc/Untitled456/row/2",
    {
        "selection": ROW_HIDDEN_TRUE,
    },
    "/123abc/Untitled456/row/2/hidden/true"
);

testMerge(
    "/123abc/Untitled456/row/45:67",
    {
        "selection": ROW_HIDDEN_TRUE,
    },
    "/123abc/Untitled456/row/2/hidden/true"
);

testMerge(
    "/123abc/Untitled456/row/45:67",
    {
        "selection": new SpreadsheetColumnOrRowMenuHistoryHashToken(
            new SpreadsheetViewportSelection(
                SpreadsheetRowReferenceRange.parse("45:67"),
            ),
            CONTEXT_MENU
        ),
    },
    "/123abc/Untitled456/row/45:67/menu"
);

// label...........................................................................................................

testMerge(
    "/123abc456/Untitled456",
    {
        "label": new SpreadsheetLabelMappingEditHistoryHashToken(
            SpreadsheetLabelName.parse("LABEL123")
        ),
    },
    "/123abc456/Untitled456/label/LABEL123"
);

testMerge(
    "/123abc456/Untitled456",
    {
        "label": new SpreadsheetLabelMappingDeleteHistoryHashToken(SpreadsheetLabelName.parse("LABEL123")),
    },
    "/123abc456/Untitled456/label/LABEL123/delete"
);

testMerge(
    "/123abc/Untitled456/label/Label123",
    {
        "label": LABEL_DELETE,
    },
    "/123abc/Untitled456/label/Label123/delete"
);

testMerge(
    "/123abc/Untitled456/label/LabelOld",
    {
        "label": LABEL_DELETE,
    },
    "/123abc/Untitled456/label/Label123/delete"
);

testMerge(
    "/123abc/Untitled456/label/LabelOld/delete",
    {
        "label": LABEL_EDIT,
    },
    "/123abc/Untitled456/label/Label123"
);

testMerge("/123abc/Untitled456/label/LabelOld/delete",
    {
        "label": LABEL_EDIT,
    },
    "/123abc/Untitled456/label/Label123"
);

testMerge(
    "/123abc/Untitled456/label/Label123",
    {
        "label": LABEL_SAVE,
    },
    "/123abc/Untitled456/label/Label123/save/Label999/C3:D4"
);

testMerge(
    "/123abc/Untitled456/label/LabelOld",
    {
        "label": LABEL_SAVE,
    },
    "/123abc/Untitled456/label/Label123/save/Label999/C3:D4"
);

testMerge(
    "/123abc/Untitled456/label/Label123/save/Label456/Z9",
    {
        "label": LABEL_SAVE,
    },
    "/123abc/Untitled456/label/Label123/save/Label999/C3:D4"
);

testMerge("/123abc/Untitled456/label/LabelOld/save/new/A1",
    {
        "label": LABEL_EDIT,
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
        "spreadsheet-name-edit": NAME_EDIT,
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
        "settings": SETTINGS_NOTHING
    },
    "/123abc/Untitled456/settings"
);

testMerge(
    "/123abc/Untitled456/settings",
    {
        "settings": new SpreadsheetMetadataSelectHistoryHashToken(
            SpreadsheetSettingsWidgetHistoryHashTokens.METADATA
        ),
    },
    "/123abc/Untitled456/settings/metadata"
);

testMerge(
    "/123abc/Untitled456/settings",
    {
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            TextStyle.COLOR,
            Color.parse("#123456")
        ),
    },
    "/123abc/Untitled456/settings/color/#123456"
);

testMerge(
    "/123abc/Untitled456/settings/metadata",
    {
        "settings": new SpreadsheetMetadataSelectHistoryHashToken(
            SpreadsheetSettingsWidgetHistoryHashTokens.TEXT
        ),
    },
    "/123abc/Untitled456/settings/text"
);

testMerge(
    "/123abc/Untitled456/settings/color/#012345",
    {
        "settings": null,
    },
    "/123abc/Untitled456"
);

testMerge(
    "/123abc/Untitled456/settings/color/#012345",
    {
        "settings": new SpreadsheetMetadataSaveHistoryHashToken(
            TextStyle.COLOR,
            Color.parse("#abcdef")
        ),
    },
    "/123abc/Untitled456/settings/color/#abcdef"
);

testMerge(
    "/123abc/Untitled456/name",
    {
        "settings": null,
    },
    "/123abc/Untitled456/name"
);

testMerge(
    "/123abc/Untitled456/cell/A1",
    {
        "selection": CELL_DELETE,
    },
    "/123abc/Untitled456/cell/A1/delete"
);

testMerge(
    "/123abc/Untitled456/cell/A123",
    {
        "settings": SpreadsheetMetadataSelectHistoryHashToken.NOTHING,
    },
    "/123abc/Untitled456/cell/A123/settings"
);

testMerge(
    "/123abc/Untitled456/cell/A124/delete",
    {
        "settings": SpreadsheetMetadataSelectHistoryHashToken.NOTHING,
    },
    "/123abc/Untitled456/cell/A124/delete"
);

testMerge(
    "/123abc/Untitled456/column/ABC",
    {
        "settings": SpreadsheetMetadataSelectHistoryHashToken.NOTHING,
    },
    "/123abc/Untitled456/column/ABC/settings"
);

testMerge(
    "/123abc/Untitled456/column/ABC/delete",
    {
        "settings": SpreadsheetMetadataSelectHistoryHashToken.NOTHING,
    },
    "/123abc/Untitled456/column/ABC/delete"
);

testMerge(
    "/123abc/Untitled456",
    {
        "selection": CELL_FORMULA_LOAD_EDIT,
    },
    "/123abc/Untitled456/cell/A1/formula"
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
                "select": CELL_SELECT,
                "selection": CELL_FORMULA_LOAD_EDIT,
            }
        )
    ).toStrictEqual({
        "_tx-id": 0,
        "spreadsheet-id": ID,
        "spreadsheet-name": SPREADSHEET_NAME,
    });
});