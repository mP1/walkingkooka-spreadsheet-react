/// <reference types="cypress" />

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

    cy.get("#cell-B2")
        .click();

    hash().should('match', /.*\/Untitled\/cell\/B2\/formula/) // => true

    formulaText()
        .type("1+2+3")
        .type("{enter}");

    reactRenderWait();

    cellTextCheck("#cell-B2", "6.");
  });

  it("Enter cell with reference", () => {
    reactRenderWait();

    cy.get("#cell-C3")
        .click();

    formulaText()
        .type("1+2+3")
        .type("{enter}");

    cy.get("#cell-D4")
        .click();

    formulaText()
        .type("C3+10")
        .type("{enter}");

    reactRenderWait();

    cellTextCheck("#cell-D4", "16.");
  });

  it("Create new empty spreadsheet", () => {
    hashEnter("/");

    checkEmptySpreadsheet();
  });

  it("Update then create new empty spreadsheet", () => {
    reactRenderWait();

    cy.get("#cell-E5")
        .click();

    formulaText()
        .type("1+2+3")
        .type("{enter}");

    hashEnter("/");

    hash().should('match', /.*\/Untitled/) // => true

    checkEmptySpreadsheet();
  });

  it("Update then create new empty spreadsheet then reload non empty", () => {
    reactRenderWait();

    cy.get("#cell-F6")
        .click();

    formulaText()
        .type("1+2+3")
        .type("{enter}");


    hashEnter("/");
    cy.go('back');

    cellTextCheck("#cell-F6", "6.");
  });

  it("Toggle(Show and hide) drawer", () => {
    settingsToolDrawerToggle();

    settingsToolDrawer()
        .should('be.visible');

    settingsToolDrawerToggle();

    settingsToolDrawer()
        .should('be.not.visible');
  });
});

// helpers..............................................................................................................

/**
 * Updates the url hash by appending the parameter (which should result in an invalid hash) and then verifies the previous
 * hash is restored.
 */
function invalidHashUpdateRejected(hashAppend) {
  reactRenderWait();

  cy.window()
      .then(function (win) {
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

  cellTextCheck(CELL, "");
}

function title() {
  return cy.title();
}

function hashEnter(hash) {
  cy.window().then(function (win) {
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

function cellTextCheck(cellReference, text) {
  cy.get(cellReference)
      .should("have.text", text);
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
