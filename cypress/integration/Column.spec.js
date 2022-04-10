/// <reference types="cypress" />

import SpreadsheetCellReference from "../../src/spreadsheet/reference/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "../../src/spreadsheet/reference/SpreadsheetColumnReference.js";
import SpreadsheetSelection from "../../src/spreadsheet/reference/SpreadsheetSelection.js";
import SpreadsheetTesting from "./SpreadsheetTesting.js";

const A1 = SpreadsheetCellReference.parse("A1");
const B1 = SpreadsheetCellReference.parse("B1");
const B2 = SpreadsheetCellReference.parse("B2");
const C3 = SpreadsheetCellReference.parse("C3");
const D4 = SpreadsheetCellReference.parse("D4");
const E5 = SpreadsheetCellReference.parse("E5");

const A = SpreadsheetColumnReference.parse("A");
const B = SpreadsheetColumnReference.parse("B");
const C = SpreadsheetColumnReference.parse("C");
const D = SpreadsheetColumnReference.parse("D");

const SELECTED_COLOR = "rgb(68, 68, 68)";

describe(
    "Column",
    () => {

        const testing = new SpreadsheetTesting(cy);

        beforeEach(() => {
            cy.visit('/');

            testing.spreadsheetEmptyReady();
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

        // column range...................................................................................................

        it("Column range history hash", () => {
            testing.hashAppend("/column/B:C");

            testing.column("B")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("C")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range out of viewport history hash", () => {
            testing.hashAppend("/column/X:Y");

            testing.column("X")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("Y")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range extend left", () => {
            testing.hashAppend("/column/E");

            testing.historyWait();

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

        it("Column range extend right", () => {
            testing.hashAppend("/column/E");

            testing.historyWait();

            testing.column("E")
                .type("{shift+rightarrow}");

            testing.historyWait();

            testing.hash()
                .should('match', /.*\/.*\/column\/E:F/);

            testing.column("F")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range extend left twice", () => {
            testing.hashAppend("/column/E:F");

            testing.historyWait();

            testing.column("E")
                .type("{shift+leftarrow}");

            testing.historyWait();

            testing.column("D")
                .type("{shift+leftarrow}");

            testing.historyWait();

            testing.hash()
                .should('match', /.*\/.*\/column\/C:F\/right/);

            testing.column("C")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("F")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Column range extend right twice", () => {
            testing.hashAppend("/column/E:F");

            testing.historyWait();

            testing.column("F")
                .type("{shift+rightarrow}");

            testing.historyWait();

            testing.column("G")
                .type("{shift+rightarrow}");

            testing.historyWait();

            testing.hash()
                .should('match', /.*\/.*\/column\/F:H\/left/);

            testing.column("H")
                .should("have.focus")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("G")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("F")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        // selection delete.............................................................................................

        it("Column select delete hash", () => {
            testing.cellFormulaEnterAndSave(E5, "'Moved");

            testing.column("B")
                .click();

            testing.historyWait();

            testing.hashAppend("/delete");

            testing.historyWait();

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck("D5", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Column range select delete hash", () => {
            testing.cellFormulaEnterAndSave(E5, "'Moved");

            testing.column("B")
                .click();

            testing.historyWait();

            testing.hashAppend(":C/delete");

            testing.historyWait();

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck("C5", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        // selection insert-after.............................................................................................

        it("Column select insert-after hash", () => {
            testing.cellFormulaEnterAndSave(E5, "'Moved");

            testing.column("B")
                .click();

            testing.historyWait();

            testing.hashAppendWithoutCheck("/insert-after/1");

            testing.hash()
                .should('match', /.*\/.*\/column\/B/);

            testing.cellFormattedTextCheck("F5", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Column range select insert-after hash", () => {
            testing.cellFormulaEnterAndSave(E5, "'Moved");

            testing.column("B")
                .click();

            testing.historyWait();

            testing.hashAppendWithoutCheck(":C/insert-after/2");

            testing.hash()
                .should('match', /.*\/.*\/column\/B:C/);

            testing.cellFormattedTextCheck("G5", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        // selection insert-before.............................................................................................

        it("Column select insert-before hash", () => {
            testing.cellFormulaEnterAndSave(E5, "'Moved");

            testing.column("B")
                .click();

            testing.historyWait();

            testing.hashAppendWithoutCheck("/insert-before/1");

            testing.hash()
                .should('match', /.*\/.*\/column\/C/);

            testing.cellFormattedTextCheck("F5", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Column range select insert-before hash", () => {
            testing.cellFormulaEnterAndSave(E5, "'Moved");

            testing.column("B")
                .click();

            testing.historyWait();

            testing.hashAppendWithoutCheck(":C/insert-before/2");

            testing.hash()
                .should('match', /.*\/.*\/column\/D:E/);

            testing.cellFormattedTextCheck("G5", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        // selection then different viewport selections.................................................................

        it("Column select then Cell", () => {
            testing.hashAppend("/column/B");

            testing.cell(A1)
                .click();

            testing.hash()
                .should('match', /.*\/.*\/cell\/A1/);
        });

        // column context menu...........................................................................................

        it("/column/$column/menu", () => {
            testing.hashAppend("/column/A/menu")

            testing.viewportContextMenu()
                .should("be.visible")
                .find("LI")
                .should("have.length", 10);
        });

        it("Column context menu", () => {
            testing.contextMenu(C.viewportId());

            testing.hash()
                .should('match', /.*\/.*\/column\/C\/menu/);

            testing.viewportContextMenu()
                .should("be.visible")
                .find("LI")
                .should("have.length", 10);
        });

        it("Column context menu links", () => {
            testing.hashAppend("/column/B");

            testing.contextMenu(B.viewportId());

            testing.viewportContextMenu()
                .should("be.visible");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_CLEAR_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/B\/clear/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/B\/delete/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/B\/insert-after\/1/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/B\/insert-after\/2/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/B\/insert-before\/1/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/B\/insert-before\/2/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_1_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/A\/freeze/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_2_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/A:B\/freeze/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_3_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/A:C\/freeze/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/B\/hidden\/true/);
        });

        it("Column range context menu links", () => {
            testing.hashAppend("/column/B:C");

            testing.contextMenu(C.viewportId());

            testing.viewportContextMenu()
                .should("be.visible");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_CLEAR_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/B:C\/clear/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/B:C\/delete/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/B:C\/insert-after\/1/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/B:C\/insert-after\/2/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/B:C\/insert-before\/1/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/B:C\/insert-before\/2/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_1_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/A\/freeze/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_2_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/A:B\/freeze/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_3_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/A:C\/freeze/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID)
                .should("have.attr", "href")
                .and('match', /#*\/*\/column\/B:C\/hidden\/true/);
        });

        it("Column context menu click clear", () => {
            testing.cellFormulaEnterAndSave(A1, "'Before");
            testing.cellFormulaEnterAndSave(B2, "'Cleared");
            testing.cellFormulaEnterAndSave(C3, "'After");

            testing.contextMenu(B.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_CLEAR_ID)
                .should("include.text", "Clear");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_CLEAR_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck(A1, "Before");
            testing.cellFormattedTextCheck("C3", "After");
        });

        it("Column range context menu click clear", () => {
            testing.cellFormulaEnterAndSave(A1, "'Before");
            testing.cellFormulaEnterAndSave(B2, "'Cleared");
            testing.cellFormulaEnterAndSave(C3, "'Cleared");
            testing.cellFormulaEnterAndSave(D4, "'After");

            testing.column(B)
                .click();

            testing.column(B)
                .type("{shift+rightarrow}");

            testing.hash()
                .should('match', /.*\/.*\/column\/B:C\/left/);

            testing.contextMenu(B.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_CLEAR_ID)
                .should("include.text", "Clear");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_CLEAR_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck(A1, "Before");
            testing.cellFormattedTextCheck(D4, "After");
        });

        it("Column context menu click delete", () => {
            testing.cellFormulaEnterAndSave(A1, "'Stationary");
            testing.cellFormulaEnterAndSave(B2, "'Deleted");
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.contextMenu(B.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ID)
                .should("include.text", "Delete");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck("B3", "Moved");
            testing.cellFormattedTextCheck(A1, "Stationary");
        });

        it("Column range context menu click delete", () => {
            testing.cellFormulaEnterAndSave(A1, "'Stationary");
            testing.cellFormulaEnterAndSave(B2, "'Deleted");
            testing.cellFormulaEnterAndSave(C3, "'Deleted");
            testing.cellFormulaEnterAndSave(D4, "'Moved");

            testing.column(B)
                .click();

            testing.column(B)
                .type("{shift+rightarrow}");

            testing.hash()
                .should('match', /.*\/.*\/column\/B:C\/left/);

            testing.contextMenu(B.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ID)
                .should("include.text", "Delete");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck("A1", "Stationary");
            testing.cellFormattedTextCheck("B4", "Moved");
        });

        it("Column context menu click insert before 2", () => {
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.contextMenu(C.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID)
                .should("include.text", "Insert 2 before");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck("E3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column context menu click insert before 1", () => {
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.contextMenu(C.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID)
                .should("include.text", "Insert 1 before");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck("D3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column context menu click insert after 1", () => {
            testing.cellFormulaEnterAndSave(A1, "'Never");
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.contextMenu(B.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID)
                .should("include.text", "Insert 1 after");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck("A1", "Never");
            testing.cellFormattedTextCheck("D3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column context menu click insert after 2", () => {
            testing.cellFormulaEnterAndSave(A1, "'Never");
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.contextMenu(B.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID)
                .should("include.text", "Insert 2 after");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.cellFormattedTextCheck("A1", "Never");
            testing.cellFormattedTextCheck("E3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column select then context menu click insert before 2", () => {
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.column("C")
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/column\/C/);

            testing.contextMenu(C.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID)
                .should("include.text", "Insert 2 before");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_2_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.hash()
                .should('match', /.*\/Untitled\/column\/E/);

            testing.cellFormattedTextCheck("E3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column select then context menu click insert before 1", () => {
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.column("C")
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/column\/C/);

            testing.contextMenu(C.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID)
                .should("include.text", "Insert 1 before");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_BEFORE_1_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.hash()
                .should('match', /.*\/Untitled\/column\/D/);

            testing.cellFormattedTextCheck("D3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column select then context menu click insert after 1", () => {
            testing.cellFormulaEnterAndSave(A1, "'Never");
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.column("B")
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/column\/B/);

            testing.contextMenu(B.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID)
                .should("include.text", "Insert 1 after");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_1_ID)
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
            testing.cellFormulaEnterAndSave(A1, "'Never");
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.column("B")
                .click();

            testing.hash()
                .should('match', /.*\/Untitled\/column\/B/);

            testing.contextMenu(B.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID)
                .should("include.text", "Insert 2 after");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_INSERT_AFTER_2_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.hash()
                .should('match', /.*\/Untitled\/column\/B/);

            testing.cellFormattedTextCheck("A1", "Never");
            testing.cellFormattedTextCheck("E3", "Moved");
            testing.cellFormattedTextCheck(C3, "");
        });

        it("Column context menu click hide", () => {
            testing.cellFormulaEnterAndSave(A1, "'Before");
            testing.cellFormulaEnterAndSave(B2, "'Hidden");
            testing.cellFormulaEnterAndSave(C3, "'After");

            testing.contextMenu(B.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID)
                .should("include.text", "Hide");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.columnWait();

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck(A1, "Before");
            testing.get(B2.viewportId())
                .should("not.exist");
            testing.cellFormattedTextCheck("C3", "After");
        });

        it("Column range context menu click hide", () => {
            testing.cellFormulaEnterAndSave(A1, "'Before");
            testing.cellFormulaEnterAndSave(B2, "'Hidden");
            testing.cellFormulaEnterAndSave(C3, "'Hidden");
            testing.cellFormulaEnterAndSave(D4, "'After");

            testing.column("B")
                .click();
            testing.historyWait();
            testing.hashAppend(":C");

            testing.contextMenu(B.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID)
                .should("include.text", "Hide");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.columnWait();

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck(A1, "Before");
            testing.get(B2.viewportId())
                .should("not.exist");
            testing.get(C3.viewportId())
                .should("not.exist");
            testing.cellFormattedTextCheck("D4", "After");
        });

        it("Attempt to history hash select hidden column cleared", () => {
            testing.contextMenu(B.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID)
                .should("include.text", "Hide");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.columnWait();

            testing.hash()
                .should('match', /.*\/.*/);

            testing.hashAppend("/column/B");

            testing.columnWait();

            testing.hash()
                .should('match', /.*\/.*/);
        });

        it("Attempt to history hash select cell in hidden column cleared", () => {
            testing.contextMenu(B.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID)
                .should("include.text", "Hide");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.columnWait();

            testing.hash()
                .should('match', /.*\/.*/);

            testing.hashAppend("/cell/B2");

            testing.columnWait();

            testing.hash()
                .should('match', /.*\/.*/);
        });

        // unhide ......................................................................................................

        it("Column context menu click unhide column after", () => {
            testing.cellFormulaEnterAndSave(A1, "'Before");
            testing.cellFormulaEnterAndSave(B2, "'Hidden");
            testing.cellFormulaEnterAndSave(C3, "'After");

            testing.columnHide(B);

            // column A context menu should have a Unhide column B menu item...
            testing.contextMenu(A.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNHIDE_AFTER_ID)
                .should("include.text", "Unhide column B");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNHIDE_AFTER_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.columnWait();

            // verify columns A, B, C are visible.
            testing.cellFormattedTextCheck(A1, "Before");
            testing.cellFormattedTextCheck(B2, "Hidden");
            testing.cellFormattedTextCheck(C3, "After");
        });

        it("Column context menu click unhide column before", () => {
            testing.cellFormulaEnterAndSave(A1, "'Before");
            testing.cellFormulaEnterAndSave(B2, "'Hidden");
            testing.cellFormulaEnterAndSave(C3, "'After");

            testing.columnHide(B);

            // column C context menu should have a Unhide column B menu item...
            testing.contextMenu(C.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNHIDE_BEFORE_ID)
                .should("include.text", "Unhide column B");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNHIDE_BEFORE_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.columnWait();

            // verify columns A, B, C are visible.
            testing.cellFormattedTextCheck(A1, "Before");
            testing.cellFormattedTextCheck(B2, "Hidden");
            testing.cellFormattedTextCheck(C3, "After");
        });

        it("Column range context menu click unhide column after", () => {
            testing.cellFormulaEnterAndSave(A1, "'Before1");
            testing.cellFormulaEnterAndSave(B2, "'Before2");
            testing.cellFormulaEnterAndSave(C3, "'Hidden");
            testing.cellFormulaEnterAndSave(D4, "'After");

            testing.columnHide(SpreadsheetColumnReference.parse("C"));

            // column C context menu should have a Unhide column B menu item...
            testing.contextMenu(B.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNHIDE_AFTER_ID)
                .should("include.text", "Unhide column C");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNHIDE_AFTER_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.columnWait();

            // verify columns A, B, C, D are visible.
            testing.cellFormattedTextCheck(A1, "Before1");
            testing.cellFormattedTextCheck(B2, "Before2");
            testing.cellFormattedTextCheck(C3, "Hidden");
            testing.cellFormattedTextCheck(D4, "After");
        });

        it("Column range context menu click unhide column before", () => {
            testing.cellFormulaEnterAndSave(A1, "'Before");
            testing.cellFormulaEnterAndSave(B2, "'Hidden");
            testing.cellFormulaEnterAndSave(C3, "'After1");
            testing.cellFormulaEnterAndSave(D4, "'After2");

            testing.columnHide(SpreadsheetColumnReference.parse("B"));

            // column C context menu should have a Unhide column B menu item...
            testing.contextMenu(C.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNHIDE_BEFORE_ID)
                .should("include.text", "Unhide column B");

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNHIDE_BEFORE_ID)
                .click();

            testing.viewportContextMenu()
                .should("not.be.visible");

            testing.columnWait();

            // verify columns A, B, C, D are visible.
            testing.cellFormattedTextCheck(A1, "Before");
            testing.cellFormattedTextCheck(B2, "Hidden");
            testing.cellFormattedTextCheck(C3, "After1");
            testing.cellFormattedTextCheck(D4, "After2");
        });
    }
);