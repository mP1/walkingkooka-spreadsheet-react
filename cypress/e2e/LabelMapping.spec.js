/// <reference types="cypress" />

import SpreadsheetCellReference from "../../src/spreadsheet/reference/cell/SpreadsheetCellReference.js";
import SpreadsheetLabelMappingWidget from "../../src/spreadsheet/reference/label/SpreadsheetLabelMappingWidget.js";
import SpreadsheetTesting from "./SpreadsheetTesting.js";
import SpreadsheetHistoryHashTokens from "../../src/spreadsheet/history/SpreadsheetHistoryHashTokens.js";

const A1 = SpreadsheetCellReference.parse("A1");
const B2 = SpreadsheetCellReference.parse("B2");
const C3 = SpreadsheetCellReference.parse("C3");

const LABEL = "Label123";

const SELECTED_COLOR = "rgb(68, 68, 68)";

describe(
    "Label Mapping",
    () => {

        const testing = new SpreadsheetTesting(cy);

        beforeEach(() => {
            cy.visit('/');

            testing.spreadsheetEmptyReady();
        });

        it("Enter hash", () => {
            testing.hashLabel();

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text"
            );
        });

        it("Label text field has focus", () => {
            testing.hashLabel();

            testing.labelMappingLabelTextField()
                .should("have.focus");
        });

        it("Label tabbing", () => {
            testing.hashLabel();

            testing.labelMappingReferenceTextField()
                .type("{selectall}A1");

            testing.labelMappingLabelTextField()
                .click()
                .should("have.focus")
                .tab();

            testing.labelMappingReferenceTextField()
                .should("have.focus")
                .tab();

            testing.labelMappingLabelSaveButton()
                .should("have.focus")
                .tab();

            testing.labelMappingLabelDeleteButton()
                .should("have.focus")
                .tab();

            // next tab advances to give focus to entire dialog.
            // next tab gives focus to close
        });

        // LABEL MAPPING LABEL..........................................................................................

        it("Edit label empty text", () => {
            testing.hashLabel();

            testing.labelMappingLabelTextField()
                .type("{selectall}{backspace}");

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                "",
                "Missing text",
                "",
                "Missing text"
            );
        });

        it("Edit label invalid text", () => {
            testing.hashLabel();

            const labelText = "!InvalidLabel";

            testing.labelMappingLabelTextField()
                .type("{selectall}" + labelText);

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                labelText,
                "Invalid character '!' at 0",
                "",
                "Missing text"
            );
        });

        it("Edit label invalid text #2", () => {
            testing.hashLabel();

            const labelText = "I!nvalidLabel";

            testing.labelMappingLabelTextField()
                .type("{selectall}" + labelText);

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                labelText,
                "Invalid character '!' at 1",
                "",
                "Missing text"
            );
        });

        it("Edit label text, missing reference ENTER", () => {
            testing.hashLabel();

            const labelText = "Label456";

            testing.labelMappingLabelTextField()
                .type("{selectall}" + labelText + "{enter}");

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                labelText,
                "",
                "",
                "Missing text"
            );
        });

        it("Edit label text, missing reference SAVE", () => {
            testing.hashLabel();

            const labelText = "Label456";

            testing.labelMappingLabelTextField()
                .type("{selectall}" + labelText);

            testing.labelMappingLabelSaveButton()
                .should("be.disabled");

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                labelText,
                "",
                "",
                "Missing text"
            );
        });

        // LABEL MAPPING REFERENCE......................................................................................

        it("Edit reference invalid text", () => {
            testing.hashLabel();

            const referenceText = "!InvalidReference";

            testing.labelMappingReferenceTextField()
                .type("{selectall}" + referenceText);

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                "Invalid character '!' at 0"
            );
        });

        it("Edit reference invalid text #2", () => {
            testing.hashLabel();

            const referenceText = "A!InvalidReference";

            testing.labelMappingReferenceTextField()
                .type("{selectall}" + referenceText);

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                "Invalid character '!' at 1"
            );
        });

        it("Edit reference same label", () => {
            testing.hashLabel();

            const referenceText = LABEL;

            testing.labelMappingReferenceTextField()
                .type("{selectall}" + referenceText);

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                "Reference \"" + LABEL + "\" must be different to label \"" + LABEL + "\""
            );
        });

        it("Edit reference", () => {
            testing.hashLabel();

            const referenceText = "B2";
            testing.labelMappingReferenceTextField()
                .type("{selectall}" + referenceText);

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                ""
            );
        });

        // special keys and buttons.....................................................................................

        it("Label TextField ESC", () => {
            testing.hashLabel();

            testing.labelMappingReferenceTextField()
                .type("{selectall}B2");

            testing.labelMappingLabelTextField()
                .type("{esc}");

            testing.hashLabel();

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text",
            );
        });

        it("Label mapping reference TextField ESC", () => {
            testing.hashLabel();

            testing.labelMappingReferenceTextField()
                .type(B2 + "{esc}");

            testing.hashLabel();

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text",
            );
        });

        it("Edit label/reference label TextField ENTER", () => {
            testing.hashLabel();

            const referenceText = "B2";
            testing.labelMappingReferenceTextField()
                .type("{selectall}" + referenceText);

            const labelText = "Label456";

            testing.labelMappingLabelTextField()
                .type("{selectall}" + labelText);

            testing.labelMappingLabelSaveButton().click();

            testing.labelMappingDialogClosedCheck();

            labelMappingOpenDialogAndCheck(
                "Label: " + labelText,
                labelText,
                "",
                referenceText,
                ""
            );
        });

        it("Edit label/reference reference TextField ENTER", () => {
            testing.hashLabel();

            const referenceText = "B2";
            testing.labelMappingReferenceTextField()
                .type("{selectall}" + referenceText + "{Enter}");

            testing.labelMappingLabelSaveButton().click();

            testing.labelMappingDialogClosedCheck();

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                ""
            );
        });

        it("Edit label/reference click SAVE button", () => {
            testing.hashLabel();

            const referenceText = "B2";
            testing.labelMappingReferenceTextField()
                .type("{selectall}" + referenceText);

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingDialogClosedCheck();

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                ""
            );
        });

        it("Edit label/reference click DELETE button", () => {
            testing.hashLabel();

            const referenceText = "b2";
            testing.labelMappingReferenceTextField()
                .type("{selectall}" + referenceText);

            testing.labelMappingLabelSaveButton()
                .click();

            testing.historyWait();

            testing.hashAppendAfterSpreadsheetName("/label/Label123")

            testing.labelMappingLabelDeleteButton()
                .click();

            testing.labelMappingDialogClosedCheck();

            testing.hashLabel();

            labelMappingOpenDialogAndCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text"
            );
        });

        it("Edit close BUTTON", () => {
            testing.hashLabel();

            testing.labelMappingLabelCloseButton()
                .click();

            testing.labelMappingDialogClosedCheck();

            testing.hash()
                .should("match", /^#\/.*\/Untitled$/);
        });

        it("Save, navigate to label", () => {
            const reference = B2;

            cy.window()
                .then((win) => {
                    const nonEmptySpreadsheetHash = win.location.hash;

                    // create a new label
                    testing.hashEnter(nonEmptySpreadsheetHash + "/label/Label456");

                    testing.hash()
                        .should("match", /^#\/.*\/Untitled\/label\/Label456$/);

                    testing.labelMappingReferenceTextField()
                        .type("{selectall}" + reference.toString());

                    testing.labelMappingLabelSaveButton()
                        .click();

                    testing.labelMappingDialogClosedCheck();

                    // navigate to label's formula
                    testing.hashEnter(nonEmptySpreadsheetHash + "/cell/Label456/formula");

                    testing.hash()
                        .should("match", /^#\/.*\/Untitled\/cell\/Label456\/formula$/);

                    testing.wait(50); // wait for formula text box to become enabled.

                    testing.formulaTextEnterAndSave("=4");

                    testing.cellFormattedTextCheck(reference, "4.");
                });
        });

        it("Save, hover shows tooltip", () => {
            // create a new label
            testing.hashAppend("/label/HoverLabel");

            testing.labelMappingReferenceTextField()
                .type("{selectall}A1");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingDialogClosedCheck();

            testing.getById(A1.viewportTooltipId())
                .should("not.exist");

            testing.cell(A1)
                .trigger("mouseover");

            testing.getById(A1.viewportTooltipId())
                .should("exist")
                .should("contain.text", "HoverLabel");
        });

        it("Save, hover shows several tooltip", () => {
            // create a new label
            testing.hashAppend("/label/HoverLabel1");

            testing.labelMappingReferenceTextField()
                .type("{selectall}A1");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingDialogClosedCheck();

            // create a new label #2
            testing.hashAppend("/label/HoverLabel2");

            testing.labelMappingReferenceTextField()
                .type("{selectall}A1");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingDialogClosedCheck();

            testing.getById(A1.viewportTooltipId())
                .should("not.exist");

            testing.cell(A1)
                .trigger("mouseover");

            testing.getById(A1.viewportTooltipId())
                .should("exist")
                .should("contain.text", "HoverLabel1, HoverLabel2");
        });

        it("Save, hover shows several tooltip case insensitive label sort", () => {
            // create a new label
            testing.hashAppendAfterSpreadsheetName("/label/HoverLabel1/save/HoverLabel1/A1");
            testing.labelMappingSaveWait();

            testing.hashAppendAfterSpreadsheetName("/label/HOVERLABEL2/save/HOVERLABEL2/A1");
            testing.labelMappingSaveWait();

            testing.hashAppendAfterSpreadsheetName("/label/HoverLabel3/save/HoverLabel3/A1");
            testing.labelMappingSaveWait();

            testing.getById(A1.viewportTooltipId())
                .should("not.exist");

            testing.cell(A1)
                .trigger("mouseover");

            testing.getById(A1.viewportTooltipId())
                .should("exist")
                .should("contain.text", "HoverLabel1, HOVERLABEL2, HoverLabel3");
        });

        it("Save label with range, hover shows tooltip", () => {
            // create a new label
            testing.hashAppend("/label/HoverLabel");

            testing.labelMappingReferenceTextField()
                .type("{selectall}A1:B2");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingDialogClosedCheck();

            testing.getById(A1.viewportTooltipId())
                .should("not.exist");

            testing.cell(A1)
                .trigger("mouseover");

            testing.getById(A1.viewportTooltipId())
                .should("exist")
                .should("contain.text", "HoverLabel");

            testing.cell(B2)
                .trigger("mouseover");

            testing.getById(B2.viewportTooltipId())
                .should("exist")
                .should("contain.text", "HoverLabel");
        });

        it("History hash navigate to label", () => {
            // create a new label
            testing.hashAppend("/label/NavigateToLabel123");

            testing.labelMappingReferenceTextField()
                .type("{selectall}A1");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingDialogClosedCheck();

            // navigate
            testing.hashAppend("/cell/NavigateToLabel123");

            testing.cell(A1)
                .should("have.focus");

            testing.column("A")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("1")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Label mapping update, refreshes viewport", () => {
            testing.cellFormulaEnterAndSave(A1, "=11");
            testing.cellFormulaEnterAndSave(B2, "=22");

            // create a new label
            testing.hashAppendAfterSpreadsheetName("/label/MovingLabel");

            testing.labelMappingReferenceTextField()
                .type("{selectall}A1");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingDialogClosedCheck();

            testing.cellFormulaEnterAndSave(C3, "=4*MovingLabel");

            testing.cellFormattedTextCheck(C3, "44."); // 4 * 11

            // update existing label
            testing.hashAppendAfterSpreadsheetName("/label/MovingLabel");

            testing.labelMappingReferenceTextField()
                .type("{selectall}B2{enter}");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingDialogClosedCheck();

            testing.cellFormattedTextCheck(C3, "88."); // 4 * 22
        });

        function labelMappingOpenDialogAndCheck(title,
                                                labelText,
                                                labelHelperText,
                                                referenceText,
                                                referenceHelperText) {
            testing.hashAppendAfterSpreadsheetName("/" + SpreadsheetHistoryHashTokens.LABEL + "/" + labelText);

            testing.getById(SpreadsheetLabelMappingWidget.DIALOG_TITLE_ID)
                .contains(title);

            testing.labelMappingLabelTextField()
                .should("have.value", labelText);

            const labelHelperTextId = SpreadsheetLabelMappingWidget.LABEL_TEXT_FIELD_HELPER_TEXT_ID;
            if(labelHelperText){
                testing.getById(labelHelperTextId)
                    .should("have.text", labelHelperText);
            }else {
                testing.getById(labelHelperTextId)
                    .should("not.exist");
            }

            testing.labelMappingReferenceTextField()
                .should("have.value", referenceText);

            const referenceHelperTextId = SpreadsheetLabelMappingWidget.REFERENCE_TEXT_FIELD_HELPER_TEXT_ID;
            if(referenceHelperText){
                testing.getById(referenceHelperTextId)
                    .should("have.text", referenceHelperText);
            }else {
                testing.getById(referenceHelperTextId)
                    .should("not.exist");
            }
        }
    }
);