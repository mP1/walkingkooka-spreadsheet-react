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
import SpreadsheetRowReference from "../../src/spreadsheet/reference/SpreadsheetRowReference.js";
import SpreadsheetSelectAutocompleteWidget
    from "../../src/spreadsheet/reference/SpreadsheetSelectAutocompleteWidget.js";
import SpreadsheetSelectLinkWidget from "../../src/spreadsheet/reference/SpreadsheetSelectLinkWidget.js";
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

            labelMappingDialogCheck(
                "Label: " + LABEL,
                LABEL,
                "",
                "",
                "Missing text"
            );
        });

        it("Label mapping label text field has focus", () => {
            spreadsheetEmpty();
            hashLabel();

            labelMappingLabelTextField()
                .should("have.focus");
        });

        it("Label mapping label tabbing", () => {
            spreadsheetEmpty();
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
            spreadsheetEmpty();
            hashLabel();

            labelMappingLabelTextField()
                .type("{selectAll}{backspace}");

            labelMappingDialogCheck(
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

            labelMappingDialogCheck(
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

            labelMappingDialogCheck(
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

            labelMappingDialogCheck(
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
            spreadsheetEmpty();
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
            spreadsheetEmpty();
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
            spreadsheetEmpty();
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
            spreadsheetEmpty();
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
            spreadsheetEmpty();
            hashLabel();

            labelMappingReferenceTextField()
                .type("B2");

            labelMappingLabelTextField()
                .type("{Esc}");

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
            spreadsheetEmpty();
            hashLabel();

            labelMappingReferenceTextField()
                .type(B2 + "{Esc}");

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
            spreadsheetEmpty();
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
            spreadsheetEmpty();
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
            spreadsheetEmpty();
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
            spreadsheetEmpty();
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
            spreadsheetEmpty();
            hashLabel();

            labelMappingLabelCloseButton()
                .click();

            hash()
                .should('match', /.*\/Untitled/);
        });

        it("Label mapping save, navigate to label", () => {
            spreadsheetEmpty();

            const reference = B2;

            cy.window()
                .then(function(win) {
                    const nonEmptySpreadsheetHash = win.location.hash;

                    // create a new label
                    hashEnter(nonEmptySpreadsheetHash + "/label/Label456");

                    hash()
                        .should('match', /.*\/Untitled\/label\/Label456/);

                    labelMappingReferenceTextField()
                        .type(reference.toString());

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
                        .type("{selectall}=4{enter}");

                    cellFormattedTextCheck(reference, "4.");
                });
        });

        it("Label mapping save, hover shows tooltip", () => {
            spreadsheetEmpty();

            // create a new label
            hashAppend("/label/HoverLabel");

            labelMappingReferenceTextField()
                .type("A1");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            cy.get("#" + A1.viewportTooltipId())
                .should("not.exist");

            cell(A1)
                .trigger("mouseover");

            cy.get("#" + A1.viewportTooltipId())
                .should("exist")
                .should("contain.text", "HoverLabel");
        });

        it("Label mapping save, hover shows several tooltip", () => {
            spreadsheetEmpty();

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

            cy.get("#" + A1.viewportTooltipId())
                .should("not.exist");

            cell(A1)
                .trigger("mouseover");

            cy.get("#" + A1.viewportTooltipId())
                .should("exist")
                .should("contain.text", "HoverLabel1, HoverLabel2");
        });

        it("Label mapping update, refreshes viewport", () => {
            spreadsheetEmpty();

            cellClick(A1);

            hash().should('match', /.*\/Untitled\/cell\/A1/)

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=11{enter}");

            cellClick(B2);

            hash().should('match', /.*\/Untitled\/cell\/B2/)

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=22{enter}")
                .blur();

            // create a new label
            hashAppend("/label/MovingLabel");

            labelMappingReferenceTextField()
                .type("A1");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            cellClick(C3);

            hash().should('match', /.*\/Untitled\/cell\/C3/)

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=4*MovingLabel{enter}")
                .blur();

            cellFormattedTextCheck(C3, "44."); // 4 * 11

            // update existing label
            hashAppend("/label/MovingLabel");

            labelMappingReferenceTextField()
                .type("{selectall}B2{enter}");

            labelMappingLabelSaveButton()
                .click();

            cellFormattedTextCheck(C3, "88."); // 4 * 22
        });

        it("Label history hash navigate to label", () => {
            spreadsheetEmpty();

            // create a new label
            hashAppend("/label/NavigateToLabel123");

            labelMappingReferenceTextField()
                .type("A1");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            // navigate
            hashAppend("/cell/NavigateToLabel123");

            cell(A1)
                .should("have.focus");
            column("A")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("1")
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
            hashAppend("/label/" + LABEL);

            hash()
                .should('match', /.*\/Untitled\/label\/Label123/);
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

            cellClick(B2);

            hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Cell viewport cell click after editing name", () => {
            spreadsheetEmpty();
            spreadsheetNameClick();
            
            cellClick(B2);

            hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        // @see https://github.com/mP1/walkingkooka-spreadsheet-react/issues/1256
        it("Cell formula load then history hash save", () => {
            spreadsheetEmpty();

            cellClick(B2);

            formulaText()
                .click();

            hash().should('match', /.*\/Untitled\/cell\/B2\/formula/)

            hashAppend("/save/=2*3")

            cellFormattedTextCheck(B2, "6.");
        });

        it("Cell formula edit ENTER saves", () => {
            spreadsheetEmpty();

            cellClick(B2);

            hash().should('match', /.*\/Untitled\/cell\/B2/)

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=1+2+3{enter}");

            hash()
                .should('match', /.*\/Untitled\/cell\/B2\/formula/);

            cellFormattedTextCheck(B2, "6.");
        });

        it("Cell formula edit with reference", () => {
            spreadsheetEmpty();

            cellClick(C3);

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=1+2+3{enter}");

            cellClick(D4);

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=C3+10{enter}");

            cellFormattedTextCheck(D4, "16.");
        });

        it("Cell formula edit, update hash cell reference", () => {
            spreadsheetEmpty();

            cellClick(C3);

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=1+2+3{enter}");

            cy.window()
                .then(function(win) {
                    var hash = win.location.hash;
                    win.location.hash = hash.replace("/cell/C3/formula", "/cell/D4/formula");
                });

            renderWait();

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=4+5{enter}");

            cellFormattedTextCheck(D4, "9.");
        });

        it("Cell hash formula update", () => {
            spreadsheetEmpty();

            hashAppend("/cell/D4/formula");

            column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("4")
                .should("have.css", "background-color", SELECTED_COLOR);

            formulaText()
                .should("have.focus");
        });

        it("Cell hash append formula", () => {
            spreadsheetEmpty();

            cellClick(C3);

            renderWait(FORMULA_TEXT_CLICK_WAIT);

            hashAppend("/formula");

            renderWait(FORMULA_TEXT_CLICK_WAIT);

            formulaText()
                .should("have.focus");
        });

        it("Cell hash append formula has focus", () => {
            spreadsheetEmpty();

            cellClick(C3);

            renderWait(FORMULA_TEXT_CLICK_WAIT);

            hashAppend("/formula");

            renderWait(FORMULA_TEXT_CLICK_WAIT);

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

            cellClick(B2);

            hash()
                .should('match', /.*\/.*\/cell\/B2/);
        });

        it("Cell click columns & rows selected", () => {
            spreadsheetEmpty();

            cellClick(B2);

            hash()
                .should('match', /.*\/.*\/cell\/B2/);

            column("B")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell click and select using arrow keys", () => {
            spreadsheetEmpty();

            cellClick(C3);
            cell(C3)
                .type("{leftarrow}");

            renderWait(50);

            hash()
                .should('match', /.*\/.*\/cell\/B3/);

            cell(B3)
                .type("{rightarrow}");

            renderWait(50);

            hash()
                .should('match', /.*\/.*\/cell\/C3/);

            cell(C3)
                .type("{uparrow}");

            renderWait(50);

            hash()
                .should('match', /.*\/.*\/cell\/C2/);

            cell(C2)
                .type("{downarrow}");

            renderWait(50);
            
            hash()
                .should('match', /.*\/.*\/cell\/C3/);
        });

        it("Cell click and hit ENTER gives formula text focus", () => {
            spreadsheetEmpty();

            cellClick(A3);

            cell(A3)
                .type("{enter}");

            hash()
                .should('match', /.*\/.*\/cell\/A3\/formula/);

            formulaText()
                .should("have.focus");
        });

        it("Cell select and hit ESC loses viewport cell focus", () => {
            spreadsheetEmpty();

            cellClick(A3);

            hash()
                .should('match', /.*\/.*\/cell\/A3/);

            cell(A3)
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
                .type("{selectall}=234{enter}")
                .blur();

            // viewport should have jumped leaving T1 as the home cell.
            cell(A1)
                .should('not.exist');
        });

        it("Cell outside viewport vertical", () => {
            spreadsheetEmpty();

            hashAppend("/cell/A30");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=234{enter}")
                .blur();

            // viewport should have jumped leaving A30 as the home cell.
            cell(A1)
                .should('not.exist');
        });

        it("Cell outside viewport horiz & vertical", () => {
            spreadsheetEmpty();

            hashAppend("/cell/T30");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=234{enter}")
                .blur();

            // viewport should have jumped leaving T30 as the home cell.
            cell(A1)
                .should('not.exist');
        });

        it("Cell outside viewport and reload", () => {
            spreadsheetEmpty();

            hashAppend("/cell/M1");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=123{enter}")
                .blur();

            hashOnlyIdAndName();
            hashAppend("/cell/T1");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=234{enter}")
                .blur();

            hashOnlyIdAndName();
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
                .type("{selectall}=123{enter}")
                .blur();

            hashOnlyIdAndName();

            hashAppend("/cell/T20");

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=234{enter}")
                .blur();

            hashOnlyIdAndName();

            hashAppend("/cell/M10");

            cellFormattedTextCheck("M10", "123.");
            cellFormattedTextCheck("T20", "234.");
        });

        // column click.................................................................................................

        it("Column click should have focus and be selected", () => {
            spreadsheetEmpty();

            renderWait(100);

            column("B")
                .click();

            hash()
                .should('match', /.*\/.*\/column\/B/);

            column("B")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);

        });

        it("Column click and cursor RIGHT", () => {
            spreadsheetEmpty();

            column("B")
                .click();

            column("B")
                .type("{rightarrow}")

            hash()
                .should('match', /.*\/.*\/column\/C/);

            column("C")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column click and cursor DOWN", () => {
            spreadsheetEmpty();

            column("B")
                .click();

            column("B")
                .type("{downarrow}")

            hash()
                .should('match', /.*\/.*\/cell\/B1/);

            column("B")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("1")
                .should("have.css", "background-color", SELECTED_COLOR);
            cell(B1)
                .should("have.focus");
        });

        // row click.................................................................................................

        it("Row click should have focus and be selected", () => {
            spreadsheetEmpty();

            row("2")
                .click();

            hash()
                .should('match', /.*\/.*\/row\/2/);

            row("2")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Row click and cursor DOWN", () => {
            spreadsheetEmpty();

            row("2")
                .click()
                .should("have.focus");

            row("2")
                .type("{downarrow}")

            row("3")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);

            hash()
                .should('match', /.*\/.*\/row\/3/);
        });

        it("Row click and cursor RIGHT", () => {
            spreadsheetEmpty();

            row("2")
                .click();

            row("2")
                .type("{rightarrow}");

            hash()
                .should('match', /.*\/.*\/cell\/A2/);

            column("A")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
            cell(A2)
                .should("have.focus");
        });

        // cell range...................................................................................................

        it("Cell range history hash", () => {
            spreadsheetEmpty();

            hashAppend("/cell/B2:C3");

            hash()
                .should('match', /.*\/.*\/cell\/B2:C3/);

            column("B")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("C")
                .should("have.css", "background-color", SELECTED_COLOR);

            row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("3")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range out of viewport history hash", () => {
            spreadsheetEmpty();

            hashAppend("/cell/X2:Y3");

            hash()
                .should('match', /.*\/.*\/cell\/X2:Y3/);

            column("X")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("Y")
                .should("have.css", "background-color", SELECTED_COLOR);

            row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("3")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend left", () => {
            spreadsheetEmpty();

            hashAppend("/cell/D4:E5");

            hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            cell(D4)
                .type("{shift+leftarrow}");

            hash()
                .should('match', /.*\/.*\/cell\/C4:E5/);

            cell("C4")
                .should("have.focus");

            column("C")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("E")
                .should("have.css", "background-color", SELECTED_COLOR);

            row("4")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend right", () => {
            spreadsheetEmpty();

            hashAppend("/cell/D4:E5");

            hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            cell("D4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            cell("E4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            hash()
                .should('match', /.*\/.*\/cell\/E4:F5/);

            cell("F4")
                .should("have.focus");

            column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("F")
                .should("have.css", "background-color", SELECTED_COLOR);

            row("4")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend right twice", () => {
            spreadsheetEmpty();

            hashAppend("/cell/D4:E5");

            hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            cell("D4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            cell("E4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            hash()
                .should('match', /.*\/.*\/cell\/E4:F5/);

            cell("F4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            hash()
                .should('match', /.*\/.*\/cell\/E4:G5/);

            cell("G4")
                .should("have.focus");

            column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("F")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("G")
                .should("have.css", "background-color", SELECTED_COLOR);

            row("4")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend up", () => {
            spreadsheetEmpty();

            hashAppend("/cell/D4:E5");

            hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            cell(D4)
                .type("{shift+uparrow}");

            hash()
                .should('match', /.*\/.*\/cell\/D3:E5/);

            cell("D3")
                .should("have.focus");

            column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("E")
                .should("have.css", "background-color", SELECTED_COLOR);

            row("3")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("4")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend down", () => {
            spreadsheetEmpty();

            hashAppend("/cell/D4:E5");

            hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            cell("D4")
                .should("have.focus")
                .type("{shift+downarrow}");

            hash()
                .should('match', /.*\/.*\/cell\/D5:E5/);

            cell("D5")
                .should("have.focus")
                .type("{shift+downarrow}");

            hash()
                .should('match', /.*\/.*\/cell\/D5:E6/);

            cell("D6")
                .should("have.focus");

            column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("E")
                .should("have.css", "background-color", SELECTED_COLOR);

            row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("6")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend down twice", () => {
            spreadsheetEmpty();

            hashAppend("/cell/D4:E5");

            hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            cell("D4")
                .should("have.focus")
                .type("{shift+downarrow}");

            hash()
                .should('match', /.*\/.*\/cell\/D5:E5/);

            cell("D5")
                .should("have.focus")
                .type("{shift+downarrow}");

            hash()
                .should('match', /.*\/.*\/cell\/D5:E6/);

            cell("D6")
                .should("have.focus")
                .type("{shift+downarrow}");

            hash()
                .should('match', /.*\/.*\/cell\/D5:E7/);

            cell("D7")
                .should("have.focus")

            column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("E")
                .should("have.css", "background-color", SELECTED_COLOR);

            row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("6")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("7")
                .should("have.css", "background-color", SELECTED_COLOR);
        });
        
        // column range...................................................................................................

        it("Column range history hash", () => {
            spreadsheetEmpty();

            hashAppend("/column/B:C");

            hash()
                .should('match', /.*\/.*\/column\/B:C/);

            column("B")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("C")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range out of viewport history hash", () => {
            spreadsheetEmpty();

            hashAppend("/column/X:Y");

            hash()
                .should('match', /.*\/.*\/column\/X:Y/);

            column("X")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("Y")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range extend left", () => {
            spreadsheetEmpty();

            hashAppend("/column/E");

            hash()
                .should('match', /.*\/.*\/column\/E/);

            column("E")
                .type("{shift+leftarrow}");

            hash()
                .should('match', /.*\/.*\/column\/D:E/);
            
            column("D")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range extend left twice", () => {
            spreadsheetEmpty();

            hashAppend("/column/E:F");

            hash()
                .should('match', /.*\/.*\/column\/E/);

            column("E")
                .type("{shift+leftarrow}");

            column("D")
                .type("{shift+leftarrow}");
            
            hash()
                .should('match', /.*\/.*\/column\/C:E/);

            column("C")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range extend right", () => {
            spreadsheetEmpty();

            hashAppend("/column/E:F");

            hash()
                .should('match', /.*\/.*\/column\/E/);

            column("E")
                .type("{shift+rightarrow}");

            hash()
                .should('match', /.*\/.*\/column\/E:F/);

            column("F")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range extend right twice", () => {
            spreadsheetEmpty();

            hashAppend("/column/E:F");

            hash()
                .should('match', /.*\/.*\/column\/E/);

            column("E")
                .type("{shift+rightarrow}");

            column("F")
                .type("{shift+rightarrow}");

            hash()
                .should('match', /.*\/.*\/column\/E:G/);

            column("G")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("F")
                .should("have.css", "background-color", SELECTED_COLOR);
            column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
        });
        
        // row range...................................................................................................

        it("Row range history hash", () => {
            spreadsheetEmpty();

            hashAppend("/row/2:3");

            hash()
                .should('match', /.*\/.*\/row\/2:3/);

            row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("3")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Row range out of viewport history hash", () => {
            spreadsheetEmpty();

            hashAppend("/row/30:31");

            hash()
                .should('match', /.*\/.*\/row\/30:31/);

            row("30")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("31")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Row range extend top", () => {
            spreadsheetEmpty();

            hashAppend("/row/5");

            hash()
                .should('match', /.*\/.*\/row\/5/);

            row("5")
                .type("{shift+uparrow}");

            hash()
                .should('match', /.*\/.*\/row\/4:5/);

            row("4")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Row range extend top twice", () => {
            spreadsheetEmpty();

            hashAppend("/row/5");

            hash()
                .should('match', /.*\/.*\/row\/5/);

            row("5")
                .type("{shift+uparrow}");

            row("4")
                .type("{shift+uparrow}");

            hash()
                .should('match', /.*\/.*\/row\/3:5/);

            row("3")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("4")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Row range extend bottom", () => {
            spreadsheetEmpty();

            hashAppend("/row/5");

            hash()
                .should('match', /.*\/.*\/row\/5/);

            row("5")
                .type("{shift+downarrow}");

            hash()
                .should('match', /.*\/.*\/row\/5:6/);

            row("6")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Row range extend bottom twice", () => {
            spreadsheetEmpty();

            hashAppend("/row/5");

            hash()
                .should('match', /.*\/.*\/row\/5/);

            row("5")
                .type("{shift+downarrow}");

            row("6")
                .type("{shift+downarrow}");

            hash()
                .should('match', /.*\/.*\/row\/5:7/);

            row("7")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("6")
                .should("have.css", "background-color", SELECTED_COLOR);
            row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        // selection delete.............................................................................................

        it("Column select delete hash", () => {
            spreadsheetEmpty();

            renderWait(100);

            cellClick(E5);

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            column("B")
                .click();

            hashAppend("/delete");

            hash()
                .should('match', /.*\/.*/);

            cellFormattedTextCheck("D5", "Moved");
            cellFormattedTextCheck(E5, "");
        });

        it("Column range select delete hash", () => {
            spreadsheetEmpty();

            renderWait(100);

            cellClick(E5);

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            column("B")
                .click();

            hashAppend(":C/delete");

            hash()
                .should('match', /.*\/.*/);

            cellFormattedTextCheck("C5", "Moved");
            cellFormattedTextCheck(E5, "");
        });

        it("Row select delete hash", () => {
            spreadsheetEmpty();

            renderWait(100);

            cellClick(E5);

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            row("2")
                .click();

            hashAppend("/delete");

            hash()
                .should('match', /.*\/.*/);

            cellFormattedTextCheck("E4", "Moved");
            cellFormattedTextCheck(E5, "");
        });

        it("Row range select delete hash", () => {
            spreadsheetEmpty();

            renderWait(100);

            cellClick(E5);

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            row("2")
                .click();

            hashAppend(":3/delete");

            hash()
                .should('match', /.*\/.*/);

            cellFormattedTextCheck("E3", "Moved");
            cellFormattedTextCheck(E5, "");
        });

        // selection insert-after.............................................................................................

        it("Column select insert-after hash", () => {
            spreadsheetEmpty();

            renderWait(100);

            cellClick(E5);

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            column("B")
                .click();

            hashAppendWithoutCheck("/insert-after/1");

            hash()
                .should('match', /.*\/.*\/column\/B/);

            cellFormattedTextCheck("F5", "Moved");
            cellFormattedTextCheck(E5, "");
        });

        it("Column range select insert-after hash", () => {
            spreadsheetEmpty();

            renderWait(100);

            cellClick(E5);

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            column("B")
                .click();

            hashAppendWithoutCheck(":C/insert-after/2");

            hash()
                .should('match', /.*\/.*\/column\/B:C/);

            cellFormattedTextCheck("G5", "Moved");
            cellFormattedTextCheck(E5, "");
        });

        it("Row select insert-after hash", () => {
            spreadsheetEmpty();

            renderWait(100);

            cellClick(E5);

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            row("2")
                .click();

            hashAppendWithoutCheck("/insert-after/1");

            hash()
                .should('match', /.*\/.*\/row\/2/);

            cellFormattedTextCheck("E6", "Moved");
            cellFormattedTextCheck(E5, "");
        });

        it("Row range select insert-after hash", () => {
            spreadsheetEmpty();

            renderWait(100);

            cellClick(E5);

            formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Moved{enter}");

            row("2")
                .click();

            hashAppendWithoutCheck(":3/insert-after/2");

            hash()
                .should('match', /.*\/.*\/row\/2:3/);

            cellFormattedTextCheck("E7", "Moved");
            cellFormattedTextCheck(E5, "");
        });
        
        // selection then different viewport selections.................................................................

        it("Cell formula edit then column click", () => {
            spreadsheetEmpty();

            hashAppend("/cell/B2/formula");

            renderWait();

            column("C")
                .click();

            hash()
                .should('match', /.*\/.*\/column\/C/);
        });

        it("Cell formula edit then row click", () => {
            spreadsheetEmpty();

            hashAppend("/cell/B2/formula");

            renderWait();

            row("3")
                .click();

            hash()
                .should('match', /.*\/.*\/row\/3/);
        });

        it("Cell formula edit different formula edit", () => {
            spreadsheetEmpty();

            hashAppend("/cell/B2/formula");

            hash()
                .should('match', /.*\/.*\/cell\/B2\/formula/);

            hashAppend("/cell/C3/formula"); // invalid removes cell from hash
            hashAppend("/cell/C3/formula");

            hash()
                .should('match', /.*\/.*\/cell\/C3/);
        });

        it("Column select then Cell", () => {
            spreadsheetEmpty();

            hashAppend("/column/B");

            hash()
                .should('match', /.*\/.*\/column\/B/);

            cell(A1)
                .click();

            hash()
                .should('match', /.*\/.*\/cell\/A1/);
        });

        it("Row select then Cell", () => {
            spreadsheetEmpty();

            hashAppend("/row/2");

            hash()
                .should('match', /.*\/.*\/row\/2/);

            cell(A1)
                .click();

            hash()
                .should('match', /.*\/.*\/cell\/A1/);
        });

        // select.....................................................................................................

        const ENABLED = false;
        const DISABLED = true;

        it("Select using hash initial appearance", () => {
            spreadsheetEmpty();

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
            spreadsheetEmpty();

            selectHistoryHash();

            selectDialogTitle()
                .contains("Select");

            selectAutocompleteTextField()
                .should('have.focus')
                .should("have.value", "");
        });

        it("Select auto complete tabbing", () => {
            spreadsheetEmpty();

            selectHistoryHash();

            selectAutocompleteTextField()
                .should('have.focus')
                .type("Hello")
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
            spreadsheetEmpty();

            selectHistoryHash();

            selectDialogClose()
                .click();

            hash()
                .should('match', /.*\/Untitled/);

            selectDialog()
                .should("not.exist");
        });

        it("Select enter ESC closes", () => {
            spreadsheetEmpty();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("{Esc}");

            hash()
                .should('match', /.*\/Untitled/);

            selectDialog()
                .should("not.exist");
        });

        it("Select enter invalid cell or label", () => {
            spreadsheetEmpty();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("!invalid");

            selectAutocompleteTextFieldHelper()
                .should("have.text", "Invalid character '!' at 0");
        });

        it("Select enter cell and ENTER and click GOTO", () => {
            spreadsheetEmpty();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("B2{enter}");

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

            hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Select enter cell range and ENTER and click SELECT CELL RANGE", () => {
            spreadsheetEmpty();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("A1:B2{enter}");

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

            hash()
                .should('match', /.*\/Untitled\/cell\/A1:B2/);
        });

        it("Select enter unknown label and ENTER and click CREATE", () => {
            spreadsheetEmpty();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("Label123{enter}");

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

            hash()
                .should('match', /.*\/Untitled\/label\/Label123/);
        });

        it("Select enter known label and ENTER and click LABEL EDIT", () => {
            spreadsheetEmpty();
            hashLabel();

            labelMappingLabelTextField()
                .type("Label123");

            labelMappingReferenceTextField()
                .type("B2");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            hash()
                .should('match', /.*\/Untitled/);

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("Label123{enter}");

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

            hash()
                .should('match', /.*\/Untitled\/label\/Label123/);
        });

        it("Click CELL then select create LABEL and ENTER, verify cell not lost from hash", () => {
            spreadsheetEmpty();

            cell(A1)
                .click();

            hash()
                .should('match', /.*\/Untitled\/cell\/A1/);

            selectHistoryHash(); // TODO not sure WHY but select dialog doesnt appear in test.

            selectAutocompleteTextField()
                .type("Label123{enter}");

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

            hash()
                .should('match', /.*\/Untitled\/cell\/A1\/label\/Label123/);
        });

        it("Select enter cell, select from dropdown ENTER and click GOTO CELL", () => {
            spreadsheetEmpty();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("B2");

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

            hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Select enter column, select from dropdown ENTER and click GOTO COLUMN", () => {
            spreadsheetEmpty();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("C");

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

            hash()
                .should('match', /.*\/Untitled\/column\/C/);
        });

        it("Select enter column range, select from dropdown ENTER and click SELECT COLUMN RANGE", () => {
            spreadsheetEmpty();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("D:E");

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
            selectLabelCreateButton(ENABLED); // "C" could be a column or label so enable both
            selectLabelEditButton(DISABLED);
            selectLabelGotoButton(DISABLED);
            selectRowGotoButton(DISABLED);
            selectRowRangeSelectButton(DISABLED);
            
            selectColumnRangeSelectButton(ENABLED)
                .click();

            hash()
                .should('match', /.*\/Untitled\/column\/D:E/);
        });

        it("Select enter known label ENTER and click LABEL EDIT", () => {
            spreadsheetEmpty();
            hashLabel();

            labelMappingReferenceTextField()
                .type("B2");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("Label123{enter}");

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

            hash()
                .should('match', /.*\/Untitled\/label\/Label123/);
        });

        it("Select enter existing label, select from dropdown ENTER and click GOTO LABEL", () => {
            spreadsheetEmpty();
            hashLabel();

            labelMappingReferenceTextField()
                .type("B2");

            labelMappingLabelSaveButton()
                .click();

            labelMappingLabelCloseButton()
                .click();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("Label");

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

            hash()
                .should('match', /.*\/Untitled\/cell\/Label123/);
        });

        it("Select enter row, select from dropdown ENTER and click GOTO ROW", () => {
            spreadsheetEmpty();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("3");

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

            hash()
                .should('match', /.*\/Untitled\/row\/3/);
        });

        it("Select enter row range, select from dropdown ENTER and click SELECT ROW RANGE", () => {
            spreadsheetEmpty();

            selectHistoryHash();

            selectAutocompleteTextField()
                .type("4:6");

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

            hash()
                .should('match', /.*\/Untitled\/row\/4:6/);
        });

        it("Select link after cell click", () => {
            spreadsheetEmpty();

            cellClick(A1);

            selectLink()
                .should('have.text', "A1");

            cellClick(A2);

            selectLink()
                .should('have.text', "A2");
        });

        it("Select link click after cell click", () => {
            spreadsheetEmpty();

            cellClick(B1);

            selectLink()
                .should('have.text', "B1")
                .click();

            hash()
                .should('match', /.*\/Untitled\/cell\/B1\/select/);

            selectAutocompleteTextField()
                .should("have.value", "")
                .type("B2{enter}");

            selectCellGotoButton(false)
                .click();

            hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        function selectHistoryHash() {
            hashAppend("/select");
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
                .type("{selectall}=1+2+3{enter}");

            hashEnter("/");

            hash().should('match', /.*\/Untitled/) // => true

            spreadsheetEmptyCheck();
        });

        it("Spreadsheet create, edit cell, create empty, reload non empty", () => {
            spreadsheetEmpty();

            cy.window()
                .then(function(win) {
                    const nonEmptySpreadsheetHash = win.location.hash;

                    cellClick(A1);

                    formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type("{selectall}=1+2+3{enter}");
                    
                    spreadsheetEmpty();

                    // reload previous spreadsheet and verify viewport reloaded
                    hashEnter(nonEmptySpreadsheetHash);

                    hash()
                        .should('eq', nonEmptySpreadsheetHash);

                    cellFormattedTextCheck(A1, "6.");
                });
        });

        it("Spreadsheet create, edit cell, reload", () => {
            spreadsheetEmpty();

            cy.window()
                .then(function(win) {
                    const nonEmptySpreadsheetHash = win.location.hash;

                    cellClick(A1);

                    formulaText()
                        .click()
                        .wait(FORMULA_TEXT_CLICK_WAIT)
                        .type("{selectall}=1+2+3{enter}");

                    // reload previous spreadsheet and verify viewport reloaded
                    hashEnter(nonEmptySpreadsheetHash);

                    hash()
                        .should('eq', nonEmptySpreadsheetHash);

                    cellFormattedTextCheck(A1, "6.");
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

            cellClick(A1);

            cy.hash()
                .should("matches", /.*\/Untitled\/cell\/A1/);

            settingsToggle();

            cy.hash()
                .should("matches", /.*\/Untitled\/cell\/A1\/settings/);
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

                if(a1Formula){
                    cellClick(A1);

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
                        cellFormattedTextCheck(A1, a1CellContent);
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
                        cellClick(A1);
                        cellFormattedTextCheck(A1, a1CellContentDefault);
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
                        cellFormattedTextCheck(A1, a1CellContent);
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

                if(a1Formula){
                    cellClick(A1);

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
                        cellFormattedTextCheck(A1, a1CellContents[i]);
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

                if(a1Formula){
                    cellClick(A1);

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
                        cellFormattedTextCheck(A1, a1CellContents[i]);
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
                        cellFormattedTextCheck(A1, a1CellContents[i]);
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

                if(a1Formula){
                    cellClick(A1);

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
                        cellFormattedTextCheck(A1, a1CellContents[i]);
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

                cellClick(A1);

                formulaText()
                    .click()
                    .wait(FORMULA_TEXT_CLICK_WAIT)
                    .type("{selectall}'ABC"+ "{enter}", FORCE_TRUE);

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

                cellClick(A1);
                formulaText()
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

                cellClick(A1);
                formulaText()
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

        function hashAppendWithoutCheck(append) {
            cy.window()
                .then(function(win) {
                    const hash = win.location.hash;
                    const after = hash + append;

                    win.location.hash = after;
                });
        }

        function hashOnlyIdAndName() {
            cy.window()
                .then(function(win) {
                    const h = win.location.hash;

                    const slash0 = h.indexOf("/");
                    const slash1 = -1 !== slash0 && h.indexOf("/", slash0 + 1);
                    const slash2 = -1 !== slash1 && h.indexOf("/", slash1 + 1);

                    if(-1 !== slash2){
                        hashEnter(h.substring(0, slash2));

                        hash()
                            .should('match', /.*\/.*/);
                    }
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
            cell(cellReference)
                .click()
                .should("have.focus");
        }

        function cellFormattedTextCheck(cellReference, text) {
            cell(cellReference)
                .should("have.text", text);
        }

        function cellA1StyleCheck(property, value) {
            cell(A1)
                .should('have.css', property, value);
        }

        function cell(cellReference) {
            const spreadsheetCellReference = cellReference instanceof SpreadsheetCellReference ?
                cellReference :
                SpreadsheetCellReference.parse(cellReference);
            return cy.get("#" + spreadsheetCellReference.viewportId());
        }

        function column(columnReference) {
            const spreadsheetColumnReference = columnReference instanceof SpreadsheetColumnReference ?
                columnReference :
                SpreadsheetColumnReference.parse(columnReference);
            return cy.get("#" + spreadsheetColumnReference.viewportId());
        }

        function row(rowReference) {
            const spreadsheetRowReference = rowReference instanceof SpreadsheetRowReference ?
                rowReference :
                SpreadsheetRowReference.parse(rowReference);
            return cy.get("#" + spreadsheetRowReference.viewportId());
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