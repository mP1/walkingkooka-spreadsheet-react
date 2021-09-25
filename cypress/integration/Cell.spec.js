/// <reference types="cypress" />

import SpreadsheetCellReference from "../../src/spreadsheet/reference/SpreadsheetCellReference.js";
import SpreadsheetTesting from "./SpreadsheetTesting.js";

const A1 = SpreadsheetCellReference.parse("A1");
const A3 = SpreadsheetCellReference.parse("A3");
const B2 = SpreadsheetCellReference.parse("B2");
const B3 = SpreadsheetCellReference.parse("B3");
const C2 = SpreadsheetCellReference.parse("C2");
const C3 = SpreadsheetCellReference.parse("C3");
const D4 = SpreadsheetCellReference.parse("D4");

const LABEL = "Label123";

const FORMULA_TEXT_CLICK_WAIT = 50;

const SELECTED_COLOR = "rgb(68, 68, 68)";

describe(
    "Cell",
    () => {

        const testing = new SpreadsheetTesting(cy);

        beforeEach(() => {
            cy.visit('/');

            testing.spreadsheetEmptyReady();
        });

        // CELL ........................................................................................................

        it("Cell viewport cell click", () => {
            testing.cellClick(B2);

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Cell viewport cell click after editing name", () => {
            testing.spreadsheetNameClick();

            testing.cellClick(B2);

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        // @see https://github.com/mP1/walkingkooka-spreadsheet-react/issues/1256
        it("Cell formula load then history hash save", () => {
            testing.cellClick(B2);

            testing.formulaText()
                .click();

            testing.hash().should('match', /.*\/Untitled\/cell\/B2\/formula/)

            testing.hashAppend("/save/=2*3")

            testing.cellFormattedTextCheck(B2, "6.");
        });

        it("Cell formula edit ENTER saves", () => {
            testing.cellClick(B2);

            testing.hash().should('match', /.*\/Untitled\/cell\/B2/)

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=1+2+3{enter}");

            testing.hash()
                .should('match', /.*\/Untitled\/cell\/B2\/formula/);

            testing.cellFormattedTextCheck(B2, "6.");
        });

        it("Cell formula edit with reference", () => {
            testing.cellClick(C3);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=1+2+3{enter}");

            testing.cellClick(D4);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=C3+10{enter}");

            testing.cellFormattedTextCheck(D4, "16.");
        });

        it("Cell formula edit, update hash cell reference", () => {
            testing.cellClick(C3);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=1+2+3{enter}");

            cy.window()
                .then((win) => {
                    var hash = win.location.hash;
                    win.location.hash = hash.replace("/cell/C3/formula", "/cell/D4/formula");
                });

            testing.wait();

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=4+5{enter}");

            testing.cellFormattedTextCheck(D4, "9.");
        });

        it("Cell hash formula update", () => {
            testing.hashAppend("/cell/D4/formula");

            testing.column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("4")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.formulaText()
                .should("have.focus");
        });

        it("Cell hash append formula", () => {
            testing.cellClick(C3);

            testing.wait(FORMULA_TEXT_CLICK_WAIT);

            testing.hashAppend("/formula");

            testing.wait(FORMULA_TEXT_CLICK_WAIT);

            testing.formulaText()
                .should("have.focus");
        });

        it("Cell hash append formula has focus", () => {
            testing.cellClick(C3);

            testing.wait(FORMULA_TEXT_CLICK_WAIT);

            testing.hashAppend("/formula");

            testing.wait(FORMULA_TEXT_CLICK_WAIT);

            testing.formulaText()
                .should("have.focus");
        });

        it("Cell hash with unknown label", () => {
            testing.hashAppend("/cell/" + LABEL);

            testing.hash()
                .should('match', /.*\/Untitled/);
        });

        it("Cell click should have focus", () => {
            testing.cellClick(B2);

            testing.cell(B2)
                .should('have.focus');
        });

        it("Cell click columns & rows selected", () => {
            testing.cellClick(B2);

            testing.hash()
                .should('match', /.*\/.*\/cell\/B2/);

            testing.column("B")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell click and select using arrow keys", () => {
            testing.cellClick(C3);

            testing.cell(C3)
                .type("{leftarrow}");

            testing.wait(50);

            testing.hash()
                .should('match', /.*\/.*\/cell\/B3/);

            testing.cell(B3)
                .type("{rightarrow}");

            testing.wait(50);

            testing.hash()
                .should('match', /.*\/.*\/cell\/C3/);

            testing.cell(C3)
                .type("{uparrow}");

            testing.wait(50);

            testing.hash()
                .should('match', /.*\/.*\/cell\/C2/);

            testing.cell(C2)
                .type("{downarrow}");

            testing.wait(50);

            testing.hash()
                .should('match', /.*\/.*\/cell\/C3/);
        });

        it("Cell click and hit ENTER gives formula text focus", () => {
            testing.cellClick(A3);

            testing.cell(A3)
                .type("{enter}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/A3\/formula/);

            testing.formulaText()
                .should("have.focus");
        });

        it("Cell select and hit ESC loses viewport cell focus", () => {
            testing.cellClick(A3);

            testing.hash()
                .should('match', /.*\/.*\/cell\/A3/);

            testing.cell(A3)
                .type("{esc}");

            testing.hash()
                .should('match', /.*\/.*/);
        });

        it("Cell outside viewport", () => {
            testing.hashAppend("/cell/T1");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=234{enter}")
                .blur();

            // viewport should have jumped leaving T1 as the home cell.
            testing.cell(A1)
                .should('not.exist');
        });

        it("Cell outside viewport vertical", () => {
            testing.hashAppend("/cell/A30");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=234{enter}")
                .blur();

            // viewport should have jumped leaving A30 as the home cell.
            testing.cell(A1)
                .should('not.exist');
        });

        it("Cell outside viewport horiz & vertical", () => {
            testing.hashAppend("/cell/T30");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=234{enter}")
                .blur();

            // viewport should have jumped leaving T30 as the home cell.
            testing.cell(A1)
                .should('not.exist');
        });

        it("Cell outside viewport and reload", () => {
            testing.hashAppend("/cell/M1");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=123{enter}")
                .blur();

            testing.hashOnlyIdAndName();
            testing.hashAppend("/cell/T1");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=234{enter}")
                .blur();

            testing.hashOnlyIdAndName();
            testing.hashAppend("/cell/M1");

            testing.cellFormattedTextCheck("M1", "123.");
            testing.cellFormattedTextCheck("T1", "234.");
        });

        it("Cell outside viewport horiz & vert and reload", () => {
            testing.hashAppend("/cell/M10");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=123{enter}")
                .blur();

            testing.hashOnlyIdAndName();

            testing.hashAppend("/cell/T20");

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}=234{enter}")
                .blur();

            testing.hashOnlyIdAndName();

            testing.hashAppend("/cell/M10");

            testing.cellFormattedTextCheck("M10", "123.");
            testing.cellFormattedTextCheck("T20", "234.");
        });

        // cell range...................................................................................................

        it("Cell range history hash", () => {
            testing.hashAppend("/cell/B2:C3");

            testing.hash()
                .should('match', /.*\/.*\/cell\/B2:C3/);

            testing.column("B")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("C")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("3")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range out of viewport history hash", () => {
            testing.hashAppend("/cell/X2:Y3");

            testing.hash()
                .should('match', /.*\/.*\/cell\/X2:Y3/);

            testing.column("X")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("Y")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("3")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend left", () => {
            testing.hashAppend("/cell/D4:E5");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            testing.cell(D4)
                .type("{shift+leftarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/C4:E5/);

            testing.cell("C4")
                .should("have.focus");

            testing.column("C")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("4")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend right", () => {
            testing.hashAppend("/cell/D4:E5");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            testing.cell("D4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.cell("E4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/E4:F5/);

            testing.cell("F4")
                .should("have.focus");

            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("F")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("4")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend right twice", () => {
            testing.hashAppend("/cell/D4:E5");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            testing.cell("D4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.cell("E4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/E4:F5/);

            testing.cell("F4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/E4:G5/);

            testing.cell("G4")
                .should("have.focus");

            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("F")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("G")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("4")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend up", () => {
            testing.hashAppend("/cell/D4:E5");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            testing.cell(D4)
                .type("{shift+uparrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D3:E5/);

            testing.cell("D3")
                .should("have.focus");

            testing.column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("3")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("4")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend down", () => {
            testing.hashAppend("/cell/D4:E5");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            testing.cell("D4")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D5:E5/);

            testing.cell("D5")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D5:E6/);

            testing.cell("D6")
                .should("have.focus");

            testing.column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("6")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell range keyboard extend down twice", () => {
            testing.hashAppend("/cell/D4:E5");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D4:E5/);

            testing.cell("D4")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D5:E5/);

            testing.cell("D5")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D5:E6/);

            testing.cell("D6")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should('match', /.*\/.*\/cell\/D5:E7/);

            testing.cell("D7")
                .should("have.focus")

            testing.column("D")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("E")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("5")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("6")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("7")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        // select then delete hash......................................................................................


        it("Cell select delete hash", () => {
            testing.cellClick(B2);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'Deleted{enter}");

            testing.cellClick(B2);
            testing.hashAppendWithoutCheck("/delete");

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck(B2, "");

            testing.formulaText()
                .should("have.value", "");
        });

        it("Cell range select delete hash", () => {
            testing.cellClick(A1);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'NotDeleted{enter}");

            testing.cellClick(C3);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'DeletedC3{enter}");

            testing.cellClick(B2);

            testing.formulaText()
                .click()
                .wait(FORMULA_TEXT_CLICK_WAIT)
                .type("{selectall}'DeletedB2{enter}");

            testing.cellClick(B2);

            testing.hashAppendWithoutCheck(":C3/delete");

            testing.hash()
                .should('match', /.*\/.*/);

            testing.cellFormattedTextCheck("A1", "NotDeleted");
            testing.cellFormattedTextCheck(B2, "");
            testing.cellFormattedTextCheck(C3, "");
        });

        // selection then different viewport selections.................................................................

        it("Cell formula edit then column click", () => {
            testing.hashAppend("/cell/B2/formula");

            testing.wait();

            testing.column("C")
                .click();

            testing.hash()
                .should('match', /.*\/.*\/column\/C/);
        });

        it("Cell formula edit then row click", () => {
            testing.hashAppend("/cell/B2/formula");

            testing.wait();

            testing.row("3")
                .click();

            testing.hash()
                .should('match', /.*\/.*\/row\/3/);
        });

        it("Cell formula edit different formula edit", () => {
            testing.hashAppend("/cell/B2/formula");

            testing.hash()
                .should('match', /.*\/.*\/cell\/B2\/formula/);

            testing.hashAppend("/cell/C3/formula"); // invalid removes cell from hash
            testing.hashAppend("/cell/C3/formula");

            testing.hash()
                .should('match', /.*\/.*\/cell\/C3/);
        });
    }
);