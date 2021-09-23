/// <reference types="cypress" />

import SpreadsheetCellReference from "../../src/spreadsheet/reference/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "../../src/spreadsheet/reference/SpreadsheetColumnReference.js";
import SpreadsheetLabelMappingWidget from "../../src/spreadsheet/reference/SpreadsheetLabelMappingWidget.js";
import SpreadsheetTesting from "./SpreadsheetTesting.js";

const A1 = SpreadsheetCellReference.parse("A1");
const A2 = SpreadsheetCellReference.parse("A2");
const A3 = SpreadsheetCellReference.parse("A3");
const B1 = SpreadsheetCellReference.parse("B1");
const B2 = SpreadsheetCellReference.parse("B2");
const B3 = SpreadsheetCellReference.parse("B3");
const C2 = SpreadsheetCellReference.parse("C2");
const C3 = SpreadsheetCellReference.parse("C3");
const D4 = SpreadsheetCellReference.parse("D4");
const E5 = SpreadsheetCellReference.parse("E5");

const LABEL = "Label123";

const FORMULA_TEXT_CLICK_WAIT = 50;

const SELECTED_COLOR = "rgb(68, 68, 68)";

context(
    "General app usage",
    () => {

        const testing = new SpreadsheetTesting(cy);

        beforeEach(() => {
            cy.visit('/');

            testing.spreadsheetEmptyReady();
        });

        // SPREADSHEET NAME ...................................................................................................

        it("Spreadsheet name edit & ESCAPE, changes lost", () => {
            testing.spreadsheetNameClick();

            // type the new name in
            testing.spreadsheetName()
                .type("{selectall}UpdatedSpreadsheetName456{esc}");

            testing.wait();

            testing.spreadsheetName()
                .should("have.text", "Untitled");

            cy.title()
                .should("eq", "Untitled");

            testing.hash()
                .should('match', /.*\/Untitled/) // => true
        });

        it("Spreadsheet name edit & blur changes lost", () => {
            testing.spreadsheetNameClick();

            // type the new name in
            testing.spreadsheetName()
                .type("{selectall}UpdatedSpreadsheetName456")
                .blur();

            testing.wait();

            testing.spreadsheetName()
                .should("have.text", "Untitled");

            cy.title()
                .should("eq", "Untitled");

            testing.hash()
                .should('match', /.*\/Untitled/) // => true
        });

        it("Spreadsheet name clear & save fails", () => {
            testing.spreadsheetNameClick();

            // type the new name in
            testing.spreadsheetName()
                .type("{selectall}{backspace}{enter}");

            testing.wait();

            testing.spreadsheetName()
                .should("have.text", "Untitled");
            cy.title()
                .should("eq", "Untitled");
            testing.hash()
                .should('match', /.*\/Untitled/) // => true
        });

        it("Spreadsheet name edit & save", () => {
            testing.spreadsheetNameClick();

            const updatedSpreadsheetName = "SpreadsheetName234"; // easier to use in regex below

            // type the new name in
            testing.spreadsheetName()
                .type("{selectall}" + updatedSpreadsheetName + "{enter}");

            testing.wait();

            testing.spreadsheetName()
                .should("have.text", updatedSpreadsheetName);

            // verify hash and title updated to include $updateSpreadsheetName
            cy.title()
                .should("eq", updatedSpreadsheetName.toString());

            testing.hash()
                .should('match', /.*\/SpreadsheetName234/) // => true
        });

        // LABEL........................................................................................................

        it("Label mapping enter hash", () => {
            testing.hashLabel();

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text"
            );
        });

        it("Label mapping label text field has focus", () => {
            testing.hashLabel();

            testing.labelMappingLabelTextField()
                .should("have.focus");
        });

        it("Label mapping label tabbing", () => {
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

        it("Label mapping hash show label mapping after editing name", () => {
            testing.spreadsheetNameClick();

            testing.spreadsheetName()
                .type("{selectall}Lost")
                .blur();

            cy.window()
                .then((win) => {
                    win.location.hash = win.location.hash + "/label/Label123";
                });

            testing.hash()
                .should('match', /.*\/Untitled\/label\/Label123/);

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text"
            );
        });

        // LABEL MAPPING LABEL..........................................................................................

        it("Label mapping edit label empty text", () => {
            testing.hashLabel();

            testing.labelMappingLabelTextField()
                .type("{selectall}{backspace}");

            labelMappingDialogCheck(
                "Label: " + LABEL,
                "",
                "Missing text",
                "",
                "Missing text"
            );
        });

        it("Label mapping edit label invalid text", () => {
            testing.hashLabel();

            const labelText = "!InvalidLabel";

            testing.labelMappingLabelTextField()
                .type("{selectall}" + labelText);

            labelMappingDialogCheck(
                "Label: " + LABEL,
                labelText,
                "Invalid character '!' at 0",
                "",
                "Missing text"
            );
        });

        it("Label mapping edit label invalid text #2", () => {
            testing.hashLabel();

            const labelText = "I!nvalidLabel";

            testing.labelMappingLabelTextField()
                .type("{selectall}" + labelText);

            labelMappingDialogCheck(
                "Label: " + LABEL,
                labelText,
                "Invalid character '!' at 1",
                "",
                "Missing text"
            );
        });

        it("Label mapping edit label text, missing reference ENTER", () => {
            testing.hashLabel();

            const labelText = "Label456";

            testing.labelMappingLabelTextField()
                .type("{selectall}" + labelText + "{enter}");

            labelMappingDialogCheck(
                "Label: " + LABEL,
                labelText,
                "",
                "",
                "Missing text"
            );
        });

        it("Label mapping edit label text, missing reference SAVE", () => {
            testing.hashLabel();

            const labelText = "Label456";

            testing.labelMappingLabelTextField()
                .type("{selectall}" + labelText);

            testing.labelMappingLabelSaveButton()
                .should("be.disabled");

            labelMappingDialogCheck(
                "Label: " + LABEL,
                labelText,
                "",
                "",
                "Missing text"
            );
        });

        // LABEL MAPPING REFERENCE......................................................................................

        it("Label mapping edit reference invalid text", () => {
            testing.hashLabel();

            const referenceText = "!InvalidReference";

            testing.labelMappingReferenceTextField()
                .type(referenceText);

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                "Invalid character '!' at 0"
            );
        });

        it("Label mapping edit reference invalid text #2", () => {
            testing.hashLabel();

            const referenceText = "A!InvalidReference";

            testing.labelMappingReferenceTextField()
                .type(referenceText);

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                "Invalid character '!' at 1"
            );
        });

        it("Label mapping edit reference same label", () => {
            testing.hashLabel();

            const referenceText = LABEL;

            testing.labelMappingReferenceTextField()
                .type(referenceText);

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                "Reference \"" + LABEL + "\" must be different to label \"" + LABEL + "\""
            );
        });

        it("Label mapping edit reference", () => {
            testing.hashLabel();

            const referenceText = "B2";
            testing.labelMappingReferenceTextField()
                .type(referenceText);

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                ""
            );
        });

        // special keys and buttons.....................................................................................

        it("Label mapping label TextField ESC", () => {
            testing.hashLabel();

            testing.labelMappingReferenceTextField()
                .type("{selectall}B2");

            testing.labelMappingLabelTextField()
                .type("{esc}");

            testing.hashLabel();

            labelMappingDialogCheck(
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

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text",
            );
        });

        it("Label mapping edit label/reference label TextField ENTER", () => {
            testing.hashLabel();

            const referenceText = "B2";
            testing.labelMappingReferenceTextField()
                .type(referenceText);

            const labelText = "Label456";

            testing.labelMappingLabelTextField()
                .type("{selectall}" + labelText);

            testing.labelMappingLabelSaveButton().click();

            labelMappingDialogCheck(
                "Label: " + labelText,
                labelText,
                "",
                referenceText,
                ""
            );
        });

        it("Label mapping edit label/reference reference TextField ENTER", () => {
            testing.hashLabel();

            const referenceText = "B2";
            testing.labelMappingReferenceTextField()
                .type(referenceText + "{Enter}");

            testing.labelMappingLabelSaveButton().click();

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                ""
            );
        });

        it("Label mapping edit label/reference click SAVE button", () => {
            testing.hashLabel();

            const referenceText = "B2";
            testing.labelMappingReferenceTextField()
                .type(referenceText);

            testing.labelMappingLabelSaveButton()
                .click();

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                ""
            );
        });

        it("Label mapping edit label/reference click DELETE button", () => {
            testing.hashLabel();

            const referenceText = "b2";
            testing.labelMappingReferenceTextField()
                .type(referenceText);

            testing.labelMappingLabelSaveButton()
                .click();

            testing.hashLabel();

            testing.labelMappingLabelDeleteButton()
                .click();

            testing.hashLabel();

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text"
            );
        });

        it("Label mapping edit close BUTTON", () => {
            testing.hashLabel();

            testing.labelMappingLabelCloseButton()
                .click();

            testing.hash()
                .should('match', /.*\/Untitled/);
        });

        it("Label mapping save, navigate to label", () => {
            const reference = B2;

            cy.window()
                .then((win) => {
                    const nonEmptySpreadsheetHash = win.location.hash;

                    // create a new label
                    testing.hashEnter(nonEmptySpreadsheetHash + "/label/Label456");

                    testing.hash()
                        .should('match', /.*\/Untitled\/label\/Label456/);

                    testing.labelMappingReferenceTextField()
                        .type(reference.toString());

                    testing.labelMappingLabelSaveButton()
                        .click();

                    testing.labelMappingLabelCloseButton()
                        .click();

                    // navigate to label's formula
                    testing.hashEnter(nonEmptySpreadsheetHash + "/cell/Label456/formula");
                    testing.hash()
                        .should('match', /.*\/Untitled\/cell\/Label456\/formula/);

                    testing.formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type("{selectall}=4{enter}");

                    testing.cellFormattedTextCheck(reference, "4.");
                });
        });

        it("Label mapping save, hover shows tooltip", () => {
            // create a new label
            testing.hashAppend("/label/HoverLabel");

            testing.labelMappingReferenceTextField()
                .type("{selectall}A1");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingLabelCloseButton()
                .click();

            cy.get("#" + A1.viewportTooltipId())
                .should("not.exist");

            testing.cell(A1)
                .trigger("mouseover");

            cy.get("#" + A1.viewportTooltipId())
                .should("exist")
                .should("contain.text", "HoverLabel");
        });

        it("Label mapping save, hover shows several tooltip", () => {
            // create a new label
            testing.hashAppend("/label/HoverLabel1");

            testing.labelMappingReferenceTextField()
                .type("{selectall}A1");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingLabelCloseButton()
                .click();

            // create a new label #2
            testing.hashAppend("/label/HoverLabel2");

            testing.labelMappingReferenceTextField()
                .type("{selectall}A1");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingLabelCloseButton()
                .click();

            cy.get("#" + A1.viewportTooltipId())
                .should("not.exist");

            testing.cell(A1)
                .trigger("mouseover");

            cy.get("#" + A1.viewportTooltipId())
                .should("exist")
                .should("contain.text", "HoverLabel1, HoverLabel2");
        });

        it("Label mapping update, refreshes viewport", () => {
            testing.cellClick(A1);

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/A1/)

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=11{enter}");

            testing.cellClick(B2);

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B2/)

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=22{enter}")
                .blur();

            // create a new label
            testing.hashAppend("/label/MovingLabel");

            testing.labelMappingReferenceTextField()
                .type("{selectall}A1");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingLabelCloseButton()
                .click();

            testing.cellClick(C3);

            testing.hash().should('match', /.*\/Untitled\/cell\/C3/)

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=4*MovingLabel{enter}")
                .blur();

            testing.cellFormattedTextCheck(C3, "44."); // 4 * 11

            // update existing label
            testing.hashAppend("/label/MovingLabel");

            testing.labelMappingReferenceTextField()
                .type("{selectall}B2{enter}");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.cellFormattedTextCheck(C3, "88."); // 4 * 22
        });

        it("Label history hash navigate to label", () => {
            // create a new label
            testing.hashAppend("/label/NavigateToLabel123");

            testing.labelMappingReferenceTextField()
                .type("{selectall}A1");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingLabelCloseButton()
                .click();

            // navigate
            testing.hashAppend("/cell/NavigateToLabel123");

            testing.cell(A1)
                .should("have.focus");

            testing.column("A")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("1")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        function labelMappingDialogCheck(title,
                                         labelText,
                                         labelHelperText,
                                         referenceText,
                                         referenceHelperText) {
            cy.get("#" + SpreadsheetLabelMappingWidget.DIALOG_TITLE_ID)
                .contains(title);

            testing.labelMappingLabelTextField()
                .should("have.value", labelText);

            const labelHelperTextId = "#" + SpreadsheetLabelMappingWidget.LABEL_TEXT_FIELD_HELPER_TEXT_ID;
            if(labelHelperText){
                cy.get(labelHelperTextId)
                    .should("have.text", labelHelperText);
            }else {
                cy.get(labelHelperTextId)
                    .should("not.exist");
            }

            testing.labelMappingReferenceTextField()
                .should("have.value", referenceText);

            const referenceHelperTextId = "#" + SpreadsheetLabelMappingWidget.REFERENCE_TEXT_FIELD_HELPER_TEXT_ID;
            if(referenceHelperText){
                cy.get(referenceHelperTextId)
                    .should("have.text", referenceHelperText);
            }else {
                cy.get(referenceHelperTextId)
                    .should("not.exist");
            }
        }

        // CELL ........................................................................................................

        it("Cell viewport cell click", () => {
            testing.cellClick(B2);

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Cell viewport cell click after editing name", () => {
            testing.spreadsheetNameClick();

            testing.cellClick(B2);

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        // @see https://github.com/mP1/walkingkooka-spreadsheet-react/issues/1256
        it("Cell formula load then history hash save", () => {
            testing.cellClick(B2);

            testing.formulaText()
                .click();

            testing.hash().should('match', /.*\/Untitled\/cell\/B2\/formula/)

            testing.hashAppend("/save/=2*3")

            testing.cellFormattedTextCheck(B2, "6.");
        });

        it("Cell formula edit ENTER saves", () => {
            testing.cellClick(B2);

            testing.hash().should('match', /.*\/Untitled\/cell\/B2/)

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=1+2+3{enter}");

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B2\/formula/);

            testing.cellFormattedTextCheck(B2, "6.");
        });

        it("Cell formula edit with reference", () => {
            testing.cellClick(C3);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=1+2+3{enter}");

            testing.cellClick(D4);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=C3+10{enter}");

            testing.cellFormattedTextCheck(D4, "16.");
        });

        it("Cell formula edit, update hash cell reference", () => {
            testing.cellClick(C3);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=1+2+3{enter}");

            cy.window()
                .then((win) => {
                    var hash = win.location.hash;
                    win.location.hash = hash.replace("/cell/C3/formula", "/cell/D4/formula");
                });

            testing.wait();

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=4+5{enter}");

            testing.cellFormattedTextCheck(D4, "9.");
        });

        it("Cell hash formula update", () => {
            testing.hashAppend("/cell/D4/formula");

            testing.column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("4")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.formulaText()
                .should("have.focus");
        });

        it("Cell hash append formula", () => {
            testing.cellClick(C3);

            testing.wait(FORMULA_TEXT_CLICK_WAIT);

            testing.hashAppend("/formula");

            testing.wait(FORMULA_TEXT_CLICK_WAIT);

            testing.formulaText()
                .should("have.focus");
        });

        it("Cell hash append formula has focus", () => {
            testing.cellClick(C3);

            testing.wait(FORMULA_TEXT_CLICK_WAIT);

            testing.hashAppend("/formula");

            testing.wait(FORMULA_TEXT_CLICK_WAIT);

            testing.formulaText()
                .should("have.focus");
        });

        it("Cell hash with unknown label", () => {
            testing.hashAppend("/cell/" + LABEL);

            testing.hash()
                .should('match', /.*\/Untitled/);
        });

        it("Cell click should have focus", () => {
            testing.cellClick(B2);

            testing.hash()
                .should('match', /.*\/.*\/cell\/B2/);
        });

        it("Cell click columns & rows selected", () => {
            testing.cellClick(B2);

            testing.hash()
                .should('match', /.*\/.*\/cell\/B2/);

            testing.column("B")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell click and select using arrow keys", () => {
            testing.cellClick(C3);

            testing.cell(C3)
                .type("{leftarrow}");

            testing.wait(50);

            testing.hash()
                .should('match', /.*\/.*\/cell\/B3/);

            testing.cell(B3)
                .type("{rightarrow}");

            testing.wait(50);

            testing.hash()
                .should('match', /.*\/.*\/cell\/C3/);

            testing.cell(C3)
                .type("{uparrow}");

            testing.wait(50);

            testing.hash()
                .should('match', /.*\/.*\/cell\/C2/);

            testing.cell(C2)
                .type("{downarrow}");

            testing.wait(50);

            testing.hash()
                .should('match', /.*\/.*\/cell\/C3/);
        });

        it("Cell click and hit ENTER gives formula text focus", () => {
            testing.cellClick(A3);

            testing.cell(A3)
                .type("{enter}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/A3\/formula/);

            testing.formulaText()
                .should("have.focus");
        });

        it("Cell select and hit ESC loses viewport cell focus", () => {
            testing.cellClick(A3);

            testing.hash()
                .should('match', /.*\/.*\/cell\/A3/);

            testing.cell(A3)
                .type("{esc}");

            testing.hash()
                .should('match', /.*\/.*/);
        });

        it("Cell outside viewport", () => {
            testing.hashAppend("/cell/T1");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=234{enter}")
                .blur();

            // viewport should have jumped leaving T1 as the home cell.
            testing.cell(A1)
                .should('not.exist');
        });

        it("Cell outside viewport vertical", () => {
            testing.hashAppend("/cell/A30");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=234{enter}")
                .blur();

            // viewport should have jumped leaving A30 as the home cell.
            testing.cell(A1)
                .should('not.exist');
        });

        it("Cell outside viewport horiz & vertical", () => {
            testing.hashAppend("/cell/T30");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=234{enter}")
                .blur();

            // viewport should have jumped leaving T30 as the home cell.
            testing.cell(A1)
                .should('not.exist');
        });

        it("Cell outside viewport and reload", () => {
            testing.hashAppend("/cell/M1");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=123{enter}")
                .blur();

            testing.hashOnlyIdAndName();
            testing.hashAppend("/cell/T1");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=234{enter}")
                .blur();

            testing.hashOnlyIdAndName();
            testing.hashAppend("/cell/M1");

            testing.cellFormattedTextCheck("M1", "123.");
            testing.cellFormattedTextCheck("T1", "234.");
        });

        it("Cell outside viewport horiz & vert and reload", () => {
            testing.hashAppend("/cell/M10");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=123{enter}")
                .blur();

            testing.hashOnlyIdAndName();

            testing.hashAppend("/cell/T20");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=234{enter}")
                .blur();

            testing.hashOnlyIdAndName();

            testing.hashAppend("/cell/M10");

            testing.cellFormattedTextCheck("M10", "123.");
            testing.cellFormattedTextCheck("T20", "234.");
        });

        // column click.................................................................................................

        it("Column click should have focus and be selected", () => {
            testing.column("B")
                .click();

            testing.hash()
                .should('match', /.*\/.*\/column\/B/);

            testing.column("B")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);

        });

        it("Column click and cursor RIGHT", () => {
            testing.column("B")
                .click();

            testing.column("B")
                .type("{rightarrow}")

            testing.hash()
                .should('match', /.*\/.*\/column\/C/);

            testing.column("C")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column click and cursor DOWN", () => {
            testing.column("B")
                .click();

            testing.column("B")
                .type("{downarrow}")

            testing.hash()
                .should('match', /.*\/.*\/cell\/B1/);

            testing.column("B")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("1")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.cell(B1)
                .should("have.focus");
        });

        // row click.................................................................................................

        it("Row click should have focus and be selected", () => {
            testing.row("2")
                .click();

            testing.hash()
                .should('match', /.*\/.*\/row\/2/);

            testing.row("2")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Row click and cursor DOWN", () => {
            testing.row("2")
                .click()
                .should("have.focus");

            testing.row("2")
                .type("{downarrow}")

            testing.row("3")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.hash()
                .should('match', /.*\/.*\/row\/3/);
        });

        it("Row click and cursor RIGHT", () => {
            testing.row("2")
                .click();

            testing.row("2")
                .type("{rightarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/A2/);

            testing.column("A")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.cell(A2)
                .should("have.focus");
        });

        // cell range...................................................................................................

        it("Cell range history hash", () => {
            testing.hashAppend("/cell/B2:C3");

            testing.hash()
                .should('match', /.*\/.*\/cell\/B2:C3/);

            testing.column("B")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("C")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("3")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range out of viewport history hash", () => {
            testing.hashAppend("/cell/X2:Y3");

            testing.hash()
                .should('match', /.*\/.*\/cell\/X2:Y3/);

            testing.column("X")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("Y")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("3")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend left", () => {
            testing.hashAppend("/cell/D4:E5");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            testing.cell(D4)
                .type("{shift+leftarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/C4:E5/);

            testing.cell("C4")
                .should("have.focus");

            testing.column("C")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("4")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend right", () => {
            testing.hashAppend("/cell/D4:E5");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            testing.cell("D4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.cell("E4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/E4:F5/);

            testing.cell("F4")
                .should("have.focus");

            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("F")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("4")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend right twice", () => {
            testing.hashAppend("/cell/D4:E5");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            testing.cell("D4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.cell("E4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/E4:F5/);

            testing.cell("F4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/E4:G5/);

            testing.cell("G4")
                .should("have.focus");

            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("F")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("G")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("4")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend up", () => {
            testing.hashAppend("/cell/D4:E5");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            testing.cell(D4)
                .type("{shift+uparrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D3:E5/);

            testing.cell("D3")
                .should("have.focus");

            testing.column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("3")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("4")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend down", () => {
            testing.hashAppend("/cell/D4:E5");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            testing.cell("D4")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D5:E5/);

            testing.cell("D5")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D5:E6/);

            testing.cell("D6")
                .should("have.focus");

            testing.column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("6")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend down twice", () => {
            testing.hashAppend("/cell/D4:E5");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            testing.cell("D4")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D5:E5/);

            testing.cell("D5")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D5:E6/);

            testing.cell("D6")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D5:E7/);

            testing.cell("D7")
                .should("have.focus")

            testing.column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("6")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("7")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        // column range...................................................................................................

        it("Column range history hash", () => {
            testing.hashAppend("/column/B:C");

            testing.hash()
                .should('match', /.*\/.*\/column\/B:C/);

            testing.column("B")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("C")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range out of viewport history hash", () => {
            testing.hashAppend("/column/X:Y");

            testing.hash()
                .should('match', /.*\/.*\/column\/X:Y/);

            testing.column("X")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("Y")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range extend left", () => {
            testing.hashAppend("/column/E");

            testing.hash()
                .should('match', /.*\/.*\/column\/E/);

            testing.column("E")
                .type("{shift+leftarrow}");

            testing.hash()
                .should('match', /.*\/.*\/column\/D:E/);

            testing.column("D")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range extend left twice", () => {
            testing.hashAppend("/column/E:F");

            testing.hash()
                .should('match', /.*\/.*\/column\/E/);

            testing.column("E")
                .type("{shift+leftarrow}");

            testing.column("D")
                .type("{shift+leftarrow}");

            testing.hash()
                .should('match', /.*\/.*\/column\/C:E/);

            testing.column("C")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range extend right", () => {
            testing.hashAppend("/column/E:F");

            testing.hash()
                .should('match', /.*\/.*\/column\/E/);

            testing.column("E")
                .type("{shift+rightarrow}");

            testing.hash()
                .should('match', /.*\/.*\/column\/E:F/);

            testing.column("F")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range extend right twice", () => {
            testing.hashAppend("/column/E:F");

            testing.hash()
                .should('match', /.*\/.*\/column\/E/);

            testing.column("E")
                .type("{shift+rightarrow}");

            testing.column("F")
                .type("{shift+rightarrow}");

            testing.hash()
                .should('match', /.*\/.*\/column\/E:G/);

            testing.column("G")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("F")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        // row range...................................................................................................

        it("Row range history hash", () => {
            testing.hashAppend("/row/2:3");

            testing.hash()
                .should('match', /.*\/.*\/row\/2:3/);

            testing.row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("3")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Row range out of viewport history hash", () => {
            testing.hashAppend("/row/30:31");

            testing.hash()
                .should('match', /.*\/.*\/row\/30:31/);

            testing.row("30")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("31")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Row range extend top", () => {
            testing.hashAppend("/row/5");

            testing.hash()
                .should('match', /.*\/.*\/row\/5/);

            testing.row("5")
                .type("{shift+uparrow}");

            testing.hash()
                .should('match', /.*\/.*\/row\/4:5/);

            testing.row("4")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Row range extend top twice", () => {
            testing.hashAppend("/row/5");

            testing.hash()
                .should('match', /.*\/.*\/row\/5/);

            testing.row("5")
                .type("{shift+uparrow}");

            testing.row("4")
                .type("{shift+uparrow}");

            testing.hash()
                .should('match', /.*\/.*\/row\/3:5/);

            testing.row("3")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("4")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Row range extend bottom", () => {
            testing.hashAppend("/row/5");

            testing.hash()
                .should('match', /.*\/.*\/row\/5/);

            testing.row("5")
                .type("{shift+downarrow}");

            testing.hash()
                .should('match', /.*\/.*\/row\/5:6/);

            testing.row("6")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Row range extend bottom twice", () => {
            testing.hashAppend("/row/5");

            testing.hash()
                .should('match', /.*\/.*\/row\/5/);

            testing.row("5")
                .type("{shift+downarrow}");

            testing.row("6")
                .type("{shift+downarrow}");

            testing.hash()
                .should('match', /.*\/.*\/row\/5:7/);

            testing.row("7")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("6")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        // selection delete.............................................................................................

        it("Cell select delete hash", () => {
            testing.cellClick(B2);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Deleted{enter}");

            testing.cellClick(B2);
            testing.hashAppendWithoutCheck("/delete");

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck(B2, "");

            testing.formulaText()
                .should("have.value", "");
        });

        it("Cell range select delete hash", () => {
            testing.cellClick(A1);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'NotDeleted{enter}");

            testing.cellClick(C3);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'DeletedC3{enter}");

            testing.cellClick(B2);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'DeletedB2{enter}");

            testing.cellClick(B2);

            testing.hashAppendWithoutCheck(":C3/delete");

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck("A1", "NotDeleted");
            testing.cellFormattedTextCheck(B2, "");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column select delete hash", () => {
            testing.cellClick(E5);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            testing.column("B")
                .click();

            testing.hashAppend("/delete");

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck("D5", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Column range select delete hash", () => {
            testing.cellClick(E5);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            testing.column("B")
                .click();

            testing.hashAppend(":C/delete");

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck("C5", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Row select delete hash", () => {
            testing.cellClick(E5);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            testing.row("2")
                .click();

            testing.hashAppend("/delete");

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck("E4", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Row range select delete hash", () => {
            testing.cellClick(E5);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            testing.row("2")
                .click();

            testing.hashAppend(":3/delete");

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck("E3", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        // selection insert-after.............................................................................................

        it("Column select insert-after hash", () => {
            testing.cellClick(E5);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            testing.column("B")
                .click();

            testing.hashAppendWithoutCheck("/insert-after/1");

            testing.hash()
                .should('match', /.*\/.*\/column\/B/);

            testing.cellFormattedTextCheck("F5", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Column range select insert-after hash", () => {
            testing.cellClick(E5);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            testing.column("B")
                .click();

            testing.hashAppendWithoutCheck(":C/insert-after/2");

            testing.hash()
                .should('match', /.*\/.*\/column\/B:C/);

            testing.cellFormattedTextCheck("G5", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Row select insert-after hash", () => {
            testing.cellClick(E5);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            testing.row("2")
                .click();

            testing.hashAppendWithoutCheck("/insert-after/1");

            testing.hash()
                .should('match', /.*\/.*\/row\/2/);

            testing.cellFormattedTextCheck("E6", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Row range select insert-after hash", () => {
            testing.cellClick(E5);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            testing.row("2")
                .click();

            testing.hashAppendWithoutCheck(":3/insert-after/2");

            testing.hash()
                .should('match', /.*\/.*\/row\/2:3/);

            testing.cellFormattedTextCheck("E7", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        // selection insert-before.............................................................................................

        it("Column select insert-before hash", () => {
            testing.cellClick(E5);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            testing.column("B")
                .click();

            testing.hashAppendWithoutCheck("/insert-before/1");

            testing.hash()
                .should('match', /.*\/.*\/column\/C/);

            testing.cellFormattedTextCheck("F5", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Column range select insert-before hash", () => {
            testing.cellClick(E5);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            testing.column("B")
                .click();

            testing.hashAppendWithoutCheck(":C/insert-before/2");

            testing.hash()
                .should('match', /.*\/.*\/column\/D:E/);

            testing.cellFormattedTextCheck("G5", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Row select insert-before hash", () => {
            testing.cellClick(E5);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            testing.row("2")
                .click();

            testing.hashAppendWithoutCheck("/insert-before/1");

            testing.hash()
                .should('match', /.*\/.*\/row\/3/);

            testing.cellFormattedTextCheck("E6", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Row range select insert-before hash", () => {
            testing.cellClick(E5);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            testing.row("2")
                .click();

            testing.hashAppendWithoutCheck(":3/insert-before/2");

            testing.hash()
                .should('match', /.*\/.*\/row\/4:5/);

            testing.cellFormattedTextCheck("E7", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        // selection then different viewport selections.................................................................

        it("Cell formula edit then column click", () => {
            testing.hashAppend("/cell/B2/formula");

            testing.wait();

            testing.column("C")
                .click();

            testing.hash()
                .should('match', /.*\/.*\/column\/C/);
        });

        it("Cell formula edit then row click", () => {
            testing.hashAppend("/cell/B2/formula");

            testing.wait();

            testing.row("3")
                .click();

            testing.hash()
                .should('match', /.*\/.*\/row\/3/);
        });

        it("Cell formula edit different formula edit", () => {
            testing.hashAppend("/cell/B2/formula");

            testing.hash()
                .should('match', /.*\/.*\/cell\/B2\/formula/);

            testing.hashAppend("/cell/C3/formula"); // invalid removes cell from hash
            testing.hashAppend("/cell/C3/formula");

            testing.hash()
                .should('match', /.*\/.*\/cell\/C3/);
        });

        it("Column select then Cell", () => {
            testing.hashAppend("/column/B");

            testing.hash()
                .should('match', /.*\/.*\/column\/B/);

            testing.cell(A1)
                .click();

            testing.hash()
                .should('match', /.*\/.*\/cell\/A1/);
        });

        it("Row select then Cell", () => {
            testing.hashAppend("/row/2");

            testing.hash()
                .should('match', /.*\/.*\/row\/2/);

            testing.cell(A1)
                .click();

            testing.hash()
                .should('match', /.*\/.*\/cell\/A1/);
        });

        // column context menu...........................................................................................

        it("Column context menu", () => {
            testing.column("C")
                .rightclick();

            testing.viewportContextMenu()
                .should("be.visible")
                .find("LI")
                .should("have.length", 4);
        });

        it("Column context menu click insert before 2", () => {
            testing.cellClick(C3);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}")
                .blur();

            testing.column("C")
                .rightclick();

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_2)
                .should("include.text", "Insert 2 before");


            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_2)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck("E3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column context menu click insert before 1", () => {
            testing.cellClick(C3);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}")
                .blur();

            testing.column("C")
                .rightclick();

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_1)
                .should("include.text", "Insert 1 before");

            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_1)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck("D3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column context menu click insert after 1", () => {
            testing.cellClick(A1);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Never{enter}")
                .blur();

            testing.cellClick(C3);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}")
                .blur();

            testing.column("B")
                .rightclick();

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_1)
                .should("include.text", "Insert 1 after");

            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_1)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck("A1", "Never");
            testing.cellFormattedTextCheck("D3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column context menu click insert after 2", () => {
            testing.cellClick(A1);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Never{enter}")
                .blur();

            testing.cellClick(C3);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}")
                .blur();

            testing.column("B")
                .rightclick();

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_2)
                .should("include.text", "Insert 2 after");


            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_2)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck("A1", "Never");
            testing.cellFormattedTextCheck("E3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column select then context menu click insert before 2", () => {
            testing.cellClick(C3);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}")
                .blur();

            testing.column("C")
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/column\/C/);

            testing.column("C")
                .rightclick();

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_2)
                .should("include.text", "Insert 2 before");

            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_2)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.hash()
                .should('match', /.*\/Untitled\/column\/E/);

            testing.cellFormattedTextCheck("E3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column select then context menu click insert before 1", () => {
            testing.cellClick(C3);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}")
                .blur();

            testing.column("C")
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/column\/C/);

            testing.column("C")
                .rightclick();

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_1)
                .should("include.text", "Insert 1 before");

            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_1)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.hash()
                .should('match', /.*\/Untitled\/column\/D/);

            testing.cellFormattedTextCheck("D3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column select then context menu click insert after 1", () => {
            testing.cellClick(A1);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Never{enter}")
                .blur();

            testing.cellClick(C3);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}")
                .blur();

            testing.column("B")
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/column\/B/);

            testing.column("B")
                .rightclick();

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_1)
                .should("include.text", "Insert 1 after");

            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_1)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.hash()
                .should('match', /.*\/Untitled\/column\/B/);

            testing.cellFormattedTextCheck("A1", "Never");
            testing.cellFormattedTextCheck("D3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column select then context menu click insert after 2", () => {
            testing.cellClick(A1);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Never{enter}")
                .blur();

            testing.cellClick(C3);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}")
                .blur();

            testing.column("B")
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/column\/B/);

            testing.column("B")
                .rightclick();

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_2)
                .should("include.text", "Insert 2 after");

            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_2)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.hash()
                .should('match', /.*\/Untitled\/column\/B/);

            testing.cellFormattedTextCheck("A1", "Never");
            testing.cellFormattedTextCheck("E3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });
    }
);