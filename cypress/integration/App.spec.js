/// <reference types="cypress" />

import BorderStyle from "../../src/text/BorderStyle.js";
import ExpressionNumberKind from "../../src/math/ExpressionNumberKind.js";
import FontVariant from "../../src/text/FontVariant.js";
import FontStyle from "../../src/text/FontStyle.js";
import Hyphens from "../../src/text/Hyphens.js";
import RoundingMode from "../../src/math/RoundingMode.js";
import SpreadsheetMetadata from "../../src/spreadsheet/meta/SpreadsheetMetadata.js";
import SpreadsheetSettingsWidget from "../../src/spreadsheet/settings/SpreadsheetSettingsWidget.js";
import TextAlign from "../../src/text/TextAlign.js";
import TextStyle from "../../src/text/TextStyle.js";
import VerticalAlign from "../../src/text/VerticalAlign.js";
import WordBreak from "../../src/text/WordBreak.js";
import WordWrap from "../../src/text/WordWrap.js";

const SELECTED = ".selected";
const COLUMN = ".column";
const ROW = ".row";
const CELL = ".cell";

const FORCE_TRUE = {
    force: true,
};

const LABEL = "Label123";
const REFERENCE = "B2";

const FORMULA_TEXT_CLICK_WAIT = 50;

context(
    "General app usage",
    () => {

        beforeEach(() => {
            cy.visit('/')
        })

        it("Spreadsheet initial empty check", () => {
            spreadsheetEmptyCheck();
        });

        it("Spreadsheet create empty", () => {
            hashEnter("/");

            spreadsheetEmptyCheck();
        });

        // INVALID TARGET. ...................................................................................................

        it("Hash invalid rejected", () => {
            hashInvalidRejected("/!invalid-target");
        });

        // SPREADSHEET NAME ...................................................................................................

        it("Spreadsheet name hash invalid name", () => {
            hashInvalidRejected("/name/!invalid-name-action");
        });

        it("Spreadsheet name edit & ESCAPE, changes lost", () => {
            spreadsheetEmpty();
            spreadsheetNameClick();

            // type the new name in
            spreadsheetName()
                .type("{selectall}UpdatedSpreadsheetName456{esc}");

            renderWait();

            spreadsheetName()
                .should("have.text", "Untitled");
            title()
                .should("eq", "Untitled");
            hash()
                .should('match', /.*\/Untitled/) // => true
        });

        it("Spreadsheet name edit & blur changes lost", () => {
            spreadsheetEmpty();
            spreadsheetNameClick();

            // type the new name in
            spreadsheetName()
                .type("{selectall}UpdatedSpreadsheetName456")
                .blur();

            renderWait();

            spreadsheetName()
                .should("have.text", "Untitled");
            title()
                .should("eq", "Untitled");
            hash()
                .should('match', /.*\/Untitled/) // => true
        });

        it("Spreadsheet name clear & save fails", () => {
            spreadsheetEmpty();
            spreadsheetNameClick();

            // type the new name in
            spreadsheetName()
                .type("{selectall}{backspace}{enter}");

            renderWait();

            spreadsheetName()
                .should("have.text", "Untitled");
            title().should("eq", "Untitled");
            hash().should('match', /.*\/Untitled/) // => true
        });

        it("Spreadsheet name edit & save", () => {
            spreadsheetEmpty();
            spreadsheetNameClick();

            const updatedSpreadsheetName = "SpreadsheetName234"; // easier to use in regex below

            // type the new name in
            spreadsheetName()
                .type("{selectall}" + updatedSpreadsheetName + "{enter}");

            renderWait();

            spreadsheetName()
                .should("have.text", updatedSpreadsheetName);

            // verify hash and title updated to include $updateSpreadsheetName
            title().should("eq", updatedSpreadsheetName.toString());
            hash().should('match', /.*\/SpreadsheetName234/) // => true
        });

        // LABEL........................................................................................................

        it("Label mapping hash with invalid label name", () => {
            hashInvalidRejected("/label/!invalid-label");
        });

        it("Label mapping enter hash", () => {
            spreadsheetEmpty();
            hashLabel();

            labelDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text"
            );
        });

        it("Label mapping hash show label mapping after editing name", () => {
            spreadsheetEmpty();

            spreadsheetNameClick();
            spreadsheetName()
                .type("Lost")
                .blur();

            cy.window()
                .then(function(win) {
                    win.location.hash = win.location.hash + "/label/Label123";
                });

            hash()
                .should('match', /.*\/Untitled\/label\/Label123/);

            labelDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text"
            );
        });

        // LABEL MAPPING LABEL..........................................................................................

        it("Label mapping edit label empty text", () => {
            spreadsheetEmpty();
            hashLabel();

            labelMappingLabelTextField()
                .type("{selectAll}{backspace}");

            labelDialogCheck(
                "Label: " + LABEL,
                "",
                "Missing text",
                "",
                "Missing text"
            );
        });

        it("Label mapping edit label invalid text", () => {
            spreadsheetEmpty();
            hashLabel();

            const labelText = "!InvalidLabel";

            labelMappingLabelTextField()
                .type("{selectAll}" + labelText);

            labelDialogCheck(
                "Label: " + LABEL,
                labelText,
                "Invalid character '!' at 0",
                "",
                "Missing text"
            );
        });

        it("Label mapping edit label invalid text #2", () => {
            spreadsheetEmpty();
            hashLabel();

            const labelText = "I!nvalidLabel";

            labelMappingLabelTextField()
                .type("{selectAll}" + labelText);

            labelDialogCheck(
                "Label: " + LABEL,
                labelText,
                "Invalid character '!' at 1",
                "",
                "Missing text"
            );
        });

        it("Label mapping edit label text, missing reference ENTER", () => {
            spreadsheetEmpty();
            hashLabel();

            const labelText = "Label456";

            labelMappingLabelTextField()
                .type("{selectAll}" + labelText + "{enter}");

            labelDialogCheck(
                "Label: " + LABEL,
                labelText,
                "",
                "",
                "Missing text"
            );
        });

        it("Label mapping edit label text, missing reference SAVE", () => {
            spreadsheetEmpty();
            hashLabel();

            const labelText = "Label456";

            labelMappingLabelTextField()
                .type("{selectAll}" + labelText);

            labelMappingLabelSaveButton().click();

            labelDialogCheck(
                "Label: " + LABEL,
                labelText,
                "",
                "",
                "Missing text"
            );
        });

        // LABEL MAPPING REFERENCE......................................................................................

        it("Label mapping edit reference invalid text", () => {
            spreadsheetEmpty();
            hashLabel();

            const referenceText = "!InvalidReference";

            labelMappingReferenceTextField()
                .type(referenceText);

            labelDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                "Invalid character '!' at 0"
            );
        });

        it("Label mapping edit reference invalid text #2", () => {
            spreadsheetEmpty();
            hashLabel();

            const referenceText = "A!InvalidReference";

            labelMappingReferenceTextField()
                .type(referenceText);

            labelDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                "Invalid character '!' at 1"
            );
        });

        it("Label mapping edit reference same label", () => {
            spreadsheetEmpty();
            hashLabel();

            const referenceText = LABEL;

            labelMappingReferenceTextField()
                .type(referenceText);

            labelDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                "Reference \"" + LABEL + "\" must be different to label \"" + LABEL + "\""
            );
        });

        it("Label mapping edit reference", () => {
            spreadsheetEmpty();
            hashLabel();

            const referenceText = REFERENCE;
            labelMappingReferenceTextField()
                .type(referenceText);

            labelDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                ""
            );
        });

        // special keys and buttons.....................................................................................

        it("Label mapping label TextField ESC", () => {
            spreadsheetEmpty();
            hashLabel();

            labelMappingReferenceTextField()
                .type(REFERENCE);

            labelMappingLabelTextField()
                .type("{Esc}");

            hashLabel();

            labelDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text",
            );
        });

        it("Label mapping reference TextField ESC", () => {
            spreadsheetEmpty();
            hashLabel();

            labelMappingReferenceTextField()
                .type(REFERENCE + "{Esc}");

            hashLabel();

            labelDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text",
            );
        });

        it("Label mapping edit label/reference label TextField ENTER", () => {
            spreadsheetEmpty();
            hashLabel();

            const referenceText = REFERENCE;
            labelMappingReferenceTextField()
                .type(referenceText);

            const labelText = "Label456";

            labelMappingLabelTextField()
                .type("{selectall}" + labelText);

            labelMappingLabelSaveButton().click();

            labelDialogCheck(
                "Label: " + labelText,
                labelText,
                "",
                referenceText,
                ""
            );
        });

        it("Label mapping edit label/reference reference TextField ENTER", () => {
            spreadsheetEmpty();
            hashLabel();

            const referenceText = REFERENCE;
            labelMappingReferenceTextField()
                .type(referenceText + "{Enter}");

            labelMappingLabelSaveButton().click();

            labelDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                ""
            );
        });

        it("Label mapping edit label/reference click SAVE button", () => {
            spreadsheetEmpty();
            hashLabel();

            const referenceText = REFERENCE;
            labelMappingReferenceTextField()
                .type(referenceText);

            labelMappingLabelSaveButton()
                .click();

            labelDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                referenceText,
                ""
            );
        });

        it("Label mapping edit label/reference click DELETE button", () => {
            spreadsheetEmpty();
            hashLabel();

            const referenceText = REFERENCE;
            labelMappingReferenceTextField()
                .type(referenceText);

            labelMappingLabelSaveButton()
                .click();

            hashLabel();
            labelMappingLabelDeleteButton()
                .click();

            hashLabel();

            labelDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text"
            );
        });

        it("Label mapping edit close BUTTON", () => {
            spreadsheetEmpty();
            hashLabel();

            labelMappingLabelCloseButton()
                .click();

            hash()
                .should('match', /.*\/Untitled/);
        });

        it("Label mapping save, navigate to label", () => {
            spreadsheetEmpty();
            hash()
                .should('match', /.*\/Untitled/);

            cy.window()
                .then(function(win) {
                    const nonEmptySpreadsheetHash = win.location.hash;

                    // create a new label
                    hashEnter(nonEmptySpreadsheetHash + "/label/Label456");

                    hash()
                        .should('match', /.*\/Untitled\/label\/Label456/);

                    labelMappingReferenceTextField()
                        .type(REFERENCE);

                    labelMappingLabelSaveButton()
                        .click();

                    labelMappingLabelCloseButton()
                        .click();

                    // navigate to label's formula
                    hashEnter(nonEmptySpreadsheetHash + "/cell/Label456/formula");
                    hash()
                        .should('match', /.*\/Untitled\/cell\/Label456\/formula/);

                    formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type("=4{enter}");

                    cellFormattedTextCheck(REFERENCE, "4.");
                });
        });

        it("Label mapping save, hover shows tooltip", () => {
            spreadsheetEmpty();
            hash()
                .should('match', /.*\/Untitled/);

            // create a new label
            hashAppend("/label/HoverLabel");

            labelMappingReferenceTextField()
                .type("A1");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            cy.get("#cell-A1-Tooltip")
                .should("not.exist");

            cellGet("A1")
                .trigger("mouseover");

            cy.get("#cell-A1-Tooltip")
                .should("exist")
                .should("contain.text", "HoverLabel");
        });

        it("Label mapping save, hover shows several tooltip", () => {
            spreadsheetEmpty();
            hash()
                .should('match', /.*\/Untitled/);

            // create a new label
            hashAppend("/label/HoverLabel1");

            labelMappingReferenceTextField()
                .type("A1");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            // create a new label #2
            hashAppend("/label/HoverLabel2");

            labelMappingReferenceTextField()
                .type("A1");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            cy.get("#cell-A1-Tooltip")
                .should("not.exist");

            cellGet("A1")
                .trigger("mouseover");

            cy.get("#cell-A1-Tooltip")
                .should("exist")
                .should("contain.text", "HoverLabel1, HoverLabel2");
        });

        it("Label mapping update, refreshes viewport", () => {
            spreadsheetEmpty();
            hash()
                .should('match', /.*\/Untitled/);

            cellClick("A1");

            hash().should('match', /.*\/Untitled\/cell\/A1/)

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=11{enter}");

            cellClick("B2");

            hash().should('match', /.*\/Untitled\/cell\/B2/)

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=22{enter}")
                .blur();

            // create a new label
            hashAppend("/label/MovingLabel");

            labelMappingReferenceTextField()
                .type("A1");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            cellClick("C3");

            hash().should('match', /.*\/Untitled\/cell\/C3/)

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=4*MovingLabel{enter}")
                .blur();

            cellFormattedTextCheck("C3", "44."); // 4 * 11

            // update existing label
            hashAppend("/label/MovingLabel");

            labelMappingReferenceTextField()
                .type("{selectall}B2{enter}");

            labelMappingLabelSaveButton()
                .click();

            cellFormattedTextCheck("C3", "88."); // 4 * 22
        });

        function labelDialogCheck(title,
                                  labelText,
                                  labelHelperText,
                                  referenceText,
                                  referenceHelperText) {
            cy.get("#label-mapping-DialogTitle")
                .contains(title);

            labelMappingLabelTextField()
                .should("have.value", labelText);

            const labelHelperTextId = "#label-mapping-label-TextField-helper-text";
            if(labelHelperText){
                cy.get(labelHelperTextId)
                    .should("have.text", labelHelperText);
            } else {
                cy.get(labelHelperTextId)
                    .should("not.exist");
            }

            labelMappingReferenceTextField()
                .should("have.value", referenceText);

            const referenceHelperTextId = "#label-mapping-reference-TextField-helper-text";
            if(referenceHelperText){
                cy.get(referenceHelperTextId)
                    .should("have.text", referenceHelperText);
            } else {
                cy.get(referenceHelperTextId)
                    .should("not.exist");
            }
        }

        function labelMappingLabelTextField() {
            return cy.get("#label-mapping-label-TextField");
        }

        function labelMappingReferenceTextField() {
            return cy.get("#label-mapping-reference-TextField");
        }

        function labelMappingLabelSaveButton() {
            return cy.get("#label-mapping-save-Button");
        }

        function labelMappingLabelDeleteButton() {
            return cy.get("#label-mapping-delete-Button");
        }

        function labelMappingLabelCloseButton() {
            return cy.get("#label-mapping-Dialog-close-Button");
        }

        function hashLabel() {
            hashAppend("/label/" + LABEL);
        }

        // CELL ................................................................................................................

        it("Cell hash with invalid reference fails", () => {
            hashInvalidRejected("/cell/!invalid-cell-reference");
        });

        it("Cell hash invalid action fails", () => {
            hashInvalidRejected("/cell/A1/!invalid-cell-action");
        });

        it("Cell viewport cell click", () => {
            spreadsheetEmpty();

            cellClick("B2");

            hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Cell viewport cell click after editing name", () => {
            spreadsheetEmpty();
            spreadsheetNameClick();
            
            cellClick("B2");

            hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Cell formula edit", () => {
            spreadsheetEmpty();

            cellClick("B2");

            hash().should('match', /.*\/Untitled\/cell\/B2/)

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=1+2+3{enter}");

            hash()
                .should('match', /.*\/Untitled\/cell\/B2\/formula/);

            cellFormattedTextCheck("B2", "6.");
        });

        it("Cell formula edit with reference", () => {
            spreadsheetEmpty();

            cellClick("C3");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=1+2+3{enter}");

            cellClick("D4");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=C3+10{enter}");

            cellFormattedTextCheck("D4", "16.");
        });

        it("Cell formula edit, update hash cell reference", () => {
            spreadsheetEmpty();

            cellClick("C3");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=1+2+3{enter}");

            cy.window()
                .then(function(win) {
                    var hash = win.location.hash;
                    win.location.hash = hash.replace("/cell/C3/formula", "/cell/D4/formula");
                });

            renderWait();

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=4+5{enter}");

            cellFormattedTextCheck("D4", "9.");
        });

        it("Cell hash update", () => {
            spreadsheetEmpty();

            hashAppend("/cell/D4/formula");

            formulaText()
                .should("have.focus");
        });

        it("Cell hash append formula", () => {
            spreadsheetEmpty();

            cellClick("C3");

            hashAppend("/formula");

            formulaText()
                .should("have.focus");
        });

        it("Cell hash with unknown label", () => {
            spreadsheetEmpty();

            hashAppend("/cell/" + LABEL);

            hash()
                .should('match', /.*\/Untitled/);
        });

        it("Cell click should have focus", () => {
            spreadsheetEmpty();

            cellClick("B2");

            hash()
                .should('match', /.*\/.*\/cell\/B2/);
        });

        it("Cell click and navigate using arrow keys", () => {
            spreadsheetEmpty();

            cellClick("C3")
                .should('have.focus');

            cellGet("C3")
                .type("{leftarrow}");

            renderWait(50);

            hash()
                .should('match', /.*\/.*\/cell\/B3/);

            cellGet("B3")
                .type("{rightarrow}");

            renderWait(50);

            hash()
                .should('match', /.*\/.*\/cell\/C3/);

            cellGet("C3")
                .type("{uparrow}");

            renderWait(50);

            hash()
                .should('match', /.*\/.*\/cell\/C2/);

            cellGet("C2")
                .type("{downarrow}");

            renderWait(50);
            
            hash()
                .should('match', /.*\/.*\/cell\/C3/);
        });

        it("Cell click and hit ENTER gives formula text focus", () => {
            spreadsheetEmpty();

            cellClick("A3")
                .should('have.focus');

            cellGet("A3")
                .type("{enter}");

            hash()
                .should('match', /.*\/.*\/cell\/A3\/formula/);

            formulaText()
                .should("have.focus");
        });

        it("Cell select and hit ESC loses viewport cell focus", () => {
            spreadsheetEmpty();

            cellClick("A3")
                .should('have.focus');

            hash()
                .should('match', /.*\/.*\/cell\/A3/);

            cellGet("A3")
                .type("{esc}");

            hash()
                .should('match', /.*\/.*/);
        });

        it("Cell outside viewport", () => {
            spreadsheetEmpty();

            hashAppend("/cell/T1");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=234{enter}")
                .blur();

            // viewport should have jumped leaving T1 as the home cell.
            cellGet("S1")
                .should('not.exist');
        });

        it("Cell outside viewport vertical", () => {
            spreadsheetEmpty();

            hashAppend("/cell/A30");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=234{enter}")
                .blur();

            // viewport should have jumped leaving A30 as the home cell.
            cellGet("A29")
                .should('not.exist');
        });

        it("Cell outside viewport horiz & vertical", () => {
            spreadsheetEmpty();

            hashAppend("/cell/T30");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=234{enter}")
                .blur();

            // viewport should have jumped leaving T30 as the home cell.
            cellGet("S29")
                .should('not.exist');
        });

        it("Cell outside viewport and reload", () => {
            spreadsheetEmpty();

            hashAppend("/cell/M1");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=123{enter}")
                .blur();

            hashAppend("/cell/T1");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=234{enter}")
                .blur();

            hashAppend("/cell/M1");

            cellFormattedTextCheck("M1", "123.");
            cellFormattedTextCheck("T1", "234.");
        });

        it("Cell outside viewport horiz & vert and reload", () => {
            spreadsheetEmpty();

            hashAppend("/cell/M10");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=123{enter}")
                .blur();

            hashAppend("/cell/T20");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=234{enter}")
                .blur();

            hashAppend("/cell/M10");

            cellFormattedTextCheck("M10", "123.");
            cellFormattedTextCheck("T20", "234.");
        });

        // navigate.....................................................................................................

        it("Navigate using hash initial appearance", () => {
            spreadsheetEmpty();
            navigateHistoryHash();

            navigateDialogTitle()
                .contains("Navigate or Edit");

            navigateAutocompleteTextField()
                .should("have.value", "");

            navigateAutocompleteTextFieldHelper()
                .should("not.exist");

            navigateGotoCellOrLabelButton(true);
            navigateCreateLinkButton(true);
            navigateEditLinkButton(true);
        });

        it("Navigate and close", () => {
            spreadsheetEmpty();
            navigateHistoryHash();

            navigateDialogClose()
                .click();

            hash()
                .should('match', /.*\/Untitled/);

            navigateDialog()
                .should("not.exist");
        });

        it("Navigate enter ESC closes", () => {
            spreadsheetEmpty();
            navigateHistoryHash();

            navigateAutocompleteTextField()
                .type("{Esc}");

            hash()
                .should('match', /.*\/Untitled/);

            navigateDialog()
                .should("not.exist");
        });

        it("Navigate enter invalid cell or label", () => {
            spreadsheetEmpty();
            navigateHistoryHash();

            navigateAutocompleteTextField()
                .type("!invalid");

            navigateAutocompleteTextFieldHelper()
                .should("have.text", "Invalid character '!' at 0");
        });

        it("Navigate enter cell and ENTER and click GOTO", () => {
            spreadsheetEmpty();
            navigateHistoryHash();

            navigateAutocompleteTextField()
                .type("B2{enter}");

            navigateAutocompleteTextFieldHelper()
                .should("not.exist");

            navigateAutocompletePopup()
                .should("not.exist");

            navigateCreateLinkButton(true);
            navigateEditLinkButton(true);
            navigateGotoCellOrLabelButton(false)
                .click();

            hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Navigate enter unknown label and ENTER and click CREATE", () => {
            spreadsheetEmpty();
            navigateHistoryHash();

            navigateAutocompleteTextField()
                .type("Label123{enter}");

            navigateAutocompleteTextFieldHelper()
                .should("not.exist");

            navigateAutocompletePopup()
                .should("not.exist");

            navigateGotoCellOrLabelButton(true);
            navigateEditLinkButton(true);
            navigateCreateLinkButton(false)
                .click();

            hash()
                .should('match', /.*\/Untitled\/label\/Label123/);
        });

        it("Navigate enter known label and ENTER and click EDIT", () => {
            spreadsheetEmpty();
            hashLabel();

            labelMappingReferenceTextField()
                .type("Label123");

            labelMappingLabelTextField()
                .type("B2");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            navigateHistoryHash();

            hash()
                .should('match', /.*\/Untitled\/navigate/);

            navigateAutocompleteTextField()
                .type("Label123{enter}");

            navigateAutocompleteTextFieldHelper()
                .should("not.exist");

            navigateAutocompletePopup()
                .should("not.exist");

            navigateGotoCellOrLabelButton(false);
            navigateCreateLinkButton(true);
            navigateEditLinkButton(false)
                .click();

            hash()
                .should('match', /.*\/Untitled\/label\/Label123/);
        });

        it("Navigate enter cell, select from dropdown ENTER and click EDIT", () => {
            spreadsheetEmpty();
            navigateHistoryHash();

            hash()
                .should('match', /.*\/Untitled\/navigate/);

            navigateAutocompleteTextField()
                .type("B2");

            navigateAutocompleteTextFieldHelper()
                .should("not.exist");

            navigateAutocompletePopup()
                .should("exist");

            navigateAutocompletePopupOption(0)
                .should("have.text", "B2");

            navigateAutocompleteTextField()
                .type("{downarrow}{enter}");

            navigateCreateLinkButton(true);
            navigateEditLinkButton(true);
            navigateGotoCellOrLabelButton(false)
                .click();

            hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Navigate enter known label ENTER and click EDIT", () => {
            spreadsheetEmpty();
            hashLabel();

            labelMappingReferenceTextField()
                .type("B2");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            navigateHistoryHash();

            hash()
                .should('match', /.*\/Untitled\/navigate/);

            navigateAutocompleteTextField()
                .type("Label123{enter}");

            navigateAutocompleteTextFieldHelper()
                .should("not.exist");

            navigateAutocompletePopup()
                .should("not.exist");

            navigateGotoCellOrLabelButton(false);
            navigateCreateLinkButton(true);
            navigateEditLinkButton(false)
                .click();

            hash()
                .should('match', /.*\/Untitled\/label\/Label123/);
        });

        it("Navigate enter existing label, select from dropdown ENTER and click GOTO", () => {
            spreadsheetEmpty();
            hashLabel();

            labelMappingReferenceTextField()
                .type("B2");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            navigateHistoryHash();

            hash()
                .should('match', /.*\/Untitled\/navigate/);

            navigateAutocompleteTextField()
                .type("Label");

            navigateAutocompleteTextFieldHelper()
                .should("not.exist");

            navigateAutocompletePopup()
                .should("exist");

            navigateAutocompletePopupOption(0)
                .should("have.text", "Label123");

            navigateAutocompleteTextField()
                .type("{downarrow}{enter}");

            navigateCreateLinkButton(true);
            navigateEditLinkButton(false);
            navigateGotoCellOrLabelButton(false)
                .click();

            hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Navigate link after cell click", () => {
            spreadsheetEmpty();

            cellClick("A1");

            navigateLink()
                .should('have.text', "A1");

            cellClick("A2");

            navigateLink()
                .should('have.text', "A2");
        });

        it("Navigate link click after cell click", () => {
            spreadsheetEmpty();

            cellClick("B1");

            navigateLink()
                .should('have.text', "B1")
                .click();

            hash()
                .should('match', /.*\/Untitled\/cell\/B1\/navigate/);

            navigateAutocompleteTextField()
                .should("have.value", "")
                .type("B2{enter}");

            navigateGotoCellOrLabelButton(false)
                .click();

            hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        function navigateHistoryHash() {
            hashAppend("/navigate");
        }

        function navigateLink() {
            return cy.get("#navigate-Link");
        }

        function navigateDialog() {
            return cy.get("#navigate-Dialog");
        }

        function navigateDialogTitle() {
            return cy.get("#navigate-DialogTitle");
        }

        function navigateDialogClose() {
            return cy.get("#navigate-Dialog-close-Button");
        }

        function navigateAutocompleteTextField() {
            return cy.get("#navigate-Autocomplete-TextField");
        }

        function navigateAutocompleteTextFieldHelper() {
            return cy.get("#navigate-Autocomplete-TextField-helper-text");
        }

        function navigateAutocompletePopup() {
            return cy.get("#navigate-Autocomplete-TextField-popup");
        }

        function navigateAutocompletePopupOption(nth) {
            return cy.get("#navigate-Autocomplete-TextField-option-" + nth);
        }

        function navigateGotoCellOrLabelButton(disabled) {
            return cy.get("#navigate-gotoCellOrLabel-Button")
                .should("be." + (disabled ? "disabled" : "enabled"));
        }

        function navigateCreateLinkButton(disabled) {
            return cy.get("#navigate-create-link-Button")
                .should("be." + (disabled ? "disabled" : "enabled"));
        }

        function navigateEditLinkButton(disabled) {
            return cy.get("#navigate-edit-link-Button")
                .should("be." + (disabled ? "disabled" : "enabled"));
        }

        // create/load spreadsheet............................................................................................

        it("Spreadsheet create empty", () => {
            hashEnter("/");

            spreadsheetEmptyCheck();
        });

        it("Spreadsheet create empty after editing cell", () => {
            spreadsheetEmpty();

            cellClick("E5");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("=1+2+3{enter}");

            hashEnter("/");

            hash().should('match', /.*\/Untitled/) // => true

            spreadsheetEmptyCheck();
        });

        it("Spreadsheet create, edit cell, create empty, reload non empty", () => {
            spreadsheetEmpty();

            cy.window()
                .then(function(win) {
                    const nonEmptySpreadsheetHash = win.location.hash;

                    cellClick("F6");

                    formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type("=1+2+3{enter}");
                    
                    spreadsheetEmpty();

                    // reload previous spreadsheet and verify viewport reloaded
                    hashEnter(nonEmptySpreadsheetHash);

                    hash()
                        .should('eq', nonEmptySpreadsheetHash);

                    cellFormattedTextCheck("F6", "6.");
                });
        });

        it("Spreadsheet create, edit cell, reload", () => {
            spreadsheetEmpty();

            cy.window()
                .then(function(win) {
                    const nonEmptySpreadsheetHash = win.location.hash;

                    cellClick("F6");

                    formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type("=1+2+3{enter}");

                    // reload previous spreadsheet and verify viewport reloaded
                    hashEnter(nonEmptySpreadsheetHash);

                    hash()
                        .should('eq', nonEmptySpreadsheetHash);

                    cellFormattedTextCheck("F6", "6.");
                });
        });

        // SETTINGS.........................................................................................................

        it("Settings toggle(Show and hide)", () => {
            spreadsheetEmpty();
            settingsToggle();

            settings()
                .should('be.visible');

            hash()
                .should('match', /.*\/.*\/settings/) // => true

            settingsToggle();

            settings()
                .should('be.not.visible');

            hash()
                .should('not.match', /.*\/.*\/settings/);
        });

        it("Settings hash show settings", () => {
            spreadsheetEmpty();

            hashAppend("/settings");

            settings()
                .should('be.visible');
        });

        it("Settings hash hide settings", () => {
            spreadsheetEmpty();
            settingsToggle();

            cy.window()
                .then(function(win) {
                    var hash = win.location.hash;
                    win.location.hash = hash.substring(0, hash.length - 1);
                });

            settings()
                .should('be.not.visible');
        });

        it("Settings toggle hash", () => {
            spreadsheetEmpty();

                    settingsToggle();

                    cy.hash()
                        .should("match", /.*\/Untitled\/settings/);
        });

        it("Settings hash Toggle show then hide", () => {
            spreadsheetEmpty();

                    settingsToggle();
                    settingsToggle();

                    cy.hash()
                        .should("match", /.*\/Untitled/);
        });

        it("Settings hash Toggle section and hide", () => {
            spreadsheetEmpty();

            cy.window()
                .then(function(win) {
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
            spreadsheetEmpty();
            spreadsheetNameClick();

            cy.hash()
                .should("matches", /.*\/Untitled\/name/);

            spreadsheetName()
                .blur();

            cy.hash()
                .should("matches", /.*\/Untitled/);

            settingsToggle();

            cy.hash()
                .should("matches", /.*\/Untitled\/settings/);
        });

        it("Settings open hash after Edit cell", () => {
            spreadsheetEmpty();

            cellClick("F6");

            cy.hash()
                .should("matches", /.*\/Untitled\/cell\/F6/);

            settingsToggle();

            cy.hash()
                .should("matches", /.*\/Untitled\/cell\/F6\/settings/);
        });

        it("Settings metadata check creator-date-time/modified-date-time", () => {
            spreadsheetEmpty();
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
                spreadsheetEmpty();
                settingsToggle();
                settingsOpenSectionSpreadsheetMetadataProperty(property);

                const a1 = "A1";

                if(a1Formula){
                    cellClick(a1);

                    formulaText()
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
                        formulaText()
                            .should("have.value", updatedA1Formula)
                    }

                    if(a1Formula){
                        cellFormattedTextCheck(a1, a1CellContent);
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
                        formulaText()
                            .should("have.value", a1Formula)
                    }

                    if(a1CellContentDefault){
                        cellClick(a1);
                        cellFormattedTextCheck(a1, a1CellContentDefault);
                    }

                    // type text and blur
                    cy.get(textFieldId)
                        .type("{selectall}" + text)
                        .blur();

                    cy.get(textFieldId)
                        .should("have.value", text);

                    if(updatedA1Formula){
                        formulaText()
                            .should("have.value", updatedA1Formula)
                    }

                    if(a1Formula){
                        cellFormattedTextCheck(a1, a1CellContent);
                    }

                    // type text and blur
                    cy.get(textFieldId)
                        .type("{selectall}XYZ{Esc}")

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
                spreadsheetEmpty();
                settingsToggle();
                settingsOpenSectionSpreadsheetMetadataProperty(property);

                const a1 = "A1";

                if(a1Formula){
                    cellClick(a1);

                    formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type(a1Formula +"{enter}", FORCE_TRUE);
                }

                const sliderId = "#settings-spreadsheet-metadata-" + property + "-Slider";

                // the first slow of a Slider is reserved for "Default".
                values.forEach((v, i) => {
                    cy.get(sliderId + " *[data-index=\"" + (1 + i) + "\"][aria-hidden=\"true\"]")
                        .should("have.text", v.nameCapitalCase())
                        .click();

                    if(a1Formula){
                        cellFormattedTextCheck(a1, a1CellContents[i]);
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
                spreadsheetEmpty();
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

                const a1 = "A1";

                if(a1Formula){
                    cellClick(a1);

                    formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type(a1Formula +"{enter}", FORCE_TRUE);
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
                        cellFormattedTextCheck(a1, a1CellContents[i]);
                    }
                });

                // type a number in TextField & verify slider moved.
                values.forEach((v, i) => {
                    console.log("value=" + JSON.stringify(v) + " i=" + i);

                    cy.get(numberTextFieldId)
                        .type("{selectall}" + v.value+ "{enter}")
                        .click();

                    cy.get(sliderId + " *[data-index=\"" + i + "\"][aria-hidden=\"true\"]")
                        .should("have.class", "MuiSlider-markLabelActive");

                    if(a1Formula){
                        cellFormattedTextCheck(a1, a1CellContents[i]);
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
                spreadsheetEmpty();
                settingsToggle();
                settingsOpenSectionSpreadsheetMetadataProperty(property);

                const a1 = "A1";

                if(a1Formula){
                    cellClick(a1);

                    formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type(a1Formula +"{enter}", FORCE_TRUE);
                }

                const dropDownListId = "#settings-spreadsheet-metadata-" + property + "-DropDownList";

                values.forEach((v, i) => {
                    cy.get(dropDownListId)
                        .select(v.toString());

                    cy.get(dropDownListId)
                        .should("have.value", v.toString());

                    if(a1Formula){
                        cellFormattedTextCheck(a1, a1CellContents[i]);
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
                spreadsheetEmpty();
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
                spreadsheetEmpty();
                settingsToggle();
                settingsOpenSectionSpreadsheetMetadataStyleProperty(property);

                const a1 = "A1";

                cellClick(a1);

                formulaText()
                    .click()
                    .wait(FORMULA_TEXT_CLICK_WAIT)
                    .type("'ABC"+ "{enter}", FORCE_TRUE);

                const textFieldId = "#settings-spreadsheet-metadata-style-" + property + "-TextField";

                cy.get(textFieldId)
                    .type("{selectall}!invalid123")
                    .blur(); // TODO verify alert appears!

                cy.get(textFieldId)
                    .type("{selectall}#123456")
                    .blur();

                cellA1StyleCheck(property, "rgb(18, 52, 86)");

                cy.get(textFieldId)
                    .type("{selectall}#789abc{enter}");

                cellA1StyleCheck(property, "rgb(120, 154, 188)");

                if(defaultColor){
                    const defaultButtonId = "#settings-spreadsheet-metadata-style-" + property + "-default-Button";
                    cy.get(defaultButtonId)
                        .should("have.text", defaultColor)
                        .click();

                    const red = parseInt(defaultColor.substring(1, 3), 16);
                    const green = parseInt(defaultColor.substring(3, 5), 16);
                    const blue = parseInt(defaultColor.substring(5, 7), 16);

                    cellA1StyleCheck(property, "rgb(" + red + ", " + green + ", " + blue + ")");
                }
            });
        }

        function settingsSpreadsheetMetadataStyleSliderAndCheck(property,
                                                                values,
                                                                defaultValue,
                                                                defaultButtonText) {
            it("Settings update SpreadsheetMetadata.style." + property, () => {
                spreadsheetEmpty();
                settingsToggle();
                settingsOpenSectionSpreadsheetMetadataStyleProperty(property);

                const a1 = "A1";

                cellClick(a1);
                formulaText()
                    .click()
                    .wait(FORMULA_TEXT_CLICK_WAIT)
                    .type("'ABC{enter}", FORCE_TRUE);

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

                        cellA1StyleCheck(property, v.toCssValue());
                    }
                });

                if(defaultValue){
                    const defaultButtonId = "#settings-spreadsheet-metadata-style-" + property + "-default-Button";
                    cy.get(defaultButtonId)
                        .should("have.text", defaultButtonText)// @see https://github.com/mP1/walkingkooka-spreadsheet-react/issues/695
                        .click();

                    cellA1StyleCheck(property, defaultValue.toCssValue());
                }
            })
        }

        function settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(property,
                                                                              min,
                                                                              max,
                                                                              defaultValue,
                                                                              defaultButtonText) {
            it("Settings update SpreadsheetMetadata.style." + property, () => {
                spreadsheetEmpty();
                settingsToggle();
                settingsOpenSectionSpreadsheetMetadataStyleProperty(property);

                const a1 = "A1";

                cellClick(a1);
                formulaText()
                    .click()
                    .wait(FORMULA_TEXT_CLICK_WAIT)
                    .type("'ABC{enter}", FORCE_TRUE);

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
                            cellA1StyleCheck(property, v.value + "px");
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
                            cellA1StyleCheck(property, defaultValue);
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
            renderWait();
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

            renderWait();

            cy.get("#settings-spreadsheet-" + section + "-content");
            //.should('be.visible');

            hash()
                .should('match', new RegExp(".*\/.*\/settings\/" + section)) // => true
        }

        /**
         * Fetches the icon that when clicked toggles the settings
         */
        function settingsToggle() {
            renderWait();
            cy.get("#settings-icon")
                .click();
        }

        // helpers..............................................................................................................

        /**
         * Updates the url hash by appending the parameter (which should result in an invalid hash) and then verifies the previous
         * hash is restored.
         */
        function hashInvalidRejected(hashAppend) {
            spreadsheetEmpty();

            cy.window()
                .then(function(win) {
                    var hash = win.location.hash;

                    // updated hash should be rejected.
                    win.location.hash = hash + hashAppend;

                    cy.hash()
                        .should("eq", hash);
                });
        }

        function title() {
            return cy.title();
        }

        function hashEnter(hash) {
            cy.window()
                .then(function(win) {
                    win.location.hash = hash;
                });
        }

        function hash() {
            return cy.location().hash();
        }

        function hashAppend(append) {
            cy.window()
                .then(function(win) {
                    const hash = win.location.hash;
                    const after = hash + append;

                    win.location.hash = after;

                    cy.hash()
                        .should("eq", after);
                });
        }

        function spreadsheetName() {
            renderWait();
            return cy.get("#spreadsheet-name");
        }

        function spreadsheetNameClick() {
            spreadsheetName()
                .click();

            hash()
                .should('match', /.*\/.*\/name/) // => true
        }

        function formulaText() {
            return cy.get("#formula-TextField");
        }

        /**
         * Click on the cell and verify it gets focused.
         */
        function cellClick(cellReference) {
            const cell = cellGet(cellReference)
                .click();
            return cell.should("have.focus");
        }

        function cellFormattedTextCheck(cellReference, text) {
            cellGet(cellReference)
                .should("have.text", text);
        }

        function cellA1StyleCheck(property, value) {
            cellGet("a1")
                .should('have.css', property, value);
        }

        function cellGet(cellReference) {
            return cy.get("#cell-" + cellReference.toUpperCase());
        }

        function spreadsheetEmpty() {
            hash()
                .should('match', /.*\/Untitled/); // wait for /$id/$name
        }

        /**
         * Checks that the spreadsheet is completely empty.
         */
        function spreadsheetEmptyCheck() {
            hash().should('match', /.*\/Untitled/) // => true

            // Verify spreadsheet name is "Untitled"
            spreadsheetName()
                .should("have.class", "MuiButton-root")
                .should("have.text", "Untitled");

            title().should("eq", "Untitled");

            // Verify formula is read only and empty
            formulaText()
                .should("be.disabled")
                .should("have.text", "");

            cy.get(COLUMN + SELECTED)
                .should("have.length", 0);

            cy.get(ROW + SELECTED)
                .should("have.length", 0);

            cy.get(CELL)
                .should("have.text", "");
        }

        function renderWait(period) {
            cy.wait(period || 20);
        }
    }
);