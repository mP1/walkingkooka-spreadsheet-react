/// <reference types="cypress" />

import SpreadsheetCellReference from "../../src/spreadsheet/reference/SpreadsheetCellReference.js";
import SpreadsheetRowReference from "../../src/spreadsheet/reference/SpreadsheetRowReference.js";
import SpreadsheetSelection from "../../src/spreadsheet/reference/SpreadsheetSelection.js";
import SpreadsheetTesting from "./SpreadsheetTesting.js";

const A1 = SpreadsheetCellReference.parse("A1");
const A2 = SpreadsheetCellReference.parse("A2");
const C3 = SpreadsheetCellReference.parse("C3");
const E5 = SpreadsheetCellReference.parse("E5");

const ROW_2 = SpreadsheetRowReference.parse("2");
const ROW_3 = SpreadsheetRowReference.parse("3");

const SELECTED_COLOR = "rgb(68, 68, 68)";

describe("Row",
    () => {

        const testing = new SpreadsheetTesting(cy);

        beforeEach(() => {
            cy.visit('/');

            testing.spreadsheetEmptyReady();
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

        // row range...................................................................................................

        it("Column range extend up", () => {
            testing.hashAppend("/row/5");

            testing.historyWait();

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

        it("Column range extend down", () => {
            testing.hashAppend("/row/5");

            testing.historyWait();

            testing.row("5")
                .type("{shift+downarrow}");

            testing.historyWait();

            testing.hash()
                .should('match', /.*\/.*\/row\/5:6/);

            testing.row("6")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range extend up twice", () => {
            testing.hashAppend("/row/5:6");

            testing.historyWait();

            testing.row("5")
                .type("{shift+uparrow}");

            testing.row("4")
                .type("{shift+uparrow}");

            testing.historyWait();

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

        it("Column range extend down twice", () => {
            testing.hashAppend("/row/5:6");

            testing.historyWait();

            testing.row("6")
                .type("{shift+downarrow}");

            testing.row("7")
                .type("{shift+downarrow}");

            testing.historyWait();

            testing.hash()
                .should('match', /.*\/.*\/row\/5:8/);

            testing.row("8")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("7")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("6")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        // selection delete.............................................................................................

        it("Row select delete hash", () => {
            testing.cellFormulaEnterAndSave(E5, "'Moved");

            testing.row("2")
                .click();

            testing.historyWait();

            testing.hashAppend("/delete");

            testing.historyWait();

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck("E4", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Row range select delete hash", () => {
            testing.cellFormulaEnterAndSave(E5,"'Moved");

            testing.row("2")
                .click();

            testing.historyWait();

            testing.hashAppend(":3/delete");

            testing.historyWait();

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck("E3", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        // selection insert-after.............................................................................................

        it("Row select insert-after hash", () => {
            testing.cellFormulaEnterAndSave(E5,"'Moved");

            testing.row("2")
                .click();

            testing.historyWait();

            testing.hashAppendWithoutCheck("/insert-after/1");

            testing.historyWait();

            testing.hash()
                .should('match', /.*\/.*\/row\/2/);

            testing.cellFormattedTextCheck("E6", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Row range select insert-after hash", () => {
            testing.cellFormulaEnterAndSave(E5,"'Moved");

            testing.row("2")
                .click();

            testing.historyWait();

            testing.hashAppendWithoutCheck(":3/insert-after/2");

            testing.hash()
                .should('match', /.*\/.*\/row\/2:3/);

            testing.cellFormattedTextCheck("E7", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        // selection insert-before.............................................................................................

        it("Row select insert-before hash", () => {
            testing.cellFormulaEnterAndSave(E5,"'Moved");

            testing.row("2")
                .click();

            testing.historyWait();

            testing.hashAppendWithoutCheck("/insert-before/1");

            testing.hash()
                .should('match', /.*\/.*\/row\/3/);

            testing.cellFormattedTextCheck("E6", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Row range select insert-before hash", () => {
            testing.cellFormulaEnterAndSave(E5,"'Moved");

            testing.row("2")
                .click();

            testing.historyWait();

            testing.hashAppendWithoutCheck(":3/insert-before/2");

            testing.hash()
                .should('match', /.*\/.*\/row\/4:5/);

            testing.cellFormattedTextCheck("E7", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        // selection then different viewport selections.................................................................

        it("Row select then Cell", () => {
            testing.hashAppend("/row/2");

            testing.cell(A1)
                .click();

            testing.hash()
                .should('match', /.*\/.*\/cell\/A1/);
        });

        // row context menu...........................................................................................

        it("Row context menu", () => {
            testing.contextMenu(ROW_3.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("LI")
                .should("have.length", 4);
        });

        it("Row context menu click insert before 2", () => {
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.contextMenu(ROW_3.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID)
                .should("include.text", "Insert 2 before");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck("C5", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Row context menu click insert before 1", () => {
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.contextMenu(ROW_3.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID)
                .should("include.text", "Insert 1 before");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck("C4", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Row context menu click insert after 1", () => {
            testing.cellFormulaEnterAndSave(A1, "'Never");
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.contextMenu(ROW_2.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID)
                .should("include.text", "Insert 1 after");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck("A1", "Never");
            testing.cellFormattedTextCheck("C4", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Row context menu click insert after 2", () => {
            testing.cellFormulaEnterAndSave(A1, "'Never");
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.contextMenu(ROW_2.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID)
                .should("include.text", "Insert 2 after");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck("A1", "Never");
            testing.cellFormattedTextCheck("C5", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Row select then context menu click insert before 2", () => {
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.row("3")
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/row\/3/);

            testing.contextMenu(ROW_3.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID)
                .should("include.text", "Insert 2 before");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.hash()
                .should('match', /.*\/Untitled\/row\/5/);

            testing.cellFormattedTextCheck("C5", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Row select then context menu click insert before 1", () => {
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.row("3")
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/row\/3/);

            testing.contextMenu(ROW_3.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID)
                .should("include.text", "Insert 1 before");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.hash()
                .should('match', /.*\/Untitled\/row\/4/);

            testing.cellFormattedTextCheck("C4", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Row select then context menu click insert after 1", () => {
            testing.cellFormulaEnterAndSave(A1, "'Never");
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.row("2")
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/row\/2/);

            testing.contextMenu(ROW_2.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID)
                .should("include.text", "Insert 1 after");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.hash()
                .should('match', /.*\/Untitled\/row\/2/);

            testing.cellFormattedTextCheck("A1", "Never");
            testing.cellFormattedTextCheck("C4", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Row select then context menu click insert after 2", () => {
            testing.cellFormulaEnterAndSave(A1, "'Never");
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.row("2")
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/row\/2/);

            testing.contextMenu(ROW_2.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID)
                .should("include.text", "Insert 2 after");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.hash()
                .should('match', /.*\/Untitled\/row\/2/);

            testing.cellFormattedTextCheck("A1", "Never");
            testing.cellFormattedTextCheck("C5", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Row range context menu links", () => {
            testing.hashAppend("/row/2:3");

            testing.contextMenu(ROW_2.viewportId());

            testing.viewportContextMenu()
                .should("be.visible");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/row\/2:3\/insert-after\/1/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/row\/2:3\/insert-after\/2/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/row\/2:3\/insert-before\/1/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/row\/2:3\/insert-before\/2/);
        });
    }
);