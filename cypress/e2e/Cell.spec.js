/// <reference types="cypress" />

import FontStyle from "../../src/text/FontStyle.js";
import SpreadsheetCellRange from "../../src/spreadsheet/reference/cell/SpreadsheetCellRange.js";
import SpreadsheetCellReference from "../../src/spreadsheet/reference/cell/SpreadsheetCellReference.js";
import SpreadsheetSelection from "../../src/spreadsheet/reference/SpreadsheetSelection.js";
import SpreadsheetTesting from "./SpreadsheetTesting.js";
import TextAlign from "../../src/text/TextAlign.js";
import TextStyle from "../../src/text/TextStyle.js";
import VerticalAlign from "../../src/text/VerticalAlign.js";
import TextDecorationLine from "../../src/text/TextDecorationLine.js";
import WordBreak from "../../src/text/WordBreak.js";
import WordWrap from "../../src/text/WordWrap.js";

const A1 = SpreadsheetCellReference.parse("A1");
const A3 = SpreadsheetCellReference.parse("A3");
const B2 = SpreadsheetCellReference.parse("B2");
const B3 = SpreadsheetCellReference.parse("B3");
const C2 = SpreadsheetCellReference.parse("C2");
const C3 = SpreadsheetCellReference.parse("C3");
const D4 = SpreadsheetCellReference.parse("D4");

const LABEL = "Label123";

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

        it("viewport without selection", () => {
            testing.formulaTextHidden();
            testing.toolbarHidden();
        });

        it("Cell viewport cell click", () => {
            testing.cellClick(B2);
            testing.formulaTextShown();
            testing.toolbarShown();
        });

        // @see https://github.com/mP1/walkingkooka-spreadsheet-react/issues/1256
        it("Cell formula load then history hash save", () => {
            testing.cellClick(B2);

            testing.formulaTextClick();

            testing.hashAppend("/save/=2*3")

            testing.cellFormattedTextCheck(B2, "6.");
        });

        it("Cell formula edit ENTER saves", () => {
            testing.cellClick(B2);

            testing.formulaTextClick();

            testing.formulaText()
                .type("{selectall}=1+2+3{enter}");

            testing.hash()
                .should("match", /^#\/.*\/Untitled\/cell\/B2\/formula$/);

            testing.cellFormattedTextCheck(B2, "6.");
        });

        it("Cell formula not editable with selection range", () => {
            testing.cellFormulaEnterAndSave(A1, "=1+2+3");
            testing.hashAppendAfterSpreadsheetName("/cell/A1:A2");

            testing.formulaText()
                .should("be.hidden")
                .should("have.text", "")
                .should("not.have.focus");
        });

        it("Cell formula edit with reference", () => {
            testing.cellFormulaEnterAndSave(C3, "=1+2+3");
            testing.cellFormulaEnterAndSave(D4, "=C3+10");

            testing.cellFormattedTextCheck(D4, "16.");
        });

        it("Cell formula edit, update hash cell reference", () => {
            testing.cellFormulaEnterAndSave(C3, "=1+2+3");

            cy.window()
                .then((win) => {
                    var hash = win.location.hash;
                    win.location.hash = hash.replace("/cell/C3/formula", "/cell/D4/formula");
                });

            testing.formulaTextEnterAndSave("{selectall}=4+5{enter}");

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

        it("Cell hash append formula has focus", () => {
            testing.cellClick(C3);

            testing.hashAppend("/formula");

            testing.formulaText()
                .should("have.focus");
        });

        it("Cell hash with unknown label", () => {
            testing.hashAppend("/cell/" + LABEL);

            testing.hash()
                .should("match", /^#\/.*\/Untitled$/);
        });

        it("Cell click should have focus", () => {
            testing.cellClick(B2);

            testing.cell(B2)
                .should('have.focus');
        });

        it("Cell click columns & rows selected", () => {
            testing.cellClick(B2);

            testing.column("B")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
        });

        it("Cell click and select using arrow keys", () => {
            testing.cellClick(C3);

            testing.cell(C3)
                .type("{leftarrow}");

            testing.historyWait();

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/B3$/);

            testing.cell(B3)
                .type("{rightarrow}");

            testing.historyWait();

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/C3$/);

            testing.cell(C3)
                .type("{uparrow}");

            testing.historyWait();

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/C2$/);

            testing.cell(C2)
                .type("{downarrow}");

            testing.historyWait();

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/C3$/);
        });

        it("Cell click and hit ENTER gives formula text focus", () => {
            testing.cellClick(A3);

            testing.cell(A3)
                .type("{enter}");

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/A3\/formula$/);

            testing.formulaText()
                .should("have.focus");
        });

        it("Cell history save style", () => {
            testing.hashAppend("/cell/A1/style/color/save/#123456");

            //testing.cellFormattedTextCheck(A1, "");
            testing.cellStyleCheck(A1, "color", "rgb(18, 52, 86)");
        });

        it("Cell toolbar style links", () => {
            testing.cellClick(B2);

            testing.toolbarStyle(TextStyle.FONT_STYLE, FontStyle.NORMAL)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/font-style\/save\/NORMAL$/);

            testing.toolbarStyle(TextStyle.FONT_STYLE, FontStyle.ITALIC)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/font-style\/save\/ITALIC$/);

            testing.toolbarStyle(TextStyle.FONT_STYLE, FontStyle.OBLIQUE)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/font-style\/save\/OBLIQUE$/);

            
            testing.toolbarStyle(TextStyle.TEXT_ALIGN, TextAlign.LEFT)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/text-align\/save\/LEFT$/);

            testing.toolbarStyle(TextStyle.TEXT_ALIGN, TextAlign.CENTER)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/text-align\/save\/CENTER$/);

            testing.toolbarStyle(TextStyle.TEXT_ALIGN, TextAlign.RIGHT)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/text-align\/save\/RIGHT$/);

            testing.toolbarStyle(TextStyle.TEXT_ALIGN, TextAlign.JUSTIFY)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/text-align\/save\/JUSTIFY$/);


            testing.toolbarStyle(TextStyle.TEXT_DECORATION_LINE, TextDecorationLine.NONE)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/text-decoration-line\/save\/NONE$/);

            testing.toolbarStyle(TextStyle.TEXT_DECORATION_LINE, TextDecorationLine.LINE_THROUGH)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/text-decoration-line\/save\/LINE_THROUGH$/);

            testing.toolbarStyle(TextStyle.TEXT_DECORATION_LINE, TextDecorationLine.OVERLINE)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/text-decoration-line\/save\/OVERLINE$/);

            testing.toolbarStyle(TextStyle.TEXT_DECORATION_LINE, TextDecorationLine.UNDERLINE)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/text-decoration-line\/save\/UNDERLINE$/);

            
            testing.toolbarStyle(TextStyle.VERTICAL_ALIGN, VerticalAlign.TOP)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/vertical-align\/save\/TOP$/);

            testing.toolbarStyle(TextStyle.VERTICAL_ALIGN, VerticalAlign.MIDDLE)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/vertical-align\/save\/MIDDLE$/);

            testing.toolbarStyle(TextStyle.VERTICAL_ALIGN, VerticalAlign.BOTTOM)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/vertical-align\/save\/BOTTOM$/);


            testing.toolbarStyle(TextStyle.WORD_BREAK, WordBreak.NORMAL)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/word-break\/save\/NORMAL$/);

            testing.toolbarStyle(TextStyle.WORD_BREAK, WordBreak.BREAK_ALL)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/word-break\/save\/BREAK_ALL$/);

            testing.toolbarStyle(TextStyle.WORD_BREAK, WordBreak.BREAK_WORD)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/word-break\/save\/BREAK_WORD$/);

            testing.toolbarStyle(TextStyle.WORD_BREAK, WordBreak.KEEP_ALL)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/word-break\/save\/KEEP_ALL$/);


            testing.toolbarStyle(TextStyle.WORD_WRAP, WordWrap.NORMAL)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/word-wrap\/save\/NORMAL$/);

            testing.toolbarStyle(TextStyle.WORD_WRAP, WordWrap.BREAK_WORD)
                .should("have.attr", "href")
                .and("match", /^#\/.*\/Untitled\/cell\/B2\/style\/word-wrap\/save\/BREAK_WORD$/);
        });

        it("Cell style save TextAlign.CENTER hash", () => {
            testing.hashAppendAfterSpreadsheetName("/cell/B2/style/text-align/save/CENTER");

            testing.historyWait();

            testing.hash()
                .should("match", /^#\/.*\/Untitled$/);

            testing.cellStyleCheck(B2, "text-align", "center");
        });

        it("Cell click cell, then style TextAlign.CENTER click", () => {
            testing.cellClick(B2);
            testing.toolbarStyleClick(TextStyle.TEXT_ALIGN, TextAlign.CENTER);

            testing.hash()
                .should("match", /^#\/.*\/Untitled\/cell\/B2\/style\/text-align$/);

            testing.cellStyleCheck(B2, "text-align", "center");
        });

        it("Cell formula then style save TextAlign.CENTER hash", () => {
            testing.cellClick(B2);
            testing.formulaTextEnterAndSave("=1");

            testing.hashAppendAfterSpreadsheetName("/cell/B2/style/text-align/save/CENTER");

            testing.historyWait();

            // testing.hash()
            //     .should("match", /^#\/.*\/Untitled\/cell\/B2\/style\/text-align$/);

            testing.cellStyleCheck(B2, "text-align", "center");
        });

        // tab
        // it("Cell style TextAlign.LEFT click, tab TextAlign.CENTER enter", () => {
        //     testing.cellClick(B2);
        //     testing.formulaTextEnterAndSave("=1");
        //
        //     testing.toolbarStyleClick(TextStyle.TEXT_ALIGN, TextAlign.LEFT);
        //     testing.hash()
        //         .should("match", /^#\/.*\/Untitled\/cell\/B2\/style\/text-align$/);
        //     testing.cellStyleCheck(B2, "text-align", "left");
        //
        //     testing.tab();
        //     testing.focused()
        //         .type("{enter}")
        //     testing.cellStyleCheck(B2, "text-align", "center");
        //
        //     testing.hash()
        //         .should("match", /^#\/.*\/Untitled\/cell\/B2\/style\/text-align$/);
        // });

        it("Cell select and hit ESC loses viewport cell focus", () => {
            testing.cellClick(A3);

            testing.cell(A3)
                .type("{esc}");

            testing.hash()
                .should("match", /^#\/.*\/.*$/);
        });

        it("Cell outside viewport", () => {
            testing.hashAppend("/cell/T1");

            testing.formulaTextLoadWait();

            testing.formulaTextEnterAndSave("=234");

            // viewport should have jumped leaving T1 as the home cell.
            testing.cell(A1)
                .should('not.exist');
        });

        it("Cell outside viewport vertical", () => {
            testing.hashAppend("/cell/A30");

            testing.formulaTextLoadWait();

            testing.formulaTextEnterAndSave("=234");

            // viewport should have jumped leaving A30 as the home cell.
            testing.cell(A1)
                .should('not.exist');
        });

        it("Cell outside viewport horiz & vertical", () => {
            testing.hashAppend("/cell/T30");

            testing.formulaTextLoadWait();

            testing.formulaTextEnterAndSave("=234");

            // viewport should have jumped leaving T30 as the home cell.
            testing.cell(A1)
                .should('not.exist');
        });

        it("Cell outside viewport and reload", () => {
            testing.hashAppend("/cell/M1");

            testing.formulaTextLoadWait();

            testing.formulaTextEnterAndSave("=123");

            testing.hashOnlyIdAndName();

            testing.historyWait();

            testing.hashAppend("/cell/T1");

            testing.formulaTextLoadWait();

            testing.formulaTextEnterAndSave("=234");

            testing.hashOnlyIdAndName();
            testing.hashAppend("/cell/M1");

            testing.cellFormattedTextCheck("M1", "123.");
            testing.cellFormattedTextCheck("T1", "234.");
        });

        it("Cell outside viewport horiz & vert and reload", () => {
            testing.hashAppend("/cell/M10");

            testing.formulaTextLoadWait();

            testing.formulaTextEnterAndSave("=123");

            testing.hashOnlyIdAndName();

            testing.historyWait();

            testing.hashAppend("/cell/T20");

            testing.formulaTextLoadWait();

            testing.formulaTextEnterAndSave("=234");

            testing.hashOnlyIdAndName();

            testing.hashAppend("/cell/M10");

            testing.formulaTextLoadWait();

            testing.cellFormattedTextCheck("M10", "123.");
            testing.cellFormattedTextCheck("T20", "234.");
        });

        // cell range...................................................................................................

        it("Cell range history hash", () => {
            testing.hashAppend("/cell/B2:C3");

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/B2:C3$/);

            testing.historyWait();

            testing.column("B")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.column("C")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.row("2")
                .should("have.css", "background-color", SELECTED_COLOR);
            testing.row("3")
                .should("have.css", "background-color", SELECTED_COLOR);

            testing.formulaText()
                .should('be.hidden');
        });

        it("Cell range out of viewport history hash", () => {
            testing.hashAppend("/cell/X2:Y3");

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/X2:Y3$/);

            testing.historyWait();

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
                .should("match", /^#\/.*\/.*\/cell\/D4:E5$/);

            testing.historyWait();

            testing.cell(D4)
                .type("{shift+leftarrow}");

            testing.historyWait();

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/C4:E5\/bottom-right$/);

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
                .should("match", /^#\/.*\/.*\/cell\/D4:E5$/);

            testing.historyWait();

            testing.cell("D4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.cell("E4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.historyWait();

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/E4:F5\/bottom-left$/);

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
                .should("match", /^#\/.*\/.*\/cell\/D4:E5$/);

            testing.historyWait();

            testing.cell("D4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.historyWait();

            testing.cell("E4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.historyWait();

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/E4:F5\/bottom-left$/);

            testing.cell("F4")
                .should("have.focus")
                .type("{shift+rightarrow}");

            testing.historyWait();

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/E4:G5\/bottom-left$/);

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
                .should("match", /^#\/.*\/.*\/cell\/D4:E5$/);

            testing.historyWait();

            testing.cell(D4)
                .type("{shift+uparrow}");

            testing.historyWait();

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/D3:E5\/bottom-right$/);

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
                .should("match", /^#\/.*\/.*\/cell\/D4:E5$/);

            testing.historyWait();

            testing.cell("D4")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/D5:E5\/bottom-right$/);

            testing.cell("D5")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/D5:E6\/top-right$/);

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
                .should("match", /^#\/.*\/.*\/cell\/D4:E5$/);

            testing.historyWait();

            testing.cell("D4")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/D5:E5\/bottom-right$/);

            testing.cell("D5")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/D5:E6\/top-right$/);

            testing.cell("D6")
                .should("have.focus")
                .type("{shift+downarrow}");

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/D5:E7\/top-right$/);

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
            testing.cellFormulaEnterAndSave(B2, "'Deleted");

            testing.cellClick(B2);

            testing.hashAppendWithoutCheck("/delete");

            testing.hash()
                .should("match", /^#\/.*\/.*$/);

            testing.cellFormattedTextCheck(B2, "");

            testing.formulaText()
                .should("have.value", "");
        });

        it("Cell range select delete hash", () => {
            testing.cellFormulaEnterAndSave(A1, "'NotDeleted");
            testing.cellFormulaEnterAndSave(C3, "'Deleted");
            testing.cellFormulaEnterAndSave(B2, "'DeletedB2");

            testing.cellClick(B2);

            testing.hashAppendWithoutCheck(":C3/delete");

            testing.hash()
                .should("match", /^#\/.*\/.*$/);

            testing.cellFormattedTextCheck("A1", "NotDeleted");
            testing.cellFormattedTextCheck(B2, "");
            testing.cellFormattedTextCheck(C3, "");
        });

        // selection then different viewport selections.................................................................

        it("Cell formula edit then column click", () => {
            testing.cellFormulaEnterAndSave(A1, "=1");

            testing.column("C")
                .click();

            testing.hash()
                .should("match", /^#\/.*\/.*\/column\/C$/);

            testing.formulaText()
                .should('be.hidden');
        });

        it("Cell formula edit then row click", () => {
            testing.cellFormulaEnterAndSave(A1, "=1");

            testing.row("3")
                .click();

            testing.hash()
                .should("match", /^#\/.*\/.*\/row\/3$/);
        });

        it("Cell formula edit different formula edit", () => {
            testing.hashAppend("/cell/B2/formula");

            testing.hash()
                .should("match", /^#\/.*\/.*\/cell\/B2\/formula$/);

            testing.hashAppendAfterSpreadsheetName("/cell/C3/formula");

            testing.formulaText()
                .should("have.focus");
        });

        // context menu.................................................................................................

        it("hash /cell/A1/menu", () => {
            testing.hashAppend("/cell/A1/menu")

            testing.viewportContextMenu()
                .should("be.visible")
                .find("LI")
                .should("have.length", 5);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_CELL_ID)
                .should("have.text", "Delete cell")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1\/delete$/)

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_COLUMN_ID)
                .should("have.text", "Delete column")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/column\/A\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ROW_ID)
                .should("have.text", "Delete row")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/row\/1\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_ID)
                .should("have.text", "Freeze A1")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1\/freeze$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNFREEZE_ID)
                .should("have.text", "Un Freeze A1")
                .should("have.attr", "aria-disabled", "true")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1\/unfreeze$/);
        });

        it("hash /cell/B2/menu", () => {
            testing.hashAppend("/cell/B2/menu")

            testing.viewportContextMenu()
                .should("be.visible")
                .find("LI")
                .should("have.length", 5);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_CELL_ID)
                .should("have.text", "Delete cell")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/B2\/delete$/)

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_COLUMN_ID)
                .should("have.text", "Delete column")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/column\/B\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ROW_ID)
                .should("have.text", "Delete row")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/row\/2\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_ID)
                .should("have.text", "Freeze B2")
                .should("have.attr", "aria-disabled", "true")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/B2\/freeze$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNFREEZE_ID)
                .should("have.text", "Un Freeze B2")
                .should("have.attr", "aria-disabled", "true")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/B2\/unfreeze$/);
        });

        it("hash /cell/A1:B2/menu", () => {
            testing.hashAppend("/cell/A1:B1/menu")

            testing.viewportContextMenu()
                .should("be.visible")
                .find("LI")
                .should("have.length", 5);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_CELL_ID)
                .should("have.text", "Delete cells")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1:B1\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_COLUMN_ID)
                .should("have.text", "Delete columns")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/column\/A:B\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ROW_ID)
                .should("have.text", "Delete row")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/row\/1\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_ID)
                .should("have.text", "Freeze A1:B1")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1:B1\/freeze$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNFREEZE_ID)
                .should("have.text", "Un Freeze A1:B1")
                .should("have.attr", "aria-disabled", "true")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1:B1\/unfreeze$/);
        });

        it("hash /cell/A1:A2/menu", () => {
            testing.hashAppend("/cell/A1:A2/menu")

            testing.viewportContextMenu()
                .should("be.visible")
                .find("LI")
                .should("have.length", 5);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_CELL_ID)
                .should("have.text", "Delete cells")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1:A2\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_COLUMN_ID)
                .should("have.text", "Delete column")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/column\/A\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ROW_ID)
                .should("have.text", "Delete rows")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/row\/1:2\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_ID)
                .should("have.text", "Freeze A1:A2")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1:A2\/freeze$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNFREEZE_ID)
                .should("have.text", "Un Freeze A1:A2")
                .should("have.attr", "aria-disabled", "true")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1:A2\/unfreeze$/);
        });

        it("hash /cell/A1:B2/menu", () => {
            testing.hashAppend("/cell/A1:B2/menu")

            testing.viewportContextMenu()
                .should("be.visible")
                .find("LI")
                .should("have.length", 5);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_CELL_ID)
                .should("have.text", "Delete cells")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1:B2\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_COLUMN_ID)
                .should("have.text", "Delete columns")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/column\/A:B\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ROW_ID)
                .should("have.text", "Delete rows")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/row\/1:2\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_ID)
                .should("have.text", "Freeze A1:B2")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1:B2\/freeze$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNFREEZE_ID)
                .should("have.text", "Un Freeze A1:B2")
                .should("have.attr", "aria-disabled", "true")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1:B2\/unfreeze$/);
        });

        it("hash /cell/B2:C3/menu", () => {
            testing.hashAppend("/cell/B2:C3/menu")

            testing.viewportContextMenu()
                .should("be.visible")
                .find("LI")
                .should("have.length", 5);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_ID)
                .should("have.text", "Freeze B2:C3")
                .should("have.attr", "aria-disabled", "true")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/B2:C3\/freeze$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNFREEZE_ID)
                .should("have.text", "Un Freeze B2:C3")
                .should("have.attr", "aria-disabled", "true")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/B2:C3\/unfreeze$/);
        });

        it("Cell context menu A1", () => {
            testing.viewportContextMenuOpen(A1)
                .find("LI")
                .should("have.length", 5);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_CELL_ID)
                .should("have.text", "Delete cell")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_COLUMN_ID)
                .should("have.text", "Delete column")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/column\/A\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_ROW_ID)
                .should("have.text", "Delete row")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/row\/1\/delete$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_FREEZE_ID)
                .should("have.text", "Freeze A1")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1\/freeze$/);

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_UNFREEZE_ID)
                .should("have.text", "Un Freeze A1")
                .should("have.attr", "aria-disabled", "true")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/A1\/unfreeze$/);
        });

        // context menu delete..........................................................................................

        it("Context menu delete cell", () => {
            testing.cellFormulaEnterAndSave(B2, "'Deleted");

            testing.cellClick(B2);

            testing.viewportContextMenuOpen(B2)
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_CELL_ID)
                .should("have.text", "Delete cell")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/B2\/delete$/)

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_CELL_ID)
                .click();

            testing.hash()
                .should("match", /^#\/.*\/Untitled$/);

            testing.cellFormattedTextCheck(B2, ""); // verify cell has lost its contents.
        });

        it("Context menu delete cell-range", () => {
            testing.cellFormulaEnterAndSave(A1, "'NotDeletedA1");
            testing.cellFormulaEnterAndSave(B2, "'DeletedB2");
            testing.cellFormulaEnterAndSave(C3, "'DeletedC3");
            testing.cellFormulaEnterAndSave(D4, "'NotDeletedD4");

            testing.hashAppendAfterSpreadsheetName("/cell/B2:C3");

            testing.historyWait();
            testing.historyWait(); // less failures with 2x wait

            testing.viewportContextMenuOpen(B2, SpreadsheetCellRange.parse("B2:C3"))
                .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_CELL_ID)
                .should("have.text", "Delete cells")
                .should("have.attr", "href")
                .and("match", /#\/.*\/.*\/cell\/B2:C3\/delete$/)

            testing.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_DELETE_CELL_ID)
                .click();

            testing.hash()
                .should("match", /^#\/.*\/Untitled$/);

            testing.cellFormattedTextCheck("A1", "NotDeletedA1");
            testing.cellFormattedTextCheck(B2, "");
            testing.cellFormattedTextCheck(C3, "");
            testing.cellFormattedTextCheck("D4", "NotDeletedD4");
        });

        // Freeze.......................................................................................................

        it("Freeze columns and navigate away", () => {
            testing.cellFormulaEnterAndSave(A1, "'FrozenA1");

            const away = SpreadsheetCellReference.parse("T1");

            testing.hashOnlyIdAndName();
            testing.historyWait();

            testing.hashAppend("/cell/" + away);
            testing.cellFormulaEnterAndSave(away, "'NonFrozen" + away);

            testing.hashOnlyIdAndName();
            testing.historyWait();

            testing.hashAppend("/column/A/freeze");

            testing.hashOnlyIdAndName();
            testing.historyWait();

            testing.hashAppend("/cell/" + away);

            testing.cellFormattedTextCheck(A1, "FrozenA1");
            testing.cellFormattedTextCheck(away, "NonFrozen" + away);
        });

        it("Freeze rows and navigate away", () => {
            testing.cellFormulaEnterAndSave(A1, "'FrozenA1");

            const away = SpreadsheetCellReference.parse("A30");

            testing.hashOnlyIdAndName();
            testing.historyWait();

            testing.hashAppend("/cell/" + away);
            testing.cellFormulaEnterAndSave(away, "'NonFrozen" + away);

            testing.hashOnlyIdAndName();
            testing.historyWait();

            testing.hashAppend("/row/1/freeze");

            testing.hashOnlyIdAndName();
            testing.historyWait();

            testing.hashAppend("/cell/" + away);

            testing.cellFormattedTextCheck(A1, "FrozenA1");
            testing.cellFormattedTextCheck(away, "NonFrozen" + away);
        });
    }
);