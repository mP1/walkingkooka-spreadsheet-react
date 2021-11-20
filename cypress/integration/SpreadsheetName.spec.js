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

        it("Button before click", () => {
            testing.spreadsheetNameButton()
                .should("have.text", "Untitled");

            cy.title()
                .should("eq", "Untitled");
        });

        it("Button click, verify text field", () => {
            testing.spreadsheetNameButton()
                .should("have.text", "Untitled");

            testing.spreadsheetNameButtonClick();

            testing.spreadsheetNameTextField()
                .should("have.value", "Untitled");
        });

        it("Edit & ESCAPE, changes lost", () => {
            testing.spreadsheetNameButtonClick();

            // type the new name in
            testing.spreadsheetNameTextField()
                .type("{selectall}UpdatedSpreadsheetName456{esc}");

            testing.wait();

            testing.spreadsheetNameButton()
                .should("have.text", "Untitled");

            cy.title()
                .should("eq", "Untitled");

            testing.hash()
                .should('match', /.*\/Untitled/);
        });

        it("Edit & blur changes lost", () => {
            testing.spreadsheetNameButtonClick();

            // type the new name in
            testing.spreadsheetNameTextField()
                .type("{selectall}UpdatedSpreadsheetName456")
                .blur();

            testing.wait();

            testing.spreadsheetNameButton()
                .should("have.text", "Untitled");

            cy.title()
                .should("eq", "Untitled");

            testing.hash()
                .should('match', /.*\/Untitled/);
        });

        it("Edit, blur, edit again changes lost", () => {
            testing.spreadsheetNameButtonClick();

            // first edit, blur lost #1
            testing.spreadsheetNameTextField()
                .type("{selectall}UpdatedSpreadsheetName456")
                .blur();

            testing.wait();

            testing.spreadsheetNameButton()
                .should("have.text", "Untitled");

            cy.title()
                .should("eq", "Untitled");

            testing.hash()
                .should('match', /.*\/Untitled/);

            // edit again
            testing.spreadsheetNameButtonClick();

            // text field should have original name
            testing.spreadsheetNameTextField()
                .should("have.value", "Untitled")
                .blur();
        });

        it("Edit & save", () => {
            testing.spreadsheetNameButtonClick();

            const updatedSpreadsheetName = "SpreadsheetName234"; // easier to use in regex below

            // type the new name in
            testing.spreadsheetNameTextField()
                .type("{selectall}" + updatedSpreadsheetName + "{enter}");

            testing.wait();

            testing.spreadsheetNameTextField()
                .should("have.value", updatedSpreadsheetName);

            // verify hash and title updated to include $updateSpreadsheetName
            cy.title()
                .should("eq", updatedSpreadsheetName.toString());

            testing.hash()
                .should('match', /.*\/SpreadsheetName234/);
        });
    }
);