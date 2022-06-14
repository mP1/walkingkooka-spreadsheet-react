/// <reference types="cypress" />

import SpreadsheetCellReference from "../../src/spreadsheet/reference/SpreadsheetCellReference.js";
import SpreadsheetTesting from "./SpreadsheetTesting.js";

const A1 = SpreadsheetCellReference.parse("A1");
const A2 = SpreadsheetCellReference.parse("A2");
const B1 = SpreadsheetCellReference.parse("B1");

describe(
    "Select",
    () => {
        const testing = new SpreadsheetTesting(cy);

        beforeEach(() => {
            cy.visit('/');

            testing.spreadsheetEmptyReady();
        });

        const ENABLED = false;
        const DISABLED = true;

        it("Select using hash initial appearance", () => {
            testing.selectHistoryHash();

            testing.selectDialogTitle()
                .contains("Select");

            testing.selectAutocompleteTextField()
                .should("have.value", "");

            testing.selectAutocompleteTextFieldHelper()
                .should("not.exist");

            testing.selectCellGotoButton(DISABLED);
            testing.selectCellRangeSelectButton(DISABLED);
            testing.selectColumnGotoButton(DISABLED);
            testing.selectColumnRangeSelectButton(DISABLED);
            testing.selectLabelCreateButton(DISABLED);
            testing.selectLabelEditButton(DISABLED);
            testing.selectLabelGotoButton(DISABLED);
            testing.selectRowGotoButton(DISABLED);
            testing.selectRowRangeSelectButton(DISABLED);
        });

        it("Auto complete text field has focus", () => {
            testing.selectHistoryHash();

            testing.selectDialogTitle()
                .contains("Select");

            testing.selectAutocompleteTextField()
                .should('have.focus')
                .should("have.value", "");
        });

        it("Auto complete tabbing", () => {
            testing.selectHistoryHash();

            testing.selectAutocompleteTextField()
                .should('have.focus')
                .type("{selectall}Hello")
                .wait(50)
                .tab();

            testing.selectLabelCreateButton(false)
                .should("have.focus")
                .tab();

            // two keyboard tabs required to tab from CREATE-LINK to CLOSE BUTTON, 1st tab gives focus to dialog box.

            // selectDialogClose()
            //     .should("have.focus")
            //     .tab());
        });

        it("Open and close", () => {
            testing.selectHistoryHash();

            testing.selectDialogClose()
                .click();

            testing.hash()
                .should('match', /.*\/Untitled/);

            testing.selectDialog()
                .should("not.exist");
        });

        it("Enter ESC closes", () => {
            testing.selectHistoryHash();

            testing.selectAutocompleteTextField()
                .type("{esc}");

            testing.hash()
                .should('match', /.*\/Untitled/);

            testing.selectDialog()
                .should("not.exist");
        });

        it("Enter invalid cell or label", () => {
            testing.selectHistoryHash();

            testing.selectAutocompleteTextField()
                .type("{selectall}!invalid");

            testing.selectAutocompleteTextFieldHelper()
                .should("have.text", "Invalid character '!' at 0");
        });

        it("Enter cell and ENTER and click GOTO", () => {
            testing.selectHistoryHash();

            testing.selectAutocompleteTextField()
                .type("{selectall}B2{enter}");

            testing.selectAutocompleteTextFieldHelper()
                .should("not.exist");

            testing.selectAutocompletePopup()
                .should("not.exist");

            testing.selectCellRangeSelectButton(DISABLED);
            testing.selectColumnGotoButton(DISABLED);
            testing.selectColumnRangeSelectButton(DISABLED);
            testing.selectLabelCreateButton(DISABLED);
            testing.selectLabelEditButton(DISABLED);
            testing.selectLabelGotoButton(DISABLED);
            testing.selectRowGotoButton(DISABLED);
            testing.selectRowRangeSelectButton(DISABLED);

            testing.selectCellGotoButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Enter cell range and ENTER and click SELECT CELL RANGE", () => {
            testing.selectHistoryHash();

            testing.selectAutocompleteTextField()
                .type("{selectall}A1:B2{enter}");

            testing.selectAutocompleteTextFieldHelper()
                .should("not.exist");

            testing.selectAutocompletePopup()
                .should("not.exist");

            testing.selectCellGotoButton(DISABLED);
            testing.selectColumnGotoButton(DISABLED);
            testing.selectColumnRangeSelectButton(DISABLED);
            testing.selectLabelCreateButton(DISABLED);
            testing.selectLabelEditButton(DISABLED);
            testing.selectLabelGotoButton(DISABLED);
            testing.selectRowGotoButton(DISABLED);
            testing.selectRowRangeSelectButton(DISABLED);

            testing.selectCellRangeSelectButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/A1:B2/);
        });

        it("Enter unknown label and ENTER and click CREATE", () => {
            testing.selectHistoryHash();

            testing.selectAutocompleteTextField()
                .type("{selectall}Label123{enter}");

            testing.selectAutocompleteTextFieldHelper()
                .should("not.exist");

            testing.selectAutocompletePopup()
                .should("not.exist");

            testing.selectCellGotoButton(DISABLED);
            testing.selectCellRangeSelectButton(DISABLED);
            testing.selectColumnGotoButton(DISABLED);
            testing.selectColumnRangeSelectButton(DISABLED);
            testing.selectLabelEditButton(DISABLED);
            testing.selectLabelGotoButton(DISABLED);
            testing.selectRowGotoButton(DISABLED);
            testing.selectRowRangeSelectButton(DISABLED);

            testing.selectLabelCreateButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/label\/Label123/);
        });

        it("Enter known label and ENTER and click LABEL EDIT", () => {
            testing.hashLabel();

            testing.labelMappingLabelTextField()
                .type("{selectall}Label123");

            testing.labelMappingReferenceTextField()
                .type("{selectall}B2");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingLabelCloseButton()
                .click();

            testing.hash()
                .should('match', /.*\/Untitled/);

            testing.selectHistoryHash();

            testing.selectAutocompleteTextField()
                .type("{selectall}Label123{enter}");

            testing.selectAutocompleteTextFieldHelper()
                .should("not.exist");

            testing.selectAutocompletePopup()
                .should("not.exist");

            testing.selectCellGotoButton(DISABLED);
            testing.selectCellRangeSelectButton(DISABLED);
            testing.selectColumnGotoButton(DISABLED);
            testing.selectColumnRangeSelectButton(DISABLED);
            testing.selectLabelCreateButton(DISABLED);
            testing.selectLabelGotoButton(ENABLED);
            testing.selectRowGotoButton(DISABLED);
            testing.selectRowRangeSelectButton(DISABLED);

            testing.selectLabelEditButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/label\/Label123/);
        });

        it("Click CELL then select create LABEL and ENTER, verify cell not lost from hash", () => {
            testing.cell(A1)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/A1/);

            testing.selectHistoryHash(); // TODO not sure WHY but select dialog doesnt appear in test.

            testing.selectAutocompleteTextField()
                .type("{selectall}Label123{enter}");

            testing.selectAutocompleteTextFieldHelper()
                .should("not.exist");

            testing.selectAutocompletePopup()
                .should("not.exist");

            testing.selectCellGotoButton(DISABLED);
            testing.selectCellRangeSelectButton(DISABLED);
            testing.selectColumnGotoButton(DISABLED);
            testing.selectColumnRangeSelectButton(DISABLED);
            testing.selectLabelEditButton(DISABLED);
            testing.selectLabelGotoButton(DISABLED);
            testing.selectRowGotoButton(DISABLED);
            testing.selectRowRangeSelectButton(DISABLED);

            testing.selectLabelCreateButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/A1\/label\/Label123/);
        });

        it("Enter cell, select from dropdown ENTER and click GOTO CELL", () => {
            testing.selectHistoryHash();

            testing.selectAutocompleteTextField()
                .type("{selectall}B2");

            testing.selectAutocompleteTextFieldHelper()
                .should("not.exist");

            testing.selectAutocompletePopup()
                .should("exist");

            testing.selectAutocompletePopupOption(0)
                .should("have.text", "B2");

            testing.selectAutocompleteTextField()
                .type("{downarrow}{enter}");

            testing.selectCellRangeSelectButton(DISABLED);
            testing.selectColumnGotoButton(DISABLED);
            testing.selectColumnRangeSelectButton(DISABLED);
            testing.selectLabelCreateButton(DISABLED);
            testing.selectLabelEditButton(DISABLED);
            testing.selectLabelGotoButton(DISABLED);
            testing.selectRowGotoButton(DISABLED);
            testing.selectRowRangeSelectButton(DISABLED);

            testing.selectCellGotoButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Enter column, select from dropdown ENTER and click GOTO COLUMN", () => {
            testing.spreadsheetEmptyReady();

            testing.selectHistoryHash();

            testing.selectAutocompleteTextField()
                .type("{selectall}C");

            testing.selectAutocompleteTextFieldHelper()
                .should("not.exist");

            testing.selectAutocompletePopup()
                .should("exist");

            testing.selectAutocompletePopupOption(0)
                .should("have.text", "C");

            testing.selectAutocompleteTextField()
                .type("{downarrow}{enter}");

            testing.selectCellGotoButton(DISABLED);
            testing.selectCellRangeSelectButton(DISABLED);
            testing.selectColumnRangeSelectButton(DISABLED);
            testing.selectLabelCreateButton(ENABLED); // "C" could be a column or label so enable both
            testing.selectLabelEditButton(DISABLED);
            testing.selectLabelGotoButton(DISABLED);
            testing.selectRowGotoButton(DISABLED);
            testing.selectRowRangeSelectButton(DISABLED);

            testing.selectColumnGotoButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/column\/C/);
        });

        it("Enter column range, select from dropdown ENTER and click SELECT COLUMN RANGE", () => {
            testing.selectHistoryHash();

            testing.selectAutocompleteTextField()
                .type("{selectall}D:E");

            testing.selectAutocompleteTextFieldHelper()
                .should("not.exist");

            testing.selectAutocompletePopup()
                .should("exist");

            testing.selectAutocompletePopupOption(0)
                .should("have.text", "D:E");

            testing.selectAutocompleteTextField()
                .type("{downarrow}{enter}");

            testing.selectCellGotoButton(DISABLED);
            testing.selectCellRangeSelectButton(DISABLED);
            testing.selectColumnGotoButton(DISABLED);
            testing.selectLabelCreateButton(DISABLED);
            testing.selectLabelEditButton(DISABLED);
            testing.selectLabelGotoButton(DISABLED);
            testing.selectRowGotoButton(DISABLED);
            testing.selectRowRangeSelectButton(DISABLED);

            testing.selectColumnRangeSelectButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/column\/D:E/);
        });

        it("Enter known label ENTER and click LABEL EDIT", () => {
            testing.hashLabel();

            testing.labelMappingReferenceTextField()
                .type("{selectall}B2");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingLabelCloseButton()
                .click();

            testing.selectHistoryHash();

            testing.selectAutocompleteTextField()
                .type("{selectall}Label123{enter}");

            testing.selectAutocompleteTextFieldHelper()
                .should("not.exist");

            testing.selectAutocompletePopup()
                .should("not.exist");

            testing.selectCellGotoButton(DISABLED);
            testing.selectCellRangeSelectButton(DISABLED);
            testing.selectColumnGotoButton(DISABLED);
            testing.selectColumnRangeSelectButton(DISABLED);
            testing.selectLabelGotoButton(ENABLED);
            testing.selectLabelCreateButton(DISABLED);
            testing.selectRowGotoButton(DISABLED);
            testing.selectRowRangeSelectButton(DISABLED);

            testing.selectLabelEditButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/label\/Label123/);
        });

        it("Enter existing label, select from dropdown ENTER and click GOTO LABEL", () => {
            testing.hashLabel();

            testing.labelMappingReferenceTextField()
                .type("{selectall}B2");

            testing.labelMappingLabelSaveButton()
                .click();

            testing.labelMappingLabelCloseButton()
                .click();

            testing.selectHistoryHash();

            testing.selectAutocompleteTextField()
                .type("{selectall}Label");

            testing.selectAutocompleteTextFieldHelper()
                .should("not.exist");

            testing.selectAutocompletePopup()
                .should("exist");

            testing.selectAutocompletePopupOption(0)
                .should("have.text", "Label");

            testing.selectAutocompletePopupOption(1)
                .should("have.text", "Label123");

            testing.selectAutocompleteTextField()
                .type("{downarrow}{downarrow}{enter}");

            testing.selectCellGotoButton(DISABLED);
            testing.selectCellRangeSelectButton(DISABLED);
            testing.selectColumnGotoButton(DISABLED);
            testing.selectColumnRangeSelectButton(DISABLED);
            testing.selectLabelCreateButton(DISABLED);
            testing.selectLabelEditButton(ENABLED);
            testing.selectRowGotoButton(DISABLED);
            testing.selectRowRangeSelectButton(DISABLED);

            testing.selectLabelGotoButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/Label123/);
        });

        it("Enter row, select from dropdown ENTER and click GOTO ROW", () => {
            testing.selectHistoryHash();

            testing.selectAutocompleteTextField()
                .type("{selectall}3");

            testing.selectAutocompleteTextFieldHelper()
                .should("not.exist");

            testing.selectAutocompletePopup()
                .should("exist");

            testing.selectAutocompletePopupOption(0)
                .should("have.text", "3");

            testing.selectAutocompleteTextField()
                .type("{downarrow}{enter}");

            testing.selectCellGotoButton(DISABLED);
            testing.selectCellRangeSelectButton(DISABLED);
            testing.selectColumnGotoButton(DISABLED);
            testing.selectColumnRangeSelectButton(DISABLED);
            testing.selectLabelCreateButton(DISABLED);
            testing.selectLabelEditButton(DISABLED);
            testing.selectLabelGotoButton(DISABLED);
            testing.selectRowRangeSelectButton(DISABLED);

            testing.selectRowGotoButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/row\/3/);
        });

        it("Enter row range, select from dropdown ENTER and click SELECT ROW RANGE", () => {
            testing.selectHistoryHash();

            testing.selectAutocompleteTextField()
                .type("{selectall}4:6");

            testing.selectAutocompleteTextFieldHelper()
                .should("not.exist");

            testing.selectAutocompletePopup()
                .should("exist");

            testing.selectAutocompletePopupOption(0)
                .should("have.text", "4:6");

            testing.selectAutocompleteTextField()
                .type("{downarrow}{enter}");

            testing.selectCellGotoButton(DISABLED);
            testing.selectCellRangeSelectButton(DISABLED);
            testing.selectColumnGotoButton(DISABLED);
            testing.selectColumnRangeSelectButton(DISABLED);
            testing.selectLabelCreateButton(DISABLED);
            testing.selectLabelEditButton(DISABLED);
            testing.selectLabelGotoButton(DISABLED);
            testing.selectRowGotoButton(DISABLED);

            testing.selectRowRangeSelectButton(ENABLED)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/row\/4:6/);
        });

        it("Cell click then verify Select link", () => {
            testing.cellClick(A1);

            testing.selectLink()
                .should('have.text', "A1");

            testing.cellClick(A2);

            testing.selectLink()
                .should('have.text', "A2");
        });

        it("Cell click then click Select link", () => {
            testing.cellClick(B1);

            testing.selectLink()
                .should('have.text', "B1")
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B1\/select/);

            testing.selectAutocompleteTextField()
                .should("have.value", "")
                .type("{selectall}B2{enter}");

            testing.selectCellGotoButton(false)
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });
    }
);