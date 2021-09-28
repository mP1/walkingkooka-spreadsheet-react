/// <reference types="cypress" />

import SpreadsheetCellReference from "../../src/spreadsheet/reference/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "../../src/spreadsheet/reference/SpreadsheetColumnReference.js";
import SpreadsheetTesting from "./SpreadsheetTesting.js";

const A1 = SpreadsheetCellReference.parse("A1");
const B1 = SpreadsheetCellReference.parse("B1");
const C3 = SpreadsheetCellReference.parse("C3");
const E5 = SpreadsheetCellReference.parse("E5");

const B = SpreadsheetColumnReference.parse("B");
const C = SpreadsheetColumnReference.parse("C");

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

        // selection delete.............................................................................................

        it("Column select delete hash", () => {
            testing.cellFormulaEnterAndSave(E5, "'Moved");

            testing.column("B")
                .click();

            testing.hashAppend("/delete");

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck("D5", "Moved");
            testing.cellFormattedTextCheck(E5, "");
        });

        it("Column range select delete hash", () => {
            testing.cellFormulaEnterAndSave(E5, "'Moved");

            testing.column("B")
                .click();

            testing.hashAppend(":C/delete");

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

        it("Column context menu", () => {
            testing.contextMenu(C.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("LI")
                .should("have.length", 4);
        });

        it("Column context menu click insert before 2", () => {
            testing.cellFormulaEnterAndSave(C3, "'Moved");

            testing.contextMenu(C.viewportId());

            testing.viewportContextMenu()
                .should("be.visible")
                .find("#" + SpreadsheetColumnReference.VIEWPORT_INSERT_BEFORE_2_ID)
                .should("include.text", "Insert 2 before");

            testing.getById(SpreadsheetColumnReference.VIEWPORT_INSERT_BEFORE_2_ID)
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
                .find("#" + SpreadsheetColumnReference.VIEWPORT_INSERT_BEFORE_1_ID)
                .should("include.text", "Insert 1 before");

            testing.getById(SpreadsheetColumnReference.VIEWPORT_INSERT_BEFORE_1_ID)
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
                .find("#" + SpreadsheetColumnReference.VIEWPORT_INSERT_AFTER_1_ID)
                .should("include.text", "Insert 1 after");

            testing.getById(SpreadsheetColumnReference.VIEWPORT_INSERT_AFTER_1_ID)
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
                .find("#" + SpreadsheetColumnReference.VIEWPORT_INSERT_AFTER_2_ID)
                .should("include.text", "Insert 2 after");

            testing.getById(SpreadsheetColumnReference.VIEWPORT_INSERT_AFTER_2_ID)
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
                .find("#" + SpreadsheetColumnReference.VIEWPORT_INSERT_BEFORE_2_ID)
                .should("include.text", "Insert 2 before");

            testing.getById(SpreadsheetColumnReference.VIEWPORT_INSERT_BEFORE_2_ID)
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
                .find("#" + SpreadsheetColumnReference.VIEWPORT_INSERT_BEFORE_1_ID)
                .should("include.text", "Insert 1 before");

            testing.getById(SpreadsheetColumnReference.VIEWPORT_INSERT_BEFORE_1_ID)
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
                .find("#" + SpreadsheetColumnReference.VIEWPORT_INSERT_AFTER_1_ID)
                .should("include.text", "Insert 1 after");

            testing.getById(SpreadsheetColumnReference.VIEWPORT_INSERT_AFTER_1_ID)
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
                .find("#" + SpreadsheetColumnReference.VIEWPORT_INSERT_AFTER_2_ID)
                .should("include.text", "Insert 2 after");

            testing.getById(SpreadsheetColumnReference.VIEWPORT_INSERT_AFTER_2_ID)
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