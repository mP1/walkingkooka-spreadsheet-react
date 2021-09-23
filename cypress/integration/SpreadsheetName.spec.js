/// <reference types="cypress" />

import SpreadsheetTesting from "./SpreadsheetTesting.js";

context(
    "General app usage",
    () => {

        const testing = new SpreadsheetTesting(cy);

        beforeEach(() => {
            cy.visit('/');

            testing.spreadsheetEmptyReady();
        });

        it("Edit & ESCAPE, changes lost", () => {
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

        it("Edit & blur changes lost", () => {
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

        it("Clear & save fails", () => {
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

        it("Edit & save", () => {
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
    }
);