/// <reference types="cypress" />

import BorderStyle from "../../src/text/BorderStyle.js";
import ExpressionNumberKind from "../../src/math/ExpressionNumberKind.js";
import FontVariant from "../../src/text/FontVariant.js";
import FontStyle from "../../src/text/FontStyle.js";
import Hyphens from "../../src/text/Hyphens.js";
import RoundingMode from "../../src/math/RoundingMode.js";
import SpreadsheetMetadata from "../../src/spreadsheet/meta/SpreadsheetMetadata.js";
import SpreadsheetSettingsWidget from "../../src/spreadsheet/settings/SpreadsheetSettingsWidget.js";
import TextAlign from "../../src/text/TextAlign.js";
import TextStyle from "../../src/text/TextStyle.js";
import VerticalAlign from "../../src/text/VerticalAlign.js";
import WordBreak from "../../src/text/WordBreak.js";
import WordWrap from "../../src/text/WordWrap.js";

const SELECTED = ".selected";
const COLUMN = ".column";
const ROW = ".row";
const CELL = ".cell";

const FORCE_TRUE = {
    force: true,
};

context(
    "General app usage",
    () => {

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

            hash().should('match', /.*\/.*\/name/) // => true

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

        it("Click viewport cell", () => {
            reactRenderWait();

            cellClick("B2");

            hash()
                .should('match', /.*\/Untitled\/cell\/B2/);
        });

        it("Edit cell formula", () => {
            reactRenderWait();

            cellClick("B2");

            hash().should('match', /.*\/Untitled\/cell\/B2/)

            formulaText()
                .type("=1+2+3")
                .type("{enter}");

            hash()
                .should('match', /.*\/Untitled\/cell\/B2\/formula/);

            reactRenderWait();

            cellFormattedTextCheck("B2", "6.");
        });

        it("Enter cell formula with reference", () => {
            reactRenderWait();

            cellClick("C3");

            formulaText()
                .type("=1+2+3")
                .type("{enter}");

            cellClick("D4");

            formulaText()
                .type("=C3+10")
                .type("{enter}");

            reactRenderWait();

            cellFormattedTextCheck("D4", "16.");
        });

        it("Edit cell formula, update hash cell reference", () => {
            reactRenderWait();

            cellClick("C3");

            formulaText()
                .type("=1+2+3")
                .type("{enter}");

            cy.window()
                .then(function(win) {
                    var hash = win.location.hash;
                    win.location.hash = hash.replace("/cell/C3/formula", "/cell/D4/formula");
                });

            reactRenderWait();

            formulaText()
                .type("=4+5")
                .type("{enter}");

            cellFormattedTextCheck("D4", "9.");
        });

        it("Update hash append cell/reference/formula", () => {
            reactRenderWait();

            hashAppend("/cell/D4/formula");

            reactRenderWait();

            formulaText()
                .should("have.focus");
        });

        it("Update hash append formula", () => {
            reactRenderWait();

            cellClick("C3");

            hashAppend("/formula");

            reactRenderWait();

            formulaText()
                .should("have.focus");
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
                .type("=1+2+3")
                .type("{enter}");

            hashEnter("/");

            hash().should('match', /.*\/Untitled/) // => true

            checkEmptySpreadsheet();
        });

        it("Update then create new empty spreadsheet then reload non empty", () => {
            reactRenderWait();

            cellClick("F6");

            formulaText()
                .type("=1+2+3")
                .type("{enter}");


            hashEnter("/");
            cy.go('back');

            cellFormattedTextCheck("F6", "6.");
        });

        it("Select cell should have focus", () => {
            reactRenderWait();

            cellClick("B2");

            hash()
                .should('match', /.*\/.*\/cell\/B2/);
        });

        it("Select cell and navigate using arrow keys", () => {
            reactRenderWait();

            cellClick("C3")
                .should('have.focus');

            cellGet("C3")
                .type("{leftarrow}");

            hash()
                .should('match', /.*\/.*\/cell\/B3/);

            cellGet("B3")
                .type("{rightarrow}");

            hash()
                .should('match', /.*\/.*\/cell\/C3/);

            cellGet("C3")
                .type("{uparrow}");

            hash()
                .should('match', /.*\/.*\/cell\/C2/);

            cellGet("C2")
                .type("{downarrow}");

            hash()
                .should('match', /.*\/.*\/cell\/C3/);
        });

        it("Select cell and hit ENTER gives formula text focus", () => {
            reactRenderWait();

            cellClick("A3")
                .should('have.focus');

            cellGet("A3")
                .type("{enter}");

            hash()
                .should('match', /.*\/.*\/cell\/A3\/formula/);

            reactRenderWait();

            formulaText()
                .should("have.focus");
        });

        it("Select cell and hit ESC loses viewport cell focus", () => {
            reactRenderWait();

            cellClick("A3")
                .should('have.focus');

            hash()
                .should('match', /.*\/.*\/cell\/A3/);

            cellGet("A3")
                .type("{esc}");

            hash()
                .should('match', /.*\/.*/);
        });

        // SETTINGS.........................................................................................................

        it("Toggle(Show and hide) settings", () => {
            settingsToggle();

            settings()
                .should('be.visible');

            hash()
                .should('match', /.*\/.*\/settings/) // => true

            settingsToggle();

            settings()
                .should('be.not.visible');

            hash()
                .should('not.match', /.*\/.*\/settings/);
        });

        it("Show settings by editing history hash", () => {
            reactRenderWait();

            hashAppend("/settings");

            reactRenderWait();
            settings()
                .should('be.visible');
        });

        it("Hide settings by editing history hash", () => {
            settingsToggle();
            reactRenderWait();

            cy.window()
                .then(function(win) {
                    var hash = win.location.hash;
                    win.location.hash = hash.substring(0, hash.length - 1);
                });

            reactRenderWait();
            settings()
                .should('be.not.visible');
        });

        it("Toggle show settings history hash", () => {
            reactRenderWait();

            cy.window()
                .then(function(win) {
                    var hash = win.location.hash;

                    settingsToggle();

                    reactRenderWait();
                    cy.hash()
                        .should("eq", hash + "/settings");
                });
        });

        it("Toggle show then hide settings history hash", () => {
            reactRenderWait();

            cy.window()
                .then(function(win) {
                    var hash = win.location.hash;

                    settingsToggle();
                    settingsToggle();

                    reactRenderWait();
                    cy.hash()
                        .should("eq", hash);
                });
        });

        it("Toggle show open section then hide settings history hash", () => {
            reactRenderWait();

            cy.window()
                .then(function(win) {
                    var hash = win.location.hash;

                    settingsToggle(); // open

                    settingsOpenSectionSpreadsheetMetadataProperty(SpreadsheetMetadata.TWO_DIGIT_YEAR);

                    settingsToggle(); // close

                    settingsToggle(); // open

                    const section = SpreadsheetSettingsWidget.section(SpreadsheetMetadata.TWO_DIGIT_YEAR);
                    cy.get("#settings-spreadsheet-" + section + "-content")
                        .should('be.visible');

                    reactRenderWait();
                    cy.hash()
                        .should("eq", hash + "/settings/" + section);
                });
        });

        it("Edit spreadsheet name, then toggle show settings history hash", () => {
            spreadsheetName();

            reactRenderWait();

            cy.window()
                .then(function(win) {
                    var hash = win.location.hash;

                    settingsToggle();

                    reactRenderWait();
                    cy.hash()
                        .should("eq", hash + "/settings");
                });
        });

        it("Edit cell, then toggle show settings history hash", () => {
            cellClick("F6");

            reactRenderWait();

            cy.window()
                .then(function(win) {
                    var hash = win.location.hash;

                    settingsToggle();

                    reactRenderWait();
                    cy.hash()
                        .should("eq", hash + "/settings");
                });
        });

        it("Show settings check creator-date-time/modified-date-time", () => {
            settingsToggle();

            settings()
                .should('be.visible');

            const year = new Date().getFullYear();

            cy.get("#settings-spreadsheet-metadata-create-date-time")
                .contains(year);

            cy.get("#settings-spreadsheet-metadata-modified-date-time")
                .contains(year);
        });

        /**
         * Opens the spreadsheet settings, types in the given text, and verifies the property.
         * The button is then clicked and the text field is verified.
         */
        function settingsSpreadsheetMetadataPropertyTextAndCheck(property,
                                                                 a1Formula,
                                                                 text,
                                                                 defaultText,
                                                                 updatedA1Formula,
                                                                 a1CellContent,
                                                                 a1CellContentDefault) {
            it("Settings update SpreadsheetMetadata." + property, () => {
                settingsToggle();
                settingsOpenSectionSpreadsheetMetadataProperty(property);

                const a1 = "A1";

                if(a1Formula){
                    cellClick(a1);

                    formulaText()
                        .type(a1Formula, FORCE_TRUE)
                        .type("{enter}", FORCE_TRUE);
                }

                const textFieldId = "#settings-spreadsheet-metadata-" + property + "-TextField";

                cy.get(textFieldId).then((input)=> {
                    // type text and hit ENTER
                    cy.get(textFieldId)
                        .type("{selectall}")
                        .type(text)
                        .type("{enter}");

                    cy.get(textFieldId)
                        .should("have.value", text);

                    if(updatedA1Formula){
                        formulaText()
                            .should("have.value", updatedA1Formula)
                    }

                    if(a1Formula){
                        cellFormattedTextCheck(a1, a1CellContent);
                    }

                    reactRenderWait();

                    // restore original textField value.
                    cy.get(textFieldId)
                        .type("{selectall}")
                        .type(input.text() + "{enter}");

                    // click default button...
                    const buttonId = "#settings-spreadsheet-metadata-" + property + "-default-Button";
                    cy.get(buttonId)
                        .should("have.text", defaultText)
                        .click();

                    cy.get(textFieldId)
                        .should("have.value", "");

                    if(a1Formula){
                        formulaText()
                            .should("have.value", a1Formula)
                    }

                    if(a1CellContentDefault){
                        cellClick(a1);
                        cellFormattedTextCheck(a1, a1CellContentDefault);
                    }

                    // type text and blur
                    cy.get(textFieldId)
                        .type("{selectall}")
                        .type(text)
                        .blur();

                    cy.get(textFieldId)
                        .should("have.value", text);

                    if(updatedA1Formula){
                        formulaText()
                            .should("have.value", updatedA1Formula)
                    }

                    if(a1Formula){
                        cellFormattedTextCheck(a1, a1CellContent);
                    }

                    reactRenderWait();

                    // type text and blur
                    cy.get(textFieldId)
                        .type("{selectall}")
                        .type("XYZ")
                        .type("{Esc}")

                    cy.get(textFieldId)
                        .should("have.value", text);
                });
            });
        }

        /**
         * Opens the spreadsheet settings, selects each value by clicking the slider.
         * TODO Currently no test is made upon the a1 cell contents.
         */
        function settingsSpreadsheetMetadataPropertySliderAndCheck(property,
                                                                   a1Formula,
                                                                   values,
                                                                   a1CellContents) {
            it("Settings update SpreadsheetMetadata." + property, () => {
                settingsToggle();
                settingsOpenSectionSpreadsheetMetadataProperty(property);

                const a1 = "A1";

                if(a1Formula){
                    cellClick(a1);

                    formulaText()
                        .type(a1Formula, FORCE_TRUE)
                        .type("{enter}", FORCE_TRUE);
                }

                const sliderId = "#settings-spreadsheet-metadata-" + property + "-Slider";

                // the first slow of a Slider is reserved for "Default".
                values.forEach((v, i) => {
                    cy.get(sliderId + " *[data-index=\"" + (1 + i) + "\"][aria-hidden=\"true\"]")
                        .should("have.text", v.nameCapitalCase())
                        .click();

                    if(a1Formula){
                        cellFormattedTextCheck(a1, a1CellContents[i]);
                    }
                });
            });
        }
        /**
         * Opens the spreadsheet settings, selects each value by clicking the slider.
         * TODO Currently no test is made upon the a1 cell contents.
         */
        function settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(property,
                                                                                  a1Formula,
                                                                                  values,
                                                                                  a1CellContents) {
            it("Settings update SpreadsheetMetadata." + property, () => {
                settingsToggle();
                settingsOpenSectionSpreadsheetMetadataProperty(property);

                const dateParsePatternsId = "#settings-spreadsheet-metadata-" + SpreadsheetMetadata.DATE_PARSE_PATTERNS + "-TextField";
                const dateFormatPatternId = "#settings-spreadsheet-metadata-" + SpreadsheetMetadata.DATE_FORMAT_PATTERN + "-TextField";
                switch(property) {
                    case SpreadsheetMetadata.DEFAULT_YEAR:
                        cy.get(dateParsePatternsId)
                            .type("{selectall}")
                            .type("dd:mm")
                            .type("{enter}")
                            .blur();
                        cy.get(dateFormatPatternId)
                            .type("{selectall}")
                            .type("yyyy/mm/dd")
                            .type("{enter}")
                            .blur();

                        cy.get(dateFormatPatternId)
                            .type("{selectall}")
                            .type("yyyy/mm/dd")
                            .type("{enter}")
                            .blur();
                        break;
                    case SpreadsheetMetadata.TWO_DIGIT_YEAR:
                        cy.get(dateParsePatternsId)
                            .type("{selectall}")
                            .type("yy/mm/dd")
                            .type("{enter}")
                            .blur();
                        cy.get(dateFormatPatternId)
                            .type("{selectall}")
                            .type("yyyy/mm/dd")
                            .type("{enter}")
                            .blur();

                        cy.get(dateFormatPatternId)
                            .type("{selectall}")
                            .type("yyyy/mm/dd")
                            .type("{enter}")
                            .blur();
                        break;
                    default:
                        break;
                }

                const a1 = "A1";

                if(a1Formula){
                    cellClick(a1);

                    formulaText()
                        .type(a1Formula, FORCE_TRUE)
                        .type("{enter}", FORCE_TRUE);
                }

                const sliderId = "#settings-spreadsheet-metadata-" + property + "-Slider";
                const numberTextFieldId = "#settings-spreadsheet-metadata-" + property + "-NumberTextField";

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
        /**
         * Opens the spreadsheet settings, selects each value by clicking the drop down list (select).
         * TODO Currently no test is made upon the a1 cell contents.
         */
        function settingsSpreadsheetMetadataPropertyDropDownListAndCheck(property,
                                                                         a1Formula,
                                                                         values,
                                                                         a1CellContents) {
            it("Settings update SpreadsheetMetadata." + property, () => {
                settingsToggle();
                settingsOpenSectionSpreadsheetMetadataProperty(property);

                const a1 = "A1";

                if(a1Formula){
                    cellClick(a1);

                    formulaText()
                        .type(a1Formula, FORCE_TRUE)
                        .type("{enter}", FORCE_TRUE);
                }

                const dropDownListId = "#settings-spreadsheet-metadata-" + property + "-DropDownList";

                values.forEach((v, i) => {
                    cy.get(dropDownListId)
                        .select(v.toString());

                    cy.get(dropDownListId)
                        .should("have.value", v.toString());

                    if(a1Formula){
                        cellFormattedTextCheck(a1, a1CellContents[i]);
                    }
                });
            });
        }

        settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(
            SpreadsheetMetadata.CELL_CHARACTER_WIDTH,
            null,
            [
                {
                    value: "1",
                    text: "1",
                },
                {
                    value: "10",
                    text: "10",
                },
                {
                    value: "20",
                    text: "20",
                },
            ],
            null
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATE_FORMAT_PATTERN,
            "31/12/1999",
            "yyyy/mm/dd",
            "Default",
            "31/12/1999",
            "1999/12/31",
            "Friday, 31 December 1999",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATE_PARSE_PATTERNS,
            "1999:12:31",
            "yyyy:mm:dd",
            "Default",
            "1999:12:31",
            "Friday, 31 December 1999",
            "Friday, 31 December 1999",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATETIME_FORMAT_PATTERN,
            "31/12/1999, 12:58",
            "hh:mm yyyy/mm/dd",
            "Default",
            "31/12/1999, 12:58",
            "12:58 1999/12/31",
            "Friday, 31 December 1999 at 12:58:00",
        );

        settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(
            SpreadsheetMetadata.DATETIME_OFFSET,
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
            null
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DATETIME_PARSE_PATTERNS,
            "1999/12/31 12:58",
            "yyyy/mm/dd hh:mm",
            "Default",
            "1999/12/31 12:58",
            "Friday, 31 December 1999 at 12:58:00",
            "Friday, 31 December 1999 at 12:58:00",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.DECIMAL_SEPARATOR,
            "=2.5",
            "*",
            ".",
            "=2*5",
            "2*5",
            "2.5",
        );

        settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(
            SpreadsheetMetadata.DEFAULT_YEAR,
            "31:12",
            [
                {
                    value: "1900",
                    text: "1900",
                },
                {
                    value: "2000",
                    text: "2000",
                }
            ],
            ["1900/12/31", "2000/12/31"]
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.EXPONENT_SYMBOL,
            null,
            "x",
            "E",
            null,
            null,
            null
        );

        settingsSpreadsheetMetadataPropertySliderAndCheck(
            SpreadsheetMetadata.EXPRESSION_NUMBER_KIND,
            null,
            ExpressionNumberKind.values(),
            null,
        );


        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.GROUPING_SEPARATOR,
            "123456",
            "*",
            ",",
            "123456",
            "123*456.",
            "123,456."
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.NEGATIVE_SIGN,
            "=2*-4",
            "*",
            "-",
            "=2**4",
            "*8.",
            "-8.");

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.NUMBER_FORMAT_PATTERN,
            "123.5",
            "###.000",
            "Default",
            "123.5",
            "123.500",
            "123.5",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.NUMBER_PARSE_PATTERNS,
            "123.5",
            "###.000",
            "Default",
            "123.5",
            "123.5",
            "123.5",
        );

        // TODO need to set format pattern which includes percentage
        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.PERCENTAGE_SYMBOL,
            null,
            "*",
            "%",
            null,
            null,
            null
        );

        // TODO need to format Exponent
        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.POSITIVE_SIGN,
            "+1.5",
            "*",
            "+",
            "*1.5",
            "1.5",
            "1.5",
        );

        settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(
            SpreadsheetMetadata.PRECISION,
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
            null
        );

        settingsSpreadsheetMetadataPropertyDropDownListAndCheck(
            SpreadsheetMetadata.ROUNDING_MODE,
            null,
            RoundingMode.values(),
            null
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.TEXT_FORMAT_PATTERN,
            "=\"Hello 123\"",
            "@@",
            "Default",
            "=\"Hello 123\"",
            "Hello 123Hello 123",
            "Hello 123",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.TEXT_FORMAT_PATTERN,
            "'Hello 123",
            "@@",
            "Default",
            "'Hello 123",
            "Hello 123Hello 123",
            "Hello 123",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.TIME_FORMAT_PATTERN,
            "12:58",
            "hh::mm::",
            "Default",
            "12:58",
            "12::58::",
            "12:58:00",
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.TIME_PARSE_PATTERNS,
            "12::58::59.000",
            "hh::mm::ss.000",
            "Default",
            "12::58::59.000",
            "12:58:59",
            "12:58:59",
        );

        settingsSpreadsheetMetadataPropertySliderNumberTextFieldAndCheck(
            SpreadsheetMetadata.TWO_DIGIT_YEAR,
            "30/12/31",
            [
                {
                    value: "20",
                    text: "20",
                },
                {
                    value: "50",
                    text: "50",
                },
            ],
            ["1930/12/31", "2030/12/31"]
        );

        settingsSpreadsheetMetadataPropertyTextAndCheck(
            SpreadsheetMetadata.VALUE_SEPARATOR,
            "=5/2",
            "*",
            ",",
            "=5/2",
            "2.5",
            "2.5",
        );

        /**
         * Updates 2 properties with initial text values, then sets the first to the second text, which should cause
         * the second to gain the former first text.
         */
        function settingsSpreadsheetMetadataPropertyTextSwapCheck(property1,
                                                                  text1,
                                                                  property2,
                                                                  text2) {
            it("Settings update SpreadsheetMetadata." + property1 + "=" + text1 + " & " + property2 + "=" + text2 + " causing value swap", () => {
                settingsToggle();
                settingsOpenSectionSpreadsheetMetadataProperty(property1);

                const textFieldId1 = "#settings-spreadsheet-metadata-" + property1 + "-TextField";
                cy.get(textFieldId1)
                    .type("{selectall}")
                    .type(text1)
                    .blur();

                cy.get(textFieldId1)
                    .should("have.value", text1);

                const textFieldId2 = "#settings-spreadsheet-metadata-" + property2 + "-TextField";
                cy.get(textFieldId2)
                    .type("{selectall}")
                    .type(text2)
                    .blur();

                cy.get(textFieldId2)
                    .should("have.value", text2);

                // set property1 with text2, this should force property2 to have text1
                cy.get(textFieldId1)
                    .type("{selectall}")
                    .type(text2)
                    .blur();

                cy.get(textFieldId1)
                    .should("have.value", text2);

                cy.get(textFieldId2)
                    .should("have.value", text1);
            });
        }


        settingsSpreadsheetMetadataPropertyTextSwapCheck(
            SpreadsheetMetadata.DECIMAL_SEPARATOR,
            '.',
            SpreadsheetMetadata.GROUPING_SEPARATOR,
            ','
        );

        settingsSpreadsheetMetadataPropertyTextSwapCheck(
            SpreadsheetMetadata.NEGATIVE_SIGN,
            '-',
            SpreadsheetMetadata.PERCENTAGE_SYMBOL,
            '%'
        );

        settingsSpreadsheetMetadataPropertyTextSwapCheck(
            SpreadsheetMetadata.NEGATIVE_SIGN,
            '-',
            SpreadsheetMetadata.POSITIVE_SIGN,
            '+'
        );

        settingsSpreadsheetMetadataPropertyTextSwapCheck(
            SpreadsheetMetadata.DECIMAL_SEPARATOR,
            '-',
            SpreadsheetMetadata.POSITIVE_SIGN,
            '+'
        );


// settings default style...........................................................................................

        function settingsSpreadsheetMetadataStyleColorAndCheck(property, defaultColor) {
            it("Settings update SpreadsheetMetadata.style." + property, () => {
                settingsToggle();
                settingsOpenSectionSpreadsheetMetadataStyleProperty(property);

                const a1 = "A1";

                cellClick(a1);
                formulaText()
                    .type("'ABC", FORCE_TRUE)
                    .type("{enter}", FORCE_TRUE);

                const textFieldId = "#settings-spreadsheet-metadata-style-" + property + "-TextField";

                cy.get(textFieldId)
                    .type("{selectall}")
                    .type("!invalid123")
                    .blur(); // TODO verify alert appears!

                cy.get(textFieldId)
                    .type("{selectall}")
                    .type("#123456")
                    .blur();

                a1StyleCheck(property, "rgb(18, 52, 86)");

                cy.get(textFieldId)
                    .type("{selectall}")
                    .type("#789abc")
                    .type("{enter}");

                a1StyleCheck(property, "rgb(120, 154, 188)");

                if(defaultColor){
                    const defaultButtonId = "#settings-spreadsheet-metadata-style-" + property + "-default-Button";
                    cy.get(defaultButtonId)
                        .should("have.text", defaultColor)
                        .click();

                    const red = parseInt(defaultColor.substring(1, 3), 16);
                    const green = parseInt(defaultColor.substring(3, 5), 16);
                    const blue = parseInt(defaultColor.substring(5, 7), 16);

                    a1StyleCheck(property, "rgb(" + red + ", " + green + ", " + blue + ")");
                }
            });
        }

        function settingsSpreadsheetMetadataStyleSliderAndCheck(property,
                                                                values,
                                                                defaultValue,
                                                                defaultButtonText) {
            it("Settings update SpreadsheetMetadata.style." + property, () => {
                settingsToggle();
                settingsOpenSectionSpreadsheetMetadataStyleProperty(property);

                const a1 = "A1";

                cellClick(a1);
                formulaText()
                    .type("'ABC", FORCE_TRUE)
                    .type("{enter}", FORCE_TRUE);

                const sliderId = "#settings-spreadsheet-metadata-style-" + property + "-Slider";

                // the first slot of a Slider is reserved for "Default".
                values.forEach((v, i) => {
                    let skip;
                    switch(property) {
                        case TextStyle.FONT_STYLE:
                        case TextStyle.FONT_VARIANT:
                            skip = i > 0;
                            break;
                        default:
                            skip = true;
                            break;
                    }

                    if(!skip){
                        cy.get(sliderId + " *[data-index=\"" + (1 + i) + "\"][aria-hidden=\"true\"]")
                            //.should("have.text", v.nameCapitalCase()) Element is not visible because it has CSS property: 'position: fixed' and its being covered by another element
                            .click(FORCE_TRUE);

                        a1StyleCheck(property, v.toCssValue());
                    }
                });

                if(defaultValue){
                    const defaultButtonId = "#settings-spreadsheet-metadata-style-" + property + "-default-Button";
                    cy.get(defaultButtonId)
                        .should("have.text", defaultButtonText)// @see https://github.com/mP1/walkingkooka-spreadsheet-react/issues/695
                        .click();

                    a1StyleCheck(property, defaultValue.toCssValue());
                }
            })
        }

        function settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(property,
                                                                              min,
                                                                              max,
                                                                              defaultValue,
                                                                              defaultButtonText) {
            it("Settings update SpreadsheetMetadata.style." + property, () => {
                settingsToggle();
                settingsOpenSectionSpreadsheetMetadataStyleProperty(property);

                const a1 = "A1";

                cellClick(a1);
                formulaText()
                    .type("'ABC", FORCE_TRUE)
                    .type("{enter}", FORCE_TRUE);

                const sliderId = "#settings-spreadsheet-metadata-style-" + property + "-Slider";
                const numberTextFieldId = "#settings-spreadsheet-metadata-style-" + property + "-NumberTextField";

                // type a number in TextField & verify slider moved.
                const values = [
                    {
                        value: min,
                        text: "" + min,
                    },
                    {
                        value: max,
                        text: "" + max,
                    }
                ];

                values.forEach((v, i) => {
                    console.log("value=" + JSON.stringify(v) + " i=" + i);

                    cy.get(numberTextFieldId)
                        .type("{selectall}")
                        .type(v.value)
                        .type("{enter}")
                        .click();

                    cy.get(sliderId + " *[data-index=\"" + i + "\"][aria-hidden=\"true\"]");
                    //     .should("have.class", "MuiSlider-markLabelActive");

                    switch(property) {
                        case TextStyle.WIDTH:
                        case TextStyle.HEIGHT:
                            break;
                        default:
                            a1StyleCheck(property, v.value + "px");
                            break;
                    }
                });

                if(null != defaultValue){
                    const defaultButtonId = "#settings-spreadsheet-metadata-style-" + property + "-default-Button";
                    cy.get(defaultButtonId)
                        .should("have.text", defaultButtonText)
                        .click();

                    switch(property) {
                        case TextStyle.WIDTH:
                        case TextStyle.HEIGHT:
                            break;
                        default:
                            a1StyleCheck(property, defaultValue);
                            break;
                    }
                }
            });
        }

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BACKGROUND_COLOR,
            "#ffffff"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_LEFT_COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_LEFT_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_LEFT_WIDTH,
            0,
            2,
            "1px",
            "1"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_TOP_COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_TOP_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_TOP_WIDTH,
            0,
            2,
            "1px",
            "1"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_RIGHT_COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_RIGHT_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_RIGHT_WIDTH,
            0,
            2,
            "1px",
            "1"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.BORDER_BOTTOM_COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.BORDER_BOTTOM_STYLE,
            BorderStyle.values(),
            BorderStyle.SOLID,
            "solid"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.BORDER_BOTTOM_WIDTH,
            0,
            2,
            "1px",
            "1"
        );

        settingsSpreadsheetMetadataStyleColorAndCheck(
            TextStyle.COLOR,
            "#000000"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.FONT_STYLE,
            FontStyle.values(),
            FontStyle.NORMAL,
            "normal"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.FONT_VARIANT,
            FontVariant.values(),
            FontVariant.NORMAL,
            "normal"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.HEIGHT,
            21,
            30,
            "30px",
            "30"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.HYPHENS,
            Hyphens.values(),
            Hyphens.NONE,
            "none"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_LEFT,
            0,
            2,
            "0px",
            "0"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_TOP,
            0,
            2,
            "0px",
            "0"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_RIGHT,
            0,
            2,
            "0px",
            "0"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.PADDING_BOTTOM,
            0,
            2,
            "0px",
            "0"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.TEXT_ALIGN,
            TextAlign.values(),
            TextAlign.LEFT,
            "left"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.VERTICAL_ALIGN,
            VerticalAlign.values(),
            VerticalAlign.TOP,
            "top"
        );

        settingsSpreadsheetMetadataStyleSliderWithTextNumberAndCheck(
            TextStyle.WIDTH,
            70,
            200,
            "100px",
            "100"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.WORD_BREAK,
            WordBreak.values(),
            WordBreak.NORMAL,
            "normal"
        );

        settingsSpreadsheetMetadataStyleSliderAndCheck(
            TextStyle.WORD_WRAP,
            WordWrap.values(),
            WordWrap.NORMAL,
            "normal"
        );

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
            cy.window()
                .then(function(win) {
                    win.location.hash = hash;
                });
        }

        function hash() {
            return cy.location().hash();
        }

        function hashAppend(append) {
            cy.window()
                .then(function(win) {
                    const hash = win.location.hash;
                    const after = hash + append;

                    win.location.hash = after;

                    cy.hash()
                        .should("eq", after);
                });
        }

        function spreadsheetName() {
            reactRenderWait();
            return cy.get("#spreadsheet-name");
        }

        function formulaText() {
            reactRenderWait();
            return cy.get("#formula-TextField");
        }

        /**
         * Click on the cell and verify it becomes outlined.
         */
        function cellClick(cellReference) {
            const cell = cellGet(cellReference)
                .click();

            cellOutlined(cellReference);
            return cell;
        }

        function cellOutlined(cellReference) {
            cellGet(cellReference)
                .should("have.css", "outline-color", "rgb(0, 0, 0)")
                .should("have.css", "outline-style", "dotted")
                .should("have.css", "outline-width", "3px");
        }

        function cellFormattedTextCheck(cellReference, text) {
            cellGet(cellReference)
                .should("have.text", text);
        }

        function a1StyleCheck(property, value) {
            cellGet("a1")
                .should('have.css', property, value);
        }

        function cellGet(cellReference) {
            return cy.get("#cell-" + cellReference.toUpperCase());
        }

        /**
         * Fetches the icon that when clicked toggles the settings
         */
        function settingsToggle() {
            reactRenderWait();
            cy.get("#settings-icon")
                .click();
        }

        /**
         * Opens the settings section that includes the given SpreadsheetMetadata property
         */
        function settingsOpenSectionSpreadsheetMetadataProperty(property) {
            settingsOpenSection(SpreadsheetSettingsWidget.section(property));
        }

        function settingsOpenSectionSpreadsheetMetadataStyleProperty(property) {
            settingsOpenSection(SpreadsheetSettingsWidget.section(property));
        }

        function settingsOpenSection(section) {
            settings();
            //.scrollIntoView() // prevents cypress from complaining about content that is longer than the screen height.
            //.should('be.visible');

            cy.get("#settings-spreadsheet-" + section + "-expand-more-icon")
                .click();

            reactRenderWait();

            cy.get("#settings-spreadsheet-" + section + "-content");
            //.should('be.visible');

            hash()
                .should('match', new RegExp(".*\/.*\/settings\/" + section)) // => true
        }

        /**
         * The settings that appears on the right containing settings, tools and more.
         */
        function settings() {
            reactRenderWait();
            return cy.get("#settings > DIV"); // the #settings remains 1000x0 while the DIV child has an actual height
        }

        function reactRenderWait(period) {
            cy.wait(period || 20);
        }
    }
);