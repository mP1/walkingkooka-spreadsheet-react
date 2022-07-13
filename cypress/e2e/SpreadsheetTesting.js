import SpreadsheetCellReference from "../../src/spreadsheet/reference/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "../../src/spreadsheet/reference/SpreadsheetColumnReference.js";
import SpreadsheetFormulaWidget from "../../src/spreadsheet/reference/formula/SpreadsheetFormulaWidget.js";
import SpreadsheetNameWidget from "../../src/spreadsheet/name/SpreadsheetNameWidget.js";
import SpreadsheetRowReference from "../../src/spreadsheet/reference/SpreadsheetRowReference.js";
import SpreadsheetLabelMappingWidget from "../../src/spreadsheet/reference/SpreadsheetLabelMappingWidget.js";
import SpreadsheetSelectLinkWidget from "../../src/spreadsheet/reference/SpreadsheetSelectLinkWidget.js";
import SpreadsheetSelectAutocompleteWidget
    from "../../src/spreadsheet/reference/SpreadsheetSelectAutocompleteWidget.js";
import SpreadsheetSelection from "../../src/spreadsheet/reference/SpreadsheetSelection.js";
import SpreadsheetSettingsWidget from "../../src/spreadsheet/settings/SpreadsheetSettingsWidget.js";
import SpreadsheetViewportWidget from "../../src/spreadsheet/reference/viewport/SpreadsheetViewportWidget.js";

export default class SpreadsheetTesting {

    static A1 = SpreadsheetCellReference.parse("A1");
    static A2 = SpreadsheetCellReference.parse("A2");
    static A3 = SpreadsheetCellReference.parse("A3");
    static B1 = SpreadsheetCellReference.parse("B1");
    static B2 = SpreadsheetCellReference.parse("B2");
    static B3 = SpreadsheetCellReference.parse("B3");
    static C2 = SpreadsheetCellReference.parse("C2");
    static C3 = SpreadsheetCellReference.parse("C3");
    static D4 = SpreadsheetCellReference.parse("D4");
    static E5 = SpreadsheetCellReference.parse("E5");

    static SELECTED = ".selected";
    static COLUMN = ".column";
    static ROW = ".row";
    static CELL = ".cell";
    static LABEL = "Label123";

    static FORCE_TRUE = {
        force: true,
    };

    constructor(cy) {
        this.cy = cy;
    }

    spreadsheetEmptyReady() {
        this.hash()
            .should("match", /^#\/.*\/Untitled$/); // wait for /$id/$name

        this.historyWait();
    }

    columnHide(columnOrRange) {
        this.viewportContextMenuOpen(columnOrRange)
            .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID)
            .should("include.text", "Hide");

        this.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID)
            .click();

        this.columnWait();

        this.viewportContextMenu()
            .should("not.be.visible");

        this.columnWait();
    }

    columnWait() {
        this.wait(100);
    }

    hash() {
        return this.cy.location().hash();
    }

    hashAppend(append) {
        this.cy.window()
            .then((win) => {
                const hash = win.location.hash;
                const after = hash + append;

                win.location.hash = after;

                this.hash()
                    .should("eq", after);
            });
    }

    hashAppendAfterSpreadsheetName(append) {
        this.hashOnlyIdAndName();
        this.hashAppend(append);
    }

    hashAppendWithoutCheck(append) {
        this.cy.window()
            .then((win) => {
                const hash = win.location.hash;
                const after = hash + append;

                win.location.hash = after;
            });
    }

    hashEnter(hash) {
        this.cy.window()
            .then((win) => {
                win.location.hash = hash;
            });
    }

    hashOnlyIdAndName() {
        this.cy.window()
            .then((win) => {
                const h = win.location.hash;

                const slash0 = h.indexOf("/");
                const slash1 = -1 !== slash0 && h.indexOf("/", slash0 + 1);
                const slash2 = -1 !== slash1 && h.indexOf("/", slash1 + 1);

                if(-1 !== slash2){
                    this.hashEnter(h.substring(0, slash2));

                    this.hash()
                        .should("match", /^#\/.*\/.*$/);
                }
            });
    }

    historyWait() {
        this.wait(100);
    }

    rowHide(rowOrRange) {
        this.viewportContextMenuOpen(rowOrRange)
            .find("#" + SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID)
            .should("include.text", "Hide");

        this.getById(SpreadsheetSelection.VIEWPORT_CONTEXT_MENU_HIDE_ID)
            .click();

        this.rowWait();

        this.viewportContextMenu()
            .should("not.be.visible");

        this.rowWait();
    }
    
    rowWait() {
        this.wait(100);
    }

    spreadsheetNameButton() {
        return this.getById(SpreadsheetNameWidget.BUTTON_ID);
    }

    spreadsheetNameButtonClick() {
        this.spreadsheetNameButton()
            .click();

        this.spreadsheetNameWait();

        this.hash()
            .should("match", /^#\/.*\/.*\/name$/);
    }

    spreadsheetNameTextField() {
        this.hash()
            .should("match", /^#\/.*\/.*\/name$/);

        return this.getById(SpreadsheetNameWidget.TEXT_FIELD_ID);
    }

    spreadsheetNameWait() {
        this.wait(100);
    }

    formulaText() {
        return this.getById(SpreadsheetFormulaWidget.TEXT_FIELD_ID);
    }

    formulaTextClick() {
        this.formulaText()
            .click();

        this.hash()
            .should("match", /^#\/.*\/.*\/cell\/.*\/formula(\/.*)*$/); // // lgtm [js/redos]

        this.formulaTextLoadWait();
    }

    cellFormulaEnterAndSave(cell, text) {
        this.cellClick(cell);

        this.formulaTextEnterAndSave(text);
    }

    formulaTextEnterAndSave(text) {
        this.formulaTextClick();

        this.formulaText()
            .type("{selectall}" + text + "{enter}", SpreadsheetTesting.FORCE_TRUE);

        this.formulaTextSaveWait(); // wait for save to complete.
    }

    formulaTextLoadWait() {
        this.wait(200);
    }

    formulaTextSaveWait() {
        this.wait(200);
    }

    labelMappingLabelTextField() {
        return this.getById(SpreadsheetLabelMappingWidget.LABEL_TEXT_FIELD_ID);
    }

    labelMappingReferenceTextField() {
        return this.getById(SpreadsheetLabelMappingWidget.REFERENCE_TEXT_FIELD_ID);
    }

    labelMappingLabelSaveButton() {
        return this.getById(SpreadsheetLabelMappingWidget.SAVE_BUTTON_ID);
    }

    labelMappingLabelDeleteButton() {
        return this.getById(SpreadsheetLabelMappingWidget.DELETE_BUTTON_ID);
    }

    labelMappingLabelCloseButton() {
        return this.getById(SpreadsheetLabelMappingWidget.DIALOG_CLOSE_BUTTON_ID);
    }

    labelMappingDialogClosedCheck() {
        this.labelMappingCloseWait();

        this.getById(SpreadsheetLabelMappingWidget.DIALOG_TITLE_ID)
            .should("not.exist");
    }

    labelMappingSaveWait() {
        this.wait(200);
    }

    labelMappingCloseWait() {
        this.wait(200);
    }

    hashLabel() {
        this.hashAppend("/label/" + SpreadsheetTesting.LABEL);

        this.historyWait();
    }

    selectHistoryHash() {
        this.hashAppend("/select");

        this.wait(50); // wait for dialog to appear.
    }

    selectLink() {
        return this.getById(SpreadsheetSelectLinkWidget.SELECT_LINK_ID);
    }

    selectDialog() {
        return this.getById(SpreadsheetSelectAutocompleteWidget.DIALOG_ID);
    }

    selectDialogTitle() {
        return this.getById(SpreadsheetSelectAutocompleteWidget.DIALOG_TITLE_ID);
    }

    selectDialogClose() {
        return this.getById(SpreadsheetSelectAutocompleteWidget.DIALOG_CLOSE_BUTTON_ID);
    }

    selectAutocompleteTextField() {
        return this.getById(SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_ID);
    }

    selectAutocompleteTextFieldHelper() {
        return this.getById(SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_HELPER_TEXT_ID);
    }

    /**
     * Originally this selected the div of the popup component which contained all the individual items.
     * Unfortunately the popup is no longer assigned any id, previously it was an id computed from the AutoComplete id
     * + a known suffix. The next best is to select the ListBox that holds all the items.
     */
    selectAutocompletePopupListbox() {
        return this.getById(SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_LISTBOX_ID);
    }

    selectAutocompletePopupOption(nth) {
        return this.getById(SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_OPTION_ID + nth);
    }

    selectCellGotoButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.CELL_GOTO_BUTTON_ID, disabled);
    }

    selectCellRangeSelectButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.CELL_RANGE_SELECT_BUTTON_ID, disabled);
    }

    selectColumnGotoButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.COLUMN_GOTO_BUTTON_ID, disabled);
    }

    selectColumnRangeSelectButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.COLUMN_RANGE_SELECT_BUTTON_ID, disabled);
    }

    selectLabelCreateButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.LABEL_CREATE_BUTTON_ID, disabled);
    }

    selectLabelEditButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.LABEL_EDIT_BUTTON_ID, disabled);
    }

    selectLabelGotoButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.LABEL_GOTO_BUTTON_ID, disabled);
    }

    selectRowGotoButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.ROW_GOTO_BUTTON_ID, disabled);
    }

    selectRowRangeSelectButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.ROW_RANGE_SELECT_BUTTON_ID, disabled);
    }

    selectButtonDisabled(id, disabled) {
        const button = this.cy.get((disabled ? "BUTTON" : "A") + "#" + id);

        if(disabled){
            button.should("be.disabled");
        }

        return button;
    }

    contextMenu(id) {
        this.getById(id)
            .rightclick()
            .rightclick(SpreadsheetTesting.FORCE_TRUE); // try twice unfortunately once often fails.
    }

    viewportContextMenu() {
        return this.getById(SpreadsheetViewportWidget.VIEWPORT_CONTEXT_MENU_ID);
    }

    viewportContextMenuOpen(click, selection) {
        this.contextMenu(click.viewportId());

        this.hash()
            .should(
                'match',
                new RegExp( "^#\/.*\/.*\/" + (selection || click).toHistoryHashToken() + "(\/.*)?\/menu$")
            );

        return this.viewportContextMenu()
            .should("be.visible");
    }

    /**
     * Click on the cell and verify it gets focused.
     */
    cellClick(cellReference) {
        this.cell(cellReference)
            .click(SpreadsheetTesting.FORCE_TRUE);

        this.hash()
            .should("match", new RegExp("^#\/.*\/.*\/cell\/" + cellReference + "(\/.*)*"));

        this.cell(cellReference)
            .should("have.focus");

        this.formulaTextLoadWait();
    }

    cellFormattedTextCheck(cellReference, text) {
        this.cell(cellReference)
            .should("have.text", text);
    }

    cellA1StyleCheck(property, value) {
        this.cell(SpreadsheetTesting.A1)
            .should('have.css', property, value);
    }

    cell(cellReference) {
        const spreadsheetCellReference = cellReference instanceof SpreadsheetCellReference ?
            cellReference :
            SpreadsheetCellReference.parse(cellReference);

        return this.getById(spreadsheetCellReference.viewportId());
    }

    column(columnReference) {
        const spreadsheetColumnReference = columnReference instanceof SpreadsheetColumnReference ?
            columnReference :
            SpreadsheetColumnReference.parse(columnReference);

        return this.getById(spreadsheetColumnReference.viewportId());
    }

    row(rowReference) {
        const spreadsheetRowReference = rowReference instanceof SpreadsheetRowReference ?
            rowReference :
            SpreadsheetRowReference.parse(rowReference);

        return this.getById(spreadsheetRowReference.viewportId());
    }

    settingsWait() {
        this.wait(100);
    }

    settings() {
        return this.getById(SpreadsheetSettingsWidget.drawerId());
    }

    settingsAccordion(accordion) {
        return this.get(SpreadsheetSettingsWidget.accordionElementSelector(accordion));
    }

    settingsAccordionExpandMoreIcon(accordion) {
        return this.getById(SpreadsheetSettingsWidget.accordionId(accordion) + "-expand-more-icon");
    }

    settingsAccordionContent(accordion) {
        return this.getById(SpreadsheetSettingsWidget.accordionId(accordion) + "-content");
    }

    settingsProperty(property, suffix) {
        return this.getById(SpreadsheetSettingsWidget.propertyId(property) + (suffix || ""));
    }

    /**
     * Checks that the spreadsheet is completely empty.
     */
    spreadsheetEmptyCheck() {
        this.hash()
            .should("match", /^#\/.*\/Untitled$/) // => true

        // Verify spreadsheet name is "Untitled"
        this.spreadsheetNameButton()
            .should("have.class", "MuiButton-root")
            .should("have.text", "Untitled");

        this.cy.title()
            .should("eq", "Untitled");

        // Verify formula is read only and empty
        this.formulaText()
            .should("be.hidden");

        this.cy.get(SpreadsheetTesting.COLUMN + SpreadsheetTesting.SELECTED)
            .should("have.length", 0);

        this.cy.get(SpreadsheetTesting.ROW + SpreadsheetTesting.SELECTED)
            .should("have.length", 0);

        this.cy.get(SpreadsheetTesting.CELL)
            .should("have.text", "");
    }

    wait(period) {
        this.cy.wait(period || 20);
    }

    focused() {
        return this.cy.focused();
    }

    tab() {
        return this.focused()
            .tab();
    }
    
    getById(id) {
        return this.get("#" + id);
    }

    get(selector) {
        return this.cy.get(selector);
    }
}