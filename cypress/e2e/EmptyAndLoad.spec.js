/// <reference types="cypress" />

import SpreadsheetCellReference from "../../src/spreadsheet/reference/cell/SpreadsheetCellReference.js";
import SpreadsheetTesting from "./SpreadsheetTesting.js";

const A1 = SpreadsheetCellReference.parse("A1");

const FORMULA_TEXT_CLICK_WAIT = 50;

describe(
    "Empty and load",
    () => {

        const testing = new SpreadsheetTesting(cy);

        beforeEach(() => {
            cy.visit('/');

            testing.spreadsheetEmptyReady();
        });

        // Spreadsheet create & load....................................................................................

        it("Initial empty check", () => {
            testing.spreadsheetEmptyCheck();
        });

        it("Create empty", () => {
            testing.hashEnter("/");

            testing.spreadsheetEmptyCheck();
        });

        it("Create empty after editing cell", () => {
            testing.cellFormulaEnterAndSave("E5", "=1+2+3");

            testing.hashEnter("/");

            testing.hash().should("match", /^#\/.*\/Untitled$/) // => true

            testing.spreadsheetEmptyCheck();
        });

        it("Create, edit cell, create empty, reload non empty", () => {
            cy.window()
                .then((win) => {
                    const nonEmptySpreadsheetHash = win.location.hash;

                    testing.cellFormulaEnterAndSave(A1, "=1+2+3");

                    // reload previous spreadsheet and verify viewport reloaded
                    testing.hashEnter(nonEmptySpreadsheetHash);

                    testing.hash()
                        .should('eq', nonEmptySpreadsheetHash);

                    testing.cellFormattedTextCheck(A1, "6.");
                });
        });

        it("Create, edit cell, reload", () => {
            cy.window()
                .then((win) => {
                    const nonEmptySpreadsheetHash = win.location.hash;

                    testing.cellFormulaEnterAndSave(A1, "=1+2+3");

                    // reload previous spreadsheet and verify viewport reloaded
                    testing.hashEnter(nonEmptySpreadsheetHash);

                    testing.hash()
                        .should('eq', nonEmptySpreadsheetHash);

                    testing.cellFormattedTextCheck(A1, "6.");
                });
        });
    });