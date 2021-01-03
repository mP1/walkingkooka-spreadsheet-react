/// <reference types="cypress" />

import SpreadsheetMetadata from "../../src/spreadsheet/meta/SpreadsheetMetadata.js";

const SELECTED = ".selected";
const COLUMN = ".column";
const ROW = ".row";
const CELL = ".cell";

context("General app usage", () => {

    beforeEach(() => {
        cy.visit('/')
    })

    it("Initial empty spreadsheet", () => {
        checkEmptySpreadsheet();
    });

    // INVALID TARGET. ...................................................................................................

    it("Enter history hash invalid target", () => {
        invalidHashUpdateRejected("/!invalid-target");
    });

    // SPREADSHEET NAME ...................................................................................................

    it("Enter history hash with invalid spreadsheet name action", () => {
        invalidHashUpdateRejected("/name/!invalid-name-action");
    });

    it("Edit spreadsheet name", () => {
        spreadsheetName()
            .click();

        hash().should('match', /.*\/.*\/name\/edit/) // => true

        const updatedSpreadsheetName = "SpreadsheetName234"; // easier to use in regex below

        // type the new name in
        spreadsheetName()
            .type("{selectall}")
            .type(updatedSpreadsheetName)
            .type("{enter}");

        reactRenderWait();

        spreadsheetName()
            .should("have.text", updatedSpreadsheetName);

        // verify hash and title updated to include $updateSpreadsheetName
        title().should("eq", updatedSpreadsheetName.toString());
        hash().should('match', /.*\/SpreadsheetName234/) // => true
    });

    // CELL ................................................................................................................

    it("Enter history hash with invalid reference", () => {
        invalidHashUpdateRejected("/cell/!invalid-cell-reference");
    });

    it("Enter history hash with valid reference but invalid action", () => {
        invalidHashUpdateRejected("/cell/A1/!invalid-cell-action");
    });

    it("Edit cell formula", () => {
        reactRenderWait();

        cellClick("B2");

        hash().should('match', /.*\/Untitled\/cell\/B2\/formula/) // => true

        formulaText()
            .type("1+2+3")
            .type("{enter}");

        reactRenderWait();

        cellFormattedTextCheck("B2", "6.");
    });

    it("Enter cell with reference", () => {
        reactRenderWait();

        cellClick("C3");

        formulaText()
            .type("1+2+3")
            .type("{enter}");

        cellClick("D4");

        formulaText()
            .type("C3+10")
            .type("{enter}");

        reactRenderWait();

        cellFormattedTextCheck("D4", "16.");
    });

    it("Update hash cell reference", () => {
        reactRenderWait();

        cellClick("C3");

        formulaText()
            .type("1+2+3")
            .type("{enter}");

        cy.window()
            .then(function(win) {
                var hash = win.location.hash;
                win.location.hash = hash.replace("/cell/C3/formula", "/cell/D4/formula");
            });

        reactRenderWait();

        formulaText()
            .type("4+5")
            .type("{enter}");

        cellFormattedTextCheck("D4", "9.");
    });

    // create/load spreadsheet............................................................................................

    it("Create new empty spreadsheet", () => {
        hashEnter("/");

        checkEmptySpreadsheet();
    });

    it("Update then create new empty spreadsheet", () => {
        reactRenderWait();

        cellClick("E5");

        formulaText()
            .type("1+2+3")
            .type("{enter}");

        hashEnter("/");

        hash().should('match', /.*\/Untitled/) // => true

        checkEmptySpreadsheet();
    });

    it("Update then create new empty spreadsheet then reload non empty", () => {
        reactRenderWait();

        cellClick("F6");

        formulaText()
            .type("1+2+3")
            .type("{enter}");


        hashEnter("/");
        cy.go('back');

        cellFormattedTextCheck("F6", "6.");
    });

    // DRAWER ............................................................................................................

    it("Toggle(Show and hide) drawer", () => {
        settingsToolDrawerToggle();

        settingsToolDrawer()
            .should('be.visible');

        settingsToolDrawerToggle();

        settingsToolDrawer()
            .should('be.not.visible');
    });

    it("Show drawer by editing history hash", () => {
        reactRenderWait();

        cy.window()
            .then(function(win) {
                var hash = win.location.hash;
                win.location.hash = hash + "/";
            });

        reactRenderWait();
        settingsToolDrawer()
            .should('be.visible');
    });

    it("Hide drawer by editing history hash", () => {
        settingsToolDrawerToggle();
        reactRenderWait();

        cy.window()
            .then(function(win) {
                var hash = win.location.hash;
                win.location.hash = hash.substring(0, hash.length - 1);
            });

        reactRenderWait();
        settingsToolDrawer()
            .should('be.not.visible');
    });

    it("Toggle show drawer history hash", () => {
        reactRenderWait();

        cy.window()
            .then(function(win) {
                var hash = win.location.hash;

                settingsToolDrawerToggle();

                reactRenderWait();
                cy.hash()
                    .should("eq", hash + "/");
            });
    });

    it("Toggle show then hide drawer history hash", () => {
        reactRenderWait();

        cy.window()
            .then(function(win) {
                var hash = win.location.hash;

                settingsToolDrawerToggle();
                settingsToolDrawerToggle();

                reactRenderWait();
                cy.hash()
                    .should("eq", hash);
            });
    });

    it("Edit spreadsheet name, then toggle show drawer history hash", () => {
        spreadsheetName();

        reactRenderWait();

        cy.window()
            .then(function(win) {
                var hash = win.location.hash;

                settingsToolDrawerToggle();

                reactRenderWait();
                cy.hash()
                    .should("eq", hash + "/");
            });
    });

    it("Edit cell, then toggle show drawer history hash", () => {
        cellClick("F6");

        reactRenderWait();

        cy.window()
            .then(function(win) {
                var hash = win.location.hash;

                settingsToolDrawerToggle();

                reactRenderWait();
                cy.hash()
                    .should("eq", hash + "/");
            });
    });

    it("Show drawer check creator-date-time/modified-date-time", () => {
        settingsToolDrawerToggle();

        settingsToolDrawer()
            .should('be.visible');

        const year = new Date().getFullYear();

        cy.get("#spreadsheet-metadata-create-date-time")
            .contains(year);

        cy.get("#spreadsheet-metadata-modified-date-time")
            .contains(year);
    });

    /**
     * Opens the spreadsheet drawer, types in the given text, and verifies the property.
     * The button is then clicked and the text field is verified.
     */
    function enterSpreadsheetMetadataTextAndCheck(property,
                                                  text,
                                                  defaultText) {
        it("Show drawer check SpreadsheetMetadata." + property, () => {
            settingsToolDrawerToggle();

            settingsToolDrawer()
                .should('be.visible');

            const textFieldId = "#spreadsheet-metadata-" + property + "-text";
            cy.get(textFieldId)
                .type("{backspace}{backspace}" + text);

            cy.get(textFieldId)
                .should("have.value", text);

            const buttonId = "#spreadsheet-metadata-" + property + "-button";
            cy.get(buttonId)
                .click();

            cy.get(textFieldId)
                .should("have.value", defaultText);
        });
    }

    enterSpreadsheetMetadataTextAndCheck(SpreadsheetMetadata.DECIMAL_SEPARATOR,
        "d",
        ".");
    enterSpreadsheetMetadataTextAndCheck(SpreadsheetMetadata.EXPONENT_SYMBOL,
        "x",
        "E");

    enterSpreadsheetMetadataTextAndCheck(SpreadsheetMetadata.GROUPING_SEPARATOR,
        "g",
        ",");

    enterSpreadsheetMetadataTextAndCheck(SpreadsheetMetadata.NEGATIVE_SIGN,
        "n",
        "-");

    enterSpreadsheetMetadataTextAndCheck(SpreadsheetMetadata.PERCENTAGE_SYMBOL,
        "p",
        "%");

    enterSpreadsheetMetadataTextAndCheck(SpreadsheetMetadata.POSITIVE_SIGN,
        "o",
        "+");
});

// helpers..............................................................................................................

/**
 * Updates the url hash by appending the parameter (which should result in an invalid hash) and then verifies the previous
 * hash is restored.
 */
function invalidHashUpdateRejected(hashAppend) {
    reactRenderWait();

    cy.window()
        .then(function(win) {
            var hash = win.location.hash;

            // updated hash should be rejected.
            win.location.hash = hash + hashAppend;

            cy.hash()
                .should("eq", hash);
        });
}

/**
 * Checks that the spreadsheet is completely empty.
 */
function checkEmptySpreadsheet() {
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

function title() {
    return cy.title();
}

function hashEnter(hash) {
    cy.window().then(function(win) {
        win.location.hash = hash;
    });
}

function hash() {
    return cy.location().hash();
}

function spreadsheetName() {
    reactRenderWait();
    return cy.get("#spreadsheet-name");
}

function formulaText() {
    reactRenderWait();
    return cy.get("#formula-text");
}

function cellClick(cellReference) {
    cellGet(cellReference)
        .click();
}

function cellFormattedTextCheck(cellReference, text) {
    cellGet(cellReference)
        .should("have.text", text);
}

function cellGet(cellReference) {
    return cy.get("#cell-" + cellReference.toUpperCase());
}

/**
 * Fetches the icon that when clicked toggles the drawer
 */
function settingsToolDrawerToggle() {
    reactRenderWait();
    cy.get("#settings-tools-icon")
        .click();
}

/**
 * The drawer that appears on the right containing settings, tools and more.
 */
function settingsToolDrawer() {
    reactRenderWait();
    return cy.get("#settings-tools-drawer > DIV"); // the #settings-tool-drawer remains 1000x0 while the DIV child has an actual height
}

function reactRenderWait(period) {
    cy.wait(period || 50);
}
