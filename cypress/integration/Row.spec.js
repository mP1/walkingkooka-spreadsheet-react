/// <reference types="cypress" />

import SpreadsheetCellReference from "../../src/spreadsheet/reference/SpreadsheetCellReference.js";
import SpreadsheetTesting from "./SpreadsheetTesting.js";

const A1 = SpreadsheetCellReference.parse("A1");
const A2 = SpreadsheetCellReference.parse("A2");
const E5 = SpreadsheetCellReference.parse("E5");

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

        it("Row select delete hash", () => {
            testing.cellClick(E5);

            testing.formulaTextClick();

            testing.formulaText()
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

            testing.formulaTextClick();

            testing.formulaText()
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

        it("Row select insert-after hash", () => {
            testing.cellClick(E5);

            testing.formulaTextClick();

            testing.formulaText()
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

            testing.formulaTextClick();

            testing.formulaText()
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

        it("Row select insert-before hash", () => {
            testing.cellClick(E5);

            testing.formulaTextClick();

            testing.formulaText()
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

            testing.formulaTextClick();

            testing.formulaText()
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

        it("Row select then Cell", () => {
            testing.hashAppend("/row/2");

            testing.hash()
                .should('match', /.*\/.*\/row\/2/);

            testing.cell(A1)
                .click();

            testing.hash()
                .should('match', /.*\/.*\/cell\/A1/);
        });
    }
);