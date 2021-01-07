/// <reference types="cypress" />

import ExpressionNumberKind from "../../src/math/ExpressionNumberKind.js";
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
                                                  a1Formula,
                                                  text,
                                                  a1CellContent,
                                                  a1CellContentDefault) {
        it("Show drawer and update SpreadsheetMetadata." + property, () => {
            settingsToolDrawerToggle();

            settingsToolDrawer()
                .should('be.visible');

            const a1 = "A1";

            if(a1Formula){
                cellClick(a1);

                formulaText()
                    .type(a1Formula)
                    .type("{enter}");
            }

            const textFieldId = "#spreadsheet-metadata-" + property + "-text";
            cy.get(textFieldId)
                .type("{backspace}{backspace}" + text)
                .blur();

            cy.get(textFieldId)
                .should("have.value", text);

            if(a1Formula){
                cellFormattedTextCheck(a1, a1CellContent);
            }

            const buttonId = "#spreadsheet-metadata-" + property + "-default-button";
            cy.get(buttonId)
                .click();

            cy.get(textFieldId)
                .should("have.value", "");

            if(a1CellContentDefault){
                cellClick(a1);
                cellFormattedTextCheck(a1, a1CellContentDefault);
            }
        });
    }

    enterSpreadsheetMetadataTextAndCheck(SpreadsheetMetadata.DECIMAL_SEPARATOR,
        "5/2",
        "d",
        "2d5", // 5.2 decimal separator now capital D
        "2.5",
    );
    enterSpreadsheetMetadataTextAndCheck(SpreadsheetMetadata.EXPONENT_SYMBOL,
        null,
        "x",
        null,
        null);

    enterSpreadsheetMetadataTextAndCheck(SpreadsheetMetadata.GROUPING_SEPARATOR,
        "123456",
        "g",
        "123g456.",
        "123,456."
    );

    enterSpreadsheetMetadataTextAndCheck(SpreadsheetMetadata.NEGATIVE_SIGN,
        "2*-4",
        "n",
        "n8.",
        "-8.");

    // TODO need to set format pattern which includes percentage
    enterSpreadsheetMetadataTextAndCheck(SpreadsheetMetadata.PERCENTAGE_SYMBOL,
        null,
        "p",
        null,
        null);

    // TODO need to format Exponent
    enterSpreadsheetMetadataTextAndCheck(SpreadsheetMetadata.POSITIVE_SIGN,
        null,
        "o",
        null,
        null,
    );

    /**
     * Opens the spreadsheet drawer, selects each value by clicking the slider.
     * TODO Currently no test is made upon the a1 cell contents.
     */
    function enterSpreadsheetMetadataSliderAndCheck(property,
                                                    a1Formula,
                                                    values,
                                                    a1CellContents,
                                                    a1CellContentDefault) {
        it("Show drawer and update SpreadsheetMetadata." + property, () => {
            settingsToolDrawerToggle();

            settingsToolDrawer()
                .should('be.visible');

            const a1 = "A1";

            if(a1Formula){
                cellClick(a1);

                formulaText()
                    .type(a1Formula)
                    .type("{enter}");
            }

            const sliderId = "#spreadsheet-metadata-" + property + "-slider";

            values.forEach((v, i) => {
                cy.get(sliderId + " *[data-index=\"" + i + "\"][aria-hidden=\"true\"]")
                    .should("have.text", v.label())
                    .click();

                if(a1Formula){
                    cellFormattedTextCheck(a1, a1CellContents[i]);
                }
            });
        });
    }

    enterSpreadsheetMetadataSliderAndCheck(SpreadsheetMetadata.EXPRESSION_NUMBER_KIND,
        null,
        ExpressionNumberKind.values(),
        null,
        null,
    );

    /**
     * Opens the spreadsheet drawer, selects each value by clicking the slider.
     * TODO Currently no test is made upon the a1 cell contents.
     */
    function enterSpreadsheetMetadataSliderNumberTextFieldAndCheck(property,
                                                    a1Formula,
                                                    values,
                                                    a1CellContents,
                                                    a1CellContentDefault) {
        it("Show drawer and update SpreadsheetMetadata." + property, () => {
            settingsToolDrawerToggle();

            settingsToolDrawer()
                .should('be.visible');

            const a1 = "A1";

            if(a1Formula){
                cellClick(a1);

                formulaText()
                    .type(a1Formula)
                    .type("{enter}");
            }

            const sliderId = "#spreadsheet-metadata-" + property + "-slider";
            const numberTextFieldId = "#spreadsheet-metadata-" + property + "-number-text-field";

            // click on the slider and verify number in TextField was updated
            values.forEach((v, i) => {
                cy.get(sliderId + " *[data-index=\"" + i + "\"][aria-hidden=\"true\"]")
                    .should("have.text", v.text)
                    .click();

                cy.get(numberTextFieldId)
                    .should("have.value", v.value)
                    .click();

                if(a1Formula){
                    cellFormattedTextCheck(a1, a1CellContents[i]);
                }
            });

            // type a number in TextField & verify slider moved.
            values.forEach((v, i) => {
                console.log("value=" + JSON.stringify(v) + " i=" + i);

                cy.get(numberTextFieldId)
                    .type("{selectall}")
                    .type(v.value)
                    .type("{enter}")
                    .click();

                cy.get(sliderId + " *[data-index=\"" + i + "\"][aria-hidden=\"true\"]")
                    .should("have.class", "MuiSlider-markLabelActive");

                if(a1Formula){
                    cellFormattedTextCheck(a1, a1CellContents[i]);
                }
            });
        });
    }

    enterSpreadsheetMetadataSliderNumberTextFieldAndCheck(SpreadsheetMetadata.PRECISION,
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
        null,
        null,
    );

    enterSpreadsheetMetadataSliderNumberTextFieldAndCheck(SpreadsheetMetadata.DATETIME_OFFSET,
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
        null,
        null,
    );
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
