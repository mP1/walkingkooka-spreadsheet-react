/// <reference types="cypress" />

import BorderStyle from "../../src/text/BorderStyle.js";
import ExpressionNumberKind from "../../src/math/ExpressionNumberKind.js";
import FontVariant from "../../src/text/FontVariant.js";
import FontStyle from "../../src/text/FontStyle.js";
import Hyphens from "../../src/text/Hyphens.js";
import RoundingMode from "../../src/math/RoundingMode.js";
import SpreadsheetCellReference from "../../src/spreadsheet/reference/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "../../src/spreadsheet/reference/SpreadsheetColumnReference.js";
import SpreadsheetLabelMappingWidget from "../../src/spreadsheet/reference/SpreadsheetLabelMappingWidget.js";
import SpreadsheetMetadata from "../../src/spreadsheet/meta/SpreadsheetMetadata.js";
import SpreadsheetSelectAutocompleteWidget
    from "../../src/spreadsheet/reference/SpreadsheetSelectAutocompleteWidget.js";
import SpreadsheetSelectLinkWidget from "../../src/spreadsheet/reference/SpreadsheetSelectLinkWidget.js";
import SpreadsheetSettingsWidget from "../../src/spreadsheet/settings/SpreadsheetSettingsWidget.js";
import SpreadsheetViewportWidget from "../../src/spreadsheet/SpreadsheetViewportWidget.js";
import TextAlign from "../../src/text/TextAlign.js";
import TextStyle from "../../src/text/TextStyle.js";
import VerticalAlign from "../../src/text/VerticalAlign.js";
import WordBreak from "../../src/text/WordBreak.js";
import WordWrap from "../../src/text/WordWrap.js";
import SpreadsheetTesting from "./SpreadsheetTesting.js";

const FORCE_TRUE = {
    force: true,
};

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

        // Spreadsheet create & load....................................................................................

        it("Spreadsheet initial empty check", () => {
            testing.spreadsheetEmptyCheck();
        });

        it("Spreadsheet create empty", () => {
            testing.hashEnter("/");

            testing.spreadsheetEmptyCheck();
        });

        it("Spreadsheet create empty after editing cell", () => {
            testing.cellClick("E5");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=1+2+3{enter}");

            testing.hashEnter("/");

            testing.hash().should('match', /.*\/Untitled/) // => true

            testing.spreadsheetEmptyCheck();
        });

        it("Spreadsheet create, edit cell, create empty, reload non empty", () => {
            cy.window()
                .then((win) => {
                    const nonEmptySpreadsheetHash = win.location.hash;

                    testing.cellClick(A1);

                    testing.formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type("{selectall}=1+2+3{enter}");

                    testing.spreadsheetEmptyReady();

                    // reload previous spreadsheet and verify viewport reloaded
                    testing.hashEnter(nonEmptySpreadsheetHash);

                    testing.hash()
                        .should('eq', nonEmptySpreadsheetHash);

                    testing.cellFormattedTextCheck(A1, "6.");
                });
        });

        it("Spreadsheet create, edit cell, reload", () => {
            cy.window()
                .then((win) => {
                    const nonEmptySpreadsheetHash = win.location.hash;

                    testing.cellClick(A1);

                    testing.formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type("{selectall}=1+2+3{enter}");

                    // reload previous spreadsheet and verify viewport reloaded
                    testing.hashEnter(nonEmptySpreadsheetHash);

                    testing.hash()
                        .should('eq', nonEmptySpreadsheetHash);

                    testing.cellFormattedTextCheck(A1, "6.");
                });
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
            hashLabel();

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text"
            );
        });

        it("Label mapping label text field has focus", () => {
            hashLabel();

            labelMappingLabelTextField()
                .should("have.focus");
        });

        it("Label mapping label tabbing", () => {
            hashLabel();

            labelMappingReferenceTextField()
                .type("{selectall}A1");

            labelMappingLabelTextField()
                .click()
                .should("have.focus")
                .tab();

            labelMappingReferenceTextField()
                .should("have.focus")
                .tab();

            labelMappingLabelSaveButton()
                .should("have.focus")
                .tab();

            labelMappingLabelDeleteButton()
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
            hashLabel();

            labelMappingLabelTextField()
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
            hashLabel();

            const labelText = "!InvalidLabel";

            labelMappingLabelTextField()
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
            hashLabel();

            const labelText = "I!nvalidLabel";

            labelMappingLabelTextField()
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
            hashLabel();

            const labelText = "Label456";

            labelMappingLabelTextField()
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
            hashLabel();

            const labelText = "Label456";

            labelMappingLabelTextField()
                .type("{selectall}" + labelText);

            labelMappingLabelSaveButton()
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
            hashLabel();

            const referenceText = "!InvalidReference";

            labelMappingReferenceTextField()
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
            hashLabel();

            const referenceText = "A!InvalidReference";

            labelMappingReferenceTextField()
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
            hashLabel();

            const referenceText = LABEL;

            labelMappingReferenceTextField()
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
            hashLabel();

            const referenceText = "B2";
            labelMappingReferenceTextField()
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
            hashLabel();

            labelMappingReferenceTextField()
                .type("{selectall}B2");

            labelMappingLabelTextField()
                .type("{esc}");

            hashLabel();

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text",
            );
        });

        it("Label mapping reference TextField ESC", () => {
            hashLabel();

            labelMappingReferenceTextField()
                .type(B2 + "{esc}");

            hashLabel();

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text",
            );
        });

        it("Label mapping edit label/reference label TextField ENTER", () => {
            hashLabel();

            const referenceText = "B2";
            labelMappingReferenceTextField()
                .type(referenceText);

            const labelText = "Label456";

            labelMappingLabelTextField()
                .type("{selectall}" + labelText);

            labelMappingLabelSaveButton().click();

            labelMappingDialogCheck(
                "Label: " + labelText,
                labelText,
                "",
                referenceText,
                ""
            );
        });

        it("Label mapping edit label/reference reference TextField ENTER", () => {
            hashLabel();

            const referenceText = "B2";
            labelMappingReferenceTextField()
                .type(referenceText + "{Enter}");

            labelMappingLabelSaveButton().click();

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                ""
            );
        });

        it("Label mapping edit label/reference click SAVE button", () => {
            hashLabel();

            const referenceText = "B2";
            labelMappingReferenceTextField()
                .type(referenceText);

            labelMappingLabelSaveButton()
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
            hashLabel();

            const referenceText = "b2";
            labelMappingReferenceTextField()
                .type(referenceText);

            labelMappingLabelSaveButton()
                .click();

            hashLabel();

            labelMappingLabelDeleteButton()
                .click();

            hashLabel();

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text"
            );
        });

        it("Label mapping edit close BUTTON", () => {
            hashLabel();

            labelMappingLabelCloseButton()
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

                    labelMappingReferenceTextField()
                        .type(reference.toString());

                    labelMappingLabelSaveButton()
                        .click();

                    labelMappingLabelCloseButton()
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

            labelMappingReferenceTextField()
                .type("{selectall}A1");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
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

            labelMappingReferenceTextField()
                .type("{selectall}A1");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            // create a new label #2
            testing.hashAppend("/label/HoverLabel2");

            labelMappingReferenceTextField()
                .type("{selectall}A1");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
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

            labelMappingReferenceTextField()
                .type("{selectall}A1");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
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

            labelMappingReferenceTextField()
                .type("{selectall}B2{enter}");

            labelMappingLabelSaveButton()
                .click();

            testing.cellFormattedTextCheck(C3, "88."); // 4 * 22
        });

        it("Label history hash navigate to label", () => {
            // create a new label
            testing.hashAppend("/label/NavigateToLabel123");

            labelMappingReferenceTextField()
                .type("{selectall}A1");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
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

            labelMappingLabelTextField()
                .should("have.value", labelText);

            const labelHelperTextId = "#" + SpreadsheetLabelMappingWidget.LABEL_TEXT_FIELD_HELPER_TEXT_ID;
            if(labelHelperText){
                cy.get(labelHelperTextId)
                    .should("have.text", labelHelperText);
            }else {
                cy.get(labelHelperTextId)
                    .should("not.exist");
            }

            labelMappingReferenceTextField()
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

        function labelMappingLabelTextField() {
            return cy.get("#" + SpreadsheetLabelMappingWidget.LABEL_TEXT_FIELD_ID);
        }

        function labelMappingReferenceTextField() {
            return cy.get("#" + SpreadsheetLabelMappingWidget.REFERENCE_TEXT_FIELD_ID);
        }

        function labelMappingLabelSaveButton() {
            return cy.get("#" + SpreadsheetLabelMappingWidget.SAVE_BUTTON_ID);
        }

        function labelMappingLabelDeleteButton() {
            return cy.get("#" + SpreadsheetLabelMappingWidget.DELETE_BUTTON_ID);
        }

        function labelMappingLabelCloseButton() {
            return cy.get("#" + SpreadsheetLabelMappingWidget.DIALOG_CLOSE_BUTTON_ID);
        }

        function hashLabel() {
            testing.hashAppend("/label/" + LABEL);
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

            contextMenu()
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

            contextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_2)
                .should("include.text", "Insert 2 before");


            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_2)
                .click();

            contextMenu()
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

            contextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_1)
                .should("include.text", "Insert 1 before");

            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_1)
                .click();

            contextMenu()
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

            contextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_1)
                .should("include.text", "Insert 1 after");

            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_1)
                .click();

            contextMenu()
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

            contextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_2)
                .should("include.text", "Insert 2 after");


            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_2)
                .click();

            contextMenu()
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

            contextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_2)
                .should("include.text", "Insert 2 before");

            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_2)
                .click();

            contextMenu()
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

            contextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_1)
                .should("include.text", "Insert 1 before");

            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_BEFORE_1)
                .click();

            contextMenu()
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

            contextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_1)
                .should("include.text", "Insert 1 after");

            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_1)
                .click();

            contextMenu()
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

            contextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_2)
                .should("include.text", "Insert 2 after");

            cy.get("#" + SpreadsheetColumnReference.VIEWPORT_COLUMN_INSERT_AFTER_2)
                .click();

            contextMenu()
                .should("not.be.visible");

            testing.hash()
                .should('match', /.*\/Untitled\/column\/B/);

            testing.cellFormattedTextCheck("A1", "Never");
            testing.cellFormattedTextCheck("E3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        function contextMenu() {
            return cy.get("#" + SpreadsheetViewportWidget.VIEWPORT_CONTEXT_MENU_ID);
        }

        // select.....................................................................................................

        const ENABLED = false;
        const DISABLED = true;

        it("Select using hash initial appearance", () => {
            selectHistoryHash();

            selectDialogTitle()
                .contains("Select");

            selectAutocompleteTextField()
                .should("have.value", "");

            selectAutocompleteTextFieldHelper()
                .should("not.exist");

            selectCellGotoButton(DISABLED);
            selectCellRangeSelectButton(DISABLED);
            selectColumnGotoButton(DISABLED);
            selectColumnRangeSelectButton(DISABLED);
            selectLabelCreateButton(DISABLED);
            selectLabelEditButton(DISABLED);
            selectLabelGotoButton(DISABLED);
            selectRowGotoButton(DISABLED);
            selectRowRangeSelectButton(DISABLED);
        });

        it("Select auto complete text field has focus", () => {
            selectHistoryHash();

            selectDialogTitle()
                .contains("Select");

            selectAutocompleteTextField()
                .should('have.focus')
                .should("have.value", "");
        });

        it("Select auto complete tabbing", () => {
            selectHistoryHash();

            selectAutocompleteTextField()
                .should('have.focus')
                .type("{selectall}Hello")
                .wait(50)
                .tab();

            selectLabelCreateButton(false)
                .should("have.focus")
                .tab();

            // two keyboard tabs required to tab from CREATE-LINK to CLOSE BUTTON, 1st tab gives focus to dialog box.

            // selectDialogClose()
            //     .should("have.focus")
            //     .tab());
        });

        it("Select and close", () => {
            selectHistoryHash();

            selectDialogClose()
                .click();

            testing.hash()
                .should('match', /.*\/Untitled/);

            selectDialog()
                .should("not.exist");
        });

        it("Select enter ESC closes", () => {
            selectHistoryHash();

            selectAutocompleteTextField()
                .type("{esc}");

            testing.hash()
                .should('match', /.*\/Untitled/);

            selectDialog()
                .should("not.exist");
        });

        it("Select enter invalid cell or label", () => {
            selectHistoryHash();

            selectAutocompleteTextField()
                .type("{selectall}!invalid");

            selectAutocompleteTextFieldHelper()
                .should("have.text", "Invalid character '!' at 0");
        });

        it("Select enter cell and ENTER and click GOTO", () => {
            selectHistoryHash();

            selectAutocompleteTextField()
                .type("{selectall}B2{enter}");

            selectAutocompleteTextFieldHelper()
                .should("not.exist");

            selectAutocompletePopup()
                .should("not.exist");

            selectCellRangeSelectButton(DISABLED);
            selectColumnGotoButton(DISABLED);
            selectColumnRangeSelectButton(DISABLED);
            selectLabelCreateButton(DISABLED);
            selectLabelEditButton(DISABLED);
            selectLabelGotoButton(DISABLED);
            selectRowGotoButton(DISABLED);
            selectRowRangeSelectButton(DISABLED);

            selectCellGotoButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Select enter cell range and ENTER and click SELECT CELL RANGE", () => {
            selectHistoryHash();

            selectAutocompleteTextField()
                .type("{selectall}A1:B2{enter}");

            selectAutocompleteTextFieldHelper()
                .should("not.exist");

            selectAutocompletePopup()
                .should("not.exist");

            selectCellGotoButton(DISABLED);
            selectColumnGotoButton(DISABLED);
            selectColumnRangeSelectButton(DISABLED);
            selectLabelCreateButton(DISABLED);
            selectLabelEditButton(DISABLED);
            selectLabelGotoButton(DISABLED);
            selectRowGotoButton(DISABLED);
            selectRowRangeSelectButton(DISABLED);

            selectCellRangeSelectButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/A1:B2/);
        });

        it("Select enter unknown label and ENTER and click CREATE", () => {
            selectHistoryHash();

            selectAutocompleteTextField()
                .type("{selectall}Label123{enter}");

            selectAutocompleteTextFieldHelper()
                .should("not.exist");

            selectAutocompletePopup()
                .should("not.exist");

            selectCellGotoButton(DISABLED);
            selectCellRangeSelectButton(DISABLED);
            selectColumnGotoButton(DISABLED);
            selectColumnRangeSelectButton(DISABLED);
            selectLabelEditButton(DISABLED);
            selectLabelGotoButton(DISABLED);
            selectRowGotoButton(DISABLED);
            selectRowRangeSelectButton(DISABLED);

            selectLabelCreateButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/label\/Label123/);
        });

        it("Select enter known label and ENTER and click LABEL EDIT", () => {
            hashLabel();

            labelMappingLabelTextField()
                .type("{selectall}Label123");

            labelMappingReferenceTextField()
                .type("{selectall}B2");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            testing.hash()
                .should('match', /.*\/Untitled/);

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("{selectall}Label123{enter}");

            selectAutocompleteTextFieldHelper()
                .should("not.exist");

            selectAutocompletePopup()
                .should("not.exist");

            selectCellGotoButton(DISABLED);
            selectCellRangeSelectButton(DISABLED);
            selectColumnGotoButton(DISABLED);
            selectColumnRangeSelectButton(DISABLED);
            selectLabelCreateButton(DISABLED);
            selectLabelGotoButton(ENABLED);
            selectRowGotoButton(DISABLED);
            selectRowRangeSelectButton(DISABLED);

            selectLabelEditButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/label\/Label123/);
        });

        it("Click CELL then select create LABEL and ENTER, verify cell not lost from hash", () => {
            testing.cell(A1)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/A1/);

            selectHistoryHash(); // TODO not sure WHY but select dialog doesnt appear in test.

            selectAutocompleteTextField()
                .type("{selectall}Label123{enter}");

            selectAutocompleteTextFieldHelper()
                .should("not.exist");

            selectAutocompletePopup()
                .should("not.exist");

            selectCellGotoButton(DISABLED);
            selectCellRangeSelectButton(DISABLED);
            selectColumnGotoButton(DISABLED);
            selectColumnRangeSelectButton(DISABLED);
            selectLabelEditButton(DISABLED);
            selectLabelGotoButton(DISABLED);
            selectRowGotoButton(DISABLED);
            selectRowRangeSelectButton(DISABLED);

            selectLabelCreateButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/A1\/label\/Label123/);
        });

        it("Select enter cell, select from dropdown ENTER and click GOTO CELL", () => {
            selectHistoryHash();

            selectAutocompleteTextField()
                .type("{selectall}B2");

            selectAutocompleteTextFieldHelper()
                .should("not.exist");

            selectAutocompletePopup()
                .should("exist");

            selectAutocompletePopupOption(0)
                .should("have.text", "B2");

            selectAutocompleteTextField()
                .type("{downarrow}{enter}");

            selectCellRangeSelectButton(DISABLED);
            selectColumnGotoButton(DISABLED);
            selectColumnRangeSelectButton(DISABLED);
            selectLabelCreateButton(DISABLED);
            selectLabelEditButton(DISABLED);
            selectLabelGotoButton(DISABLED);
            selectRowGotoButton(DISABLED);
            selectRowRangeSelectButton(DISABLED);

            selectCellGotoButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Select enter column, select from dropdown ENTER and click GOTO COLUMN", () => {
            testing.spreadsheetEmptyReady();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("{selectall}C");

            selectAutocompleteTextFieldHelper()
                .should("not.exist");

            selectAutocompletePopup()
                .should("exist");

            selectAutocompletePopupOption(0)
                .should("have.text", "C");

            selectAutocompleteTextField()
                .type("{downarrow}{enter}");

            selectCellGotoButton(DISABLED);
            selectCellRangeSelectButton(DISABLED);
            selectColumnRangeSelectButton(DISABLED);
            selectLabelCreateButton(ENABLED); // "C" could be a column or label so enable both
            selectLabelEditButton(DISABLED);
            selectLabelGotoButton(DISABLED);
            selectRowGotoButton(DISABLED);
            selectRowRangeSelectButton(DISABLED);

            selectColumnGotoButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/column\/C/);
        });

        it("Select enter column range, select from dropdown ENTER and click SELECT COLUMN RANGE", () => {
            selectHistoryHash();

            selectAutocompleteTextField()
                .type("{selectall}D:E");

            selectAutocompleteTextFieldHelper()
                .should("not.exist");

            selectAutocompletePopup()
                .should("exist");

            selectAutocompletePopupOption(0)
                .should("have.text", "D:E");

            selectAutocompleteTextField()
                .type("{downarrow}{enter}");

            selectCellGotoButton(DISABLED);
            selectCellRangeSelectButton(DISABLED);
            selectColumnGotoButton(DISABLED);
            selectLabelCreateButton(DISABLED);
            selectLabelEditButton(DISABLED);
            selectLabelGotoButton(DISABLED);
            selectRowGotoButton(DISABLED);
            selectRowRangeSelectButton(DISABLED);

            selectColumnRangeSelectButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/column\/D:E/);
        });

        it("Select enter known label ENTER and click LABEL EDIT", () => {
            hashLabel();

            labelMappingReferenceTextField()
                .type("{selectall}B2");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("{selectall}Label123{enter}");

            selectAutocompleteTextFieldHelper()
                .should("not.exist");

            selectAutocompletePopup()
                .should("not.exist");

            selectCellGotoButton(DISABLED);
            selectCellRangeSelectButton(DISABLED);
            selectColumnGotoButton(DISABLED);
            selectColumnRangeSelectButton(DISABLED);
            selectLabelGotoButton(ENABLED);
            selectLabelCreateButton(DISABLED);
            selectRowGotoButton(DISABLED);
            selectRowRangeSelectButton(DISABLED);

            selectLabelEditButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/label\/Label123/);
        });

        it("Select enter existing label, select from dropdown ENTER and click GOTO LABEL", () => {
            hashLabel();

            labelMappingReferenceTextField()
                .type("{selectall}B2");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("{selectall}Label");

            selectAutocompleteTextFieldHelper()
                .should("not.exist");

            selectAutocompletePopup()
                .should("exist");

            selectAutocompletePopupOption(0)
                .should("have.text", "Label");

            selectAutocompletePopupOption(1)
                .should("have.text", "Label123");

            selectAutocompleteTextField()
                .type("{downarrow}{downarrow}{enter}");

            selectCellGotoButton(DISABLED);
            selectCellRangeSelectButton(DISABLED);
            selectColumnGotoButton(DISABLED);
            selectColumnRangeSelectButton(DISABLED);
            selectLabelCreateButton(DISABLED);
            selectLabelEditButton(ENABLED);
            selectRowGotoButton(DISABLED);
            selectRowRangeSelectButton(DISABLED);

            selectLabelGotoButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/Label123/);
        });

        it("Select enter row, select from dropdown ENTER and click GOTO ROW", () => {
            selectHistoryHash();

            selectAutocompleteTextField()
                .type("{selectall}3");

            selectAutocompleteTextFieldHelper()
                .should("not.exist");

            selectAutocompletePopup()
                .should("exist");

            selectAutocompletePopupOption(0)
                .should("have.text", "3");

            selectAutocompleteTextField()
                .type("{downarrow}{enter}");

            selectCellGotoButton(DISABLED);
            selectCellRangeSelectButton(DISABLED);
            selectColumnGotoButton(DISABLED);
            selectColumnRangeSelectButton(DISABLED);
            selectLabelCreateButton(DISABLED);
            selectLabelEditButton(DISABLED);
            selectLabelGotoButton(DISABLED);
            selectRowRangeSelectButton(DISABLED);

            selectRowGotoButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/row\/3/);
        });

        it("Select enter row range, select from dropdown ENTER and click SELECT ROW RANGE", () => {
            selectHistoryHash();

            selectAutocompleteTextField()
                .type("{selectall}4:6");

            selectAutocompleteTextFieldHelper()
                .should("not.exist");

            selectAutocompletePopup()
                .should("exist");

            selectAutocompletePopupOption(0)
                .should("have.text", "4:6");

            selectAutocompleteTextField()
                .type("{downarrow}{enter}");

            selectCellGotoButton(DISABLED);
            selectCellRangeSelectButton(DISABLED);
            selectColumnGotoButton(DISABLED);
            selectColumnRangeSelectButton(DISABLED);
            selectLabelCreateButton(DISABLED);
            selectLabelEditButton(DISABLED);
            selectLabelGotoButton(DISABLED);
            selectRowGotoButton(DISABLED);

            selectRowRangeSelectButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/row\/4:6/);
        });

        it("Select link after cell click", () => {
            testing.cellClick(A1);

            selectLink()
                .should('have.text', "A1");

            testing.cellClick(A2);

            selectLink()
                .should('have.text', "A2");
        });

        it("Select link click after cell click", () => {
            testing.cellClick(B1);

            selectLink()
                .should('have.text', "B1")
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B1\/select/);

            selectAutocompleteTextField()
                .should("have.value", "")
                .type("{selectall}B2{enter}");

            selectCellGotoButton(false)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        function selectHistoryHash() {
            testing.hashAppend("/select");
        }

        function selectLink() {
            return cy.get("#" + SpreadsheetSelectLinkWidget.SELECT_LINK_ID);
        }

        function selectDialog() {
            return cy.get("#" + SpreadsheetSelectAutocompleteWidget.DIALOG_ID);
        }

        function selectDialogTitle() {
            return cy.get("#" + SpreadsheetSelectAutocompleteWidget.DIALOG_TITLE_ID);
        }

        function selectDialogClose() {
            return cy.get("#" + SpreadsheetSelectAutocompleteWidget.DIALOG_CLOSE_BUTTON_ID);
        }

        function selectAutocompleteTextField() {
            return cy.get("#" + SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_ID);
        }

        function selectAutocompleteTextFieldHelper() {
            return cy.get("#" + SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_HELPER_TEXT_ID);
        }

        function selectAutocompletePopup() {
            return cy.get("#" + SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_POPUP_ID);
        }

        function selectAutocompletePopupOption(nth) {
            return cy.get("#" + SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_OPTION_ID + nth);
        }

        function selectCellGotoButton(disabled) {
            return selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.CELL_GOTO_BUTTON_ID, disabled);
        }

        function selectCellRangeSelectButton(disabled) {
            return selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.CELL_RANGE_SELECT_BUTTON_ID, disabled);
        }

        function selectColumnGotoButton(disabled) {
            return selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.COLUMN_GOTO_BUTTON_ID, disabled);
        }

        function selectColumnRangeSelectButton(disabled) {
            return selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.COLUMN_RANGE_SELECT_BUTTON_ID, disabled);
        }

        function selectLabelCreateButton(disabled) {
            return selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.LABEL_CREATE_BUTTON_ID, disabled);
        }

        function selectLabelEditButton(disabled) {
            return selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.LABEL_EDIT_BUTTON_ID, disabled);
        }

        function selectLabelGotoButton(disabled) {
            return selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.LABEL_GOTO_BUTTON_ID, disabled);
        }

        function selectRowGotoButton(disabled) {
            return selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.ROW_GOTO_BUTTON_ID, disabled);
        }

        function selectRowRangeSelectButton(disabled) {
            return selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.ROW_RANGE_SELECT_BUTTON_ID, disabled);
        }

        function selectButtonDisabled(id, disabled) {
            const button = cy.get((disabled ? "BUTTON" : "A") + "#" + id);

            if(disabled){
                button.should("be.disabled");
            }

            return button;
        }

        // SETTINGS.........................................................................................................

        it("Settings toggle(Show and hide)", () => {
            settingsToggle();

            settings()
                .should('be.visible');

            testing.hash()
                .should('match', /.*\/.*\/settings/) // => true

            settingsToggle();

            settings()
                .should('be.not.visible');

            testing.hash()
                .should('not.match', /.*\/.*\/settings/);
        });

        it("Settings hash show settings", () => {
            testing.hashAppend("/settings");

            settings()
                .should('be.visible');
        });

        it("Settings hash hide settings", () => {
            settingsToggle();

            cy.window()
                .then((win) => {
                    var hash = win.location.hash;
                    win.location.hash = hash.substring(0, hash.length - 1);
                });

            settings()
                .should('be.not.visible');
        });

        it("Settings toggle hash", () => {
            settingsToggle();

            cy.hash()
                .should("match", /.*\/Untitled\/settings/);
        });

        it("Settings hash Toggle show then hide", () => {
            settingsToggle();
            settingsToggle();

            cy.hash()
                .should("match", /.*\/Untitled/);
        });

        it("Settings hash Toggle section and hide", () => {
            cy.window()
                .then((win) => {
                    var hash = win.location.hash;

                    settingsToggle(); // open

                    settingsOpenSectionSpreadsheetMetadataProperty(SpreadsheetMetadata.TWO_DIGIT_YEAR);

                    settingsToggle(); // close

                    settingsToggle(); // open

                    const section = SpreadsheetSettingsWidget.section(SpreadsheetMetadata.TWO_DIGIT_YEAR);
                    cy.get("#settings-spreadsheet-" + section + "-content")
                        .should('be.visible');

                    cy.hash()
                        .should("eq", hash + "/settings/" + section);
                });
        });

        it("Settings show after editing spreadsheet name", () => {
            testing.spreadsheetNameClick();

            testing.spreadsheetName()
                .blur();

            cy.hash()
                .should("matches", /.*\/Untitled/);

            settingsToggle();

            cy.hash()
                .should("matches", /.*\/Untitled\/settings/);
        });

        it("Settings open hash after Edit cell", () => {
            testing.cellClick(A1);

            cy.hash()
                .should("matches", /.*\/Untitled\/cell\/A1/);

            settingsToggle();

            cy.hash()
                .should("matches", /.*\/Untitled\/cell\/A1\/settings/);
        });

        it("Settings metadata check creator-date-time/modified-date-time", () => {
            settingsToggle();

            settingsOpenSectionSpreadsheetMetadataProperty(SpreadsheetMetadata.CREATE_DATE_TIME);

            const year = new Date().getFullYear();

            cy.get("#settings-spreadsheet-metadata-create-date-time")
                .contains(year);

            cy.get("#settings-spreadsheet-metadata-modified-date-time")
                .contains(year);
        });

        /**
         * Opens the spreadsheet settings, types in the given text, and verifies the property.
         * The button is then clicked and the text field is verified.
         */
        function settingsSpreadsheetMetadataPropertyTextAndCheck(property,
                                                                 a1Formula,
                                                                 text,
                                                                 defaultText,
                                                                 updatedA1Formula,
                                                                 a1CellContent,
                                                                 a1CellContentDefault) {
            it("Settings update SpreadsheetMetadata." + property, () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataProperty(property);

                if(a1Formula){
                    testing.cellClick(A1);

                    testing.formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type(a1Formula + "{enter}", FORCE_TRUE);
                }

                const textFieldId = "#settings-spreadsheet-metadata-" + property + "-TextField";

                cy.get(textFieldId).then((input) => {
                    // type text and hit ENTER
                    cy.get(textFieldId)
                        .type("{selectall}" + text + "{enter}");

                    cy.get(textFieldId)
                        .should("have.value", text);

                    if(updatedA1Formula){
                        testing.formulaText()
                            .should("have.value", updatedA1Formula)
                    }

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContent);
                    }

                    // restore original textField value.
                    cy.get(textFieldId)
                        .type("{selectall}" + input.text() + "{enter}");

                    // click default button...
                    const buttonId = "#settings-spreadsheet-metadata-" + property + "-default-Button";
                    cy.get(buttonId)
                        .should("have.text", defaultText)
                        .click();

                    cy.get(textFieldId)
                        .should("have.value", "");

                    if(a1Formula){
                        testing.formulaText()
                            .should("have.value", a1Formula)
                    }

                    if(a1CellContentDefault){
                        testing.cellClick(A1);
                        testing.cellFormattedTextCheck(A1, a1CellContentDefault);
                    }

                    // type text and blur
                    cy.get(textFieldId)
                        .type("{selectall}" + text)
                        .blur();

                    cy.get(textFieldId)
                        .should("have.value", text);

                    if(updatedA1Formula){
                        testing.formulaText()
                            .should("have.value", updatedA1Formula)
                    }

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContent);
                    }

                    // type text and blur
                    cy.get(textFieldId)
                        .type("{selectall}XYZ{esc}")

                    cy.get(textFieldId)
                        .should("have.value", text);
                });
            });
        }

        /**
         * Opens the spreadsheet settings, selects each value by clicking the slider.
         * TODO Currently no test is made upon the a1 cell contents.
         */
        function settingsSpreadsheetMetadataPropertySliderAndCheck(property,
                                                                   a1Formula,
                                                                   values,
                                                                   a1CellContents) {
            it("Settings update SpreadsheetMetadata." + property, () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataProperty(property);

                if(a1Formula){
                    testing.cellClick(A1);

                    testing.formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type(a1Formula + "{enter}", FORCE_TRUE);
                }

                const sliderId = "#settings-spreadsheet-metadata-" + property + "-Slider";

                // the first slow of a Slider is reserved for "Default".
                values.forEach((v, i) => {
                    cy.get(sliderId + " *[data-index=\"" + (1 + i) + "\"][aria-hidden=\"true\"]")
                        .should("have.text", v.nameCapitalCase())
                        .click();

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContents[i]);
                    }
                });
            });
        }

        /**
         * Opens the spreadsheet settings, selects each value by clicking the slider.
         * TODO Currently no test is made upon the a1 cell contents.
         */
        function settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(property,
                                                                                  a1Formula,
                                                                                  values,
                                                                                  a1CellContents) {
            it("Settings update SpreadsheetMetadata." + property, () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataProperty(property);

                const dateParsePatternsId = "#settings-spreadsheet-metadata-" + SpreadsheetMetadata.DATE_PARSE_PATTERNS + "-TextField";
                const dateFormatPatternId = "#settings-spreadsheet-metadata-" + SpreadsheetMetadata.DATE_FORMAT_PATTERN + "-TextField";
                switch(property) {
                    case SpreadsheetMetadata.DEFAULT_YEAR:
                        cy.get(dateParsePatternsId)
                            .type("{selectall}dd:mm{enter}")
                            .blur();
                        cy.get(dateFormatPatternId)
                            .type("{selectall}yyyy/mm/dd{enter}")
                            .blur();

                        cy.get(dateFormatPatternId)
                            .type("{selectall}yyyy/mm/dd{enter}")
                            .blur();
                        break;
                    case SpreadsheetMetadata.TWO_DIGIT_YEAR:
                        cy.get(dateParsePatternsId)
                            .type("{selectall}yy/mm/dd{enter}")
                            .blur();
                        cy.get(dateFormatPatternId)
                            .type("{selectall}yyyy/mm/dd{enter}")
                            .blur();

                        cy.get(dateFormatPatternId)
                            .type("{selectall}yyyy/mm/dd{enter}")
                            .blur();
                        break;
                    default:
                        break;
                }

                if(a1Formula){
                    testing.cellClick(A1);

                    testing.formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type(a1Formula + "{enter}", FORCE_TRUE);
                }

                const sliderId = "#settings-spreadsheet-metadata-" + property + "-Slider";
                const numberTextFieldId = "#settings-spreadsheet-metadata-" + property + "-NumberTextField";

                // click on the slider and verify number in TextField was updated
                values.forEach((v, i) => {
                    cy.get(sliderId + " *[data-index=\"" + i + "\"][aria-hidden=\"true\"]")
                        .should("have.text", v.text)
                        .click();

                    cy.get(numberTextFieldId)
                        .should("have.value", v.value)
                        .click();

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContents[i]);
                    }
                });

                // type a number in TextField & verify slider moved.
                values.forEach((v, i) => {
                    console.log("value=" + JSON.stringify(v) + " i=" + i);

                    cy.get(numberTextFieldId)
                        .type("{selectall}" + v.value + "{enter}")
                        .click();

                    cy.get(sliderId + " *[data-index=\"" + i + "\"][aria-hidden=\"true\"]")
                        .should("have.class", "MuiSlider-markLabelActive");

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContents[i]);
                    }
                });
            });
        }

        /**
         * Opens the spreadsheet settings, selects each value by clicking the drop down list (select).
         * TODO Currently no test is made upon the a1 cell contents.
         */
        function settingsSpreadsheetMetadataPropertyDropDownListAndCheck(property,
                                                                         a1Formula,
                                                                         values,
                                                                         a1CellContents) {
            it("Settings update SpreadsheetMetadata." + property, () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataProperty(property);

                if(a1Formula){
                    testing.cellClick(A1);

                    testing.formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type(a1Formula + "{enter}", FORCE_TRUE);
                }

                const dropDownListId = "#settings-spreadsheet-metadata-" + property + "-DropDownList";

                values.forEach((v, i) => {
                    cy.get(dropDownListId)
                        .select(v.toString());

                    cy.get(dropDownListId)
                        .should("have.value", v.toString());

                    if(a1Formula){
                        testing.cellFormattedTextCheck(A1, a1CellContents[i]);
                    }
                });
            });
        }

        settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(
            SpreadsheetMetadata.CELL_CHARACTER_WIDTH,
            null,
            [
                {
                    value: "1",
                    text: "1",
                },
                {
                    value: "10",
                    text: "10",
                },
                {
                    value: "20",
                    text: "20",
                },
            ],
            null
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATE_FORMAT_PATTERN,
            "31/12/1999",
            "yyyy/mm/dd",
            "Default",
            "31/12/1999",
            "1999/12/31",
            "Friday, 31 December 1999",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATE_PARSE_PATTERNS,
            "1999:12:31",
            "yyyy:mm:dd",
            "Default",
            "1999:12:31",
            "Friday, 31 December 1999",
            "Friday, 31 December 1999",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATETIME_FORMAT_PATTERN,
            "31/12/1999, 12:58",
            "hh:mm yyyy/mm/dd",
            "Default",
            "31/12/1999, 12:58",
            "12:58 1999/12/31",
            "Friday, 31 December 1999 at 12:58:00",
        );

        settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(
            SpreadsheetMetadata.DATETIME_OFFSET,
            null,
            [
                {
                    value: "-25569",
                    text: "1900",
                },
                {
                    value: "-24107",
                    text: "1904",
                },
            ],
            null
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATETIME_PARSE_PATTERNS,
            "1999/12/31 12:58",
            "yyyy/mm/dd hh:mm",
            "Default",
            "1999/12/31 12:58",
            "Friday, 31 December 1999 at 12:58:00",
            "Friday, 31 December 1999 at 12:58:00",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DECIMAL_SEPARATOR,
            "=2.5",
            "*",
            ".",
            "=2*5",
            "2*5",
            "2.5",
        );

        settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(
            SpreadsheetMetadata.DEFAULT_YEAR,
            "31:12",
            [
                {
                    value: "1900",
                    text: "1900",
                },
                {
                    value: "2000",
                    text: "2000",
                }
            ],
            ["1900/12/31", "2000/12/31"]
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.EXPONENT_SYMBOL,
            null,
            "x",
            "E",
            null,
            null,
            null
        );

        settingsSpreadsheetMetadataPropertySliderAndCheck(
            SpreadsheetMetadata.EXPRESSION_NUMBER_KIND,
            null,
            ExpressionNumberKind.values(),
            null,
        );


        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.GROUPING_SEPARATOR,
            "123456",
            "*",
            ",",
            "123456",
            "123*456.",
            "123,456."
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.NEGATIVE_SIGN,
            "=2*-4",
            "*",
            "-",
            "=2**4",
            "*8.",
            "-8.");

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.NUMBER_FORMAT_PATTERN,
            "123.5",
            "###.000",
            "Default",
            "123.5",
            "123.500",
            "123.5",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.NUMBER_PARSE_PATTERNS,
            "123.5",
            "###.000",
            "Default",
            "123.5",
            "123.5",
            "123.5",
        );

        // TODO need to set format pattern which includes percentage
        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.PERCENTAGE_SYMBOL,
            null,
            "*",
            "%",
            null,
            null,
            null
        );

        // TODO need to format Exponent
        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.POSITIVE_SIGN,
            "+1.5",
            "*",
            "+",
            "*1.5",
            "1.5",
            "1.5",
        );

        settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(
            SpreadsheetMetadata.PRECISION,
            null,
            [
                {
                    value: "0",
                    text: "∞",
                },
                {
                    value: "32",
                    text: "32",
                },
                {
                    value: "64",
                    text: "64",
                },
                {
                    value: "128",
                    text: "128",
                }
            ],
            null
        );

        settingsSpreadsheetMetadataPropertyDropDownListAndCheck(
            SpreadsheetMetadata.ROUNDING_MODE,
            null,
            RoundingMode.values(),
            null
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.TEXT_FORMAT_PATTERN,
            "=\"Hello 123\"",
            "@@",
            "Default",
            "=\"Hello 123\"",
            "Hello 123Hello 123",
            "Hello 123",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.TEXT_FORMAT_PATTERN,
            "'Hello 123",
            "@@",
            "Default",
            "'Hello 123",
            "Hello 123Hello 123",
            "Hello 123",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.TIME_FORMAT_PATTERN,
            "12:58",
            "hh::mm::",
            "Default",
            "12:58",
            "12::58::",
            "12:58:00",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.TIME_PARSE_PATTERNS,
            "12::58::59.000",
            "hh::mm::ss.000",
            "Default",
            "12::58::59.000",
            "12:58:59",
            "12:58:59",
        );

        settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(
            SpreadsheetMetadata.TWO_DIGIT_YEAR,
            "30/12/31",
            [
                {
                    value: "20",
                    text: "20",
                },
                {
                    value: "50",
                    text: "50",
                },
            ],
            ["1930/12/31", "2030/12/31"]
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.VALUE_SEPARATOR,
            "=5/2",
            "*",
            ",",
            "=5/2",
            "2.5",
            "2.5",
        );

        /**
         * Updates 2 properties with initial text values, then sets the first to the second text, which should cause
         * the second to gain the former first text.
         */
        function settingsSpreadsheetMetadataPropertyTextSwapCheck(property1,
                                                                  text1,
                                                                  property2,
                                                                  text2) {
            it("Settings update SpreadsheetMetadata." + property1 + "=" + text1 + " & " + property2 + "=" + text2 + " causing value swap", () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataProperty(property1);

                const textFieldId1 = "#settings-spreadsheet-metadata-" + property1 + "-TextField";
                cy.get(textFieldId1)
                    .type("{selectall}" + text1)
                    .blur();

                cy.get(textFieldId1)
                    .should("have.value", text1);

                const textFieldId2 = "#settings-spreadsheet-metadata-" + property2 + "-TextField";
                cy.get(textFieldId2)
                    .type("{selectall}" + text2)
                    .blur();

                cy.get(textFieldId2)
                    .should("have.value", text2);

                // set property1 with text2, this should force property2 to have text1
                cy.get(textFieldId1)
                    .type("{selectall}" + text2)
                    .blur();

                cy.get(textFieldId1)
                    .should("have.value", text2);

                cy.get(textFieldId2)
                    .should("have.value", text1);
            });
        }


        settingsSpreadsheetMetadataPropertyTextSwapCheck(
            SpreadsheetMetadata.DECIMAL_SEPARATOR,
            '.',
            SpreadsheetMetadata.GROUPING_SEPARATOR,
            ','
        );

        settingsSpreadsheetMetadataPropertyTextSwapCheck(
            SpreadsheetMetadata.NEGATIVE_SIGN,
            '-',
            SpreadsheetMetadata.PERCENTAGE_SYMBOL,
            '%'
        );

        settingsSpreadsheetMetadataPropertyTextSwapCheck(
            SpreadsheetMetadata.NEGATIVE_SIGN,
            '-',
            SpreadsheetMetadata.POSITIVE_SIGN,
            '+'
        );

        settingsSpreadsheetMetadataPropertyTextSwapCheck(
            SpreadsheetMetadata.DECIMAL_SEPARATOR,
            '-',
            SpreadsheetMetadata.POSITIVE_SIGN,
            '+'
        );

// settings default style...........................................................................................

        function settingsSpreadsheetMetadataStyleColorAndCheck(property, defaultColor) {
            it("Settings update SpreadsheetMetadata.style." + property, () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataStyleProperty(property);

                testing.cellClick(A1);

                testing.formulaText()
                    .click()
                    .wait(FORMULA_TEXT_CLICK_WAIT)
                    .type("{selectall}'ABC" + "{enter}", FORCE_TRUE);

                const textFieldId = "#settings-spreadsheet-metadata-style-" + property + "-TextField";

                cy.get(textFieldId)
                    .type("{selectall}!invalid123")
                    .blur(); // TODO verify alert appears!

                cy.get(textFieldId)
                    .type("{selectall}#123456")
                    .blur();

                testing.cellA1StyleCheck(property, "rgb(18, 52, 86)");

                cy.get(textFieldId)
                    .type("{selectall}#789abc{enter}");

                testing.cellA1StyleCheck(property, "rgb(120, 154, 188)");

                if(defaultColor){
                    const defaultButtonId = "#settings-spreadsheet-metadata-style-" + property + "-default-Button";
                    cy.get(defaultButtonId)
                        .should("have.text", defaultColor)
                        .click();

                    const red = parseInt(defaultColor.substring(1, 3), 16);
                    const green = parseInt(defaultColor.substring(3, 5), 16);
                    const blue = parseInt(defaultColor.substring(5, 7), 16);

                    testing.cellA1StyleCheck(property, "rgb(" + red + ", " + green + ", " + blue + ")");
                }
            });
        }

        function settingsSpreadsheetMetadataStyleSliderAndCheck(property,
                                                                values,
                                                                defaultValue,
                                                                defaultButtonText) {
            it("Settings update SpreadsheetMetadata.style." + property, () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataStyleProperty(property);

                testing.cellClick(A1);
                testing.formulaText()
                    .click()
                    .wait(FORMULA_TEXT_CLICK_WAIT)
                    .type("{selectall}'ABC{enter}", FORCE_TRUE);

                const sliderId = "#settings-spreadsheet-metadata-style-" + property + "-Slider";

                // the first slot of a Slider is reserved for "Default".
                values.forEach((v, i) => {
                    let skip;
                    switch(property) {
                        case TextStyle.FONT_STYLE:
                        case TextStyle.FONT_VARIANT:
                            skip = i > 0;
                            break;
                        default:
                            skip = true;
                            break;
                    }

                    if(!skip){
                        cy.get(sliderId + " *[data-index=\"" + (1 + i) + "\"][aria-hidden=\"true\"]")
                            //.should("have.text", v.nameCapitalCase()) Element is not visible because it has CSS property: 'position: fixed' and its being covered by another element
                            .click(FORCE_TRUE);

                        testing.cellA1StyleCheck(property, v.toCssValue());
                    }
                });

                if(defaultValue){
                    const defaultButtonId = "#settings-spreadsheet-metadata-style-" + property + "-default-Button";
                    cy.get(defaultButtonId)
                        .should("have.text", defaultButtonText)// @see https://github.com/mP1/walkingkooka-spreadsheet-react/issues/695
                        .click();

                    testing.cellA1StyleCheck(property, defaultValue.toCssValue());
                }
            });
        }

        function settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(property,
                                                                              min,
                                                                              max,
                                                                              defaultValue,
                                                                              defaultButtonText) {
            it("Settings update SpreadsheetMetadata.style." + property, () => {
                settingsToggle();

                settingsOpenSectionSpreadsheetMetadataStyleProperty(property);

                testing.cellClick(A1);
                testing.formulaText()
                    .click()
                    .wait(FORMULA_TEXT_CLICK_WAIT)
                    .type("{selectall}'ABC{enter}", FORCE_TRUE);

                const sliderId = "#settings-spreadsheet-metadata-style-" + property + "-Slider";
                const numberTextFieldId = "#settings-spreadsheet-metadata-style-" + property + "-NumberTextField";

                // type a number in TextField & verify slider moved.
                const values = [
                    {
                        value: min,
                        text: "" + min,
                    },
                    {
                        value: max,
                        text: "" + max,
                    }
                ];

                values.forEach((v, i) => {
                    console.log("value=" + JSON.stringify(v) + " i=" + i);

                    cy.get(numberTextFieldId)
                        .type("{selectall}" + v.value + "{enter}")
                        .click();

                    cy.get(sliderId + " *[data-index=\"" + i + "\"][aria-hidden=\"true\"]");
                    //     .should("have.class", "MuiSlider-markLabelActive");

                    switch(property) {
                        case TextStyle.WIDTH:
                        case TextStyle.HEIGHT:
                            break;
                        default:
                            testing.cellA1StyleCheck(property, v.value + "px");
                            break;
                    }
                });

                if(null != defaultValue){
                    const defaultButtonId = "#settings-spreadsheet-metadata-style-" + property + "-default-Button";
                    cy.get(defaultButtonId)
                        .should("have.text", defaultButtonText)
                        .click();

                    switch(property) {
                        case TextStyle.WIDTH:
                        case TextStyle.HEIGHT:
                            break;
                        default:
                            testing.cellA1StyleCheck(property, defaultValue);
                            break;
                    }
                }
            });
        }

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BACKGROUND_COLOR,
            "#ffffff"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_LEFT_COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_LEFT_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_LEFT_WIDTH,
            0,
            2,
            "1px",
            "1"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_TOP_COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_TOP_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_TOP_WIDTH,
            0,
            2,
            "1px",
            "1"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_RIGHT_COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_RIGHT_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_RIGHT_WIDTH,
            0,
            2,
            "1px",
            "1"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_BOTTOM_COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_BOTTOM_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_BOTTOM_WIDTH,
            0,
            2,
            "1px",
            "1"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.FONT_STYLE,
            FontStyle.values(),
            FontStyle.NORMAL,
            "normal"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.FONT_VARIANT,
            FontVariant.values(),
            FontVariant.NORMAL,
            "normal"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.HEIGHT,
            21,
            30,
            "30px",
            "30"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.HYPHENS,
            Hyphens.values(),
            Hyphens.NONE,
            "none"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_LEFT,
            0,
            2,
            "0px",
            "0"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_TOP,
            0,
            2,
            "0px",
            "0"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_RIGHT,
            0,
            2,
            "0px",
            "0"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_BOTTOM,
            0,
            2,
            "0px",
            "0"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.TEXT_ALIGN,
            TextAlign.values(),
            TextAlign.LEFT,
            "left"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.VERTICAL_ALIGN,
            VerticalAlign.values(),
            VerticalAlign.TOP,
            "top"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.WIDTH,
            70,
            200,
            "100px",
            "100"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.WORD_BREAK,
            WordBreak.values(),
            WordBreak.NORMAL,
            "normal"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.WORD_WRAP,
            WordWrap.values(),
            WordWrap.NORMAL,
            "normal"
        );

        /**
         * The settings that appears on the right containing settings, tools and more.
         */
        function settings() {
            return cy.get("#settings > DIV"); // the #settings remains 1000x0 while the DIV child has an actual height
        }

        /**
         * Opens the settings section that includes the given SpreadsheetMetadata property
         */
        function settingsOpenSectionSpreadsheetMetadataProperty(property) {
            settingsOpenSection(SpreadsheetSettingsWidget.section(property));
        }

        function settingsOpenSectionSpreadsheetMetadataStyleProperty(property) {
            settingsOpenSection(SpreadsheetSettingsWidget.section(property));
        }

        function settingsOpenSection(section) {
            settings();
            //.scrollIntoView() // prevents cypress from complaining about content that is longer than the screen height.
            //.should('be.visible');

            cy.get("#settings-spreadsheet-" + section + "-expand-more-icon")
                .click();

            testing.wait();

            cy.get("#settings-spreadsheet-" + section + "-content");
            //.should('be.visible');

            testing.hash()
                .should('match', new RegExp(".*\/.*\/settings\/" + section)) // => true
        }

        /**
         * Fetches the icon that when clicked toggles the settings
         */
        function settingsToggle() {
            testing.wait();
            cy.get("#settings-icon")
                .click();
        }
    }
);